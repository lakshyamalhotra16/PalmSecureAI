from __future__ import annotations

import numpy as np

from ai.feature_extraction.embedding_generator import EmbeddingGenerator
from ai.preprocessing.preprocessing_pipeline import PreprocessingPipeline
from ai.templates.biometric_template import BiometricTemplate
from database.repositories.template_repository import TemplateRepository
from services.template_service import TemplateService
from ai.detection.palm_detector import PalmDetector


class EnrollmentService:
    """
    Service responsible for enrolling new users.
    """

    def __init__(
        self,
        repository: TemplateRepository,
    ) -> None:

        self.detector = PalmDetector()
        self.repository = repository
        self.preprocessing = PreprocessingPipeline()
        self.embedding_generator = EmbeddingGenerator()
        self.template_service = TemplateService()

    def enroll(
            self,
            user_id: str,
            image: np.ndarray,
    ) -> BiometricTemplate:
        detection = self.detector.process_frame(image)

        if not detection.hand_detected:
            raise ValueError("No palm detected.")

        preprocessing_result = self.preprocessing.process(
            image=detection.frame,
            landmarks=detection.landmarks,
        )

        embedding = self.embedding_generator.generate(
            preprocessing_result.roi,
        )

        template = self.template_service.create(
            user_id=user_id,
            embedding=embedding,
            quality_score=preprocessing_result.quality.blur_score,
        )

        self.repository.save(template)

        return template