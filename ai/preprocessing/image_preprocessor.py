"""
PalmSecureAI

Module: image_preprocessor.py
Author: Lakshya Malhotra

"""

from __future__ import annotations
import logging
from dataclasses import dataclass
from typing import Optional

import cv2
import numpy as np

logger = logging.getLogger(__name__)

@dataclass(slots=True)
class PreprocessingConfig:
    """
    Configuration for image preprocessing.
    """

    use_grayscale: bool = True
    use_clahe: bool = True
    clahe_clip_limit: float = 2.0
    clahe_grid_size: tuple[int, int] = (8, 8)
    use_gaussian_blur: bool = True
    gaussian_kernel: tuple[int, int] = (3, 3)
    normalize: bool = True
    output_float: bool = False

@dataclass(slots=True)
class PreprocessingResult:
    """
    Stores preprocessing results.
    """
    image: np.ndarray

    success: bool

class ImagePreprocessor:
    """
    Performs preprocessing on palm ROI image.
    """
    def __init__(self, config: Optional[PreprocessingConfig] = None) -> None:
        if config is None:
            config = PreprocessingConfig()
        self.config = config

        logger.info("ImagePreprocessor initialized.")

    def preprocess(
            self,
            image: np.ndarray,
    ) -> PreprocessingResult:
        """
        Apply preprocessing pipeline to a palm ROI image.
        """

        processed = image.copy()

        # Convert to grayscale
        if self.config.use_grayscale:
            processed = cv2.cvtColor(
                processed,
                cv2.COLOR_BGR2GRAY,
            )

        # Contrast enhancement using CLAHE
        if self.config.use_clahe:
            clahe = cv2.createCLAHE(
                clipLimit=self.config.clahe_clip_limit,
                tileGridSize=self.config.clahe_grid_size,
            )

            processed = clahe.apply(processed)

        # Noise reduction (ADD THIS PART)
        if self.config.use_gaussian_blur:
            processed = cv2.GaussianBlur(
                processed,
                self.config.gaussian_kernel,
                0,
            )
        # Normalize pixel values
        if self.config.normalize:
            processed = processed.astype(np.float32) / 255.0

            # Convert back to uint8 for visualization if required
            if not self.config.output_float:
                processed = (processed * 255).astype(np.uint8)

        return PreprocessingResult(
            image=processed,
            success=True,
        )