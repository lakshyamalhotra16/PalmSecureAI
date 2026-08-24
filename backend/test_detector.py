from app.ai.detector import PalmDetector
from app.ai.feature_extractor import FeatureExtractor

detector = PalmDetector()

results = detector.detect("storage/test_images/palm.jpg")

if not results.multi_hand_landmarks:
    print("❌ No hand detected.")
    exit()

print("✅ Hand Detected!")

landmarks = FeatureExtractor.extract_landmarks(results)

print(f"Total landmarks: {len(landmarks)}")

print("\nFirst Landmark:")
print(landmarks[0])

print("\nLast Landmark:")
print(landmarks[-1])

normalized = FeatureExtractor.normalize_landmarks(landmarks)

print("\nNormalized Wrist:")
print(normalized[0])

print("\nNormalized Middle MCP:")
print(normalized[9])

print("\nNormalized Pinky Tip:")
print(normalized[20])

distance_features = FeatureExtractor.calculate_distance_features(
    normalized
)

print("\nDistance Features")

print(distance_features)

print(f"\nTotal Distance Features: {len(distance_features)}")

finger_lengths = FeatureExtractor.calculate_finger_lengths(normalized)

print("\nFinger Lengths")

for finger, length in finger_lengths.items():
    print(f"{finger:7}: {length:.4f}")

angles = FeatureExtractor.calculate_joint_angles(normalized)

print("\nJoint Angles")

for i, angle in enumerate(angles, start=1):
    print(f"Angle {i:02}: {angle:.2f}°")

print(f"\nTotal Angles: {len(angles)}")

palm_width = FeatureExtractor.calculate_palm_width(normalized)
palm_height = FeatureExtractor.calculate_palm_height(normalized)
finger_spread = FeatureExtractor.calculate_finger_spread(normalized)
tip_distances = FeatureExtractor.calculate_fingertip_distances(normalized)

print("\nPalm Geometry")
print(f"Palm Width  : {palm_width:.4f}")
print(f"Palm Height : {palm_height:.4f}")

print("\nFinger Spread")
for i, value in enumerate(finger_spread, start=1):
    print(f"Spread {i}: {value:.4f}")

print("\nFingertip Distances")
for i, value in enumerate(tip_distances, start=1):
    print(f"Tip Distance {i:02}: {value:.4f}")

feature_vector = FeatureExtractor.build_feature_vector(landmarks)

print("\n" + "=" * 60)
print("PALMSECUREAI BIOMETRIC FEATURE VECTOR")
print("=" * 60)

print(f"\nTotal Features : {len(feature_vector)}")

print("\nFirst 10 Features:")
for i, value in enumerate(feature_vector[:10], start=1):
    print(f"{i:02}: {value:.6f}")

print("\nLast 10 Features:")
for i, value in enumerate(feature_vector[-10:], start=len(feature_vector)-9):
    print(f"{i:02}: {value:.6f}")