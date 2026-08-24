import "./CameraSection.css";
import Webcam from "react-webcam";
import { Camera } from "lucide-react";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export default function CameraSection({
  webcamRef,
  onCapture,
}) {

  return (
    <section className="camera-card">

      <div className="camera-header">
        <div>
          <h2>Live Camera</h2>
          <span>AI Ready</span>
        </div>
      </div>

      <div className="camera-preview">

        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}

          onUserMedia={() => {
            console.log("✅ Camera Started");
          }}

          onUserMediaError={(err) => {
            console.error("❌ Camera Error:", err);
            alert(err.message);
          }}
        />

      </div>

      <button
        className="capture-btn"
        onClick={onCapture}
      >
        <Camera size={18}/>
        Capture Palm
      </button>

    </section>
  );
}