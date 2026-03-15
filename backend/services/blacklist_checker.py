"""
Blacklist Checker — three-stage phishing URL blacklist check.

Stage 1 — Google Safe Browsing v4 API (requires a free API key):
    Covers MALWARE, SOCIAL_ENGINEERING, UNWANTED_SOFTWARE, and
    POTENTIALLY_HARMFUL_APPLICATION across ANY_PLATFORM.

Stage 2 — PhishDestroy (api.destroy.tools, no API key required):
    Simple per-domain reputation check; returns {"threat": true} on a hit.

Stage 3 — OpenPhish local set (loaded from disk at startup, refreshed daily):
    Cached copy of the OpenPhish community feed, refreshed via a background
    thread every 24 hours. Zero latency lookups.

On ANY match across any stage the result is returned immediately and all
further detection modules are skipped — a blacklist hit is definitive.
"""

import logging
import os
import threading
from pathlib import Path
from typing import Optional
from urllib.parse import quote_plus

import httpx
import tldextract

logger = logging.getLogger(__name__)

# ── File paths ───────────────────────────────────────────────────────────────
OPENPHISH_CACHE_FILE = Path(__file__).parent.parent / "data" / "openphish_cache.txt"

# ── Feed URLs ────────────────────────────────────────────────────────────────
OPENPHISH_FEED_URL = "https://openphish.com/feed.txt"
PHISHDESTROY_URL = "https://api.destroy.tools/v1/check"
GOOGLE_SB_URL = "https://safebrowsing.googleapis.com/v4/threatMatches:find"

# ── Timing ───────────────────────────────────────────────────────────────────
REFRESH_INTERVAL_SECONDS = 24 * 60 * 60  # 24 hours

# ── Timeouts (per specification: 5 s for live APIs) ──────────────────────────
LIVE_API_TIMEOUT = httpx.Timeout(5.0)
OPENPHISH_DOWNLOAD_TIMEOUT = httpx.Timeout(30.0)

# ── Google Safe Browsing threat configuration ─────────────────────────────────
GOOGLE_SB_THREAT_TYPES = [
    "MALWARE",
    "SOCIAL_ENGINEERING",
    "UNWANTED_SOFTWARE",
    "POTENTIALLY_HARMFUL_APPLICATION",
]


class BlacklistChecker:
    """
    Manages three-stage phishing URL blacklist checking:
      1. Google Safe Browsing v4 (live)
      2. PhishDestroy  (live, no auth)
      3. OpenPhish local set (disk cache, refreshed every 24 h)
    """

    def __init__(self) -> None:
        """Initialise with an empty URL set; call initialise() before use."""
        self._openphish_set: set[str] = set()
        self._refresh_timer: Optional[threading.Timer] = None
        self._google_sb_key = os.getenv("GOOGLE_SAFE_BROWSING_API_KEY", "")

    async def initialise(self) -> None:
        """
        Load the local OpenPhish cache from disk and schedule the 24-hour refresh.
        Called once during application startup via FastAPI's lifespan handler.
        """
        self._load_openphish_cache()
        self._schedule_refresh()

    def shutdown(self) -> None:
        """
        Cancel the background refresh timer to prevent dangling threads on shutdown.
        """
        if self._refresh_timer is not None:
            self._refresh_timer.cancel()
            self._refresh_timer = None

    # ── OpenPhish cache management ────────────────────────────────────────────

    def _load_openphish_cache(self) -> None:
        """
        Read the OpenPhish cache file into an in-memory set for O(1) lookup.

        Each non-blank, non-comment line is treated as a URL or domain entry.
        Lines starting with '#' are ignored.
        """
        try:
            if OPENPHISH_CACHE_FILE.exists():
                lines = OPENPHISH_CACHE_FILE.read_text(encoding="utf-8").splitlines()
                self._openphish_set = {
                    line.strip().lower()
                    for line in lines
                    if line.strip() and not line.startswith("#")
                }
                logger.info("OpenPhish cache loaded: %d entries", len(self._openphish_set))
            else:
                logger.warning("OpenPhish cache file not found at %s", OPENPHISH_CACHE_FILE)
        except Exception as exc:
            logger.error("Failed to load OpenPhish cache: %s", exc)

    def _schedule_refresh(self) -> None:
        """
        Schedule the next OpenPhish feed refresh using threading.Timer so it
        does not block the asyncio event loop.
        """
        # Assign to a typed local variable first so type checkers can confirm
        # that .daemon and .start() are called on a concrete Timer (not None).
        timer: threading.Timer = threading.Timer(
            REFRESH_INTERVAL_SECONDS, self._background_refresh
        )
        timer.daemon = True  # Allow the process to exit cleanly
        timer.start()
        self._refresh_timer = timer

    def _background_refresh(self) -> None:
        """
        Background thread: download the latest OpenPhish feed and reload the cache.
        Always re-schedules itself after completing (success or failure) to maintain
        the 24-hour refresh cycle.
        """
        logger.info("Starting OpenPhish feed refresh...")
        try:
            with httpx.Client(timeout=OPENPHISH_DOWNLOAD_TIMEOUT) as client:
                response = client.get(
                    OPENPHISH_FEED_URL,
                    headers={"User-Agent": "SentinelURL-Scanner/1.0"},
                )
                if response.status_code == 200:
                    OPENPHISH_CACHE_FILE.write_text(response.text, encoding="utf-8")
                    self._load_openphish_cache()
                    logger.info("OpenPhish feed refreshed: %d entries", len(self._openphish_set))
                else:
                    logger.warning("OpenPhish feed HTTP %s — keeping stale cache", response.status_code)
        except Exception as exc:
            logger.error("OpenPhish feed refresh failed: %s", exc)
        finally:
            # Always reschedule regardless of outcome.
            self._schedule_refresh()

    # ── Public check entry point ──────────────────────────────────────────────

    async def check(self, url: str, normalised_url: str) -> dict:
        """
        Run all three blacklist stages in order, returning on the first match.

        Args:
            url:            Original URL submitted by the user.
            normalised_url: The canonicalised URL for cache-consistent lookups.

        Returns:
            Dict with:
              - 'blacklisted' (bool)
              - 'source'      (str | None): 'google_safe_browsing' |
                                            'phishdestroy' | 'openphish' | None
        """
        # ── Stage 1: Google Safe Browsing ──────────────────────────────────────
        gsb_hit = await self._check_google_safe_browsing(normalised_url)
        if gsb_hit:
            return {"blacklisted": True, "source": "google_safe_browsing"}

        # ── Stage 2: PhishDestroy ──────────────────────────────────────────────
        ext = tldextract.extract(normalised_url)
        registered_domain = f"{ext.domain}.{ext.suffix}".lower()
        phishdestroy_hit = await self._check_phishdestroy(registered_domain)
        if phishdestroy_hit:
            return {"blacklisted": True, "source": "phishdestroy"}

        # ── Stage 3: OpenPhish local set ───────────────────────────────────────
        if self._check_openphish(normalised_url, registered_domain):
            return {"blacklisted": True, "source": "openphish"}

        return {"blacklisted": False, "source": None}

    # ── Stage 1: Google Safe Browsing v4 API ──────────────────────────────────

    async def _check_google_safe_browsing(self, normalised_url: str) -> bool:
        """
        Query the Google Safe Browsing v4 threatMatches:find endpoint.

        A non-empty "matches" array in the response means the URL is listed.
        Returns False silently on timeout or any network/parse error so that
        a slow or unavailable GSB API never blocks a scan.

        Args:
            normalised_url: The URL to check.

        Returns:
            True if any threat match is found, False otherwise.
        """
        if not self._google_sb_key:
            # API key not configured — skip this stage gracefully.
            return False

        request_body = {
            "client": {
                "clientId": "sentinelurl",
                "clientVersion": "1.0",
            },
            "threatInfo": {
                "threatTypes": GOOGLE_SB_THREAT_TYPES,
                "platformTypes": ["ANY_PLATFORM"],
                "threatEntryTypes": ["URL"],
                "threatEntries": [{"url": normalised_url}],
            },
        }

        try:
            async with httpx.AsyncClient(timeout=LIVE_API_TIMEOUT) as client:
                response = await client.post(
                    f"{GOOGLE_SB_URL}?key={self._google_sb_key}",
                    json=request_body,
                    headers={
                        "Content-Type": "application/json",
                        "User-Agent": "SentinelURL-Scanner/1.0",
                    },
                )
                data = response.json()
                # "matches" key is only present when threats are found.
                # An empty response body {} means no matches.
                matches = data.get("matches", [])
                return len(matches) > 0
        except httpx.TimeoutException:
            # Silently skip — a slow GSB API must never delay results.
            logger.info("Google Safe Browsing API timed out — skipping Stage 1")
            return False
        except Exception as exc:
            logger.warning("Google Safe Browsing API error: %s", exc)
            return False

    # ── Stage 2: PhishDestroy ─────────────────────────────────────────────────

    async def _check_phishdestroy(self, registered_domain: str) -> bool:
        """
        Query the PhishDestroy reputation API (no API key required).

        Endpoint: GET https://api.destroy.tools/v1/check?domain=<domain>
        A response JSON with {"threat": true} indicates the domain is malicious.

        Args:
            registered_domain: The registered domain portion of the URL
                                (e.g. 'evil.com'), already lowercased.

        Returns:
            True if the domain is listed as a threat, False otherwise.
        """
        if not registered_domain or "." not in registered_domain:
            return False

        try:
            async with httpx.AsyncClient(timeout=LIVE_API_TIMEOUT) as client:
                response = await client.get(
                    PHISHDESTROY_URL,
                    params={"domain": registered_domain},
                    headers={"User-Agent": "SentinelURL-Scanner/1.0"},
                )
                # Only parse JSON on a successful response.
                if response.status_code == 200:
                    data = response.json()
                    return bool(data.get("threat", False))
        except httpx.TimeoutException:
            logger.info("PhishDestroy API timed out — skipping Stage 2")
        except Exception as exc:
            logger.warning("PhishDestroy API error: %s", exc)
        # Explicit return covers all exception and non-200 paths.
        return False

    # ── Stage 3: OpenPhish local set ──────────────────────────────────────────

    def _check_openphish(self, normalised_url: str, registered_domain: str) -> bool:
        """
        Fast O(1) lookup against the in-memory OpenPhish set.

        Checks both the full normalised URL and the registered domain, so
        phishing URLs with different paths on the same domain are caught.

        Args:
            normalised_url:    Full normalised URL string.
            registered_domain: The registered domain (e.g. 'evil.com').

        Returns:
            True if either the URL or domain is in the OpenPhish set.
        """
        lower_url = normalised_url.lower().rstrip("/")
        if lower_url in self._openphish_set:
            return True
        return registered_domain in self._openphish_set
