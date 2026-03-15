"""
SSRF Guard — Server-Side Request Forgery prevention utility.

Every URL submitted to /analyze MUST pass through validate_url() before
any network request is made. This module is the single enforcement point
for all SSRF mitigations.

Why this matters:
  Without SSRF protection an attacker could submit a URL like
  http://169.254.169.254/latest/meta-data/ (AWS metadata endpoint) or
  http://localhost:6379 (Redis) and trick our server into making requests
  on their behalf, potentially exposing credentials.
"""

import ipaddress
import socket
from urllib.parse import urlparse


class SSRFBlockedError(Exception):
    """
    Raised whenever a URL fails the SSRF safety checks.
    Callers must catch this and return an appropriate error response
    rather than attempting a network request.
    """


# Allowed URL schemes. All others (javascript:, file:, ftp:, data:, etc.)
# are rejected because they either execute code or access local resources.
ALLOWED_SCHEMES = {"http", "https"}

# Hostnames that should never be reached from a public-facing service.
# These names always resolve to loopback or internal addresses.
BLOCKED_HOSTNAMES = {"localhost", "local", "internal", "broadcasthost"}

# Private, loopback, link-local, and other reserved IP networks per RFC 1918,
# RFC 3927, RFC 4193, RFC 5737, RFC 6598, and RFC 6890.
BLOCKED_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),        # RFC 1918 private
    ipaddress.ip_network("172.16.0.0/12"),      # RFC 1918 private
    ipaddress.ip_network("192.168.0.0/16"),     # RFC 1918 private
    ipaddress.ip_network("127.0.0.0/8"),        # loopback
    ipaddress.ip_network("169.254.0.0/16"),     # link-local (AWS metadata)
    ipaddress.ip_network("100.64.0.0/10"),      # shared address space RFC 6598
    ipaddress.ip_network("192.0.0.0/24"),       # IETF protocol assignments
    ipaddress.ip_network("198.18.0.0/15"),      # benchmarking RFC 2544
    ipaddress.ip_network("198.51.100.0/24"),    # documentation TEST-NET-2
    ipaddress.ip_network("203.0.113.0/24"),     # documentation TEST-NET-3
    ipaddress.ip_network("240.0.0.0/4"),        # reserved
    ipaddress.ip_network("::1/128"),            # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),           # IPv6 ULA (private)
    ipaddress.ip_network("fe80::/10"),          # IPv6 link-local
]


def _is_ip_blocked(ip_str: str) -> bool:
    """
    Check whether a resolved IP address falls in any blocked network range.

    Args:
        ip_str: Dotted-decimal IPv4 or colon-hex IPv6 address string.

    Returns:
        True if the IP must be blocked, False if it is safe to reach.
    """
    try:
        addr = ipaddress.ip_address(ip_str)
    except ValueError:
        # Unparseable address — block it to be safe.
        return True

    return any(addr in network for network in BLOCKED_NETWORKS)


def validate_url(url: str) -> str:
    """
    Validate that *url* is safe to make an outbound HTTP request to.

    Checks performed (in order):
    1. Parse the URL and verify the scheme is http or https.
    2. Ensure a non-empty hostname is present.
    3. Reject known-bad hostnames (localhost, local, internal, etc.).
    4. Resolve the hostname via DNS (socket.getaddrinfo) and verify
       none of the resolved IPs fall in any private/reserved range.

    Args:
        url: The raw URL string to validate.

    Returns:
        The same url string if all checks pass.

    Raises:
        SSRFBlockedError: If any check fails, with a descriptive message.
    """
    parsed = urlparse(url)

    # ── Check 1: scheme ───────────────────────────────────────────────────────
    # Only permit http and https. javascript:, file:, ftp:, data: etc. are all
    # vectors for SSRF or code execution.
    if parsed.scheme.lower() not in ALLOWED_SCHEMES:
        raise SSRFBlockedError(
            f"Blocked scheme '{parsed.scheme}'. Only http and https are allowed."
        )

    # ── Check 2: hostname presence ────────────────────────────────────────────
    hostname = parsed.hostname
    if not hostname:
        raise SSRFBlockedError("URL has no hostname.")

    hostname = hostname.lower()

    # ── Check 3: blocked hostname names ──────────────────────────────────────
    # Block known internal aliases before DNS resolution to avoid relying solely
    # on DNS responses (which could be manipulated or resolve differently).
    if hostname in BLOCKED_HOSTNAMES:
        raise SSRFBlockedError(f"Hostname '{hostname}' is not allowed.")

    # Also block hostnames that *end* with .local or .internal (mDNS / coreDNS)
    if hostname.endswith(".local") or hostname.endswith(".internal"):
        raise SSRFBlockedError(f"Hostname '{hostname}' resolves to an internal network.")

    # ── Check 4: DNS resolution and IP range check ────────────────────────────
    # Resolve the hostname to all its IP addresses. If ANY resolved address is
    # in a private/reserved range, the URL is blocked. This prevents DNS
    # rebinding attacks where a public domain later resolves to a private IP.
    try:
        # getaddrinfo returns (family, type, proto, canonname, sockaddr) tuples.
        # sockaddr is (host, port) for IPv4 and (host, port, flow, scope) for IPv6.
        addr_infos = socket.getaddrinfo(hostname, None)
    except socket.gaierror as exc:
        raise SSRFBlockedError(f"DNS resolution failed for '{hostname}': {exc}") from exc

    if not addr_infos:
        raise SSRFBlockedError(f"No IP addresses resolved for '{hostname}'.")

    for _family, _type, _proto, _canon, sockaddr in addr_infos:
        ip = sockaddr[0]
        if _is_ip_blocked(ip):
            raise SSRFBlockedError(
                f"Hostname '{hostname}' resolves to a private/reserved IP address ({ip})."
            )

    return url
