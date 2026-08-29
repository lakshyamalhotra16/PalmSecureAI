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
        """
        Mark employee attendance after successful palm authentication.

        First successful authentication of the day:
            -> Check In

        Second successful authentication of the day:
            -> Check Out
            -> Calculate working hours

        Further authentications:
            -> Return existing attendance record
        """

        now = datetime.now()
        today = now.date()
        current_time = now.time()

        # =========================================================
        # CHECK WHETHER ATTENDANCE ALREADY EXISTS TODAY
        # =========================================================

        attendance = crud.attendance_already_marked(
            db=db,
            user_id=user_id,
            attendance_date=today,
        )

        # =========================================================
        # FIRST AUTHENTICATION -> CHECK IN
        # =========================================================

        if attendance is None:

            attendance_data = AttendanceCreate(
                user_id=user_id,
                date=today,
                check_in=current_time,
                check_out=None,
                working_hours=0.0,
                confidence=float(confidence),
                status="Present",
            )

            attendance = crud.create_attendance(
                db=db,
                attendance=attendance_data,
            )

            return attendance

        # =========================================================
        # SECOND AUTHENTICATION -> CHECK OUT
        # =========================================================

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

            # -----------------------------------------------------
            # CALCULATE WORKING HOURS
            # -----------------------------------------------------

            working_seconds = (
                check_out_datetime - check_in_datetime
            ).total_seconds()

            # Prevent negative working hours
            if working_seconds < 0:
                working_seconds = 0

            attendance.working_hours = round(
                working_seconds / 3600,
                2,
            )

            # Keep latest confidence
            attendance.confidence = float(confidence)

            # Keep status as Present
            attendance.status = "Present"

            db.commit()
            db.refresh(attendance)

        # =========================================================
        # THIRD/FURTHER AUTHENTICATION
        # =========================================================

        # If check-in and check-out already exist,
        # don't create another attendance record.

        return attendance