from datetime import datetime

from sqlalchemy.orm import Session

from app.database import crud
from app.schemas.attendance import AttendanceCreate


class AttendanceService:

    @staticmethod
    def mark_attendance(
        db: Session,
        user_id: int,
        confidence: float,
    ):

        now = datetime.now()
        today = now.date()
        current_time = now.time()

        attendance = crud.attendance_already_marked(
            db=db,
            user_id=user_id,
            attendance_date=today,
        )

        # First authentication of the day -> Check In
        if attendance is None:

            attendance_data = AttendanceCreate(
                user_id=user_id,
                date=today,
                check_in=current_time,
                check_out=None,
                working_hours=0.0,
                confidence=confidence,
                status="Present",
            )

            return crud.create_attendance(
                db=db,
                attendance=attendance_data,
            )

        # Second authentication of the day -> Check Out
        if attendance.check_out is None:

            attendance.check_out = current_time

            check_in_datetime = datetime.combine(
                attendance.date,
                attendance.check_in,
            )

            check_out_datetime = datetime.combine(
                attendance.date,
                current_time,
            )

            working_seconds = (
                check_out_datetime - check_in_datetime
            ).total_seconds()

            attendance.working_hours = round(
                working_seconds / 3600,
                2,
            )

            db.commit()
            db.refresh(attendance)

        return attendance