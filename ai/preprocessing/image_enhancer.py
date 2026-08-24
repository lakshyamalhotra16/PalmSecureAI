from __future__ import annotations

from dataclasses import dataclass
from typing import Tuple

import cv2
import numpy as np


@dataclass
class EnhancementConfig:

    gaussian_kernel: Tuple[int, int] = (3, 3)
    clahe_clip_limit: float = 2.0
    clahe_grid_size: Tuple[int, int] = (8, 8)
    sharpen: bool = True


class ImageEnhancer:
    def __init__(
        self,
        config: EnhancementConfig | None = None,
    ) -> None:

        self.config = config or EnhancementConfig()

        self.clahe = cv2.createCLAHE(
            clipLimit=self.config.clahe_clip_limit,
            tileGridSize=self.config.clahe_grid_size,
        )

    def enhance(
        self,
        image: np.ndarray,
    ) -> np.ndarray:

        if image is None:
            raise ValueError("Input image is None.")

        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)


        image = cv2.GaussianBlur(
            image,
            self.config.gaussian_kernel,
            0,
        )


        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)

        l, a, b = cv2.split(lab)

        l = self.clahe.apply(l)

        lab = cv2.merge((l, a, b))

        enhanced = cv2.cvtColor(
            lab,
            cv2.COLOR_LAB2BGR,
        )

        if self.config.sharpen:

            kernel = np.array([
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0],
            ])

            enhanced = cv2.filter2D(
                enhanced,
                -1,
                kernel,
            )

        enhanced = enhanced.astype(np.float32) / 255.0

        return enhanced