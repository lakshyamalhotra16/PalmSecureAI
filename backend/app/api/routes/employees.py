from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database import crud
from app.schemas.employee import EmployeeListResponse


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
)


@router.get(
    "",
    response_model=EmployeeListResponse,
)
def get_employees(
    db: Session = Depends(get_db),
):
    try:
        users = crud.get_all_users(db)

        employees = []

        for user in users:

            attendance = crud.attendance_already_marked(
                db=db,
                user_id=user.id,
                attendance_date=date.today(),
            )

            status = (
                attendance.status
                if attendance is not None
                else "Absent"
            )

            employees.append(
                {
                    "id": user.id,
                    "employee_id": user.employee_id,
                    "full_name": user.full_name,
                    "department": user.department,
                    "status": status,
                }
            )

        return {
            "total": len(employees),
            "employees": employees,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Unable to load employees: {str(exc)}",
        ) from exc