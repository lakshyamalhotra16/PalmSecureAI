from __future__ import annotations

import numpy as np

from ai.database.embedding_database import EmbeddingDatabase
from ai.database.enrollment import Enrollment
from ai.authentication.authenticator import Authenticator
from ai.authentication.auth_result import AuthenticationResult


class BiometricService:
    """
    Business logic layer for PalmSecureAI.
    """

    def __init__(self) -> None:

        # Shared database instance
        self.database = EmbeddingDatabase()

        self.enrollment = Enrollment(
            database=self.database,
        )

        self.authenticator = Authenticator(
            database=self.database,
        )

    def enroll(
        self,
        user_name: str,
        frame: np.ndarray,
    ) -> None:

        self.enrollment.enroll_from_frame(
            user_name=user_name,
            frame=frame,
        )

    def authenticate(
        self,
        frame: np.ndarray,
    ) -> AuthenticationResult:

        return self.authenticator.authenticate(frame)

    def total_users(self) -> int:

        return self.database.total_users()

    def list_users(self):

        return self.database.list_users()

    def delete_user(
        self,
        user_name: str,
    ) -> bool:
        self.database.remove_user(user_name)
        return True