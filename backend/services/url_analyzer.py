"""
URL Analyzer — heuristic checks on the URL structure and content.

Analyses the normalised URL string to detect common phishing patterns
such as suspicious length, IP-as-hostname, excessive subdomains, and
phishing-related keywords in the path/query.

Each triggered check adds a penalty to the total score and appends a
human-readable reason string for display in the frontend.
"""

import ipaddress
import re
from urllib.parse import urlparse, unquote

import tldextract

# Domains that are inherently trusted and should not be penalised for
# containing words like 'login', 'secure', 'account', etc. in their paths.
TRUSTED_DOMAINS = {
    "google.com", "github.com", "microsoft.com", "apple.com",
    "amazon.com", "paypal.com", "bankofamerica.com", "chase.com",
    "wellsfargo.com",
}

# Phishing-associated keywords commonly found in malicious URL paths/queries.
PHISHING_KEYWORDS = [
    "login", "verify", "secure", "update", "account", "bank", "payment",
    "confirm", "signin", "password", "credential", "wallet", "alert",
    "suspended", "validate", "recover", "unlock", "authorize",
]


def _is_ip_address(hostname: str) -> bool:
    """
    Return True if the hostname is an IPv4 or IPv6 address literal.

    Phishing sites often use raw IP addresses to avoid registering
    a suspicious domain name.

    Args:
        hostname: The hostname component from a parsed URL.

    Returns:
        True if hostname is a valid IP address.
    """
    try:
        ipaddress.ip_address(hostname.strip("[]"))  # strip brackets for IPv6
        return True
    except ValueError:
        return False


def analyse_url(original_url: str, normalised_url: str) -> tuple[int, list[dict]]:
    """
    Run all URL-structure heuristic checks and return total score and reasons.

    Args:
        original_url:   The URL as submitted by the user.
        normalised_url: The URL after normalisation and redirect-following.

    Returns:
        A tuple of (score: int, reasons: list[dict]) where each reason dict
        has keys 'module', 'reason', and 'score'.
    """
    score = 0
    reasons: list[dict] = []

    def _add(pts: int, message: str) -> None:
        """Helper to accumulate score and append a formatted reason entry."""
        nonlocal score
        score += pts
        reasons.append({
            "module": "URL Analysis",
            "reason": f"{message} (+{pts})",
            "score": pts,
        })

    parsed = urlparse(normalised_url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    query = parsed.query or ""

    # ── Length checks ─────────────────────────────────────────────────────────
    # Long URLs are used to obfuscate the true domain or stuff in keywords.
    url_len = len(normalised_url)
    if url_len > 75:
        _add(15, f"URL length is {url_len} characters (>75)")
    if url_len > 100:
        # Stacked on top of the >75 check; extra penalty for very long URLs.
        _add(10, f"URL length is {url_len} characters (>100)")

    # ── IP as hostname ────────────────────────────────────────────────────────
    # IP addresses don't have legitimate business domains and are a red flag.
    if _is_ip_address(hostname):
        _add(25, "Hostname is a raw IP address instead of a domain name")

    # ── Excessive subdomains ──────────────────────────────────────────────────
    # Attackers hide the real domain in subdomains: secure.paypal.com.evil.com
    subdomain_count = hostname.count(".")
    if subdomain_count > 3:
        _add(20, f"Hostname has {subdomain_count} dot-separated labels (excessive subdomains)")

    # ── Hyphen in domain ──────────────────────────────────────────────────────
    # Hyphens are used to create lookalike domains: pay-pal.com, go0gle.com
    ext = tldextract.extract(normalised_url)
    if "-" in ext.domain:
        _add(10, f"Domain '{ext.domain}' contains a hyphen (lookalike pattern)")

    # ── @ symbol in URL ───────────────────────────────────────────────────────
    # Everything before '@' is treated as credentials by browsers, hiding the
    # real destination: http://paypal.com@evil.com/phish
    if "@" in normalised_url:
        _add(20, "URL contains '@' symbol (can be used to hide true destination)")

    # ── Double slash in path ──────────────────────────────────────────────────
    # Double slashes in path segments can confuse parsers and mask redirects.
    if re.search(r"(?<!:)//", path):
        _add(10, "URL path contains a double-slash (parser confusion technique)")

    # ── HTTP instead of HTTPS ─────────────────────────────────────────────────
    # Legitimate sites almost universally use HTTPS.
    if parsed.scheme == "http":
        _add(15, "URL uses HTTP instead of HTTPS (unencrypted connection)")

    # ── Redirect to a different domain ────────────────────────────────────────
    # If the original and normalised URLs have different registered domains,
    # the URL redirected through a different site.
    orig_parsed = urlparse(original_url)
    orig_ext = tldextract.extract(orig_parsed.netloc)
    norm_ext = tldextract.extract(normalised_url)
    orig_registered = f"{orig_ext.domain}.{orig_ext.suffix}"
    norm_registered = f"{norm_ext.domain}.{norm_ext.suffix}"
    if orig_registered != norm_registered and orig_registered.strip("."):
        _add(20, f"URL redirected from '{orig_registered}' to '{norm_registered}'")

    # ── Phishing keyword check (skip for trusted domains) ────────────────────
    # Only scan path+query — domains legitimately contain words like 'github'.
    registered_domain = f"{norm_ext.domain}.{norm_ext.suffix}".lower()
    if registered_domain not in TRUSTED_DOMAINS:
        path_query = unquote((path + " " + query).lower())
        keyword_score = 0
        matched_keywords: list[str] = []

        for kw in PHISHING_KEYWORDS:
            if kw in path_query:
                matched_keywords.append(kw)
                keyword_score += 10
                if keyword_score >= 30:
                    break  # Hard cap at +30 from keywords

        if matched_keywords:
            capped = min(keyword_score, 30)
            _add(capped, f"Path/query contains phishing keywords: {', '.join(matched_keywords)}")

    return score, reasons
