import "./Header.css";
import { FiShield, FiWifi } from "react-icons/fi";

export default function Header() {
    return (
        <header className="dashboard-header">

            <div className="header-left">
                <FiShield className="header-logo" />

                <div>
                    <h1>PalmSecureAI</h1>
                    <p>Enterprise Biometric Attendance System</p>
                </div>
            </div>

            <div className="header-right">

                <span className="status-dot"></span>

                <FiWifi />

                <span>System Online</span>

            </div>

        </header>
    );
}