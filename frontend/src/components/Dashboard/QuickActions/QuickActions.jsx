import "./QuickActions.css";

import {
    Users,
    ClipboardList,
    Fingerprint,
    BarChart3,
    ArrowUpRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function QuickActions() {

    const navigate = useNavigate();

    const actions = [
        {
            title: "Employees",
            description: "Manage employee profiles",
            icon: Users,
            path: "/employees",
        },
        {
            title: "Attendance",
            description: "Monitor attendance records",
            icon: ClipboardList,
            path: "/attendance",
        },
        {
            title: "Authentication",
            description: "Run biometric verification",
            icon: Fingerprint,
            path: "/authentication",
        },
        {
            title: "Analytics",
            description: "View system insights",
            icon: BarChart3,
            path: "/analytics",
        },
    ];

    return (
        <section className="quick-actions">

            <div className="quick-actions-header">

                <div>
                    <div className="quick-actions-eyebrow">
                        CONTROL CENTER
                    </div>

                    <h2>
                        Quick Actions
                    </h2>

                    <p>
                        Access frequently used system modules
                    </p>
                </div>

                <div className="quick-actions-status">
                    <span className="status-indicator" />
                    System Ready
                </div>

            </div>

            <div className="actions-grid">

                {actions.map((item) => {

                    const Icon = item.icon;

                    return (
                        <button
                            key={item.title}
                            className="action-card"
                            type="button"
                            onClick={() => navigate(item.path)}
                        >

                            <div className="action-card-top">

                                <div className="action-icon">
                                    <Icon size={23} />
                                </div>

                                <div className="action-arrow">
                                    <ArrowUpRight size={18} />
                                </div>

                            </div>

                            <div className="action-content">

                                <h3>
                                    {item.title}
                                </h3>

                                <p>
                                    {item.description}
                                </p>

                            </div>

                            <div className="action-line">
                                <span />
                            </div>

                        </button>
                    );

                })}

            </div>

        </section>
    );
}