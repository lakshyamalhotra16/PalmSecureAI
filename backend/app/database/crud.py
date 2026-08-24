from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models.attendance import Attendance
from app.database.models.palm import Palm
from app.database.models.user import User

from app.schemas.attendance import AttendanceCreate
from app.schemas.palm import PalmCreate
from app.schemas.user import UserCreate


# ============================================================
# USER CRUD
# ============================================================

def create_user(
    db: Session,
    user: UserCreate,
) -> User:
    db_user = User(
        employee_id=user.employee_id,
        full_name=user.full_name,
        department=user.department,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


def get_user_by_employee_id(
    db: Session,
    employee_id: str,
) -> User | None:

    statement = (
        select(User)
        .where(User.employee_id == employee_id)
    )

    return db.scalar(statement)


def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:

    statement = (
        select(User)
        .where(User.id == user_id)
    )

    return db.scalar(statement)


def get_all_users(
    db: Session,
) -> list[User]:

    statement = select(User)

    return list(db.scalars(statement).all())


# ============================================================
# PALM CRUD
# ============================================================

def create_palm(
    db: Session,
    user_id: int,
    palm: PalmCreate,
) -> Palm:

    db_palm = Palm(
        user_id=user_id,
        image_path=palm.image_path,
        feature_vector=palm.feature_vector,
        quality_score=palm.quality_score,
    )

    db.add(db_palm)
    db.commit()
    db.refresh(db_palm)

    return db_palm


def get_palm_by_id(
    db: Session,
    palm_id: int,
) -> Palm | None:

    statement = (
        select(Palm)
        .where(Palm.id == palm_id)
    )

    return db.scalar(statement)


def get_palms_by_user(
    db: Session,
    user_id: int,
) -> list[Palm]:

    statement = (
        select(Palm)
        .where(Palm.user_id == user_id)
    )

    return list(db.scalars(statement).all())


def get_all_palms(
    db: Session,
) -> list[Palm]:

    statement = select(Palm)

    return list(db.scalars(statement).all())


# ============================================================
# ATTENDANCE CRUD
# ============================================================

def create_attendance(
    db: Session,
    attendance: AttendanceCreate,
) -> Attendance:

    db_attendance = Attendance(
        user_id=attendance.user_id,
        date=attendance.date,
        check_in=attendance.check_in,
        check_out=attendance.check_out,
        working_hours=attendance.working_hours,
        confidence=attendance.confidence,
        status=attendance.status,
    )

    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)

    return db_attendance


def attendance_already_marked(
    db: Session,
    user_id: int,
    attendance_date: date,
) -> Attendance | None:

    statement = (
        select(Attendance)
        .where(
            Attendance.user_id == user_id,
            Attendance.date == attendance_date,
        )
    )

    return db.scalar(statement)


def get_today_attendance(
    db: Session,
    attendance_date: date,
) -> list[Attendance]:

    statement = (
        select(Attendance)
        .where(
            Attendance.date == attendance_date,
        )
        .order_by(Attendance.check_in.desc())
    )

    return list(db.scalars(statement).all())


def get_user_attendance(
    db: Session,
    user_id: int,
) -> list[Attendance]:

    statement = (
        select(Attendance)
        .where(
            Attendance.user_id == user_id,
        )
        .order_by(Attendance.date.desc(), Attendance.check_in.desc(),)
    )

    return list(db.scalars(statement).all())


def get_all_attendance(
    db: Session,
) -> list[Attendance]:

    statement = (
        select(Attendance)
        .order_by(Attendance.date.desc())
    )

    return list(db.scalars(statement).all())

def delete_palm(
    db: Session,
    palm_id: int,
) -> bool:

    palm = get_palm_by_id(
        db,
        palm_id,
    )

    if palm is None:
        return False

    db.delete(palm)
    db.commit()

    return True