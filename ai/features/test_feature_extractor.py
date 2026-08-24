from __future__ import annotations
import cv2
from ai.features.feature_extractor import FeatureExtractor

def main() -> None:
    image_path = r"C:\PalmSecureAI\data\dataset\Lakshya\WIN_20260725_13_19_38_Pro.jpg"
    image = cv2.imread(image_path)

    if image is None:
        print("Failed to load image.")
        return

    extractor = FeatureExtractor()
    result = extractor.extract_features(image)

    print("=" * 50)
    print("Feature Extraction Result")
    print("=" * 50)

    print(f"Success      : {result.success}")
    print(f"Model          : {result.model_name}")
    print(f"Inference Time : {result.inference_time:.4f} sec")

    if result.success:
        print(f"Embedding Shape: {result.embedding.shape}")
        print(f"Embedding Size: {len(result.embedding)}")


if __name__ == "__main__":
    main()