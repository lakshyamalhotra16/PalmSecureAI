from app.ai.matcher import PalmMatcher

stored = [
    1.0,
    2.0,
    3.0,
]

input_vector = [
    1.05,
    2.02,
    3.01,
]

result = PalmMatcher.authenticate(
    stored,
    input_vector,
)

print("\nAuthentication Result")
print("-" * 30)

print(f"Authenticated : {result.authenticated}")
print(f"Confidence    : {result.confidence:.2f}%")
print(f"Distance      : {result.distance:.4f}")
print(f"Similarity    : {result.similarity:.4f}")