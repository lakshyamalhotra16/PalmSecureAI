from __future__ import annotations

from dataclasses import dataclass
from typing import Optional


@dataclass(slots=True)
class MatchResult:
    """
    Result of comparing a live biometric embedding
    against enrolled templates.
    """

    matched: bool

    user_id: Optional[str]

    similarity: float

    confidence: float

    threshold: float

    message: str