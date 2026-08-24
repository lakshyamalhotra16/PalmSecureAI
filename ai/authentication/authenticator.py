from __future__ import annotations

import logging
import time
from pathlib import Path
from typing import Optional

import cv2
import numpy as np

from ai.authentication.auth_config import AuthenticationConfig
from ai.authentication.auth_result import AuthenticationResult
from ai.authentication.exceptions import (
    AuthenticationError,
    DatabaseError,
    FeatureExtractionError,
    HandNotDetectedError,
    MatcherError,
    ROIExtractionError,
)

from ai.database.embedding_database import EmbeddingDatabase
from ai.detection.palm_detector import PalmDetector
from ai.detection.roi_extractor import ROIExtractor
from ai.features.feature_extractor import FeatureExtractor
from ai.matching.matcher import Matcher

logger = logging.getLogger(__name__)


class Authenticator:

    def __init__(
            self,
            detector: Optional[PalmDetector] = None,
            roi_extractor: Optional[ROIExtractor] = None,
            feature_extractor: Optional[FeatureExtractor] = None,
            matcher: Optional[Matcher] = None,
            database: Optional[EmbeddingDatabase] = None,
            config: Optional[AuthenticationConfig] = None,
    ) -> None:

        self.config = config or AuthenticationConfig()

        self.detector = detector or PalmDetector()

        self.roi_extractor = roi_extractor or ROIExtractor()

        self.feature_extractor = (
                feature_extractor or FeatureExtractor()
        )

        self.matcher = matcher or Matcher()

        self.database = database or EmbeddingDatabase()

        logger.info("Authenticator initialized successfully.")

    @property
    def enrolled_users(self) -> int:
        return self.database.total_users()

    @property
    def is_database_empty(self) -> bool:
        """
        Checks whether database has any embeddings.
        """
        return self.enrolled_users == 0

    def _validate_frame(self, frame: np.ndarray) -> None:

        if frame is None:
            raise ValueError("Input frame is None.")

        if not isinstance(frame, np.ndarray):
            raise TypeError(
                "Frame must be numpy.ndarray."
            )

        if frame.size == 0:
            raise ValueError("Empty frame received.")

    def _check_database(self) -> None:

        if self.is_database_empty:
            raise DatabaseError(
                "No enrolled users found."
            )

    @staticmethod
    def _current_time() -> float:

        return time.perf_counter()

    @staticmethod
    def _elapsed(start: float) -> float:

        return round(time.perf_counter() - start, 4)

    def authenticate(
            self,
            frame: np.ndarray,
    ) -> AuthenticationResult:
        """
        Authenticate a user from a webcam frame.
        """

        start_time = self._current_time()

        try:
            self._validate_frame(frame)
            self._check_database()

            detection = self.detector.process_frame(frame)

            if not detection.hand_detected:
                return AuthenticationResult(
                    success=False,
                    user_id=None,
                    confidence=0.0,
                    message="No palm detected.",
                    processing_time=self._elapsed(start_time),
                )

            hand_landmarks = detection.results.multi_hand_landmarks[0]

            roi_result = self.roi_extractor.extract(
                detection.frame,
                hand_landmarks,
            )

            if not roi_result.valid:
                return AuthenticationResult(
                    success=False,
                    user_id=None,
                    confidence=0.0,
                    message="No palm detected.",
                    processing_time=self._elapsed(start_time),
                )

            feature_result = self.feature_extractor.extract_features(
                roi_result.roi,
            )

            if not feature_result.success:
                return AuthenticationResult(
                    success=False,
                    user_id=None,
                    confidence=0.0,
                    message="No palm detected.",
                    processing_time=self._elapsed(start_time),
                )

            best_match = None

            for user_name in self.database.list_users():

                stored_embedding = self.database.get_embedding(user_name)

                result = self.matcher.match(
                    feature_result.embedding,
                    stored_embedding,
                    user_name,
                )

                if best_match is None or result.similarity_score > best_match.similarity_score:
                    best_match = result

            if best_match is None:
                return AuthenticationResult(
                    success=False,
                    user_id=None,
                    confidence=0.0,
                    message="No matching user found.",
                    processing_time=self._elapsed(start_time),
                )

            if best_match.is_match:
                return AuthenticationResult(
                    success=True,
                    user_id=best_match.matched_user,
                    confidence=best_match.similarity_score,
                    message=best_match.message,
                    processing_time=self._elapsed(start_time),
                )

            return AuthenticationResult(
                success=False,
                user_id=None,
                confidence=best_match.similarity_score,
                message=best_match.message,
                processing_time=self._elapsed(start_time),
            )
        except Exception as error:

            logger.exception(
                "Authentication failed: %s",
                error,
            )

            return AuthenticationResult(
                success=False,
                user_id=None,
                confidence=0.0,
                message=str(error),
                processing_time=self._elapsed(start_time),
            )
