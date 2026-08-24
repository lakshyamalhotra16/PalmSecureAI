import math
from typing import List

import cv2
import numpy as np


class FeatureExtractor:


    LANDMARK_COUNT = 21
    @staticmethod
    def _validate_landmarks(
        landmarks: List[List[float]],
    ) -> bool:

        if not landmarks:
            return False

        if len(landmarks) != FeatureExtractor.LANDMARK_COUNT:
            return False

        for point in landmarks:

            if len(point) != 3:
                return False

            if not all(
                math.isfinite(float(value))
                for value in point
            ):
                return False

        return True

    # ============================================================
    # EXTRACT MEDIAPIPE LANDMARKS
    # ============================================================

    @staticmethod
    def extract_landmarks(results) -> List[List[float]]:

        if results is None:
            return []

        hand_landmarks = getattr(
            results,
            "multi_hand_landmarks",
            None,
        )

        if not hand_landmarks:
            return []

        hand = hand_landmarks[0]

        landmarks = []

        for landmark in hand.landmark:

            landmarks.append(
                [
                    float(landmark.x),
                    float(landmark.y),
                    float(landmark.z),
                ]
            )

        if not FeatureExtractor._validate_landmarks(
            landmarks
        ):
            return []

        return landmarks

    # ============================================================
    # NORMALIZE LANDMARKS
    # ============================================================

    @staticmethod
    def normalize_landmarks(
        landmarks: List[List[float]],
    ) -> List[List[float]]:

        if not FeatureExtractor._validate_landmarks(
            landmarks
        ):
            return []

        wrist = landmarks[0]
        middle_mcp = landmarks[9]

        scale = FeatureExtractor._distance(
            wrist,
            middle_mcp,
        )

        if scale <= 1e-8:
            return []

        normalized = []

        for point in landmarks:

            normalized.append(
                [
                    (point[0] - wrist[0]) / scale,
                    (point[1] - wrist[1]) / scale,
                    (point[2] - wrist[2]) / scale,
                ]
            )

        return normalized

    # ============================================================
    # DISTANCE
    # ============================================================

    @staticmethod
    def _distance(
        p1: List[float],
        p2: List[float],
    ) -> float:

        return math.sqrt(
            (p1[0] - p2[0]) ** 2
            + (p1[1] - p2[1]) ** 2
            + (p1[2] - p2[2]) ** 2
        )

    # ============================================================
    # COORDINATE FEATURES
    # ============================================================

    @staticmethod
    def calculate_coordinate_features(
        landmarks: List[List[float]],
    ) -> List[float]:

        features = []

        for point in landmarks:

            features.extend(
                [
                    point[0],
                    point[1],
                    point[2],
                ]
            )

        return features

    # ============================================================
    # WRIST DISTANCES
    # ============================================================

    @staticmethod
    def calculate_distance_features(
        landmarks: List[List[float]],
    ) -> List[float]:

        if not landmarks:
            return []

        wrist = landmarks[0]

        return [
            FeatureExtractor._distance(
                wrist,
                point,
            )
            for point in landmarks[1:]
        ]

    # ============================================================
    # FINGER LENGTHS
    # ============================================================

    @staticmethod
    def calculate_finger_lengths(
        landmarks: List[List[float]],
    ) -> dict:

        fingers = {
            "thumb": [1, 2, 3, 4],
            "index": [5, 6, 7, 8],
            "middle": [9, 10, 11, 12],
            "ring": [13, 14, 15, 16],
            "pinky": [17, 18, 19, 20],
        }

        lengths = {}

        for finger, points in fingers.items():

            total = 0.0

            for index in range(
                len(points) - 1
            ):

                total += FeatureExtractor._distance(
                    landmarks[points[index]],
                    landmarks[points[index + 1]],
                )

            lengths[finger] = total

        return lengths

    # ============================================================
    # ANGLE
    # ============================================================

    @staticmethod
    def _angle(
        a: List[float],
        b: List[float],
        c: List[float],
    ) -> float:

        ba = [
            a[0] - b[0],
            a[1] - b[1],
            a[2] - b[2],
        ]

        bc = [
            c[0] - b[0],
            c[1] - b[1],
            c[2] - b[2],
        ]

        dot = (
            ba[0] * bc[0]
            + ba[1] * bc[1]
            + ba[2] * bc[2]
        )

        magnitude_ba = math.sqrt(
            sum(
                value * value
                for value in ba
            )
        )

        magnitude_bc = math.sqrt(
            sum(
                value * value
                for value in bc
            )
        )

        if (
            magnitude_ba <= 1e-8
            or magnitude_bc <= 1e-8
        ):
            return 0.0

        cosine = dot / (
            magnitude_ba * magnitude_bc
        )

        cosine = max(
            -1.0,
            min(1.0, cosine),
        )

        return math.degrees(
            math.acos(cosine)
        )

    # ============================================================
    # JOINT ANGLES
    # ============================================================

    @staticmethod
    def calculate_joint_angles(
        landmarks: List[List[float]],
    ) -> List[float]:

        if not landmarks:
            return []

        joints = [
            (1, 2, 3),
            (2, 3, 4),
            (5, 6, 7),
            (6, 7, 8),
            (9, 10, 11),
            (10, 11, 12),
            (13, 14, 15),
            (14, 15, 16),
            (17, 18, 19),
            (18, 19, 20),
        ]

        return [
            FeatureExtractor._angle(
                landmarks[a],
                landmarks[b],
                landmarks[c],
            )
            for a, b, c in joints
        ]

    # ============================================================
    # PALM WIDTH
    # ============================================================

    @staticmethod
    def calculate_palm_width(
        landmarks: List[List[float]],
    ) -> float:

        return FeatureExtractor._distance(
            landmarks[5],
            landmarks[17],
        )

    # ============================================================
    # PALM HEIGHT
    # ============================================================

    @staticmethod
    def calculate_palm_height(
        landmarks: List[List[float]],
    ) -> float:

        return FeatureExtractor._distance(
            landmarks[0],
            landmarks[9],
        )

    # ============================================================
    # FINGER SPREAD
    # ============================================================

    @staticmethod
    def calculate_finger_spread(
        landmarks: List[List[float]],
    ) -> List[float]:

        tips = [4, 8, 12, 16, 20]

        features = []

        for index in range(
            len(tips) - 1
        ):

            features.append(
                FeatureExtractor._distance(
                    landmarks[tips[index]],
                    landmarks[tips[index + 1]],
                )
            )

        return features

    # ============================================================
    # FINGERTIP DISTANCES
    # ============================================================

    @staticmethod
    def calculate_fingertip_distances(
        landmarks: List[List[float]],
    ) -> List[float]:

        tips = [4, 8, 12, 16, 20]

        features = []

        for i in range(len(tips)):

            for j in range(
                i + 1,
                len(tips),
            ):

                features.append(
                    FeatureExtractor._distance(
                        landmarks[tips[i]],
                        landmarks[tips[j]],
                    )
                )

        return features

    # ============================================================
    # STRUCTURAL DISTANCES
    # ============================================================

    @staticmethod
    def calculate_structural_distances(
        landmarks: List[List[float]],
    ) -> List[float]:

        pairs = [
            (4, 8),
            (4, 12),
            (4, 16),
            (4, 20),
            (8, 12),
            (8, 16),
            (8, 20),
            (12, 16),
            (12, 20),
            (16, 20),
            (5, 9),
            (9, 13),
            (13, 17),
            (5, 13),
            (9, 17),
            (2, 5),
            (6, 9),
            (10, 13),
            (14, 17),
        ]

        return [
            FeatureExtractor._distance(
                landmarks[a],
                landmarks[b],
            )
            for a, b in pairs
        ]

    # ============================================================
    # PALM APPEARANCE FEATURES
    # ============================================================

    @staticmethod
    def calculate_appearance_features(
        image_path: str,
        landmarks: List[List[float]],
    ) -> List[float]:
        """
        Extract a compact palm appearance descriptor.

        The descriptor is based on:
            - grayscale palm region
            - local contrast normalization
            - resized intensity information
            - gradient information
            - intensity histogram

        This complements the MediaPipe geometry features.
        """

        if not image_path:
            return []

        image = cv2.imread(
            image_path,
            cv2.IMREAD_COLOR,
        )

        if image is None:
            return []

        height, width = image.shape[:2]

        if height <= 0 or width <= 0:
            return []

        # --------------------------------------------------------
        # Convert normalized landmark coordinates to pixels
        # --------------------------------------------------------

        points = []

        for point in landmarks:

            x = int(point[0] * float(width))
            y = int(point[1] * float(height))

            if x < 0:
                x = 0
            elif x >= width:
                x = width - 1

            if y < 0:
                y = 0
            elif y >= height:
                y = height - 1

            points.append((x, y))

        xs = [
            point[0]
            for point in points
        ]

        ys = [
            point[1]
            for point in points
        ]

        min_x = min(xs)
        max_x = max(xs)
        min_y = min(ys)
        max_y = max(ys)

        # Add margin around the palm
        margin_x = int(
            (max_x - min_x) * 0.25
        )

        margin_y = int(
            (max_y - min_y) * 0.25
        )

        x1 = max(
            0,
            min_x - margin_x,
        )

        y1 = max(
            0,
            min_y - margin_y,
        )

        x2 = min(
            width,
            max_x + margin_x,
        )

        y2 = min(
            height,
            max_y + margin_y,
        )

        if x2 <= x1 or y2 <= y1:
            return []

        palm = image[
            y1:y2,
            x1:x2,
        ]

        if palm.size == 0:
            return []

        # --------------------------------------------------------
        # Grayscale
        # --------------------------------------------------------

        gray = cv2.cvtColor(
            palm,
            cv2.COLOR_BGR2GRAY,
        )

        # --------------------------------------------------------
        # Local contrast normalization
        # --------------------------------------------------------

        clahe = cv2.createCLAHE(
            clipLimit=2.0,
            tileGridSize=(8, 8),
        )

        gray = clahe.apply(gray)

        # --------------------------------------------------------
        # Resize
        # --------------------------------------------------------

        gray = cv2.resize(
            gray,
            (32, 32),
            interpolation=cv2.INTER_AREA,
        )

        # --------------------------------------------------------
        # Normalize intensity
        # --------------------------------------------------------

        gray_float = (
            gray.astype(np.float32)
            / 255.0
        )

        mean = float(
            np.mean(gray_float)
        )

        std = float(
            np.std(gray_float)
        )

        if std > 1e-8:

            normalized = (
                (gray_float - mean)
                / std
            )

        else:

            normalized = (
                gray_float - mean
            )

        normalized = np.clip(
            normalized,
            -3.0,
            3.0,
        )

        normalized = (
            normalized / 3.0
        )

        features = normalized.flatten().tolist()

        # --------------------------------------------------------
        # Gradient magnitude
        # --------------------------------------------------------

        gx = cv2.Sobel(
            gray_float,
            cv2.CV_32F,
            1,
            0,
            ksize=3,
        )

        gy = cv2.Sobel(
            gray_float,
            cv2.CV_32F,
            0,
            1,
            ksize=3,
        )

        magnitude = cv2.magnitude(
            gx,
            gy,
        )

        magnitude = cv2.resize(
            magnitude,
            (16, 16),
            interpolation=cv2.INTER_AREA,
        )

        max_value = float(
            np.max(magnitude)
        )

        if max_value > 1e-8:

            magnitude = (
                magnitude / max_value
            )

        features.extend(
            magnitude.flatten().tolist()
        )

        # --------------------------------------------------------
        # Intensity histogram
        # --------------------------------------------------------

        histogram = cv2.calcHist(
            [gray],
            [0],
            None,
            [32],
            [0, 256],
        )

        histogram = (
            histogram.flatten()
            .astype(np.float32)
        )

        histogram_sum = float(
            np.sum(histogram)
        )

        if histogram_sum > 0:

            histogram /= histogram_sum

        features.extend(
            histogram.tolist()
        )

        return [
            round(
                float(value),
                8,
            )
            for value in features
            if math.isfinite(
                float(value)
            )
        ]

    # ============================================================
    # BUILD FINAL FEATURE VECTOR
    # ============================================================

    @staticmethod
    def build_feature_vector(
        landmarks: List[List[float]],
        image_path: str | None = None,
    ) -> List[float]:
        """
        Build the complete biometric feature vector.

        Geometry:
            133 features

        Appearance:
            1024 + 256 + 32 = 1312 features

        Total with image:
            1445 features
        """

        if not FeatureExtractor._validate_landmarks(
            landmarks
        ):
            return []

        normalized = (
            FeatureExtractor.normalize_landmarks(
                landmarks
            )
        )

        if not normalized:
            return []

        feature_vector = []

        # --------------------------------------------------------
        # 1. Normalized coordinates
        # 63
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_coordinate_features(
                normalized
            )
        )

        # --------------------------------------------------------
        # 2. Wrist distances
        # 20
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_distance_features(
                normalized
            )
        )

        # --------------------------------------------------------
        # 3. Finger lengths
        # 5
        # --------------------------------------------------------

        finger_lengths = (
            FeatureExtractor.calculate_finger_lengths(
                normalized
            )
        )

        feature_vector.extend(
            [
                finger_lengths["thumb"],
                finger_lengths["index"],
                finger_lengths["middle"],
                finger_lengths["ring"],
                finger_lengths["pinky"],
            ]
        )

        # --------------------------------------------------------
        # 4. Joint angles
        # 10
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_joint_angles(
                normalized
            )
        )

        # --------------------------------------------------------
        # 5. Palm dimensions
        # 2
        # --------------------------------------------------------

        feature_vector.append(
            FeatureExtractor.calculate_palm_width(
                normalized
            )
        )

        feature_vector.append(
            FeatureExtractor.calculate_palm_height(
                normalized
            )
        )

        # --------------------------------------------------------
        # 6. Finger spread
        # 4
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_finger_spread(
                normalized
            )
        )

        # --------------------------------------------------------
        # 7. Fingertip distances
        # 10
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_fingertip_distances(
                normalized
            )
        )

        # --------------------------------------------------------
        # 8. Structural distances
        # 19
        # --------------------------------------------------------

        feature_vector.extend(
            FeatureExtractor.calculate_structural_distances(
                normalized
            )
        )

        # --------------------------------------------------------
        # 9. Palm appearance
        # --------------------------------------------------------

        if image_path:

            appearance_features = (
                FeatureExtractor.calculate_appearance_features(
                    image_path=image_path,
                    landmarks=landmarks,
                )
            )

            feature_vector.extend(
                appearance_features
            )

        # --------------------------------------------------------
        # Final validation
        # --------------------------------------------------------

        if not feature_vector:
            return []

        if not all(
            math.isfinite(
                float(value)
            )
            for value in feature_vector
        ):
            return []

        return [
            round(
                float(value),
                8,
            )
            for value in feature_vector
        ]