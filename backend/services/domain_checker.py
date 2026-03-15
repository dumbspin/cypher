"""
Domain Checker — gathers WHOIS/RDAP data and scores domain age risk.

A very recently registered domain is a strong indicator of a phishing
campaign, since attackers register new domains immediately before attacks
to avoid pre-built blacklists.

Primary source:  python-whois library
Fallback source: rdap.org public REST API (no auth required)
"""

import logging
from datetime import datetime, timezone
from typing import Optional

import httpx
import whois

from utils.ssrf_guard import SSRFBlockedError

logger = logging.getLogger(__name__)

# Timeout for RDAP fallback requests.
RDAP_TIMEOUT = httpx.Timeout(8.0)


def _days_since(dt: datetime) -> int:
    """
    Calculate how many days have elapsed since *dt*.

    Args:
        dt: A timezone-aware or naive datetime representing domain creation.

    Returns:
        Number of whole days since dt.
    """
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        # Make naive datetime timezone-aware by assuming UTC.
        dt = dt.replace(tzinfo=timezone.utc)
    delta = now - dt
    return max(0, delta.days)


def _days_until(dt: datetime) -> int:
    """
    Calculate how many days remain until *dt* (e.g., domain expiry).

    Args:
        dt: A timezone-aware or naive datetime representing expiry.

    Returns:
        Number of whole days until dt (negative if already expired).
    """
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta = dt - now
    return delta.days


def _format_date(dt) -> Optional[str]:
    """
    Safely format a date field from whois, which may be a list or single value.

    Args:
        dt: A datetime, list of datetimes, or None from whois output.

    Returns:
        ISO-8601 date string or None.
    """
    if isinstance(dt, list):
        dt = dt[0] if dt else None
    if isinstance(dt, datetime):
        return dt.strftime("%Y-%m-%d")
    return None


async def _whois_creation_date(domain: str) -> Optional[datetime]:
    """
    Query the WHOIS database for the domain's creation date.

    Runs in a thread executor to avoid blocking the event loop, since
    python-whois performs synchronous blocking DNS/TCP calls.

    Args:
        domain: Registered domain name (e.g., 'example.com').

    Returns:
        Creation datetime or None if WHOIS query fails.
    """
    import asyncio

    loop = asyncio.get_event_loop()
    try:
        w = await loop.run_in_executor(None, whois.whois, domain)
        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]
        if isinstance(creation, datetime):
            return creation
    except Exception as exc:
        logger.debug("WHOIS failed for %s: %s", domain, exc)
    return None


async def _rdap_creation_date(domain: str) -> Optional[datetime]:
    """
    Fallback: Query the rdap.org public API for domain registration date.

    RDAP (Registration Data Access Protocol) is a standardised replacement
    for WHOIS that returns structured JSON.

    Args:
        domain: Registered domain name.

    Returns:
        Creation datetime parsed from RDAP response, or None on failure.
    """
    url = f"https://rdap.org/domain/{domain}"
    try:
        async with httpx.AsyncClient(timeout=RDAP_TIMEOUT) as client:
            response = await client.get(url, headers={"User-Agent": "SentinelURL-Scanner/1.0"})
            if response.status_code != 200:
                return None
            data = response.json()
            for event in data.get("events", []):
                if event.get("eventAction") == "registration":
                    date_str = event.get("eventDate", "")
                    # RDAP dates are ISO-8601: '2020-01-15T00:00:00Z'
                    return datetime.fromisoformat(date_str.replace("Z", "+00:00"))
    except Exception as exc:
        logger.debug("RDAP fallback failed for %s: %s", domain, exc)
    return None


async def check_domain(domain: str, normalised_url: str) -> tuple[int, list[dict], dict]:
    """
    Run all domain-age and WHOIS checks, returning score, reasons, and domain info.

    Attempts python-whois first; falls back to rdap.org if whois fails.
    If both fail, adds a penalty for undetermined domain age.

    Args:
        domain:         Extracted registered domain (e.g. 'paypal.com').
        normalised_url: Full normalised URL (used for tldextract).

    Returns:
        Tuple of:
          - total score contribution (int)
          - list of reason dicts with keys module/reason/score
          - domain_info dict with structured WHOIS metadata
    """
    import tldextract

    score = 0
    reasons: list[dict] = []
    domain_info: dict = {"domain": domain}

    def _add(pts: int, message: str) -> None:
        nonlocal score
        score += pts
        reasons.append({
            "module": "Domain Intelligence",
            "reason": f"{message} (+{pts})",
            "score": pts,
        })

    # ── Gather WHOIS data ─────────────────────────────────────────────────────
    creation_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    registrar: Optional[str] = None

    import asyncio
    loop = asyncio.get_event_loop()

    try:
        w = await loop.run_in_executor(None, whois.whois, domain)
        creation_date = w.creation_date
        expiry_date = w.expiration_date
        registrar = w.registrar

        # WHOIS may return lists when multiple dates are present.
        if isinstance(creation_date, list):
            creation_date = creation_date[0]
        if isinstance(expiry_date, list):
            expiry_date = expiry_date[0]

        domain_info["registrar"] = registrar
        domain_info["creation_date"] = _format_date(creation_date)
        domain_info["expiry_date"] = _format_date(expiry_date)

    except Exception as exc:
        logger.info("WHOIS failed for %s, trying RDAP: %s", domain, exc)

    # ── RDAP fallback ─────────────────────────────────────────────────────────
    if creation_date is None:
        creation_date = await _rdap_creation_date(domain)
        if creation_date:
            domain_info["creation_date"] = _format_date(creation_date)

    # ── Age scoring ───────────────────────────────────────────────────────────
    if creation_date is None:
        _add(15, "Domain age could not be determined (WHOIS and RDAP both failed)")
    else:
        age_days = _days_since(creation_date)
        domain_info["age_days"] = age_days

        if age_days < 7:
            _add(50, f"Domain registered {age_days} day(s) ago (very new — high risk)")
        elif age_days < 30:
            _add(35, f"Domain registered {age_days} days ago (less than 30 days old)")
        elif age_days < 90:
            _add(15, f"Domain registered {age_days} days ago (less than 90 days old)")

    # ── Expiry scoring ────────────────────────────────────────────────────────
    if expiry_date is not None:
        days_left = _days_until(expiry_date)
        domain_info["expiry_date"] = _format_date(expiry_date)
        if days_left < 365:
            _add(10, f"Domain expires in {days_left} days (short registration — low investment indicator)")

    return score, reasons, domain_info
