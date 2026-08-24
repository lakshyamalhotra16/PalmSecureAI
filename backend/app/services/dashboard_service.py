from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.database import crud


class DashboardService:

    @staticmethod
    def get_dashboard(db: Session):

        today = date.today()

        # =========================================================
        # USERS
        # =========================================================

        users = crud.get_all_users(db)

        total_employees = len(users)

        # =========================================================
        # TODAY'S ATTENDANCE
        # =========================================================

        today_attendance = crud.get_today_attendance(
            db,
            today,
        )

        today_attendance_count = len(today_attendance)

        if total_employees > 0:
            attendance_percentage = round(
                (today_attendance_count / total_employees) * 100,
                2,
            )
        else:
            attendance_percentage = 0.0

        # =========================================================
        # RECOGNITION CONFIDENCE
        # =========================================================

        confidence_values = [
            attendance.confidence
            for attendance in today_attendance
            if attendance.confidence is not None
        ]

        if confidence_values:
            recognition_accuracy = round(
                sum(confidence_values) / len(confidence_values),
                2,
            )
        else:
            recognition_accuracy = 0.0

        # =========================================================
        # EMPLOYEES
        # =========================================================

        employees = []

        for user in users:

            attendance = crud.attendance_already_marked(
                db=db,
                user_id=user.id,
                attendance_date=today,
            )

            if attendance is not None:
                attendance_status = attendance.status
            else:
                attendance_status = "Absent"

            employees.append(
                {
                    "id": user.id,
                    "employee_id": user.employee_id,
                    "full_name": user.full_name,
                    "department": user.department,
                    "status": attendance_status,
                }
            )

        # =========================================================
        # ATTENDANCE HISTORY
        # =========================================================

        all_attendance = crud.get_all_attendance(db)

        attendance_history = []

        for attendance in all_attendance[:10]:

            user = crud.get_user_by_id(
                db=db,
                user_id=attendance.user_id,
            )

            if user is None:
                continue

            attendance_history.append(
                {
                    "employee": user.full_name,
                    "employee_id": user.employee_id,
                    "date": attendance.date,
                    "login": attendance.check_in,
                    "logout": attendance.check_out,
                    "working_hours": attendance.working_hours,
                    "confidence": attendance.confidence,
                    "status": attendance.status,
                }
            )

        # =========================================================
        # RECENT ACTIVITY
        # =========================================================

        recent_activity = []

        for attendance in all_attendance[:5]:

            user = crud.get_user_by_id(
                db=db,
                user_id=attendance.user_id,
            )

            if user is None:
                continue

            if attendance.check_out is None:

                activity_type = "authentication"
                activity_title = "Palm Authentication Successful"

            else:

                activity_type = "attendance"
                activity_title = "Attendance Recorded"

            timestamp = (
                attendance.check_in.strftime("%I:%M %p")
                if attendance.check_in
                else "Recently"
            )

            recent_activity.append(
                {
                    "type": activity_type,
                    "title": activity_title,
                    "description": user.full_name,
                    "timestamp": timestamp,
                }
            )

        # =========================================================
        # ATTENDANCE ANALYTICS - LAST 7 DAYS
        # =========================================================

        analytics = []

        for days_ago in range(6, -1, -1):

            current_date = today - timedelta(
                days=days_ago
            )

            daily_attendance = crud.get_today_attendance(
                db=db,
                attendance_date=current_date,
            )

            if total_employees > 0:

                percentage = round(
                    (
                        len(daily_attendance)
                        / total_employees
                    )
                    * 100,
                    2,
                )

            else:

                percentage = 0.0

            analytics.append(
                {
                    "day": current_date.strftime("%a"),
                    "attendance": percentage,
                }
            )

        # =========================================================
        # SECURITY STATUS
        # =========================================================

        security_status = "Protected"

        # =========================================================
        # FINAL DASHBOARD RESPONSE
        # =========================================================

        return {
            "stats": {
                "recognition_accuracy": recognition_accuracy,
                "total_employees": total_employees,
                "today_attendance": today_attendance_count,
                "attendance_percentage": attendance_percentage,
                "security_status": security_status,
            },

            "employees": employees,

            "attendance_history": attendance_history,

            "recent_activity": recent_activity,

            "analytics": analytics,
        }