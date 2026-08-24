from __future__ import annotations

from typing import List, Optional

from datetime import datetime
import numpy as np
from sqlalchemy import select

from ai.templates.biometric_template import BiometricTemplate
from database.connection import SessionLocal
from database.models.biometric_template import BiometricTemplateModel
from database.repositories.template_repository import TemplateRepository


class SQLiteTemplateRepository(TemplateRepository):
    """
    SQLite implementation of the TemplateRepository.

    Stores biometric templates using SQLAlchemy.
    """

    def __init__(self) -> None:
        pass

    @staticmethod
    def _model_to_template(
            self,
            model: BiometricTemplateModel,
    ) -> BiometricTemplate:

        embedding = np.frombuffer(
            model.embedding,
            dtype=np.float32,
        )

        return BiometricTemplate(
            user_id=model.user_id,
            embedding=embedding,
            quality_score=model.quality_score,
            created_at=model.created_at,
            version=model.version,
            sample_count=model.sample_count,
        )

    def save(
        self,
        template: BiometricTemplate,
    ) -> None:

        with SessionLocal() as session:

            model = session.scalar(
                select(BiometricTemplateModel).where(
                    BiometricTemplateModel.user_id == template.user_id
                )
            )

            if model is None:

                model = BiometricTemplateModel(
                    user_id=template.user_id,
                    embedding=template.embedding.astype(
                        np.float32
                    ).tobytes(),
                    quality_score=template.quality_score,
                    created_at=template.created_at,
                    version=template.version,
                    sample_count=template.sample_count,
                )

                session.add(model)

            else:

                model.embedding = template.embedding.astype(
                    np.float32
                ).tobytes()

                model.quality_score = template.quality_score
                model.version = template.version
                model.sample_count = template.sample_count

            session.commit()

    def get_by_user_id(
        self,
        user_id: str,
    ) -> Optional[BiometricTemplate]:

        with SessionLocal() as session:

            model = session.scalar(
                select(BiometricTemplateModel).where(
                    BiometricTemplateModel.user_id == user_id
                )
            )

            if model is None:
                return None

            return self._model_to_template(model)

    def get_all(
        self,
    ) -> List[BiometricTemplate]:

        with SessionLocal() as session:

            models = session.scalars(
                select(BiometricTemplateModel)
            ).all()

            return [
                self._model_to_template(model)
                for model in models
            ]

    def delete(
        self,
        user_id: str,
    ) -> None:

        with SessionLocal() as session:

            model = session.scalar(
                select(BiometricTemplateModel).where(
                    BiometricTemplateModel.user_id == user_id
                )
            )

            if model is not None:
                session.delete(model)
                session.commit()