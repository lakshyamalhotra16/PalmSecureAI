import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger():
    app_logger = logging.getLogger("palmsecure")
    app_logger.setLevel(logging.INFO)

    if app_logger.handlers:
        return app_logger

    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(message)s"
    )

    # Console logging - works on Render
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    app_logger.addHandler(console_handler)

    # File logging - only for local development
    if os.getenv("RENDER") is None:
        os.makedirs("backend/logs", exist_ok=True)

        file_handler = RotatingFileHandler(
            "backend/logs/palmsecure.log",
            maxBytes=5 * 1024 * 1024,
            backupCount=3,
            encoding="utf-8"
        )

        file_handler.setFormatter(formatter)
        app_logger.addHandler(file_handler)

    return app_logger


logger = setup_logger()