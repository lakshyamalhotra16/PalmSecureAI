from __future__ import annotations

from ai.templates.biometric_template import BiometricTemplate
from ai.templates.template_manager import TemplateManager


class TemplateService:
    """
    High-level service for managing biometric templates.
    """

    def __init__(self) -> None:
        self.manager = TemplateManager()

    def create(
        self,
        user_id: str,
        embedding,
        quality_score: float,
        sample_count: int = 1,
    ) -> BiometricTemplate:

        template = self.manager.create_template(
            user_id=user_id,
            embedding=embedding,
            quality_score=quality_score,
            sample_count=sample_count,
        )

        if not self.manager.validate(template):
            raise ValueError("Generated template is invalid.")

        return template