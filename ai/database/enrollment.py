from __future__ import annotations

import logging
from pathlib import Path

import cv2

from ai.database.embedding_database import EmbeddingDatabase
from ai.features.feature_extractor import FeatureExtractor
from ai.detection.palm_detector import PalmDetector
from ai.detection.roi_extractor import ROIExtractor


LOGGER = logging.getLogger(__name__)


class Enrollment:
    """
    Handles biometric user enrollment.

    Workflow
    --------
    Image
        ↓
    Feature Extractor
        ↓
    Embedding
        ↓
    Embedding Database
    """

    def __init__(
            self,
            database: EmbeddingDatabase | None = None,
            extractor: FeatureExtractor | None = None,
            detector: PalmDetector | None = None,
            roi_extractor: ROIExtractor | None = None,
    ) -> None:
        """
        Initialize the enrollment system.
        """

        self.database = database or EmbeddingDatabase()

        self.extractor = extractor or FeatureExtractor()

        self.detector = detector or PalmDetector()

        self.roi_extractor = roi_extractor or ROIExtractor()

        LOGGER.info("Enrollment module initialized.")

    @staticmethod
    def _validate_frame(frame) -> None:
        """
        Validate an input frame before enrollment.
        """

        if frame is None:
            raise ValueError("Input frame is None.")

        if frame.size == 0:
            raise ValueError("Input frame is empty.")

    def enroll_user(
        self,
        user_name: str,
        image_path: str | Path,
    ) -> None:

        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found: {image_path}"
            )

        image = cv2.imread(str(image_path))

        if image is None:
            raise ValueError(
                f"Unable to read image: {image_path}"
            )

        result = self.extractor.extract_features(image)

        if not result.success:
            raise RuntimeError(
                "Feature extraction failed."
            )

        self.database.add_user(
            user_name,
            result.embedding,
        )

        LOGGER.info(
            "User '%s' enrolled successfully.",
            user_name,
        )

    def enroll_from_image(
        self,
        user_name: str,
        image,
    ) -> None:
        """
        Enroll a user directly from an OpenCV image.

        Parameters
        ----------
        user_name : str
            Name or ID of the user.

        image : np.ndarray
            Palm image loaded in memory.
        """

        if image is None:
            raise ValueError("Input image is None.")

        result = self.extractor.extract_features(image)

        if not result.success:
            raise RuntimeError(
                "Feature extraction failed."
            )

        self.database.add_user(
            user_name,
            result.embedding,
        )

        LOGGER.info(
            "User '%s' enrolled successfully from memory.",
            user_name,
        )

    def _detect_palm(
            self,
            frame,
    ):
        """
        Detect a palm in the given frame.
        """

        self._validate_frame(frame)

        detection = self.detector.process_frame(frame)

        if not detection.hand_detected:
            raise RuntimeError("No palm detected.")

        return detection

    def _extract_roi(
            self,
            frame,
            detection,
    ):
        if not detection.results.multi_hand_landmarks:
            raise RuntimeError("No hand landmarks found.")

        hand_landmarks = detection.results.multi_hand_landmarks[0]

        roi_result = self.roi_extractor.extract(
            frame,
            hand_landmarks,
        )

        if not roi_result.valid:
            raise RuntimeError("Palm ROI extraction failed.")

        return roi_result.roi

    def _extract_embedding(self, roi):

        result = self.extractor.extract_features(roi)

        if not result.success:
            raise RuntimeError("Feature extraction failed.")

        return result.embedding

    def enroll_from_frame(
            self,
            user_name: str,

            frame,
    ) -> None:
        self._validate_frame(frame)
        detection = self.detector.process_frame(frame)

        roi = self._extract_roi(frame, detection)
        embedding = self._extract_embedding(roi)

        self.database.add_user(
            user_name,
            embedding,
        )
        LOGGER.info(
            "User '%s' enrolled successfully from webcam frame.",
            user_name,
        )