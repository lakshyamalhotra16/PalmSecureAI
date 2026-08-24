import cv2

from ai.detection.detector_utils import CameraManager
from ai.detection.palm_detector import PalmDetector
from ai.detection.roi_extractor import ROIExtractor
from ai.preprocessing.image_preprocessor import ImagePreprocessor


def main():
    camera = CameraManager()
    detector = PalmDetector()
    extractor = ROIExtractor()
    preprocessor = ImagePreprocessor()

    try:
        while True:
            # CameraManager returns only the frame
            frame = camera.read()
            detection = detector.process_frame(frame)
            display_frame = detector.draw_results(detection)

            if detection.hand_detected:

                roi_result = extractor.extract(
                    display_frame,
                    detection.results.multi_hand_landmarks[0]
                )

                if roi_result.valid:
                    processed = preprocessor.preprocess(roi_result.roi)

                    cv2.rectangle(
                        display_frame,
                        (roi_result.bbox[0], roi_result.bbox[1]),
                        (roi_result.bbox[2], roi_result.bbox[3]),
                        (0, 255, 0),
                        2,
                    )

                    cv2.imshow("Palm ROI", roi_result.roi)
                    cv2.imshow("Processed Palm", processed.image)

            cv2.imshow("Palm Detection", display_frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        detector.close()
        camera.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()