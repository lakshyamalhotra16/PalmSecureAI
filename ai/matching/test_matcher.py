from __future__ import annotations

import cv2

from ai.features.feature_extractor import FeatureExtractor
from ai.matching.matcher import Matcher


def main() -> None:
    image1_path = r"C:\PalmSecureAI\data\dataset\Lakshya\WIN_20260725_13_19_38_Pro.jpg"
    image2_path = r"C:\PalmSecureAI\data\dataset\Lakshya\WIN_20260725_13_19_45_Pro.jpg"

    image1 = cv2.imread(image1_path)
    image2 = cv2.imread(image2_path)

    if image1 is None:
        raise FileNotFoundError(f"Unable to load: {image1_path}")

    if image2 is None:
        raise FileNotFoundError(f"Unable to load: {image2_path}")

    extractor = FeatureExtractor()

    embedding1 = extractor.extract_features(image1).embedding
    embedding2 = extractor.extract_features(image2).embedding

    matcher = Matcher(threshold=0.85)

    result = matcher.match(
        embedding1,
        embedding2,
        user_name="Lakshya",
    )

    print(result)


if __name__ == "__main__":
    main()