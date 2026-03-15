"""
Content Scanner — fetches the page HTML and uses BeautifulSoup to detect
phishing indicators in the page content.

Checks performed:
  - Password input fields (common on phishing credential-harvesting pages)
  - Forms that POST to an external domain (data exfiltration)
  - Hidden iframes (used for drive-by downloads or clickjacking)
  - Login/sign-in form by keyword in labels and buttons
  - Favicon loaded from an external domain (brand impersonation)
  - <title> brand-name mismatch with the actual domain
  - Meta-refresh redirect (used to forward to the final phishing URL)
"""

import logging
import re
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

import tldextract
from utils.ssrf_guard import SSRFBlockedError, validate_url

logger = logging.getLogger(__name__)

# Maximum response body size to read (2 MB).
# Prevents memory exhaustion from streaming very large pages.
MAX_CONTENT_BYTES = 2 * 1024 * 1024  # 2 MB

TIMEOUT = httpx.Timeout(connect=10.0, read=15.0, write=10.0, pool=5.0)

# Popular brand names whose presence in a page title but absence from the
# domain name is a strong signal of impersonation.
BRAND_NAMES = [
    "paypal", "amazon", "apple", "google", "microsoft", "facebook",
    "instagram", "netflix", "bank of america", "chase", "wellsfargo",
    "citibank", "hsbc", "visa", "mastercard", "ebay", "dropbox",
]

# Keywords that suggest a login form is present (checked on label/button text).
LOGIN_KEYWORDS = ["login", "log in", "sign in", "signin", "username", "email address"]


def _registered_domain(url: str) -> str:
    """
    Extract the registered domain (e.g. 'evil.com') from a URL.

    Args:
        url: Full URL string.

    Returns:
        'domain.suffix' string (e.g. 'paypal.com').
    """
    ext = tldextract.extract(url)
    return f"{ext.domain}.{ext.suffix}".lower()


async def scan_content(normalised_url: str) -> tuple[int, list[dict]]:
    """
    Fetch the target page and analyse its HTML for phishing indicators.

    Handles network errors, read-size caps, and parse failures gracefully.
    Any exception during fetch/parse returns zero score rather than crashing.

    Args:
        normalised_url: The final, normalised URL to fetch.

    Returns:
        A tuple of (total_score: int, reasons: list[dict]).
    """
    score = 0
    reasons: list[dict] = []

    def _add(pts: int, message: str) -> None:
        nonlocal score
        score += pts
        reasons.append({
            "module": "Content Analysis",
            "reason": f"{message} (+{pts})",
            "score": pts,
        })

    # ── Fetch the page ────────────────────────────────────────────────────────
    html = await _fetch_html(normalised_url)
    if html is None:
        # Non-fatal: page could not be retrieved. Skip content checks.
        return 0, []

    # ── Parse HTML ────────────────────────────────────────────────────────────
    try:
        soup = BeautifulSoup(html, "lxml")
    except Exception as exc:
        logger.warning("HTML parse failed for %s: %s", normalised_url, exc)
        return 0, []

    page_domain = _registered_domain(normalised_url)

    # ── Check 1: Password input field ─────────────────────────────────────────
    # Any page with a password field is a credential-harvesting candidate.
    if soup.find("input", {"type": re.compile(r"^password$", re.I)}):
        _add(20, "Page contains a password input field (credential harvesting indicator)")

    # ── Check 2: Form posting to external domain ──────────────────────────────
    # If a <form> sends data to a different domain, data is being exfiltrated.
    for form in soup.find_all("form", action=True):
        action = form["action"].strip()
        if not action or action.startswith("#") or action.startswith("javascript"):
            continue
        # Resolve relative URLs to absolute before checking domain.
        abs_action = urljoin(normalised_url, action)
        form_domain = _registered_domain(abs_action)
        if form_domain and form_domain != page_domain and not abs_action.startswith("/"):
            _add(25, f"Form submits data to external domain '{form_domain}'")
            break  # Score once even if multiple such forms exist

    # ── Check 3: Hidden iframes ───────────────────────────────────────────────
    # Iframes hidden via CSS are used for clickjacking and invisible redirects.
    for iframe in soup.find_all("iframe"):
        style = iframe.get("style", "")
        if re.search(r"display\s*:\s*none", style, re.I):
            _add(15, "Page contains a hidden iframe (display:none) — possible clickjacking")
            break

    # ── Check 4: Login/signin form (keywords in labels/buttons) ──────────────
    page_text = soup.get_text(" ").lower()
    if any(kw in page_text for kw in LOGIN_KEYWORDS):
        # Only add score if we also found a form — plain text pages that
        # mention "login" are less suspicious.
        if soup.find("form"):
            _add(15, "Page contains a login/signin form (keyword in page text)")

    # ── Check 5: Favicon loaded from an external domain ──────────────────────
    # Phishing pages import a trusted brand's favicon to appear legitimate.
    for link in soup.find_all("link", rel=re.compile(r"icon", re.I)):
        href = link.get("href", "")
        if href.startswith("http"):
            favicon_domain = _registered_domain(href)
            if favicon_domain and favicon_domain != page_domain:
                _add(10, f"Favicon loaded from external domain '{favicon_domain}'")
                break

    # ── Check 6: Title brand-name mismatch ───────────────────────────────────
    # A title saying "PayPal — Login" on a domain that isn't paypal.com is a
    # classic brand impersonation pattern.
    title_tag = soup.find("title")
    if title_tag:
        title_text = title_tag.get_text().lower()
        for brand in BRAND_NAMES:
            if brand in title_text and brand.split()[0] not in page_domain:
                _add(15, f"Page title references brand '{brand}' but domain is '{page_domain}'")
                break

    # ── Check 7: Meta-refresh redirect ────────────────────────────────────────
    # <meta http-equiv="refresh" content="0; url=..."> redirects users to a
    # different page, often used to send them to the actual phishing content.
    for meta in soup.find_all("meta", attrs={"http-equiv": re.compile(r"refresh", re.I)}):
        _add(10, "Page uses <meta http-equiv='refresh'> redirect")
        break

    return score, reasons


async def _fetch_html(url: str) -> str | None:
    """
    Perform an HTTP GET request to *url* and return the response body as text.

    Enforces:
    - SSRF validation before connecting
    - 2 MB response body cap
    - 10s connect / 15s read timeouts
    - SentinelURL-Scanner/1.0 User-Agent

    Args:
        url: URL to fetch.

    Returns:
        HTML body string, or None if the request fails.
    """
    try:
        validate_url(url)
    except SSRFBlockedError as exc:
        logger.info("Content scan SSRF blocked: %s", exc)
        return None

    try:
        async with httpx.AsyncClient(
            timeout=TIMEOUT,
            follow_redirects=True,
            headers={"User-Agent": "SentinelURL-Scanner/1.0"},
            verify=False,  # Reach phishing sites regardless of cert validity
        ) as client:
            async with client.stream("GET", url) as response:
                chunks: list[bytes] = []
                total = 0
                async for chunk in response.aiter_bytes(chunk_size=8192):
                    total += len(chunk)
                    if total > MAX_CONTENT_BYTES:
                        # Stop reading at 2 MB to prevent memory exhaustion.
                        logger.info("Content truncated at 2 MB for %s", url)
                        break
                    chunks.append(chunk)
                body = b"".join(chunks)
                return body.decode("utf-8", errors="replace")
    except httpx.TimeoutException:
        logger.info("Content scan timed out for %s", url)
        return None
    except Exception as exc:
        logger.info("Content scan failed for %s: %s", url, exc)
        return None
