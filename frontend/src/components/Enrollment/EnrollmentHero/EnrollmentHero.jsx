import "./EnrollmentHero.css";

import {
    UserPlus,
    ShieldCheck,
    Activity,
} from "lucide-react";

export default function EnrollmentHero() {

    return (

        <section className="enrollment-hero">

            <div className="enrollment-left">

                <div className="hero-badge">

                    <ShieldCheck size={18} />

                    AI Powered Enrollment
                </div>

                <h1>

                    Palm Enrollment

                    <span>

                        Enterprise Employee Registration

                    </span>

                </h1>

                <p>

                    Register employees securely using AI-powered
                    palm biometrics with real-time verification,
                    encrypted storage and intelligent identity
                    management.

                </p>

            </div>

            <div className="enrollment-right">

                <div className="status-card">

                    <div className="status-header">

                        <Activity size={18} />

                        Enrollment Service

                    </div>

                    <div className="status-circle">

                        <UserPlus size={70} />

                    </div>

                    <div className="status-info">

                        <div>

                            <span>Status</span>

                            <strong>Ready</strong>

                        </div>

                        <div>

                            <span>AI Model</span>

                            <strong>Online</strong>

                        </div>

                        <div>

                            <span>Encryption</span>

                            <strong>AES-256</strong>

                        </div>

                    </div>

                </div>

            </div>

        </section>

    );

}