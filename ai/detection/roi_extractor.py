"""
PalmSecureAI

Module: roi_extractor.py

Professional Palm ROI Extraction Engine

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
class ROIConfig:
    """
    Configuration for palm ROI extraction.
    """

    padding: int = 30
    output_size: int = 224
    min_roi_size: int = 80


@dataclass(slots=True)
class ROIResult:
    """
    Stores extracted palm ROI information.
    """

    roi: Optional[np.ndarray]
    bbox: tuple[int, int, int, int]
    valid: bool


class ROIExtractor:
    """
    Extracts palm Region of Interest (ROI) from detected hand landmarks.
    """

    PALM_LANDMARKS = (
        0,   # Wrist
        1,   # Thumb CMC
        2,   # Thumb MCP
        5,   # Index MCP
        9,   # Middle MCP
        13,  # Ring MCP
        17,  # Pinky MCP
    )

    def __init__(
        self,
        config: Optional[ROIConfig] = None,
    ) -> None:

        if config is None:
            config = ROIConfig()

        self.config = config

        logger.info("ROIExtractor initialized successfully.")

    def _palm_points(
        self,
        hand_landmarks,
        width: int,
        height: int,
    ) -> np.ndarray:
        """
        Convert palm landmarks into pixel coordinates.
        """

        points = []

        for index in self.PALM_LANDMARKS:
            landmark = hand_landmarks.landmark[index]

            points.append(
                (
                    int(landmark.x * width),
                    int(landmark.y * height),
                )
            )

        return np.array(points)

    def extract(
        self,
        frame: np.ndarray,
        hand_landmarks,
    ) -> ROIResult:
        """
        Extract the palm ROI from detected hand landmarks.
        """

        height, width = frame.shape[:2]

        palm_points = self._palm_points(
            hand_landmarks,
            width,
            height,
        )

        x_min = np.min(palm_points[:, 0])
        x_max = np.max(palm_points[:, 0])
        y_min = np.min(palm_points[:, 1])
        y_max = np.max(palm_points[:, 1])

        padding = self.config.padding

        x_min = max(0, x_min - padding)
        y_min = max(0, y_min - padding)

        x_max = min(width, x_max + padding)
        y_max = min(height, y_max + padding)

        roi = frame[y_min:y_max, x_min:x_max]

        if roi.size == 0:
            return ROIResult(
                roi=None,
                bbox=(x_min, y_min, x_max, y_max),
                valid=False,
            )

        roi_height, roi_width = roi.shape[:2]

        if (
            roi_height < self.config.min_roi_size
            or roi_width < self.config.min_roi_size
        ):
            return ROIResult(
                roi=None,
                bbox=(x_min, y_min, x_max, y_max),
                valid=False,
            )

        roi = cv2.resize(
            roi,
            (
                self.config.output_size,
                self.config.output_size,
            ),
        )

        return ROIResult(
            roi=roi,
            bbox=(x_min, y_min, x_max, y_max),
            valid=True,
        )