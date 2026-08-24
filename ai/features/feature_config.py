"""
PalmSecureAI

Module: feature_config.py

Configuration for CNN Feature Extraction

Author: Lakshya Malhotra
"""

from __future__ import annotations
from dataclasses import dataclass

@dataclass(slots=True)
class FeatureConfig:
    """
    Configuration for CNN Feature Extraction
    """

    model_name: str = "MobileNetV2"
    input_size: tuple[int, int] = (224, 224)
    channels: int = 3
    pretrained: bool = True
    normalize_embeddings: bool = True
    embedding_size: int = 1280
    batch_size: int = 32
    verbose: bool = False