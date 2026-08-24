from __future__ import annotations

from dataclasses import dataclass
from typing import List

import numpy as np

from ai.preprocessing.roi_extractor import ROIExtractor, BoundingBox
from ai.preprocessing.image_enhancer import ImageEnhancer
from ai.preprocessing.quality_checker import (
    QualityChecker,
    QualityResult,
)


@dataclass
class PreprocessingResult:
    roi: np.ndarray
    bbox: BoundingBox
    quality: QualityResult


class PreprocessingPipeline:

    def __init__(self) -> None:
        self.roi_extractor = ROIExtractor()
        self.image_enhancer = ImageEnhancer()
        self.quality_checker = QualityChecker()

    def process(
        self,
        image: np.ndarray,
        landmarks: List,
    ) -> PreprocessingResult:

        roi, bbox = self.roi_extractor.extract(
            image,
            landmarks,
        )

        enhanced_roi = self.image_enhancer.enhance(
            roi,
        )

        quality = self.quality_checker.evaluate(
            enhanced_roi,
        )

        return PreprocessingResult(
            roi=enhanced_roi,
            bbox=bbox,
            quality=quality,
        )