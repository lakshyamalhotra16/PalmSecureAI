import "./Hero.css";

import {
    ShieldCheck,
    CalendarDays,
    Activity,
    Users,
    Fingerprint,
    ArrowUpRight,
} from "lucide-react";

export default function Hero({ user, dashboard }) {

    const hour = new Date().getHours();

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 17
                ? "Good Afternoon"
                : "Good Evening";

    const stats = dashboard?.stats;

    const employeeName =
        user?.full_name ||
        user?.name ||
        "Administrator";

    const recognitionAccuracy =
        stats?.recognition_accuracy !== undefined
            ? `${stats.recognition_accuracy}%`
            : "--";

    const totalEmployees =
        stats?.total_employees !== undefined
            ? stats.total_employees
            : "--";

    const attendancePercentage =
        stats?.attendance_percentage !== undefined
            ? `${stats.attendance_percentage}%`
            : "--";

    const currentDate =
        new Date().toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    const isVerified =
        user?.authenticated === true;

    return (
        <section className="hero-section">

            {/* Decorative background */}

            <div className="hero-orb hero-orb-one" />
            <div className="hero-orb hero-orb-two" />
            <div className="hero-grid" />


            {/* =========================================
                MAIN HERO
            ========================================== */}

            <div className="hero-main">

                <div className="hero-copy">

                    {/* Status badge */}

                    <div className="hero-status">

                        <span className="hero-status-dot" />

                        <ShieldCheck size={14} />

                        <span>
                            AI SECURITY PLATFORM
                        </span>

                    </div>


                    {/* Heading */}

                    <h1>

                        {greeting},

                        <span>
                            {" "}
                            {employeeName}
                        </span>

                    </h1>


                    <p className="hero-description">
                        Your biometric security infrastructure
                        is actively monitoring authentication,
                        employee access and attendance.
                    </p>


                    {/* Information row */}

                    <div className="hero-meta">

                        <div className="hero-meta-item">

                            <span className="hero-meta-icon">
                                <CalendarDays size={15} />
                            </span>

                            <div>
                                <small>DATE</small>
                                <strong>
                                    {currentDate}
                                </strong>
                            </div>

                        </div>


                        <div className="hero-meta-divider" />


                        <div className="hero-meta-item">

                            <span className="hero-meta-icon green">
                                <Activity size={15} />
                            </span>

                            <div>
                                <small>MONITORING</small>
                                <strong>
                                    Live & Active
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================
                    SECURITY STATUS
                ====================================== */}

                <div className="hero-security">

                    <div className="security-ring">

                        <div className="security-ring-inner">

                            <ShieldCheck
                                size={42}
                                strokeWidth={1.6}
                            />

                        </div>

                    </div>


                    <div className="security-status">

                        <span>
                            SECURITY STATUS
                        </span>

                        <strong>
                            {isVerified
                                ? "Identity Verified"
                                : "System Protected"}
                        </strong>

                        <small>
                            Biometric engine operational
                        </small>

                    </div>

                </div>

            </div>


            {/* =========================================
                STATISTICS
            ========================================== */}

            <div className="hero-stat-grid">

                {/* Recognition */}

                <div className="hero-stat-card">

                    <div className="hero-stat-top">

                        <div className="hero-stat-icon blue">
                            <Fingerprint size={18} />
                        </div>

                        <span className="hero-stat-label">
                            ACCURACY
                        </span>

                        <ArrowUpRight
                            size={15}
                            className="hero-stat-arrow"
                        />

                    </div>

                    <strong>
                        {recognitionAccuracy}
                    </strong>

                    <span>
                        Recognition accuracy
                    </span>

                    <div className="stat-progress">
                        <span
                            style={{
                                width:
                                    recognitionAccuracy === "--"
                                        ? "0%"
                                        : recognitionAccuracy,
                            }}
                        />
                    </div>

                </div>


                {/* Employees */}

                <div className="hero-stat-card">

                    <div className="hero-stat-top">

                        <div className="hero-stat-icon purple">
                            <Users size={18} />
                        </div>

                        <span className="hero-stat-label">
                            WORKFORCE
                        </span>

                        <ArrowUpRight
                            size={15}
                            className="hero-stat-arrow"
                        />

                    </div>

                    <strong>
                        {totalEmployees}
                    </strong>

                    <span>
                        Registered employees
                    </span>

                    <div className="stat-mini-line">
                        <span />
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>

                </div>


                {/* Attendance */}

                <div className="hero-stat-card">

                    <div className="hero-stat-top">

                        <div className="hero-stat-icon green">
                            <Activity size={18} />
                        </div>

                        <span className="hero-stat-label">
                            ATTENDANCE
                        </span>

                        <ArrowUpRight
                            size={15}
                            className="hero-stat-arrow"
                        />

                    </div>

                    <strong>
                        {attendancePercentage}
                    </strong>

                    <span>
                        Overall attendance
                    </span>

                    <div className="stat-progress green-progress">
                        <span
                            style={{
                                width:
                                    attendancePercentage === "--"
                                        ? "0%"
                                        : attendancePercentage,
                            }}
                        />
                    </div>

                </div>

            </div>

        </section>
    );
}