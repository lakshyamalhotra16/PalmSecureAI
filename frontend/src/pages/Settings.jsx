import Navbar from "../components/Layout/Navbar/Navbar";

import "./Settings.css";

export default function Settings() {
    return (
        <>
            <Navbar />

            <main className="settings-page">

                <div className="settings-container">

                    <div className="settings-header">
                        <div>
                            <span className="settings-eyebrow">
                                SYSTEM CONFIGURATION
                            </span>

                            <h1>
                                Settings <span>Control</span>
                            </h1>

                            <p>
                                Manage PalmSecureAI system preferences,
                                security configuration and application behavior.
                            </p>
                        </div>

                        <div className="settings-status">
                            <span className="status-dot"></span>
                            System Operational
                        </div>
                    </div>

                    <section className="settings-grid">

                        <div className="settings-card">

                            <div className="settings-card-header">
                                <div className="settings-icon blue">
                                    ⚙
                                </div>

                                <div>
                                    <h2>General Settings</h2>
                                    <p>
                                        Configure basic application preferences.
                                    </p>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>System Name</strong>
                                    <span>PalmSecureAI</span>
                                </div>

                                <button className="setting-action">
                                    Edit
                                </button>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Environment</strong>
                                    <span>Production</span>
                                </div>

                                <span className="setting-badge blue-badge">
                                    Active
                                </span>
                            </div>

                        </div>

                        <div className="settings-card">

                            <div className="settings-card-header">
                                <div className="settings-icon green">
                                    🛡
                                </div>

                                <div>
                                    <h2>Security</h2>
                                    <p>
                                        Manage biometric security controls.
                                    </p>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Biometric Authentication</strong>
                                    <span>
                                        Palm verification enabled
                                    </span>
                                </div>

                                <span className="toggle active">
                                    <span></span>
                                </span>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Secure Processing</strong>
                                    <span>
                                        Protected biometric processing
                                    </span>
                                </div>

                                <span className="setting-badge green-badge">
                                    Enabled
                                </span>
                            </div>

                        </div>

                        <div className="settings-card">

                            <div className="settings-card-header">
                                <div className="settings-icon purple">
                                    ◉
                                </div>

                                <div>
                                    <h2>Authentication</h2>
                                    <p>
                                        Configure employee verification behavior.
                                    </p>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Recognition Mode</strong>
                                    <span>
                                        AI Palm Recognition
                                    </span>
                                </div>

                                <span className="setting-badge purple-badge">
                                    AI Enabled
                                </span>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Confidence Threshold</strong>
                                    <span>
                                        Automatic verification threshold
                                    </span>
                                </div>

                                <strong className="threshold">
                                    70%
                                </strong>
                            </div>

                        </div>

                        <div className="settings-card">

                            <div className="settings-card-header">
                                <div className="settings-icon cyan">
                                    ◴
                                </div>

                                <div>
                                    <h2>Attendance</h2>
                                    <p>
                                        Configure workforce attendance tracking.
                                    </p>
                                </div>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Attendance Tracking</strong>
                                    <span>
                                        Automatic attendance recording
                                    </span>
                                </div>

                                <span className="toggle active">
                                    <span></span>
                                </span>
                            </div>

                            <div className="setting-row">
                                <div>
                                    <strong>Duplicate Prevention</strong>
                                    <span>
                                        Prevent repeated attendance entries
                                    </span>
                                </div>

                                <span className="setting-badge green-badge">
                                    Active
                                </span>
                            </div>

                        </div>

                    </section>

                    <section className="system-security">

                        <div className="security-icon">
                            ✓
                        </div>

                        <div>
                            <h3>
                                PalmSecureAI System Secure
                            </h3>

                            <p>
                                Biometric data and employee records are
                                protected by the PalmSecureAI security layer.
                            </p>
                        </div>

                        <span className="secure-badge">
                            ● SYSTEM SECURE
                        </span>

                    </section>

                </div>

            </main>
        </>
    );
}