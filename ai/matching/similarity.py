from __future__ import annotations

import numpy as np


class Similarity:
    """
    Utility class providing similarity and distance
    calculations for biometric embeddings.
    """

    @staticmethod
    def validate_embedding(embedding: np.ndarray) -> None:
        """
        Validate an embedding before comparison.
        """

        if embedding is None:
            raise ValueError("Embedding cannot be None.")

        if not isinstance(embedding, np.ndarray):
            raise TypeError("Embedding must be a NumPy array.")

        if embedding.ndim != 1:
            raise ValueError(
                "Embedding must be one-dimensional."
            )

        if embedding.size == 0:
            raise ValueError(
                "Embedding cannot be empty."
            )

    @staticmethod
    def normalize_embedding(
        embedding: np.ndarray,
    ) -> np.ndarray:
        """
        L2-normalize an embedding.
        """

        Similarity.validate_embedding(embedding)

        norm = np.linalg.norm(embedding)

        if norm == 0:
            raise ValueError(
                "Embedding norm is zero."
            )

        return embedding / norm

    @staticmethod
    def cosine_similarity(
        embedding1: np.ndarray,
        embedding2: np.ndarray,
    ) -> float:
        """
        Compute cosine similarity.
        """

        embedding1 = Similarity.normalize_embedding(
            embedding1
        )

        embedding2 = Similarity.normalize_embedding(
            embedding2
        )

        similarity = np.dot(
            embedding1,
            embedding2,
        )

        return float(similarity)

    @staticmethod
    def euclidean_distance(
        embedding1: np.ndarray,
        embedding2: np.ndarray,
    ) -> float:
        """
        Compute Euclidean distance.
        """

        Similarity.validate_embedding(embedding1)
        Similarity.validate_embedding(embedding2)

        return float(
            np.linalg.norm(
                embedding1 - embedding2
            )
        )

    @staticmethod
    def manhattan_distance(
        embedding1: np.ndarray,
        embedding2: np.ndarray,
    ) -> float:
        """
        Compute Manhattan distance.
        """

        Similarity.validate_embedding(embedding1)
        Similarity.validate_embedding(embedding2)

        return float(
            np.sum(
                np.abs(
                    embedding1 - embedding2
                )
            )
        )