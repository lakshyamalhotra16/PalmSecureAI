import "./Scanner.css";
import PalmIcon from "./PalmIcon";
import { BsShieldCheck } from "react-icons/bs";

export default function Scanner() {
  return (
    <div className="scanner-card">

      <div className="scanner-header">
        <span className="scanner-dot"></span>
        <h3>AI Biometric Scanner</h3>
      </div>

      <div className="scanner-body">

        <div className="scanner-ring">

    <div className="scanner-ring-1"></div>
    <div className="scanner-ring-2"></div>

    <div className="scanner-ring-inner">
        <PalmIcon />
    </div>

</div>

        <div className="scanner-progress">
          <div className="progress-fill"></div>
        </div>

        <div className="scanner-status">
          <BsShieldCheck />
          <span>AI Verification Active</span>
        </div>

      </div>

      <div className="scanner-metrics">

        <div className="metric">
          <span>Accuracy</span>
          <strong>99.97%</strong>
        </div>

        <div className="metric">
          <span>Encryption</span>
          <strong>AES-256</strong>
        </div>

        <div className="metric">
          <span>Response</span>
          <strong>0.82 sec</strong>
        </div>

      </div>

    </div>
  );
}