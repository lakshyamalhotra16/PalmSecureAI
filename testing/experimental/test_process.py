import cv2

from ai.detection.palm_detector import PalmDetector

detector = PalmDetector()

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()

    if not ret:
        break

    result = detector.process_frame(frame)

    print(result.hand_detected)

    cv2.imshow("Test", result.frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()