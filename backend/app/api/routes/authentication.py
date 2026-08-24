from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.authentication_service import AuthenticationService
from app.utils.file_storage import save_image


router = APIRouter(
    tags=["Authentication"],
)


# ============================================================
# PALM AUTHENTICATION
# ============================================================

@router.post("/authenticate")
def authenticate_user(
    palm_image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:

        # ========================================================
        # VALIDATE FILE
        # ========================================================

        if not palm_image.filename:
            raise HTTPException(
                status_code=400,
                detail="Palm image is required.",
            )

        # ========================================================
        # SAVE UPLOADED IMAGE
        # ========================================================

        image_path = save_image(
            palm_image,
        )

        # ========================================================
        # AUTHENTICATE PALM
        # ========================================================

        data = AuthenticationService.authenticate(
            db=db,
            image_path=image_path,
        )

        # ========================================================
        # GET ATTENDANCE
        # ========================================================

        attendance = data.get(
            "attendance",
        )

        attendance_data = None

        if attendance is not None:

            attendance_data = {
                "id": attendance.id,
                "date": str(
                    attendance.date
                ),
                "check_in": (
                    str(attendance.check_in)
                    if attendance.check_in
                    else None
                ),
                "check_out": (
                    str(attendance.check_out)
                    if attendance.check_out
                    else None
                ),
                "working_hours": attendance.working_hours,
                "status": attendance.status,
            }

        # ========================================================
        # FINAL RESPONSE
        # ========================================================

        return {
            "authenticated": data["authenticated"],

            "employee_id": data["employee_id"],

            "full_name": data["full_name"],

            "department": data["department"],

            "confidence": data["confidence"],

            "similarity": data["similarity"],

            "distance": data["distance"],

            "attendance": attendance_data,
        }

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        import traceback

        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=(
                "Internal authentication error."
            ),
        ) from exc