"""
PalmSeureAI

Module: feature_result.py

Stores CNN Feature Extraction Results

Author: Lakshya Malhotra
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np

@dataclass(slots=True)
class FeatureResult:
    """
    Stores the result of CNN feature extraction.

    """
    embedding: Optional[np.ndarray]
    success: bool
    inference_time: float
    model_name: str

