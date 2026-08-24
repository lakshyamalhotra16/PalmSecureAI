from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from database.models.biometric_template import BiometricTemplateModel

DATABASE_URL = "sqlite:///database/palmsecure.db"

engine = create_engine(
    DATABASE_URL,
    echo=False,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)

Base = declarative_base()


def create_database() -> None:
    Base.metadata.create_all(bind=engine)