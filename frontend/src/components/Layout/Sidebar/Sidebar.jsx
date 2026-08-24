import "./Sidebar.css";

import {
    LayoutDashboard,
    UserPlus,
    Fingerprint,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    ChevronRight,
    Activity,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {

    const navigation = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            label: "Enrollment",
            path: "/enrollment",
            icon: UserPlus,
        },
        {
            label: "Authentication",
            path: "/authentication",
            icon: Fingerprint,
        },
        {
            label: "Employees",
            path: "/employees",
            icon: Users,
        },
        {
            label: "Analytics",
            path: "/analytics",
            icon: BarChart3,
        },
    ];

    return (
        <aside className="sidebar">

            {/* BRAND */}

            <div className="sidebar-brand">

                <div className="brand-mark">
                    <ShieldCheck
                        size={22}
                        strokeWidth={2.3}
                    />
                </div>

                <div className="brand-content">
                    <h1>PalmSecureAI</h1>
                    <span>Enterprise Security</span>
                </div>

            </div>


            {/* SYSTEM STATUS */}

            <div className="sidebar-status">

                <div className="status-icon">
                    <Activity size={15} />
                </div>

                <div className="status-content">

                    <span className="status-label">
                        SYSTEM STATUS
                    </span>

                    <div className="status-value">

                        <span className="status-dot" />

                        All Systems Operational

                    </div>

                </div>

            </div>


            {/* WORKSPACE */}

            <div className="sidebar-section">

                <span className="sidebar-section-title">
                    WORKSPACE
                </span>

                <nav className="sidebar-nav">

                    {navigation.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >

                                <span className="nav-icon">
                                    <Icon
                                        size={17}
                                        strokeWidth={2}
                                    />
                                </span>

                                <span className="nav-label">
                                    {item.label}
                                </span>

                                <ChevronRight
                                    className="nav-arrow"
                                    size={14}
                                />

                            </NavLink>
                        );

                    })}

                </nav>

            </div>


            {/* SYSTEM */}

            <div className="sidebar-section sidebar-settings">

                <span className="sidebar-section-title">
                    SYSTEM
                </span>

                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `sidebar-link ${
                            isActive ? "active" : ""
                        }`
                    }
                >

                    <span className="nav-icon">
                        <Settings
                            size={17}
                            strokeWidth={2}
                        />
                    </span>

                    <span className="nav-label">
                        Settings
                    </span>

                    <ChevronRight
                        className="nav-arrow"
                        size={14}
                    />

                </NavLink>

            </div>


            {/* FOOTER */}

            <div className="sidebar-footer">

                <div className="security-card">

                    <div className="security-icon">
                        <ShieldCheck size={16} />
                    </div>

                    <div className="security-content">

                        <strong>
                            Protected
                        </strong>

                        <span>
                            Biometric security active
                        </span>

                    </div>

                    <span className="security-dot" />

                </div>


                <button
                    type="button"
                    className="logout-button"
                >

                    <LogOut size={16} />

                    <span>
                        Sign Out
                    </span>

                </button>


                <div className="sidebar-version">

                    <span>
                        PalmSecureAI
                    </span>

                    <span>
                        v1.0.0
                    </span>

                </div>

            </div>

        </aside>
    );
}