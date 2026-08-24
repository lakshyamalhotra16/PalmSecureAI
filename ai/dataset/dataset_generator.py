"""
PalmSecureAI

Module: dataset_generator.py

Professional Dataset Collection Engine

Author: Lakshya Malhotra
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class DatasetConfig:
    """
    Configuration for dataset generation.
    """

    dataset_root: Path = Path("data/dataset")
    image_size: tuple[int, int] = (224, 224)
    image_extension: str = ".png"
    max_images: int = 200


@dataclass(slots=True)
class SaveResult:
    """
    Stores save status.
    """

    success: bool
    image_path: Optional[Path]


class DatasetGenerator:
    """
    Saves processed palm images into the dataset directory.
    """

    def __init__(
        self,
        config: Optional[DatasetConfig] = None,
    ) -> None:

        if config is None:
            config = DatasetConfig()

        self.config = config

        self.config.dataset_root.mkdir(
            parents=True,
            exist_ok=True,
        )

        logger.info("DatasetGenerator initialized.")

    def create_person_folder(
        self,
        person_name: str,
    ) -> Path:
        """
        Create (or return) a folder for a person's palm images.
        """

        person_folder = self.config.dataset_root / person_name

        person_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        logger.info(
            "Person folder ready: %s",
            person_folder,
        )

        return person_folder

    def get_next_image_number(
        self,
        person_folder: Path,
    ) -> int:
        """
        Get the next available image number for a person's folder.
        """

        image_files = sorted(
            person_folder.glob(
                f"*{self.config.image_extension}"
            )
        )

        if not image_files:
            return 1

        last_image = image_files[-1]

        try:
            return int(last_image.stem) + 1

        except ValueError:

            logger.warning(
                "Invalid filename found: %s",
                last_image.name,
            )

            return len(image_files) + 1

    def save_image(
        self,
        person_name: str,
        image: np.ndarray,
    ) -> SaveResult:
        """
        Save a processed palm image to the dataset.
        """

        # Validate image
        if image is None or image.size == 0:
            logger.error("Invalid image provided.")

            return SaveResult(
                success=False,
                image_path=None,
            )

        person_folder = self.create_person_folder(
            person_name
        )

        image_number = self.get_next_image_number(
            person_folder
        )

        # Respect maximum image limit
        if image_number > self.config.max_images:
            logger.warning(
                "Maximum image limit (%d) reached for %s.",
                self.config.max_images,
                person_name,
            )

            return SaveResult(
                success=False,
                image_path=None,
            )

        filename = (
            f"{image_number:04d}"
            f"{self.config.image_extension}"
        )

        image_path = person_folder / filename

        resized_image = cv2.resize(
            image,
            self.config.image_size,
        )

        success = cv2.imwrite(
            str(image_path),
            resized_image,
        )

        if success:

            logger.info(
                "Saved image: %s",
                image_path,
            )

            return SaveResult(
                success=True,
                image_path=image_path,
            )

        logger.error(
            "Failed to save image: %s",
            image_path,
        )

        return SaveResult(
            success=False,
            image_path=None,
        )