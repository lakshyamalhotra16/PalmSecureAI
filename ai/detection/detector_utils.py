"""
PalmSecureAI
------------

Module: detector_utils.py

Description:
    Utility classes and helper methods used by the palm detection pipeline.

Author: Lakshya Malhotra
Project: PalmSecureAI
"""

from __future__ import annotations

import logging
import time
from typing import Optional, Tuple

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class CameraError(Exception):
    """Raised when camera initialization or frame capture fails."""


class CameraManager:
    """
    Handles webcam initialization and frame capture.

    Parameters
    ----------
    camera_index : int
        Webcam index.
    width : int
        Capture width.
    height : int
        Capture height.
    """

    def __init__(
        self,
        camera_index: int = 0,
        width: int = 1280,
        height: int = 720
    ) -> None:

        self.camera_index = camera_index
        self.width = width
        self.height = height

        self.cap = cv2.VideoCapture(self.camera_index)

        if not self.cap.isOpened():
            raise CameraError("Unable to open webcam.")

        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)

        logger.info("Camera initialized successfully.")

    def read(self) -> np.ndarray:
        """
        Capture a frame.

        Returns
        -------
        numpy.ndarray
            Captured frame.
        """

        success, frame = self.cap.read()

        if not success:
            raise CameraError("Unable to capture frame.")

        return frame

    def release(self) -> None:
        """Release camera."""

        if self.cap.isOpened():
            self.cap.release()

        logger.info("Camera released.")


class FPSCounter:
    """
    Calculates Frames Per Second.
    """

    def __init__(self) -> None:

        self.previous_time = time.time()
        self.current_time = self.previous_time
        self.fps = 0.0

    def update(self) -> float:

        self.current_time = time.time()

        elapsed = self.current_time - self.previous_time

        if elapsed > 0:
            self.fps = 1.0 / elapsed

        self.previous_time = self.current_time

        return self.fps


class ImageUtils:
    """
    Static helper methods for image processing.
    """

    @staticmethod
    def bgr_to_rgb(frame: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    @staticmethod
    def rgb_to_bgr(frame: np.ndarray) -> np.ndarray:
        return cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)

    @staticmethod
    def resize(
        frame: np.ndarray,
        width: int,
        height: int
    ) -> np.ndarray:

        return cv2.resize(frame, (width, height))

    @staticmethod
    def flip(
        frame: np.ndarray,
        horizontal: bool = True
    ) -> np.ndarray:

        flip_code = 1 if horizontal else 0
        return cv2.flip(frame, flip_code)

    @staticmethod
    def draw_text(
        frame: np.ndarray,
        text: str,
        position: Tuple[int, int],
        color: Tuple[int, int, int] = (0, 255, 0),
        scale: float = 0.8,
        thickness: int = 2
    ) -> None:

        cv2.putText(
            frame,
            text,
            position,
            cv2.FONT_HERSHEY_SIMPLEX,
            scale,
            color,
            thickness,
            cv2.LINE_AA,
        )


class FrameValidator:
    """
    Validates captured frames.
    """

    @staticmethod
    def is_valid(frame: Optional[np.ndarray]) -> bool:

        if frame is None:
            return False

        if frame.size == 0:
            return False

        return True