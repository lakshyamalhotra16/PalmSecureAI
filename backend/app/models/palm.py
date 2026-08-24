from datetime import datetime, UTC

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class Palm(Base):
    __tablename__ = "palms"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    image_path = Column(
        String,
        nullable=False
    )

    # Stores the biometric feature vector as a JSON string
    feature_vector = Column(
        Text,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(UTC)
    )

    user = relationship(
        "User",
        back_populates="palms"
    )