from __future__ import annotations

from dataclasses import dataclass

import cv2
import numpy as np


@dataclass
class QualityResult:

    valid: bool
    blur_score: float
    brightness: float
    contrast: float
    message: str


class QualityChecker:

    def __init__(
        self,
        blur_threshold: float = 100.0,
        min_brightness: float = 60.0,
        max_brightness: float = 200.0,
        min_contrast: float = 25.0,
    ) -> None:

        self.blur_threshold = blur_threshold
        self.min_brightness = min_brightness
        self.max_brightness = max_brightness
        self.min_contrast = min_contrast

    def evaluate(
        self,
        image: np.ndarray,
    ) -> QualityResult:

        if image is None:
            raise ValueError("Input image is None.")

        if image.dtype != np.uint8:
            image = (image * 255).astype(np.uint8)

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        blur_score = cv2.Laplacian(
            gray,
            cv2.CV_64F,
        ).var()

        brightness = float(np.mean(gray))

        contrast = float(np.std(gray))

        if blur_score < self.blur_threshold:
            return QualityResult(
                False,
                blur_score,
                brightness,
                contrast,
                "Palm image is too blurry.",
            )

        if brightness < self.min_brightness:
            return QualityResult(
                False,
                blur_score,
                brightness,
                contrast,
                "Lighting is too dark.",
            )

        if brightness > self.max_brightness:
            return QualityResult(
                False,
                blur_score,
                brightness,
                contrast,
                "Lighting is too bright.",
            )

        if contrast < self.min_contrast:
            return QualityResult(
                False,
                blur_score,
                brightness,
                contrast,
                "Image contrast is too low.",
            )

        return QualityResult(
            True,
            blur_score,
            brightness,
            contrast,
            "Image quality is acceptable.",
        )