from ai.detection.detector_utils import (
    CameraManager,
    FPSCounter,
    ImageUtils,
    FrameValidator,
)
import cv2

def main():
    camera = CameraManager()
    fps_counter = FPSCounter()

    try:
        while True:
            frame = camera.read()
            if not FrameValidator.is_valid(frame):
                continue
            frame = ImageUtils.flip(frame)
            fps = fps_counter.update()
            ImageUtils.draw_text(
                frame,
                f"FPS: {fps:.2f}",
                (20, 40)
            )
            cv2.imshow("PalmSecureAI - Camera Test", frame)

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    finally:
        camera.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()