import math
from dataclasses import dataclass
from typing import List


@dataclass
class MatchResult:
    authenticated: bool
    confidence: float
    distance: float
    similarity: float


class PalmMatcher:

    FEATURE_COUNT = 1445

    GEOMETRY_FEATURE_COUNT = 133
    APPEARANCE_FEATURE_COUNT = 1312

    GEOMETRY_WEIGHT = 0.80
    APPEARANCE_WEIGHT = 0.20

    THRESHOLD = 0.78

    @staticmethod
    def normalize(vector: List[float]) -> List[float]:

        if not vector:
            return []

        magnitude = math.sqrt(
            sum(
                float(x) * float(x)
                for x in vector
            )
        )

        if magnitude <= 1e-12:
            return []

        return [
            float(x) / magnitude
            for x in vector
        ]

    @staticmethod
    def validate_vector(
        vector: List[float],
        name: str,
    ):

        if not vector:
            raise ValueError(
                f"{name} feature vector is empty."
            )

        if len(vector) != PalmMatcher.FEATURE_COUNT:
            raise ValueError(
                f"{name} vector has "
                f"{len(vector)} features. "
                f"Expected "
                f"{PalmMatcher.FEATURE_COUNT}."
            )

        try:

            values = [
                float(x)
                for x in vector
            ]

        except (TypeError, ValueError) as exc:

            raise ValueError(
                f"{name} vector contains "
                f"invalid values."
            ) from exc

        if not all(
            math.isfinite(x)
            for x in values
        ):
            raise ValueError(
                f"{name} vector contains "
                f"NaN or infinite values."
            )

        return values

    @staticmethod
    def cosine_similarity(
        vector1: List[float],
        vector2: List[float],
    ) -> float:

        if len(vector1) != len(vector2):
            raise ValueError(
                "Feature vectors must have "
                "the same length."
            )

        magnitude1 = math.sqrt(
            sum(
                x * x
                for x in vector1
            )
        )

        magnitude2 = math.sqrt(
            sum(
                x * x
                for x in vector2
            )
        )

        if (
            magnitude1 <= 1e-12
            or magnitude2 <= 1e-12
        ):
            return 0.0

        dot_product = sum(
            a * b
            for a, b in zip(
                vector1,
                vector2,
            )
        )

        similarity = (
            dot_product
            / (magnitude1 * magnitude2)
        )

        return max(
            -1.0,
            min(1.0, similarity),
        )

    @staticmethod
    def euclidean_distance(
        vector1: List[float],
        vector2: List[float],
    ) -> float:

        if len(vector1) != len(vector2):
            raise ValueError(
                "Feature vectors must have "
                "the same length."
            )

        return math.sqrt(
            sum(
                (a - b) ** 2
                for a, b in zip(
                    vector1,
                    vector2,
                )
            )
        )

    @staticmethod
    def confidence_from_similarity(
        similarity: float,
    ) -> float:

        similarity = max(
            0.0,
            min(1.0, similarity),
        )

        return round(
            similarity * 100,
            2,
        )

    @staticmethod
    def _block_similarity(
        stored_vector: List[float],
        input_vector: List[float],
    ) -> tuple[float, float]:

        geometry_stored = stored_vector[
            :PalmMatcher.GEOMETRY_FEATURE_COUNT
        ]

        geometry_input = input_vector[
            :PalmMatcher.GEOMETRY_FEATURE_COUNT
        ]

        appearance_stored = stored_vector[
            PalmMatcher.GEOMETRY_FEATURE_COUNT:
        ]

        appearance_input = input_vector[
            PalmMatcher.GEOMETRY_FEATURE_COUNT:
        ]

        geometry_stored = PalmMatcher.normalize(
            geometry_stored
        )

        geometry_input = PalmMatcher.normalize(
            geometry_input
        )

        appearance_stored = PalmMatcher.normalize(
            appearance_stored
        )

        appearance_input = PalmMatcher.normalize(
            appearance_input
        )

        if not geometry_stored:
            raise ValueError(
                "Stored geometry features "
                "cannot be normalized."
            )

        if not geometry_input:
            raise ValueError(
                "Input geometry features "
                "cannot be normalized."
            )

        if not appearance_stored:
            raise ValueError(
                "Stored appearance features "
                "cannot be normalized."
            )

        if not appearance_input:
            raise ValueError(
                "Input appearance features "
                "cannot be normalized."
            )

        geometry_similarity = (
            PalmMatcher.cosine_similarity(
                geometry_stored,
                geometry_input,
            )
        )

        appearance_similarity = (
            PalmMatcher.cosine_similarity(
                appearance_stored,
                appearance_input,
            )
        )

        return (
            geometry_similarity,
            appearance_similarity,
        )

    @staticmethod
    def authenticate(
        stored_vector: List[float],
        input_vector: List[float],
    ) -> MatchResult:

        stored_vector = (
            PalmMatcher.validate_vector(
                stored_vector,
                "Stored",
            )
        )

        input_vector = (
            PalmMatcher.validate_vector(
                input_vector,
                "Input",
            )
        )

        (
            geometry_similarity,
            appearance_similarity,
        ) = PalmMatcher._block_similarity(
            stored_vector,
            input_vector,
        )

        similarity = (
            (
                PalmMatcher.GEOMETRY_WEIGHT
                * geometry_similarity
            )
            +
            (
                PalmMatcher.APPEARANCE_WEIGHT
                * appearance_similarity
            )
        )

        similarity = max(
            0.0,
            min(1.0, similarity),
        )

        stored_normalized = (
            PalmMatcher.normalize(
                stored_vector
            )
        )

        input_normalized = (
            PalmMatcher.normalize(
                input_vector
            )
        )

        if not stored_normalized:
            raise ValueError(
                "Stored feature vector "
                "cannot be normalized."
            )

        if not input_normalized:
            raise ValueError(
                "Input feature vector "
                "cannot be normalized."
            )

        distance = (
            PalmMatcher.euclidean_distance(
                stored_normalized,
                input_normalized,
            )
        )

        confidence = (
            PalmMatcher.confidence_from_similarity(
                similarity
            )
        )

        authenticated = (
            similarity >= PalmMatcher.THRESHOLD
        )

        print(
            "---------------- PALM MATCH ----------------"
        )

        print(
            f"Geometry Similarity   : "
            f"{geometry_similarity:.6f}"
        )

        print(
            f"Appearance Similarity : "
            f"{appearance_similarity:.6f}"
        )

        print(
            f"Combined Similarity   : "
            f"{similarity:.6f}"
        )

        print(
            f"Confidence            : "
            f"{confidence:.2f}%"
        )

        print(
            f"Distance              : "
            f"{distance:.6f}"
        )

        print(
            f"Threshold             : "
            f"{PalmMatcher.THRESHOLD:.2f}"
        )

        print(
            f"Authenticated         : "
            f"{authenticated}"
        )

        print(
            "---------------------------------------------"
        )

        return MatchResult(
            authenticated=authenticated,
            confidence=confidence,
            distance=round(
                distance,
                6,
            ),
            similarity=round(
                similarity,
                6,
            ),
        )