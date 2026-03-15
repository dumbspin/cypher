"""
SentinelURL Backend — FastAPI Application Entry Point

This module bootstraps the FastAPI application, configures CORS,
rate limiting, error handlers, and registers all API routes.
"""

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Load .env before anything else so env vars are available
load_dotenv()

from routes.analyze import router as analyze_router
from routes.health import router as health_router
from services.blacklist_checker import BlacklistChecker
from utils.rate_limiter import limiter


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs startup logic (loading blacklists) before serving requests,
    and cleanup logic after shutdown.
    """
    # Startup: initialise the blacklist checker which loads OpenPhish feed
    # and schedules the 24-hour refresh timer.
    blacklist_checker = BlacklistChecker()
    await blacklist_checker.initialise()
    # Attach to app state so routes can access the same instance
    app.state.blacklist_checker = blacklist_checker
    yield
    # Shutdown: cancel the background refresh timer to avoid resource leaks
    blacklist_checker.shutdown()


app = FastAPI(
    title="SentinelURL API",
    description="Phishing URL Detection Platform — backend API",
    version="1.0.0",
    lifespan=lifespan,
)

# ── Rate limiter ───────────────────────────────────────────────────────────────
# Attach the slowapi limiter to the app state and register its 429 handler.
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS ───────────────────────────────────────────────────────────────────────
# Only allow the frontend origin from the environment variable.
# Never use wildcard '*' — it would expose the API to any origin.
allowed_origins_raw = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in allowed_origins_raw.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)


# ── Global exception handler ───────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catch-all exception handler that prevents stack traces from leaking
    to the client. Returns a structured JSON error response instead.
    """
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "detail": str(exc)[:200]},
    )


# ── Route registration ─────────────────────────────────────────────────────────
app.include_router(analyze_router)
app.include_router(health_router)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
