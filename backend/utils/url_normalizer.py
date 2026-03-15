"""
URL Normalizer — canonicalises submitted URLs for consistent cache keys
and accurate detection analysis.

Normalisation steps:
  1. URL-decode percent-encoded characters (urllib.parse.unquote)
  2. Decode Punycode / IDN hostnames (encode('ascii').decode('idna'))
  3. Lowercase the hostname
  4. Follow up to MAX_REDIRECTS HTTP redirects to obtain the final URL
  5. Strip trailing slashes from the path for cache key consistency

Both the original and the normalised URL are returned so the frontend
can display a "redirected from" note when they differ.
"""

import asyncio
from urllib.parse import urlparse, urlunparse, unquote

import httpx

from utils.ssrf_guard import SSRFBlockedError, validate_url

# Maximum number of redirects to follow before giving up.
MAX_REDIRECTS = 5

# Timeout configuration applied to ALL outbound httpx requests made from this
# module. Keeping timeouts tight prevents slow-server amplification attacks.
CONNECT_TIMEOUT = 10.0   # seconds to establish TCP connection
READ_TIMEOUT = 15.0      # seconds to wait for a response body chunk


def _decode_punycode(hostname: str) -> str:
    """
    Convert a Punycode / ACE-encoded hostname (xn--...) to its Unicode form.

    For example: 'xn--pypal-g6d.com' → 'pаypal.com' (Cyrillic а, not ASCII a).
    Returns the original hostname unchanged if decoding fails.

    Args:
        hostname: The raw hostname from the parsed URL.

    Returns:
        Unicode-decoded hostname string.
    """
    try:
        # encode('ascii') ensures we only try to decode ASCII labels.
        return hostname.encode("ascii").decode("idna")
    except (UnicodeError, UnicodeDecodeError):
        # Not a valid IDNA hostname — return as-is.
        return hostname


def normalise_url_static(url: str) -> str:
    """
    Perform static normalisation steps on a URL without making network requests.

    Steps:
      - URL-decode percent-encoded characters
      - Lowercase the hostname
      - Decode Punycode labels in the hostname
      - Strip trailing slashes from the path

    Args:
        url: Raw URL string.

    Returns:
        Normalised URL string.
    """
    # Step 1: URL-decode (e.g. %2F → /, %40 → @)
    decoded = unquote(url)

    parsed = urlparse(decoded)

    # Step 2 & 3: lowercase + Punycode decode the hostname
    hostname = (parsed.hostname or "").lower()
    hostname = _decode_punycode(hostname)

    # Preserve port if explicitly specified
    if parsed.port:
        netloc = f"{hostname}:{parsed.port}"
    else:
        netloc = hostname

    # Step 4: strip trailing slash from path (but keep "/" for root)
    path = parsed.path.rstrip("/") or "/"

    normalised = urlunparse((
        parsed.scheme.lower(),
        netloc,
        path,
        parsed.params,
        parsed.query,
        "",   # strip fragment — fragments are never sent to servers
    ))

    return normalised


async def normalise_url(url: str) -> tuple[str, str]:
    """
    Fully normalise a URL, including following HTTP redirects.

    The function first applies static normalisation, then follows up to
    MAX_REDIRECTS redirects using httpx (with SSRF validation on every
    hop) to obtain the final destination URL.

    Args:
        url: Raw URL submitted by the user.

    Returns:
        A tuple of (original_url, final_normalised_url).
        If redirect-following fails for any reason the statically
        normalised URL is returned as the final URL.
    """
    original = url
    static_normalised = normalise_url_static(url)

    try:
        # Validate the statically-normalised URL before any network I/O.
        validate_url(static_normalised)
    except SSRFBlockedError:
        # If the URL is blocked, return it as-is for the caller to report.
        return original, static_normalised

    try:
        final_url = await _follow_redirects(static_normalised)
    except Exception:
        # Any network error during redirect-following is non-fatal.
        # Fall back to the statically-normalised URL.
        final_url = static_normalised

    return original, normalise_url_static(final_url)


async def _follow_redirects(url: str) -> str:
    """
    Follow HTTP redirects up to MAX_REDIRECTS times, returning the final URL.

    Each redirect target is validated via ssrf_guard before being fetched,
    preventing an open-redirect chain from leading our scanner to an
    internal network address.

    Args:
        url: Starting URL (already statically normalised and SSRF-checked).

    Returns:
        The URL of the final non-redirect response.

    Raises:
        httpx.HTTPError: On network or HTTP errors.
        SSRFBlockedError: If any redirect target is an internal address.
    """
    timeout = httpx.Timeout(connect=CONNECT_TIMEOUT, read=READ_TIMEOUT, write=10.0, pool=5.0)

    async with httpx.AsyncClient(
        follow_redirects=False,   # We handle redirects manually to SSRF-check each hop
        timeout=timeout,
        headers={"User-Agent": "SentinelURL-Scanner/1.0"},
        verify=False,             # Some phishing sites have self-signed certs; we still want to reach them
    ) as client:
        current_url = url

        for _ in range(MAX_REDIRECTS):
            # SSRF-check the URL before each network request.
            validate_url(current_url)

            response = await client.get(current_url)

            if response.status_code not in (301, 302, 303, 307, 308):
                # Not a redirect — we have reached the final destination.
                return str(response.url)

            location = response.headers.get("location", "")
            if not location:
                return current_url

            # Resolve relative redirect URLs against the current base.
            current_url = str(httpx.URL(current_url).copy_with()).rstrip("/")
            current_url = str(httpx.URL(location)) if location.startswith("http") else current_url

        # Exhausted redirect limit — return whatever URL we are at.
        return current_url
