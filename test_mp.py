import mediapipe as mp

print("Version:", getattr(mp, "__version__", "No version"))
print("Loaded from:", mp.__file__)
print("Available attributes:")
print(dir(mp))