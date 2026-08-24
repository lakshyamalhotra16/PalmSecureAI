"""
PalmSecureAI

Module: hand_landmarks.py

Professional visualization utilities for MediaPipe Hands.

Author: Lakshya Malhotra
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional, Tuple

import cv2
import mediapipe as mp
import numpy as np

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class LandmarkStyle:
    """
    Visualization style configuration.
    """

    landmark_color: Tuple[int, int, int] = (0, 255, 0)
    connection_color: Tuple[int, int, int] = (255, 255, 255)
    bbox_color: Tuple[int, int, int] = (0, 255, 255)
    center_color: Tuple[int, int, int] = (0, 0, 255)
    text_color: Tuple[int, int, int] = (255, 255, 255)

    landmark_radius: int = 5
    thickness: int = 2
    font_scale: float = 0.7


class HandLandmarkDrawer:
    """
    Professional visualization engine for MediaPipe Hands.
    """

    def __init__(
            self,
            style: Optional[LandmarkStyle] = None,
    ) -> None:

        self.style = style or LandmarkStyle()

        self.mp_draw = mp.solutions.drawing_utils
        self.mp_hands = mp.solutions.hands

        self.landmark_spec = self.mp_draw.DrawingSpec(
            color=self.style.landmark_color,
            thickness=self.style.thickness,
            circle_radius=self.style.landmark_radius,
        )

        self.connection_spec = self.mp_draw.DrawingSpec(
            color=self.style.connection_color,
            thickness=self.style.thickness,
        )

        logger.info("HandLandmarkDrawer initialized.")

    @staticmethod
    def _image_size(
            frame: np.ndarray,
    ) -> Tuple[int, int]:

        height, width = frame.shape[:2]
        return width, height

    @staticmethod
    def _landmark_to_pixel(
            landmark,
            width: int,
            height: int,
    ) -> Tuple[int, int]:

        x = int(landmark.x * width)
        y = int(landmark.y * height)

        return x, y

    def _bounding_rectangle(
            self,
            frame: np.ndarray,
            hand_landmarks,
    ) -> Tuple[int, int, int, int]:

        width, height = self._image_size(frame)

        xs = []
        ys = []

        for landmark in hand_landmarks.landmark:
            x, y = self._landmark_to_pixel(
                landmark,
                width,
                height,
            )

            xs.append(x)
            ys.append(y)

        return (
            max(min(xs), 0),
            max(min(ys), 0),
            min(max(xs), width),
            min(max(ys), height),
        )

    @staticmethod
    def _center(
            bbox: Tuple[int, int, int, int],
    ) -> Tuple[int, int]:

        x1, y1, x2, y2 = bbox

        return (
            (x1 + x2) // 2,
            (y1 + y2) // 2,
        )

    def draw_landmarks(
            self,
            frame: np.ndarray,
            hand_landmarks,
    ) -> None:
        """
        Draw hand landmarks and skeleton.
        """

        self.mp_draw.draw_landmarks(
            frame,
            hand_landmarks,
            self.mp_hands.HAND_CONNECTIONS,
            self.landmark_spec,
            self.connection_spec,
        )

    def draw_bounding_box(
            self,
            frame: np.ndarray,
            hand_landmarks,
    ) -> Tuple[int, int, int, int]:
        """
        Draw bounding box around the hand.
        """

        bbox = self._bounding_rectangle(
            frame,
            hand_landmarks,
        )

        x1, y1, x2, y2 = bbox

        cv2.rectangle(
            frame,
            (x1, y1),
            (x2, y2),
            self.style.bbox_color,
            self.style.thickness,
        )

        return bbox

    def draw_hand_center(
            self,
            frame: np.ndarray,
            bbox: Tuple[int, int, int, int],
    ) -> None:
        """
        Draw center of the hand.
        """

        cx, cy = self._center(bbox)

        cv2.circle(
            frame,
            (cx, cy),
            5,
            self.style.center_color,
            -1,
        )

    def draw_hand_label(
            self,
            frame: np.ndarray,
            bbox: Tuple[int, int, int, int],
            label: str = "Palm",
    ) -> None:
        """
        Draw label above the bounding box.
        """

        x1, y1, _, _ = bbox

        cv2.putText(
            frame,
            label,
            (x1, max(y1 - 10, 20)),
            cv2.FONT_HERSHEY_SIMPLEX,
            self.style.font_scale,
            self.style.text_color,
            self.style.thickness,
            cv2.LINE_AA,
        )

    def draw_all(
            self,
            frame: np.ndarray,
            hand_landmarks,
            label: str = "Palm",
    ) -> None:
        """
        Draw all visualizations.
        """

        self.draw_landmarks(
            frame,
            hand_landmarks,
        )

        bbox = self.draw_bounding_box(
            frame,
            hand_landmarks,
        )

        self.draw_hand_center(
            frame,
            bbox,
        )

        self.draw_hand_label(
            frame,
            bbox,
            label,
        )


if __name__ == "__main__":
    print("hand_landmarks.py imported successfully!")