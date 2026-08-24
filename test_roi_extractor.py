import cv2

from ai.detection.palm_detector import PalmDetector
from ai.detection.roi_extractor import ROIExtractor

detector = PalmDetector()
extractor = ROIExtractor()

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    raise RuntimeError("Unable to open camera")

while True:

    success, frame = cap.read()

    if not success:
        break

    detection = detector.process_frame(frame)

    display = detection.frame.copy()

    if detection.hand_detected:

        for hand_landmarks in detection.results.multi_hand_landmarks:

            roi_result = extractor.extract(
                detection.frame,
                hand_landmarks,
            )

            x1, y1, x2, y2 = roi_result.bbox

            cv2.rectangle(
                display,
                (x1, y1),
                (x2, y2),
                (0, 255, 255),
                2,
            )

            detector.drawer.draw_landmarks(
                display,
                hand_landmarks,
            )

            if roi_result.valid:

                cv2.imshow(
                    "Palm ROI",
                    roi_result.roi,
                )

    cv2.imshow(
        "Palm Detection",
        display,
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

detector.close()
cap.release()
cv2.destroyAllWindows()