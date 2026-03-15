"""
Analyze route — POST /analyze endpoint.

This module wires together all detection modules:
  1. SSRF guard + URL normalisation
  2. Blacklist check (short-circuit if matched)
  3. Parallel: URL analysis + domain check + content scan
  4. Risk engine aggregation
  5. Cache write

Returns a structured AnalyzeResponse to the frontend.
"""

import asyncio
import hashlib
import logging
from typing import Optional

import tldextract
from fastapi import APIRouter, Request

from models.schemas import AnalyzeRequest, AnalyzeResponse
from services.blacklist_checker import BlacklistChecker
from services.content_scanner import scan_content
from services.domain_checker import check_domain
from services.risk_engine import blacklist_result, compute_risk
from services.screenshot_service import get_screenshot_url
from services.url_analyzer import analyse_url
from utils.cache import get_cached, set_cached
from utils.rate_limiter import limiter, ANALYZE_LIMIT
from utils.ssrf_guard import SSRFBlockedError, validate_url
from utils.url_normalizer import normalise_url

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
@limiter.limit(ANALYZE_LIMIT)
async def analyze_url_endpoint(
    request: Request,
    body: AnalyzeRequest,
) -> AnalyzeResponse:
    """
    Main analysis endpoint.

    Accepts a URL, runs all detection modules in parallel where possible,
    aggregates scores via the risk engine, and returns a full scan result.

    Rate limited to 10 requests/minute per IP.
    """
    raw_url = body.url

    # ── Step 1: SSRF guard (early check before normalisation) ─────────────────
    try:
        validate_url(raw_url)
    except SSRFBlockedError as exc:
        return AnalyzeResponse(
            scan_id="blocked",
            url=raw_url,
            normalized_url=raw_url,
            risk_score=0,
            raw_score=0,
            classification="Safe",
            reasons=[],
            error=f"URL blocked by security policy: {exc}",
        )

    # ── Step 2: Normalise URL + follow redirects ───────────────────────────────
    try:
        original_url, normalised_url = await normalise_url(raw_url)
    except Exception as exc:
        logger.warning("URL normalisation failed: %s", exc)
        original_url = raw_url
        normalised_url = raw_url

    # Derive cache key (scan_id)
    scan_id = hashlib.md5(normalised_url.encode("utf-8")).hexdigest()

    # ── Step 3: Cache lookup ──────────────────────────────────────────────────
    cached = await get_cached(normalised_url)
    if cached is not None:
        cached["cached"] = True
        return AnalyzeResponse(**cached)

    # ── Step 4: Blacklist check (short-circuit path) ──────────────────────────
    blacklist_checker: BlacklistChecker = request.app.state.blacklist_checker
    bl_result = await blacklist_checker.check(original_url, normalised_url)

    if bl_result.get("blacklisted"):
        risk = blacklist_result()
        response_data = _build_response(
            scan_id=scan_id,
            original_url=original_url,
            normalised_url=normalised_url,
            risk=risk,
            domain_info=None,
            screenshot_url=None,
            blacklisted=True,
        )
        # Cache definitive blacklist hits
        await set_cached(normalised_url, response_data)
        return AnalyzeResponse(**response_data)

    # ── Step 5: Extract domain for domain check ───────────────────────────────
    ext = tldextract.extract(normalised_url)
    domain = f"{ext.domain}.{ext.suffix}"

    # ── Step 6: Run detection modules in parallel ──────────────────────────────
    # url_analyze and content_scan can both run concurrently.
    # domain_check involves blocking WHOIS, so it's also async.
    url_score, url_reasons = analyse_url(original_url, normalised_url)

    domain_task = asyncio.create_task(check_domain(domain, normalised_url))
    content_task = asyncio.create_task(scan_content(normalised_url))

    domain_score, domain_reasons, domain_info_dict = await domain_task
    content_score, content_reasons = await content_task

    # ── Step 7: Aggregate risk ────────────────────────────────────────────────
    risk = compute_risk([
        (url_score, url_reasons),
        (domain_score, domain_reasons),
        (content_score, content_reasons),
    ])

    # ── Step 8: Screenshot URL ────────────────────────────────────────────────
    screenshot_url = get_screenshot_url(normalised_url)

    # ── Step 9: Build response ────────────────────────────────────────────────
    response_data = _build_response(
        scan_id=scan_id,
        original_url=original_url,
        normalised_url=normalised_url,
        risk=risk,
        domain_info=domain_info_dict,
        screenshot_url=screenshot_url,
        blacklisted=False,
    )

    # ── Step 10: Cache result ─────────────────────────────────────────────────
    await set_cached(normalised_url, response_data)

    return AnalyzeResponse(**response_data)


def _build_response(
    *,
    scan_id: str,
    original_url: str,
    normalised_url: str,
    risk: dict,
    domain_info: Optional[dict],
    screenshot_url: Optional[str],
    blacklisted: bool,
) -> dict:
    """
    Assemble the serialisable response dictionary from aggregated results.

    This helper exists to keep the main endpoint function readable and to
    ensure the exact same response format is used for both cached and
    live results.

    Args:
        scan_id:        MD5 hash of normalised URL used as cache key.
        original_url:   URL as submitted.
        normalised_url: URL after normalisation.
        risk:           Dict from risk_engine with score/classification/reasons.
        domain_info:    Dict from domain_checker with WHOIS data.
        screenshot_url: ScreenshotOne API URL or None.
        blacklisted:    Whether a blacklist match was found.

    Returns:
        Serialisable dict matching the AnalyzeResponse schema.
    """
    # Convert list-of-dicts reasons to list-of-DetectionReason-dicts
    reasons_out = [
        {"module": r["module"], "reason": r["reason"], "score": r["score"]}
        for r in risk.get("reasons", [])
    ]

    domain_info_out = None
    if domain_info:
        domain_info_out = {
            "domain": domain_info.get("domain", ""),
            "registrar": domain_info.get("registrar"),
            "creation_date": domain_info.get("creation_date"),
            "expiry_date": domain_info.get("expiry_date"),
            "age_days": domain_info.get("age_days"),
            "country": domain_info.get("country"),
        }

    return {
        "scan_id": scan_id,
        "url": original_url,
        "normalized_url": normalised_url,
        "risk_score": risk["risk_score"],
        "raw_score": risk["raw_score"],
        "classification": risk["classification"],
        "reasons": reasons_out,
        "domain_info": domain_info_out,
        "screenshot_url": screenshot_url,
        "cached": False,
        "blacklisted": blacklisted,
        "error": None,
    }

