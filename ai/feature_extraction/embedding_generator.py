from __future__ import annotations

import numpy as np
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input

from ai.feature_extraction.embedding_model import EmbeddingModel


class EmbeddingGenerator:
    """
    Generates L2-normalized embeddings from
    preprocessed palm images.
    """

    def __init__(self) -> None:
        self.embedding_model = EmbeddingModel()

    def _prepare_image(
        self,
        image: np.ndarray,
    ) -> np.ndarray:
        """
        Prepare image for MobileNetV3 inference.
        """

        if image is None:
            raise ValueError("Input image is None.")

        if image.ndim != 3:
            raise ValueError(
                "Expected image shape (224,224,3)"
            )

        image = image.astype(np.float32)

        # If preprocessing pipeline normalized to [0,1],
        # convert back to [0,255]
        if image.max() <= 1.0:
            image *= 255.0

        image = preprocess_input(image)

        image = np.expand_dims(image, axis=0)

        return image

    def generate(
        self,
        image: np.ndarray,
    ) -> np.ndarray:
        """
        Generate a biometric embedding.
        """

        image = self._prepare_image(image)

        embedding = self.embedding_model.predict(image)[0]

        return embedding.astype(np.float32)