from __future__ import annotations

from abc import ABC, abstractmethod
from typing import List, Optional

from ai.templates.biometric_template import BiometricTemplate


class TemplateRepository(ABC):
    """
    Abstract repository for biometric templates.
    """

    @abstractmethod
    def save(
        self,
        template: BiometricTemplate,
    ) -> None:
        pass

    @abstractmethod
    def get_by_user_id(
        self,
        user_id: str,
    ) -> Optional[BiometricTemplate]:
        pass

    @abstractmethod
    def get_all(self) -> List[BiometricTemplate]:
        pass

    @abstractmethod
    def delete(
        self,
        user_id: str,
    ) -> None:
        pass