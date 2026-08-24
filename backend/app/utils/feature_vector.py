import json
from typing import List


def serialize_feature_vector(vector: List[float]) -> str:
    """
    Convert a feature vector into a JSON string.
    """
    return json.dumps(vector)


def deserialize_feature_vector(vector: str) -> List[float]:
    """
    Convert a JSON string back into a Python list.
    """

    if not vector:
        raise ValueError("Feature vector is empty.")

    return json.loads(vector)