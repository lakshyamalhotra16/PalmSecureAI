from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard_service import DashboardService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "",
    response_model=DashboardResponse,
)
def get_dashboard(
    db: Session = Depends(get_db),
):
    try:
        return DashboardService.get_dashboard(db)

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load dashboard: {str(exc)}",
        ) from exc 