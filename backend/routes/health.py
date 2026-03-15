"""
Health check route — GET /health

Used by UptimeRobot (or any uptime monitor) to poll the backend
every few minutes, preventing Render's free tier from spinning down
the instance due to inactivity (cold-start prevention).
"""

from fastapi import APIRouter
from models.schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Returns a simple 200 OK response with status 'ok'.
    This endpoint must be fast (no DB or network calls) so the uptime
    monitor does not time out.
    """
    return HealthResponse(status="ok", version="1.0.0")
