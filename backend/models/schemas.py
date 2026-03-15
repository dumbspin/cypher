"""
Pydantic schemas for all request/response models in Cypher.

Strict typing ensures the API never accepts malformed data and always
returns a predictable, documented structure to the frontend.
"""

import re
from typing import Any, Optional

from pydantic import BaseModel, Field, field_validator


# ── Request models ─────────────────────────────────────────────────────────────


class AnalyzeRequest(BaseModel):
    """
    Incoming URL analysis request.

    Enforces a maximum URL length of 2048 characters (matching RFC 7230
    recommendations) and rejects URLs containing null bytes or control
    characters that could be used for injection attacks.
    """

    url: str = Field(..., min_length=1, max_length=2048, description="URL to analyse")

    @field_validator("url")
    @classmethod
    def reject_dangerous_chars(cls, v: str) -> str:
        """
        Block null bytes and ASCII control characters (0x00–0x1F, 0x7F).
        These characters have no legitimate place in a URL and are commonly
        used to bypass naive validation or cause parser confusion.
        """
        if re.search(r"[\x00-\x1f\x7f]", v):
            raise ValueError("URL contains invalid control characters")
        return v.strip()


class BulkAnalyzeRequest(BaseModel):
    """
    Wrapper for the bulk scan CSV upload endpoint.
    The actual file is handled as a multipart upload in the route;
    this model is used for metadata validation.
    """

    max_urls: int = Field(default=50, ge=1, le=50)


# ── Sub-models used inside the response ────────────────────────────────────────


class DomainInfo(BaseModel):
    """Structured WHOIS / RDAP metadata for the scanned domain."""

    domain: str
    registrar: Optional[str] = None
    creation_date: Optional[str] = None
    expiry_date: Optional[str] = None
    age_days: Optional[int] = None
    country: Optional[str] = None


class DetectionReason(BaseModel):
    """A single triggered detection check with its score contribution."""

    module: str = Field(..., description="Module that raised this reason")
    reason: str = Field(..., description="Human-readable explanation")
    score: int = Field(..., description="Score points contributed by this check")


# ── Main response model ────────────────────────────────────────────────────────


class AnalyzeResponse(BaseModel):
    """
    Full analysis response returned by POST /analyze.

    All fields are explicitly typed so the frontend can rely on
    consistent JSON structure without runtime surprises.
    """

    scan_id: str = Field(..., description="Unique identifier for this scan (MD5 of normalised URL)")
    url: str = Field(..., description="Original URL submitted by the user")
    normalized_url: str = Field(..., description="URL after normalisation and redirect-following")
    risk_score: int = Field(..., ge=0, le=100, description="Clamped risk score 0–100")
    raw_score: int = Field(..., ge=0, description="Raw sum of all penalties (may exceed 100)")
    classification: str = Field(..., description="Safe | Suspicious | Phishing")
    reasons: list[DetectionReason] = Field(default_factory=list)
    domain_info: Optional[DomainInfo] = None
    screenshot_url: Optional[str] = None
    cached: bool = Field(default=False, description="True if result was served from cache")
    blacklisted: bool = Field(default=False, description="True if URL is in a blacklist")
    error: Optional[str] = None


class BulkAnalyzeResponse(BaseModel):
    """Response for the bulk CSV endpoint — an array of individual scan results."""

    results: list[AnalyzeResponse]
    total: int
    processed: int


class HealthResponse(BaseModel):
    """Simple health-check response used by UptimeRobot."""

    status: str = "ok"
    version: str = "1.0.0"
