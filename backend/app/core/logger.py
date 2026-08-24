import logging
from logging.handlers import RotatingFileHandler

from app.core.config import settings

def setup_logger() -> logging.Logger:

    app_logger = logging.getLogger(settings.APP_NAME)

    if app_logger.handlers:
        return app_logger

    app_logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
    )

    file_handler = RotatingFileHandler(
        filename=settings.LOG_DIR / "palmsecure.log",
        maxBytes=5 * 1024 * 1024,
        backupCount=5,
        encoding="utf-8",
    )

    console_handler = logging.StreamHandler()

    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    app_logger.addHandler(file_handler)
    app_logger.addHandler(console_handler)

    return app_logger


logger = setup_logger()