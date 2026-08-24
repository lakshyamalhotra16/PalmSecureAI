import "./Topbar.css";

import {
    Search,
    Bell,
    Moon,
    UserCircle2,
    Activity,
    ChevronDown,
} from "lucide-react";

export default function Topbar() {
    return (
        <header className="topbar">

            {/* =========================================
                LEFT — SEARCH
            ========================================== */}

            <div className="topbar-left">

                <div className="topbar-search">

                    <Search
                        size={18}
                        strokeWidth={1.8}
                    />

                    <input
                        type="text"
                        placeholder="Search employees, attendance..."
                        aria-label="Search"
                    />

                    <span className="search-shortcut">
                        ⌘ K
                    </span>

                </div>

            </div>


            {/* =========================================
                RIGHT — SYSTEM CONTROLS
            ========================================== */}

            <div className="topbar-right">

                {/* System Status */}

                <div className="system-status">

                    <span className="system-status-indicator">
                        <span />
                    </span>

                    <div className="system-status-text">

                        <strong>
                            System Online
                        </strong>

                        <small>
                            All services operational
                        </small>

                    </div>

                </div>


                {/* Divider */}

                <div className="topbar-divider" />


                {/* Notifications */}

                <button
                    type="button"
                    className="topbar-icon-button"
                    aria-label="Notifications"
                >

                    <Bell
                        size={19}
                        strokeWidth={1.8}
                    />

                    <span className="notification-dot" />

                </button>


                {/* Theme */}

                <button
                    type="button"
                    className="topbar-icon-button"
                    aria-label="Toggle theme"
                >

                    <Moon
                        size={19}
                        strokeWidth={1.8}
                    />

                </button>


                {/* Profile */}

                <button
                    type="button"
                    className="topbar-profile"
                >

                    <div className="profile-avatar">

                        <UserCircle2
                            size={25}
                            strokeWidth={1.6}
                        />

                    </div>


                    <div className="profile-information">

                        <strong>
                            Lakshya
                        </strong>

                        <span>
                            Administrator
                        </span>

                    </div>


                    <ChevronDown
                        className="profile-chevron"
                        size={16}
                    />

                </button>

            </div>

        </header>
    );
}