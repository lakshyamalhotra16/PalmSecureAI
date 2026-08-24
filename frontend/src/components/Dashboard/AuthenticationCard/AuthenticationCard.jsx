import "./AuthenticationCard.css";

import {
    ShieldCheck,
    ScanSearch,
    Cpu,
    Database,
    CheckCircle2,
    Fingerprint,
    ArrowRight,
} from "lucide-react";

export default function AuthenticationCard({
    similarity,
    confidence,
    dashboard,
}) {

    const hasAuthenticationResult =
        similarity !== undefined ||
        confidence !== undefined;

    const similarityPercentage =
        similarity !== undefined &&
        similarity !== null
            ? similarity <= 1
                ? (similarity * 100).toFixed(2)
                : Number(similarity).toFixed(2)
            : "--";

    const confidencePercentage =
        confidence !== undefined &&
        confidence !== null
            ? Number(confidence).toFixed(2)
            : "--";

    const isVerified =
        dashboard?.authenticated === true ||
        hasAuthenticationResult;

    const steps = [
        {
            title: "Palm Detected",
            description: "Biometric input captured",
        },
        {
            title: "Landmarks Extracted",
            description: "Palm geometry analyzed",
        },
        {
            title: "Feature Encoding",
            description: "Identity signature generated",
        },
        {
            title: "Database Match",
            description: "Identity successfully compared",
        },
    ];

    return (
        <section className="authentication-card">

            {/* HEADER */}

            <div className="authentication-top">

                <div className="authentication-title">

                    <div className="authentication-icon">
                        <Fingerprint
                            size={18}
                            strokeWidth={1.8}
                        />
                    </div>

                    <div>
                        <span>BIOMETRIC ENGINE</span>

                        <h2>
                            AI Authentication
                        </h2>
                    </div>

                </div>


                <div className="authentication-status">

                    <span />

                    {isVerified
                        ? "Verified"
                        : "Protected"}

                </div>

            </div>


            {/* VERIFICATION BANNER */}

            <div className="verification-banner">

                <div className="verification-symbol">
                    <ShieldCheck
                        size={23}
                        strokeWidth={1.7}
                    />
                </div>

                <div className="verification-content">

                    <strong>
                        {isVerified
                            ? "Identity Verified"
                            : "Authentication Ready"}
                    </strong>

                    <span>
                        Enterprise biometric verification
                        pipeline is operational
                    </span>

                </div>

                <CheckCircle2
                    className="verification-check"
                    size={18}
                />

            </div>


            {/* PIPELINE */}

            <div className="authentication-pipeline">

                <div className="pipeline-heading">

                    <span>
                        VERIFICATION PIPELINE
                    </span>

                    <small>
                        04 stages
                    </small>

                </div>


                <div className="pipeline-list">

                    {steps.map((step, index) => (

                        <div
                            className="pipeline-step"
                            key={step.title}
                        >

                            <div className="step-number">
                                {String(index + 1).padStart(2, "0")}
                            </div>

                            <div className="step-line" />

                            <div className="step-content">

                                <strong>
                                    {step.title}
                                </strong>

                                <span>
                                    {step.description}
                                </span>

                            </div>

                            <CheckCircle2
                                className="step-check"
                                size={14}
                            />

                        </div>

                    ))}

                </div>

            </div>


            {/* METRICS */}

            <div className="authentication-metrics">

                <div className="auth-metric">

                    <div className="metric-icon blue">
                        <ScanSearch size={15} />
                    </div>

                    <span>
                        SIMILARITY
                    </span>

                    <strong>
                        {similarityPercentage}%
                    </strong>

                </div>


                <div className="auth-metric">

                    <div className="metric-icon purple">
                        <Cpu size={15} />
                    </div>

                    <span>
                        CONFIDENCE
                    </span>

                    <strong>
                        {confidencePercentage}%
                    </strong>

                </div>


                <div className="auth-metric">

                    <div className="metric-icon green">
                        <Database size={15} />
                    </div>

                    <span>
                        DATABASE
                    </span>

                    <strong>
                        Connected
                    </strong>

                </div>

            </div>


            {/* FOOTER */}

            <div className="authentication-footer">

                <div>

                    <span className="footer-dot" />

                    AI engine operational

                </div>

                <ArrowRight size={13} />

            </div>

        </section>
    );
}