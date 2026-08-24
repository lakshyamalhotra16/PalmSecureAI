"""
PalmSecureAI

Module: feature_extractor.py

CNN Feature Extraction using MobileNetV2

Author: Lakshya Malhotra
"""

from __future__ import annotations

import logging
import time

import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

from .feature_config import FeatureConfig
from .feature_result import FeatureResult


logger = logging.getLogger(__name__)


class FeatureExtractor:
    """
    Extracts feature embeddings from palm images using MobileNetV2.
    """

    def __init__(self, config: FeatureConfig | None = None):
        self.config = config or FeatureConfig()

        logger.info("Loading MobileNetV2 model...")

        self.model = MobileNetV2(
            weights="imagenet",
            include_top=False,
            pooling="avg",
            input_shape=(
                self.config.input_size[0],
                self.config.input_size[1],
                self.config.channels,
            ),
        )

        logger.info("MobileNetV2 loaded successfully.")


    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """
        Preprocess image for feature extraction
        """

        if image is None or image.size == 0:
            raise ValueError("Input image is empty.")

        image = cv2.resize(image, self.config.input_size)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image = image.astype(np.float32)
        image = preprocess_input(image)
        image = np.expand_dims(image, axis=0)
        return image

    def extract_features(self, image: np.ndarray) -> FeatureResult:
        start_time = time.perf_counter()
        try:
            image = self.preprocess_image(image)

            embedding = self.model.predict(
                image,
                verbose=0,
            )[0]

            if self.config.normalize_embeddings:
                norm = np.linalg.norm(embedding)

                if norm>0:
                    embedding = embedding / norm

            inference_time = time.perf_counter() - start_time

            return FeatureResult(
                embedding=embedding,
                success=True,
                inference_time=inference_time,
                model_name=self.config.model_name,
            )

        except Exception as e:
            logger.exception("Feature extraction failed.")

            return FeatureResult(
                embedding=None,
                success=False,
                inference_time=time.perf_counter() - start_time,
                model_name=self.config.model_name,
            )

