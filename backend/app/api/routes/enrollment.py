from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)

from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.services.enrollment_service import EnrollmentService
from app.utils.file_storage import save_image


router = APIRouter(
    tags=["Enrollment"],
)


@router.post(
    "/enrollment/enroll",
    response_model=UserResponse,
)
def enroll_employee(
    employee_id: str = Form(...),
    full_name: str = Form(...),
    department: str = Form(...),
    palm_image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    try:
        print("=" * 60)
        print("ENROLLMENT API REQUEST RECEIVED")
        print(f"Employee ID : {employee_id}")
        print(f"Full Name   : {full_name}")
        print(f"Department  : {department}")
        print("=" * 60)

        image_path = save_image(palm_image)

        print(f"Saved image: {image_path}")

        user_data = UserCreate(
            employee_id=employee_id,
            full_name=full_name,
            department=department,
        )

        result = EnrollmentService.enroll_user(
            db=db,
            user=user_data,
            image_path=image_path,
        )

        db.commit()
        db.refresh(result["user"])

        print("=" * 60)
        print("ENROLLMENT API SUCCESS")
        print(f"User ID : {result['user'].id}")
        print(f"Employee: {result['user'].employee_id}")
        print(f"Palm ID : {result['palm'].id}")
        print("=" * 60)

        return result["user"]

    except ValueError as exc:
        db.rollback()

        print("ENROLLMENT VALIDATION ERROR")
        print(str(exc))

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        db.rollback()

        import traceback
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=f"Enrollment failed: {str(exc)}",
        )