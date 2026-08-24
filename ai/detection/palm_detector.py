"""
PalmSecureAI

Module: palm_detector.py

Professional Palm Detection Engine
Author: Lakshya Malhotra
"""

from __future__ import annotations
import logging
from dataclasses import dataclass
from typing import Optional

import cv2
import numpy as np
import mediapipe as mp

from ai.detection.hand_landmarks import HandLandmarkDrawer

logger = logging.getLogger(__name__)

@dataclass(slots=True)
class DetectionConfig:
    """
    Configuration used by PalmDetector.
    """
    static_image_mode: bool = False
    max_num_hands: int = 2
    model_complexity: int = 1
    min_detection_confidence: float = 0.7
    min_tracking_confidence: float = 0.7

from typing import Any

@dataclass(slots=True)
class DetectionResult:
    frame: np.ndarray
    rgb_frame: np.ndarray
    results: Any
    hand_detected: bool
    landmarks: Any | None

class PalmDetector:
    """
    Detects palms using MediaPipe Hands.
    """

    def __init__(
            self,
            config: Optional[DetectionConfig] = None,
    ) -> None:

        if config is None:
            config = DetectionConfig()

        self.config: DetectionConfig = config

        self.mp_hands = mp.solutions.hands

        self.hands = self.mp_hands.Hands(
            static_image_mode=self.config.static_image_mode,
            max_num_hands=self.config.max_num_hands,
            model_complexity=self.config.model_complexity,
            min_detection_confidence=self.config.min_detection_confidence,
            min_tracking_confidence=self.config.min_tracking_confidence,
        )

        self.drawer = HandLandmarkDrawer()

        logger.info("PalmDetector initialized successfully.")

    def process_frame(self, frame: np.ndarray) -> DetectionResult:
        """
        Process a single frame and return the detection result.
        """

        # Mirror the frame for a natural webcam view
        frame = cv2.flip(frame, 1)

        # Convert BGR to RGB (MediaPipe expects RGB)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect hands
        results: Any = self.hands.process(rgb_frame)

        # Check if any hand was detected
        hand_detected = results.multi_hand_landmarks is not None

        landmarks = (
            results.multi_hand_landmarks[0]
            if hand_detected
            else None
        )

        return DetectionResult(
            frame=frame,
            rgb_frame=rgb_frame,
            results=results,
            hand_detected=hand_detected,
            landmarks=landmarks,
        )

    def draw_results(self, detection: DetectionResult) -> np.ndarray:
        """
        Draw all detected hand landmarks on the frame.

        Parameters
        ----------
        detection : DetectionResult
            Detection result returned by process_frame().

        Returns
        -------
        np.ndarray
            Frame with landmarks drawn.
        """

        frame = detection.frame.copy()

        if detection.results.multi_hand_landmarks:

            for hand_landmarks in detection.results.multi_hand_landmarks:
                self.drawer.draw_landmarks(
                    frame,
                    hand_landmarks,
                )

        return frame

    def close(self) -> None:
        """
        Release MediaPipe resources.
        """

        self.hands.close()
        logger.info("PalmDetector closed successfully.")