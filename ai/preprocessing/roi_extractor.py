from __future__ import annotations

from dataclasses import dataclass
from typing import List, Tuple

import cv2
import numpy as np


@dataclass
class BoundingBox:
    """
    Bounding box of the extracted palm region.
    """

    x: int
    y: int
    width: int
    height: int


class ROIExtractor:
    """
    Extracts a palm Region of Interest (ROI) using MediaPipe hand landmarks.
    """

    def __init__(
        self,
        padding: float = 0.20,
        output_size: Tuple[int, int] = (224, 224),
    ) -> None:
        self.padding = padding
        self.output_size = output_size

    def extract(
        self,
        image: np.ndarray,
        landmarks: List,
    ) -> Tuple[np.ndarray, BoundingBox]:

        if image is None:
            raise ValueError("Input image is None.")

        if not landmarks:
            raise ValueError("No landmarks received.")

        image_height, image_width = image.shape[:2]

        xs = [lm.x * image_width for lm in landmarks]
        ys = [lm.y * image_height for lm in landmarks]

        min_x = max(0, int(min(xs)))
        max_x = min(image_width, int(max(xs)))

        min_y = max(0, int(min(ys)))
        max_y = min(image_height, int(max(ys)))

        width = max_x - min_x
        height = max_y - min_y

        pad_x = int(width * self.padding)
        pad_y = int(height * self.padding)

        x1 = max(0, min_x - pad_x)
        y1 = max(0, min_y - pad_y)

        x2 = min(image_width, max_x + pad_x)
        y2 = min(image_height, max_y + pad_y)

        roi = image[y1:y2, x1:x2]

        roi = cv2.resize(
            roi,
            self.output_size,
            interpolation=cv2.INTER_AREA,
        )

        bbox = BoundingBox(
            x=x1,
            y=y1,
            width=x2 - x1,
            height=y2 - y1,
        )

        return roi, bbox