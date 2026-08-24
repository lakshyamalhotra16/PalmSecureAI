import "./AuthenticationStatus.css";

import {
    Fingerprint,
    ScanSearch,
    Database,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

export default function AuthenticationStatus({
    confidence,
    similarity,
}) {

    return (

        <div className="authentication-card card">

            <div className="authentication-header">

                <ShieldCheck size={28} />

                <div>

                    <h2>AI Authentication</h2>

                    <p>
                        Palm biometric verification completed
                    </p>

                </div>

            </div>

            <div className="authentication-divider"></div>

            <div className="authentication-step success">

                <Fingerprint size={18} />

                <span>Palm Detected</span>

                <CheckCircle2 size={18} />

            </div>

            <div className="authentication-step success">

                <ScanSearch size={18} />

                <span>Landmarks Extracted</span>

                <CheckCircle2 size={18} />

            </div>

            <div className="authentication-step success">

                <Database size={18} />

                <span>Database Match Found</span>

                <CheckCircle2 size={18} />

            </div>

            <div className="authentication-divider"></div>

            <div className="metric-row">

                <span>Confidence</span>

                <strong>

                    {confidence
                        ? `${confidence.toFixed(2)}%`
                        : "--"}

                </strong>

            </div>

            <div className="metric-row">

                <span>Similarity</span>

                <strong>

                    {similarity
                        ? `${similarity.toFixed(2)}%`
                        : "--"}

                </strong>

            </div>

        </div>

    );

}