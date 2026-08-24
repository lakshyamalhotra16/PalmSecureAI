from __future__ import annotations

import logging
import pickle

from typing import Dict

import numpy as np

from .database_config import DatabaseConfig


LOGGER = logging.getLogger(__name__)


class EmbeddingDatabase:
    """
    Stores and manages biometric embeddings.

    Each user is associated with a single embedding vector.

    Example
    -------
    {
        "Lakshya": numpy.ndarray(...),
        "Rahul": numpy.ndarray(...),
    }
    """

    def __init__(
        self,
        config: DatabaseConfig | None = None,
    ) -> None:

        self.config = config or DatabaseConfig()

        if self.config.create_directory:
            self.config.database_directory.mkdir(
                parents=True,
                exist_ok=True,
            )

        self.embeddings: Dict[str, np.ndarray] = {}

        self.load()

        LOGGER.info(
            "Embedding database initialized."
        )

    def save(self) -> None:
        """
        Save all embeddings to disk.
        """

        with open(
            self.config.database_path,
            "wb",
        ) as file:
            pickle.dump(
                self.embeddings,
                file,
            )

        LOGGER.info(
            "Database saved successfully."
        )

    def load(self) -> None:
        """
        Load embeddings from disk.
        """

        if not self.config.database_path.exists():
            LOGGER.info(
                "Database file not found. Starting with an empty database."
            )
            return

        with open(
            self.config.database_path,
            "rb",
        ) as file:
            self.embeddings = pickle.load(file)

        LOGGER.info(
            "Loaded %d users from database.",
            len(self.embeddings),
        )

    def user_exists(
        self,
        user_name: str,
    ) -> bool:
        """
        Check whether a user exists.
        """

        return user_name in self.embeddings
    def add_user(
        self,
        user_name: str,
        embedding: np.ndarray,
    ) -> None:
        """
        Add or update a user's embedding.
        """

        if embedding.size == 0:
            raise ValueError("Embedding cannot be empty.")

        if (
            self.user_exists(user_name)
            and not self.config.overwrite_existing
        ):
            raise ValueError(
                f"User '{user_name}' already exists."
            )

        self.embeddings[user_name] = embedding

        self.save()

        LOGGER.info(
            "User '%s' enrolled successfully.",
            user_name,
        )

    def remove_user(
        self,
        user_name: str,
    ) -> None:
        """
        Remove a user from the database.
        """

        if not self.user_exists(user_name):
            raise ValueError(
                f"User '{user_name}' does not exist."
            )

        del self.embeddings[user_name]

        self.save()

        LOGGER.info(
            "User '%s' removed successfully.",
            user_name,
        )

    def get_embedding(
        self,
        user_name: str,
    ) -> np.ndarray:
        """
        Return the embedding associated with a user.
        """

        if not self.user_exists(user_name):
            raise ValueError(
                f"User '{user_name}' does not exist."
            )

        return self.embeddings[user_name]

    def list_users(
        self,
    ) -> list[str]:
        """
        Return a sorted list of enrolled users.
        """

        return sorted(self.embeddings.keys())

    def total_users(self) -> int:
        """
        Return the number of enrolled users.
        """

        return len(self.embeddings)