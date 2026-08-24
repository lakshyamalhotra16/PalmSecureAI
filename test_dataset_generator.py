"""
PalmSecureAI

Test Script:
Dataset Generator

Pipeline:
Camera → Detection → ROI → Preprocessing → Dataset Saving
"""

import logging
import cv2

from ai.detection.detector_utils import CameraManager
from ai.detection.palm_detector import PalmDetector
from ai.detection.roi_extractor import ROIExtractor
from ai.preprocessing.image_preprocessor import ImagePreprocessor
from ai.dataset.dataset_generator import DatasetGenerator

logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s - %(message)s",
)


def main() -> None:

    camera = CameraManager()
    detector = PalmDetector()
    roi_extractor = ROIExtractor()
    preprocessor = ImagePreprocessor()
    dataset_generator = DatasetGenerator()

    person_name = "Lakshya"

    print("Press S to save palm image.")
    print("Press Q to quit.")

    processed_image = None

    while True:

        frame = camera.read()

        if frame is None:
            continue

        detection = detector.process_frame(frame)

        display_frame = detector.draw_results(detection)

        processed_image = None

        if (
            detection.hand_detected
            and detection.results.multi_hand_landmarks
        ):

            hand_landmarks = detection.results.multi_hand_landmarks[0]

            roi_result = roi_extractor.extract(
                detection.frame,
                hand_landmarks,
            )

            if roi_result.valid:

                preprocessing_result = preprocessor.preprocess(
                    roi_result.roi,
                )

                if preprocessing_result.success:

                    processed_image = preprocessing_result.image

                    cv2.imshow(
                        "Processed Palm",
                        processed_image,
                    )

        cv2.imshow(
            "Palm Detection",
            display_frame,
        )

        key = cv2.waitKey(1) & 0xFF

        if key == ord("s"):

            if processed_image is not None:

                result = dataset_generator.save_image(
                    person_name,
                    processed_image,
                )

                if result.success:
                    print(f"Saved: {result.image_path}")
                else:
                    print("Failed to save image.")

            else:
                print("No valid palm detected.")

        elif key == ord("q"):
            break

    camera.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()