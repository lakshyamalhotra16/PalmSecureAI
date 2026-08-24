import "./RecentActivity.css";

import {
    Fingerprint,
    Database,
    CheckCircle2,
    ShieldCheck,
    Activity,
    ArrowUpRight,
} from "lucide-react";

export default function RecentActivity({ dashboard }) {

    const activities =
        dashboard?.recent_activity || [];

    const getActivityConfig = (type) => {

        switch (type) {

            case "authentication":
                return {
                    icon: Fingerprint,
                    label: "Authentication",
                    className: "authentication",
                };

            case "attendance":
                return {
                    icon: Database,
                    label: "Attendance",
                    className: "attendance",
                };

            case "verification":
                return {
                    icon: CheckCircle2,
                    label: "Verification",
                    className: "verification",
                };

            case "system":
                return {
                    icon: Activity,
                    label: "System",
                    className: "system",
                };

            default:
                return {
                    icon: ShieldCheck,
                    label: "Security",
                    className: "security",
                };
        }
    };

    return (
        <section className="recent-activity">

            {/* HEADER */}

            <div className="activity-header">

                <div className="activity-heading">

                    <div className="activity-title-icon">
                        <Activity size={19} />
                    </div>

                    <div>
                        <h2>Recent Activity</h2>

                        <p>
                            Latest system events and security activity
                        </p>
                    </div>

                </div>

                <div className="activity-live">

                    <span className="live-dot"></span>

                    <span>Live</span>

                </div>

            </div>

            {/* ACTIVITY LIST */}

            <div className="activity-list">

                {activities.length === 0 ? (

                    <div className="activity-empty">

                        <div className="empty-icon">
                            <Activity size={23} />
                        </div>

                        <h3>No recent activity</h3>

                        <p>
                            System events will appear here automatically.
                        </p>

                    </div>

                ) : (

                    activities.map((item, index) => {

                        const config =
                            getActivityConfig(item.type);

                        const Icon =
                            config.icon;

                        return (

                            <article
                                className="activity-item"
                                key={`${item.type}-${item.timestamp}-${index}`}
                            >

                                {/* TIMELINE */}

                                <div className="activity-timeline">

                                    <div
                                        className={`activity-icon ${config.className}`}
                                    >
                                        <Icon size={19} />
                                    </div>

                                    {index !== activities.length - 1 && (
                                        <span className="timeline-line"></span>
                                    )}

                                </div>

                                {/* CONTENT */}

                                <div className="activity-content">

                                    <div className="activity-main">

                                        <div>

                                            <div className="activity-meta">

                                                <span
                                                    className={`activity-type ${config.className}`}
                                                >
                                                    {config.label}
                                                </span>

                                                <span className="activity-status">
                                                    <CheckCircle2 size={13} />
                                                    Successful
                                                </span>

                                            </div>

                                            <h3>
                                                {item.title}
                                            </h3>

                                            <p>
                                                {item.description}
                                            </p>

                                        </div>

                                        <div className="activity-arrow">
                                            <ArrowUpRight size={17} />
                                        </div>

                                    </div>

                                    <div className="activity-time">

                                        <span>
                                            {item.timestamp}
                                        </span>

                                    </div>

                                </div>

                            </article>

                        );
                    })

                )}

            </div>

            {/* FOOTER */}

            {activities.length > 0 && (

                <div className="activity-footer">

                    <div>

                        <span className="footer-indicator"></span>

                        <span>
                            System monitoring active
                        </span>

                    </div>

                    <span>
                        {activities.length} recent events
                    </span>

                </div>

            )}

        </section>
    );
}