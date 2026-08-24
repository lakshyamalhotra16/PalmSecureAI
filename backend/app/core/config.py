from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):


    APP_NAME: str = "PalmSecureAI"

    APP_VERSION: str = "1.0.0"

    DEBUG: bool = True

    API_PREFIX: str = "/api/v1"

    HOST: str = "127.0.0.1"

    PORT: int = 8000


    DATABASE_URL: str = "sqlite:///./storage/palmsecure.db"


    STORAGE_DIR: Path = BASE_DIR / "storage"

    UPLOAD_DIR: Path = STORAGE_DIR / "palms"

    TEMP_DIR: Path = STORAGE_DIR / "temp"


    LOG_DIR: Path = BASE_DIR / "logs"

    LOG_LEVEL: str = "INFO"


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()