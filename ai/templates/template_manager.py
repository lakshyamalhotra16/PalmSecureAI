from __future__ import annotations

import numpy as np

from ai.templates.biometric_template import BiometricTemplate


class TemplateManager:
    """
    Creates and validates biometric templates.
    """

    def create_template(
        self,
        user_id: str,
        embedding: np.ndarray,
        quality_score: float,
        sample_count: int = 1,
    ) -> BiometricTemplate:

        if embedding.ndim != 1:
            raise ValueError(
                "Embedding must be one-dimensional."
            )

        return BiometricTemplate(
            user_id=user_id,
            embedding=embedding,
            quality_score=quality_score,
            sample_count=sample_count,
        )

    def validate(
        self,
        template: BiometricTemplate,
    ) -> bool:

        if template.embedding is None:
            return False

        if template.embedding.size == 0:
            return False

        if template.quality_score <= 0:
            return False

        return True