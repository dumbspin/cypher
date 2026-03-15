"""
Cache utility — wraps the Upstash Redis REST API.

Upstash provides a serverless Redis instance accessible over HTTPS using
simple REST calls. This avoids the need for a persistent TCP connection
and works within Render's free-tier constraints.

Cache key format: 'scan:<md5_of_normalised_url>'
TTL:              CACHE_TTL_SECONDS env var (default 3600 seconds)
"""

import hashlib
import json
import logging
import os
from typing import Any, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Upstash REST credentials loaded from environment variables.
UPSTASH_URL = os.getenv("UPSTASH_REDIS_REST_URL", "")
UPSTASH_TOKEN = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")
CACHE_TTL = int(os.getenv("CACHE_TTL_SECONDS", "3600"))

# Timeout for cache requests — kept short so a slow Redis never blocks scans.
CACHE_TIMEOUT = httpx.Timeout(5.0)


def _cache_key(normalised_url: str) -> str:
    """
    Derive a deterministic cache key from the normalised URL.

    Using MD5 here is purely for key generation (not security). The hash
    keeps keys at a fixed length regardless of URL size.

    Args:
        normalised_url: The final, normalised URL string.

    Returns:
        Cache key string in the form 'scan:<32-char-hex>'.
    """
    digest = hashlib.md5(normalised_url.encode("utf-8")).hexdigest()
    return f"scan:{digest}"


def _headers() -> dict[str, str]:
    """
    Build the Upstash REST API authentication headers.

    Returns:
        Dict with Authorization header using the Bearer token.
    """
    return {"Authorization": f"Bearer {UPSTASH_TOKEN}"}


async def get_cached(normalised_url: str) -> Optional[dict[str, Any]]:
    """
    Attempt to retrieve a cached scan result for the given normalised URL.

    Args:
        normalised_url: The final, normalised URL used as cache key basis.

    Returns:
        Parsed scan result dict if a cache hit is found, or None on miss/error.
    """
    if not UPSTASH_URL or not UPSTASH_TOKEN:
        # Cache is unconfigured — silently skip. This allows the app to work
        # locally without Redis credentials.
        return None

    key = _cache_key(normalised_url)
    try:
        async with httpx.AsyncClient(timeout=CACHE_TIMEOUT) as client:
            response = await client.get(
                f"{UPSTASH_URL}/get/{key}",
                headers=_headers(),
            )
            data = response.json()
            if data.get("result") is None:
                return None
            return json.loads(data["result"])
    except Exception as exc:
        # Cache errors must never crash the scan — log and return None.
        logger.warning("Cache GET failed: %s", exc)
        return None


async def set_cached(normalised_url: str, result: dict[str, Any]) -> None:
    """
    Store a scan result in cache with the configured TTL.

    Args:
        normalised_url: Used to derive the cache key.
        result:         The serialisable scan result dict to store.
    """
    if not UPSTASH_URL or not UPSTASH_TOKEN:
        return

    key = _cache_key(normalised_url)
    payload = json.dumps(result)

    try:
        async with httpx.AsyncClient(timeout=CACHE_TIMEOUT) as client:
            # Upstash REST: SETEX key seconds value
            await client.post(
                f"{UPSTASH_URL}/setex/{key}/{CACHE_TTL}/{payload}",
                headers=_headers(),
            )
    except Exception as exc:
        logger.warning("Cache SET failed: %s", exc)
