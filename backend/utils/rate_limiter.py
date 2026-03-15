"""
Rate limiter configuration using slowapi.

slowapi wraps limits library for FastAPI, providing per-IP rate limiting
backed by in-memory storage (suitable for single-instance deployments on
Render's free tier).

Configured limits:
  /analyze  — 10 requests / minute per IP
  /bulk     —  2 requests / minute per IP
"""

from slowapi import Limiter
from slowapi.util import get_remote_address

# The limiter is created once and shared across the entire application.
# get_remote_address extracts the client's real IP from the request,
# using X-Forwarded-For when behind a proxy (Render's infrastructure).
limiter = Limiter(key_func=get_remote_address)

# Named limit strings reused across route decorators for DRY consistency.
ANALYZE_LIMIT = "10/minute"
BULK_LIMIT = "2/minute"
