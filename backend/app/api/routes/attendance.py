from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import crud
from app.database.session import get_db
from app.schemas.attendance import AttendanceResponse
from app.services.attendance_service import AttendanceService


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"],
)


# ============================================================
# MARK ATTENDANCE
# ============================================================

@router.post(
    "/mark",
    response_model=AttendanceResponse,
)
def mark_attendance(
    user_id: int,
    confidence: float,
    db: Session = Depends(get_db),
):
    user = crud.get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    if not 0 <= confidence <= 100:
        raise HTTPException(
            status_code=400,
            detail="Confidence must be between 0 and 100.",
        )

    return AttendanceService.mark_attendance(
        db=db,
        user_id=user_id,
        confidence=confidence,
    )


# ============================================================
# TODAY'S ATTENDANCE
# ============================================================

@router.get(
    "/today",
    response_model=list[AttendanceResponse],
)
def get_today_attendance(
    db: Session = Depends(get_db),
):
    return crud.get_today_attendance(
        db,
        date.today(),
    )


# ============================================================
# USER ATTENDANCE
# ============================================================

@router.get(
    "/user/{user_id}",
    response_model=list[AttendanceResponse],
)
def get_user_attendance(
    user_id: int,
    db: Session = Depends(get_db),
):
    user = crud.get_user_by_id(
        db,
        user_id,
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found.",
        )

    return crud.get_user_attendance(
        db,
        user_id,
    )


# ============================================================
# ALL ATTENDANCE
# ============================================================

@router.get(
    "/",
    response_model=list[AttendanceResponse],
)
def get_all_attendance(
    db: Session = Depends(get_db),
):
    return crud.get_all_attendance(db)