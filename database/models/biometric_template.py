from __future__ import annotations

from datetime import datetime, UTC

from sqlalchemy import DateTime, Float, Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column

from database.connection import Base


class BiometricTemplateModel(Base):
    """
    SQLAlchemy model for biometric templates.
    """

    __tablename__ = "biometric_templates"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )

    user_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    embedding: Mapped[bytes] = mapped_column(
        LargeBinary,
        nullable=False,
    )

    quality_score: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    version: Mapped[str] = mapped_column(
        String(20),
        default="1.0",
        nullable=False,
    )

    sample_count: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
    )