from datetime import datetime, UTC
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


if TYPE_CHECKING:
    from app.database.models.attendance import Attendance
    from app.database.models.palm import Palm


class User(Base):

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    employee_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    department: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    palms: Mapped[list["Palm"]] = relationship(
        "Palm",
        back_populates="user",
        cascade="all, delete, delete-orphan",
    )

    attendance: Mapped[list["Attendance"]] = relationship(
        "Attendance",
        back_populates="user",
        cascade="all, delete, delete-orphan",
    )