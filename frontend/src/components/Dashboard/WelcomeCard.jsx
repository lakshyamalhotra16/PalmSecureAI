import "./WelcomeCard.css";
import { FiCheckCircle } from "react-icons/fi";

export default function WelcomeCard({ user }) {

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="welcome-card">

            <div className="welcome-left">

                <h2>
                    👋 Welcome Back,
                </h2>

                <h1>
                    {user?.full_name ?? "Employee"}
                </h1>

                <p>
                    Palm authenticated successfully.
                </p>

                <span className="today-date">
                    {today}
                </span>

            </div>

            <div className="welcome-right">

                <FiCheckCircle className="success-icon" />

                <h3>
                    Attendance Marked
                </h3>

                <p>
                    Status :
                    <span className="present">
                        Present
                    </span>
                </p>

            </div>

        </div>
    );
}