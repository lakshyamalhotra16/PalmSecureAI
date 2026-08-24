import "./EmployeeProfile.css";

import {
    User,
    BadgeCheck,
    Building2,
    Fingerprint,
    Clock3,
    ShieldCheck,
} from "lucide-react";

export default function EmployeeProfile({ user }) {

    return (

        <div className="employee-profile card">

            <div className="profile-header">

                <div className="profile-avatar">

                    <User size={42} />

                </div>

                <div>

                    <h2>
                        {user?.full_name ?? "Employee"}
                    </h2>

                    <p>
                        Enterprise Verified User
                    </p>

                </div>

            </div>

            <div className="profile-divider"></div>

            <div className="profile-row">

                <Fingerprint size={18} />

                <span>Employee ID</span>

                <strong>

                    {user?.employee_id ?? "--"}

                </strong>

            </div>

            <div className="profile-row">

                <Building2 size={18} />

                <span>Department</span>

                <strong>

                    {user?.department ?? "--"}

                </strong>

            </div>

            <div className="profile-row">

                <BadgeCheck size={18} />

                <span>Status</span>

                <strong className="status">

                    PRESENT

                </strong>

            </div>

            <div className="profile-row">

                <Clock3 size={18} />

                <span>Login Time</span>

                <strong>

                    {user?.attendance?.time
                        ? user.attendance.time.substring(0,8)
                        : "--"}

                </strong>

            </div>

            <div className="profile-divider"></div>

            <div className="verified-box">

                <ShieldCheck size={22} />

                <div>

                    <h4>

                        AI Verified

                    </h4>

                    <p>

                        Palm successfully matched.

                    </p>

                </div>

            </div>

        </div>

    );

}