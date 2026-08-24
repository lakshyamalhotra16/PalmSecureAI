from __future__ import annotations

from typing import Tuple

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV3Small
from tensorflow.keras.layers import (
    BatchNormalization,
    Dense,
    GlobalAveragePooling2D,
    Lambda,
)
from tensorflow.keras.models import Model


class EmbeddingModel:
    """
    Singleton embedding model used throughout PalmSecureAI.
    Produces 256-dimensional L2-normalized embeddings.
    """

    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(
        self,
        input_shape: Tuple[int, int, int] = (224, 224, 3),
        embedding_dim: int = 256,
    ) -> None:

        if self.__class__._model is not None:
            return

        backbone = MobileNetV3Small(
            input_shape=input_shape,
            include_top=False,
            weights="imagenet",
        )

        backbone.trainable = False

        x = backbone.output

        x = GlobalAveragePooling2D()(x)

        x = Dense(
            embedding_dim,
            activation=None,
            name="embedding_dense",
        )(x)

        x = BatchNormalization(
            name="embedding_bn",
        )(x)

        x = Lambda(
            lambda t: tf.math.l2_normalize(t, axis=1),
            name="embedding_norm",
        )(x)

        self.__class__._model = Model(
            inputs=backbone.input,
            outputs=x,
            name="PalmEmbeddingModel",
        )

    @property
    def model(self):
        return self.__class__._model

    @property
    def embedding_size(self):
        return 256

    def predict(self, image):
        return self.model.predict(image, verbose=0)