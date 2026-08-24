import "./Hero.css";

import {
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Cpu,
    Lock,
    Users,
    CalendarCheck2,
    Activity,
    ScanFace,
    BarChart3,
    Play,
    Sparkles,
    ScanLine,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

function HolographicHand({ variant = "blue", className = "" }) {
    const isGreen = variant === "green";

    return (
        <div
            className={`holo-hand ${isGreen ? "holo-hand-green" : "holo-hand-blue"} ${className}`}
            aria-hidden="true"
        >
            <img
                className="holo-hand-image"
                src="/holographic-hand-clean.png"
                alt=""
                draggable="false"
            />
        </div>
    );
}

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="hero">

            <div className="hero-container">

                {/* =====================================================
                    LEFT CONTENT
                ===================================================== */}

                <div className="hero-left">

                    <div className="hero-badge">
                        <Sparkles size={16} />
                        AI POWERED PALM AUTHENTICATION
                    </div>

                    <h1>
                        Secure Employee
                        <br />
                        Authentication

                        <span>
                            Using AI Powered
                            <br />
                            Palm Biometrics
                        </span>
                    </h1>

                    <p>
                        PalmSecureAI delivers enterprise-grade biometric
                        authentication powered by Artificial Intelligence
                        with real-time palm analysis, secure attendance
                        management and instant employee verification.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-btn"
                            onClick={() => navigate("/enrollment")}
                        >
                            Get Started
                            <ArrowRight size={18} />
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() => navigate("/authentication")}
                        >
                            <Play size={16} />
                            Live Demo
                        </button>

                    </div>

                </div>


                {/* =====================================================
                    CENTER LIVE SCANNER
                ===================================================== */}

                <div className="hero-live-card">

                    <div className="live-card-header">

                        <div className="live-title">
                            <span className="live-dot"></span>
                            LIVE SCAN
                        </div>

                        <ScanLine size={18} />

                    </div>


                    <div className="scan-frame">

                        <div className="corner corner-tl"></div>
                        <div className="corner corner-tr"></div>
                        <div className="corner corner-bl"></div>
                        <div className="corner corner-br"></div>


                        <div className="scan-particles">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="hand-scanner">
                            <HolographicHand variant="blue" />
                            <div className="holo-scan-beam"></div>
                        </div>

                        <div className="biometric-label biometric-depth">
                            <span>DEPTH</span><strong>2.45mm</strong>
                        </div>
                        <div className="biometric-label biometric-pattern">
                            <span>PATTERN</span><strong>VERIFIED</strong>
                        </div>
                        <div className="biometric-label biometric-lines">
                            <span>LINES</span><strong>1289</strong>
                        </div>
                        <div className="biometric-label biometric-match">
                            <span>MATCH</span><strong>99.97%</strong>
                        </div>

                        <div className="scan-platform">

                            <div className="platform-ring ring-a"></div>
                            <div className="platform-ring ring-b"></div>
                            <div className="platform-ring ring-c"></div>

                            <div className="platform-core"></div>

                        </div>

                    </div>


                    <div className="scan-progress">

                        <div className="progress-track">
                            <span></span>
                        </div>

                        <div className="progress-label">
                            <strong>Scanning Palm...</strong>

                            <small>
                                AI PROCESSING
                            </small>
                        </div>

                    </div>

                </div>


                {/* =====================================================
                    RIGHT SECURITY CARD
                ===================================================== */}

                <div className="scanner-card">

                    <div className="scanner-card-header">

                        <div className="scanner-active">

                            <CheckCircle2 size={17} />

                            <span>
                                AI Scanner Active
                            </span>

                        </div>

                        <div className="live-pill">
                            <span></span>
                            Live
                        </div>

                    </div>


                    <div className="security-visual">

                        <div className="security-ring ring-outer"></div>
                        <div className="security-ring ring-middle"></div>
                        <div className="security-ring ring-inner"></div>

                        <div className="security-core">
                            <HolographicHand variant="green" />
                        </div>

                    </div>


                    <div className="system-status">

                        <CheckCircle2 size={15} />

                        System Running Smoothly

                    </div>


                    <div className="scanner-items">

                        <div className="scanner-item">

                            <div className="scanner-item-icon blue">
                                <Cpu size={18} />
                            </div>

                            <span>
                                AI Detection
                            </span>

                            <strong>
                                Online
                            </strong>

                        </div>


                        <div className="scanner-item">

                            <div className="scanner-item-icon green">
                                <Lock size={18} />
                            </div>

                            <span>
                                Encryption
                            </span>

                            <strong>
                                AES-256
                            </strong>

                        </div>


                        <div className="scanner-item">

                            <div className="scanner-item-icon green">
                                <ShieldCheck size={18} />
                            </div>

                            <span>
                                Confidence
                            </span>

                            <strong>
                                99.97%
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================================================
                STATISTICS
            ========================================================= */}

            <div className="hero-stats">

                <div className="hero-stat">

                    <div className="stat-icon blue">
                        <Activity size={19} />
                    </div>

                    <div>
                        <strong>99.97%</strong>
                        <span>Recognition Accuracy</span>
                    </div>

                </div>


                <div className="hero-stat">

                    <div className="stat-icon green">
                        <Activity size={19} />
                    </div>

                    <div>
                        <strong>0.8 sec</strong>
                        <span>Authentication Speed</span>
                    </div>

                </div>


                <div className="hero-stat">

                    <div className="stat-icon green">
                        <ShieldCheck size={19} />
                    </div>

                    <div>
                        <strong>AES-256</strong>
                        <span>Data Encryption</span>
                    </div>

                </div>


                <div className="hero-stat">

                    <div className="stat-icon purple">
                        <Users size={19} />
                    </div>

                    <div>
                        <strong>8</strong>
                        <span>Enrolled Employees</span>
                    </div>

                </div>


                <div className="hero-stat">

                    <div className="stat-icon yellow">
                        <CalendarCheck2 size={19} />
                    </div>

                    <div>
                        <strong>25%</strong>
                        <span>Today's Attendance</span>
                    </div>

                </div>


                <div className="hero-stat">

                    <div className="stat-icon blue">
                        <Activity size={19} />
                    </div>

                    <div>
                        <strong>Live</strong>
                        <span>System Status</span>
                    </div>

                </div>

            </div>


            {/* =========================================================
                FEATURE CARDS
            ========================================================= */}

            <div className="hero-features">

                <div
                    className="feature-card feature-blue"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/authentication")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate("/authentication");
                        }
                    }}
                >

                    <div className="feature-icon">
                        <ScanFace size={25} />
                    </div>

                    <div className="feature-content">

                        <h3>
                            AI Palm Detection
                        </h3>

                        <p>
                            Advanced AI model for precise palm
                            detection and analysis.
                        </p>

                    </div>

                    <ArrowRight className="feature-arrow" size={21} />

                </div>


                <div
                    className="feature-card feature-green"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/authentication")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate("/authentication");
                        }
                    }}
                >

                    <div className="feature-icon">
                        <ShieldCheck size={25} />
                    </div>

                    <div className="feature-content">

                        <h3>
                            Secure Authentication
                        </h3>

                        <p>
                            Multi-layer security with AES-256
                            encryption and real-time verification.
                        </p>

                    </div>

                    <ArrowRight className="feature-arrow" size={21} />

                </div>


                <div
                    className="feature-card feature-purple"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/dashboard")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate("/dashboard");
                        }
                    }}
                >

                    <div className="feature-icon">
                        <Users size={25} />
                    </div>

                    <div className="feature-content">

                        <h3>
                            Attendance Management
                        </h3>

                        <p>
                            Automated attendance tracking with
                            real-time analytics and reports.
                        </p>

                    </div>

                    <ArrowRight className="feature-arrow" size={21} />

                </div>


                <div
                    className="feature-card feature-yellow"
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate("/dashboard")}
                    onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            navigate("/dashboard");
                        }
                    }}
                >

                    <div className="feature-icon">
                        <BarChart3 size={25} />
                    </div>

                    <div className="feature-content">

                        <h3>
                            Smart Analytics
                        </h3>

                        <p>
                            Comprehensive insights with detailed
                            analytics and performance metrics.
                        </p>

                    </div>

                    <ArrowRight className="feature-arrow" size={21} />

                </div>

            </div>


            {/* =========================================================
                FOOTER STATUS
            ========================================================= */}

            <div className="hero-footer">

                <div>
                    <span className="footer-dot"></span>
                    PalmSecureAI services operational
                </div>

                <span>
                    Secure Workforce Intelligence
                </span>

            </div>

        </section>
    );
}