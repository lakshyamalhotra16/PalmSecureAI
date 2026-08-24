import "./Navbar.css";

import { NavLink, useLocation } from "react-router-dom";

import {
    ShieldCheck,
    Bell,
    Moon,
    Sun,
    Monitor,
    UserCircle2,
    Activity,
    Menu,
    X,
} from "lucide-react";

import { useState } from "react";
import useTheme from "../../../hooks/useTheme";

export default function Navbar() {

    const { theme, toggleTheme } = useTheme();

    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);

    const dashboardRoutes = [
        "/dashboard",
        "/analytics",
        "/employees",
        "/settings",
    ];

    if (dashboardRoutes.includes(location.pathname)) {

        return null;

    }

    const getThemeIcon = () => {

        if (theme === "dark") return <Moon size={18} />;

        if (theme === "light") return <Sun size={18} />;

        return <Monitor size={18} />;

    };

    const getThemeText = () => {

        if (theme === "dark") return "Dark";

        if (theme === "light") return "Light";

        return "Professional";

    };

    return (

        <header className="navbar">

            <div className="navbar-container">

                <NavLink
                    to="/"
                    className="navbar-logo"
                >

                    <div className="logo-icon">

                        <ShieldCheck size={30} />

                    </div>

                    <div className="logo-content">

                        <h2>

                            PalmSecureAI

                        </h2>

                        <span>

                            Enterprise Biometric Security

                        </span>

                    </div>

                </NavLink>

                <nav
                    className={
                        menuOpen
                            ? "navbar-links active"
                            : "navbar-links"
                    }
                >

                    <NavLink
                        to="/"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/enrollment"
                        onClick={() => setMenuOpen(false)}
                    >
                        Enrollment
                    </NavLink>

                    <NavLink
                        to="/authentication"
                        onClick={() => setMenuOpen(false)}
                    >
                        Authentication
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                    >
                        Dashboard
                    </NavLink>

                </nav>

                <div className="navbar-right">

                    <div className="status-pill">

                        <Activity size={14} />

                        <span>

                            System Online

                        </span>

                    </div>

                    <button className="nav-icon">

                        <Bell size={19} />

                    </button>

                    <button
                        className="theme-btn"
                        onClick={toggleTheme}
                    >

                        {getThemeIcon()}

                        <span>

                            {getThemeText()}

                        </span>

                    </button>

                    <div className="profile-card">

                        <UserCircle2 size={40} />

                        <div>

                            <h4>

                                Lakshya

                            </h4>

                            <span>

                                Administrator

                            </span>

                        </div>

                    </div>

                    <button
                        className="mobile-menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >

                        {

                            menuOpen

                                ?

                                <X size={24} />

                                :

                                <Menu size={24} />

                        }

                    </button>

                </div>

            </div>

        </header>

    );

}