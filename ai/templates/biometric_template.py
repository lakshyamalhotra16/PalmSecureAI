from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, UTC
from typing import Optional

import numpy as np


@dataclass
class BiometricTemplate:
    """
    Represents a stored biometric template.
    """

    user_id: str
    embedding: np.ndarray

    quality_score: float

    created_at: datetime = field(
        default_factory=lambda: datetime.now(UTC)
    )

    version: str = "1.0"

    sample_count: int = 1

    metadata: Optional[dict] = None