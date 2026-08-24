import cv2
import mediapipe as mp


class PalmDetector:
    def __init__(self):
        self.mp_hands = mp.solutions.hands

        self.hands = self.mp_hands.Hands(
            static_image_mode=True,
            max_num_hands=1,
            min_detection_confidence=0.7,
        )

    def detect(self, image_path: str):
        image = cv2.imread(image_path)

        if image is None:
            raise ValueError("Unable to read image.")

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        results = self.hands.process(rgb)

        return results