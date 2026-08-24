import "./SystemOverview.css";

import {
    Activity,
    ArrowUpRight,
    CalendarCheck2,
    CheckCircle2,
    Database,
    ShieldCheck,
    Users,
} from "lucide-react";

export default function SystemOverview({ dashboard }) {
    const stats = dashboard?.stats ?? {};

    const recognitionValue =
        stats.recognition_accuracy !== undefined &&
        stats.recognition_accuracy !== null
            ? `${stats.recognition_accuracy}%`
            : "--";

    const employeeValue =
        stats.total_employees !== undefined &&
        stats.total_employees !== null
            ? stats.total_employees
            : "--";

    const attendanceValue =
        stats.attendance_percentage !== undefined &&
        stats.attendance_percentage !== null
            ? `${stats.attendance_percentage}%`
            : "--";

    const services = [
        {
            id: "recognition",
            label: "Recognition Accuracy",
            value: recognitionValue,
            description: "Palm verification performance",
            status: "Live",
            icon: Activity,
            theme: "blue",
            footer: "AI verification active",
        },
        {
            id: "employees",
            label: "Total Employees",
            value: employeeValue,
            description: "Enrolled biometric identities",
            status: "Registered",
            icon: Users,
            theme: "purple",
            footer: "Active employee database",
        },
        {
            id: "attendance",
            label: "Today's Attendance",
            value: attendanceValue,
            description: "Employees authenticated today",
            status: "Today",
            icon: CalendarCheck2,
            theme: "green",
            footer: "Attendance monitoring active",
        },
    ];

    return (
        <section
            className="system-overview"
            aria-labelledby="system-overview-title"
        >

            {/* =====================================================
                HEADER
            ====================================================== */}

            <header className="system-overview-header">

                <div className="system-heading">

                    <div
                        className="system-heading-icon"
                        aria-hidden="true"
                    >
                        <Activity
                            size={17}
                            strokeWidth={1.9}
                        />
                    </div>

                    <div>

                        <span>
                            SYSTEM MONITORING
                        </span>

                        <h2 id="system-overview-title">
                            System Overview
                        </h2>

                    </div>

                </div>


                <div
                    className="system-live-badge"
                    aria-label="All systems operational"
                >

                    <span aria-hidden="true" />

                    <strong>
                        All Systems Operational
                    </strong>

                </div>

            </header>


            {/* =====================================================
                SERVICE METRICS
            ====================================================== */}

            <div className="system-services">

                {services.map((service) => {

                    const Icon = service.icon;

                    return (
                        <article
                            className="system-service-card"
                            key={service.id}
                        >

                            {/* SERVICE TOP */}

                            <div className="service-top">

                                <div
                                    className={`service-icon ${service.theme}`}
                                    aria-hidden="true"
                                >
                                    <Icon
                                        size={16}
                                        strokeWidth={1.9}
                                    />
                                </div>


                                <div className="service-status">

                                    <span aria-hidden="true" />

                                    <span>
                                        {service.status}
                                    </span>

                                </div>

                            </div>


                            {/* SERVICE CONTENT */}

                            <div className="service-content">

                                <span className="service-label">
                                    {service.label}
                                </span>

                                <strong>
                                    {service.value}
                                </strong>

                                <span className="service-description">
                                    {service.description}
                                </span>

                            </div>


                            {/* SERVICE FOOTER */}

                            <div className="service-footer">

                                <span>

                                    <CheckCircle2
                                        size={10}
                                        strokeWidth={2}
                                    />

                                    {service.footer}

                                </span>

                                <ArrowUpRight
                                    size={11}
                                    strokeWidth={1.8}
                                    aria-hidden="true"
                                />

                            </div>

                        </article>
                    );
                })}

            </div>


            {/* =====================================================
                SECURITY STATUS BAR
            ====================================================== */}

            <footer className="system-overview-footer">

                {/* SECURITY */}

                <div className="system-footer-item">

                    <div
                        className="footer-icon green"
                        aria-hidden="true"
                    >
                        <ShieldCheck
                            size={14}
                            strokeWidth={1.9}
                        />
                    </div>

                    <div>

                        <span>
                            SECURITY
                        </span>

                        <strong>
                            Protected
                        </strong>

                    </div>

                </div>


                <div
                    className="system-footer-divider"
                    aria-hidden="true"
                />


                {/* SYSTEM */}

                <div className="system-footer-item">

                    <div
                        className="footer-icon"
                        aria-hidden="true"
                    >
                        <Activity
                            size={14}
                            strokeWidth={1.9}
                        />
                    </div>

                    <div>

                        <span>
                            SYSTEM
                        </span>

                        <strong>
                            Biometric protection active
                        </strong>

                    </div>

                </div>


                <div
                    className="system-footer-divider"
                    aria-hidden="true"
                />


                {/* DATABASE */}

                <div className="system-footer-item">

                    <div
                        className="footer-icon blue"
                        aria-hidden="true"
                    >
                        <Database
                            size={14}
                            strokeWidth={1.9}
                        />
                    </div>

                    <div>

                        <span>
                            DATABASE
                        </span>

                        <strong>
                            Connected
                        </strong>

                    </div>

                </div>

            </footer>

        </section>
    );
}