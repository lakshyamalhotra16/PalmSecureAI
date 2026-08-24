from __future__ import annotations

from typing import List

import numpy as np

from ai.matching.match_result import MatchResult
from ai.matching.similarity import Similarity
from ai.templates.biometric_template import BiometricTemplate


class Matcher:
    """
    Matches a live biometric embedding against
    enrolled biometric templates.
    """

    def __init__(
        self,
        threshold: float = 0.90,
    ) -> None:

        self.threshold = threshold

    def match(
        self,
        live_embedding: np.ndarray,
        templates: List[BiometricTemplate],
    ) -> MatchResult:

        Similarity.validate_embedding(live_embedding)

        if not templates:
            return MatchResult(
                matched=False,
                user_id=None,
                similarity=0.0,
                confidence=0.0,
                threshold=self.threshold,
                message="No enrolled templates found.",
            )

        best_similarity = -1.0
        best_template = None

        for template in templates:

            similarity = Similarity.cosine_similarity(
                live_embedding,
                template.embedding,
            )

            if similarity > best_similarity:
                best_similarity = similarity
                best_template = template

        matched = best_similarity >= self.threshold

        return MatchResult(
            matched=matched,
            user_id=best_template.user_id if matched else None,
            similarity=best_similarity,
            confidence=best_similarity * 100,
            threshold=self.threshold,
            message=(
                "Authentication successful."
                if matched
                else "Authentication failed."
            ),
        )