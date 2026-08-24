import "./EmployeeCard.css";

import {
    UserRound,
    IdCard,
    Building2,
    BadgeCheck,
    Fingerprint,
    ShieldCheck,
} from "lucide-react";

export default function EmployeeCard({ user, dashboard }) {

    const employee =
        user ||
        dashboard?.employees?.[0] ||
        null;

    const employeeName =
        employee?.full_name ||
        employee?.name ||
        "No Employee";

    const employeeId =
        employee?.employee_id ||
        employee?.employeeId ||
        "N/A";

    const department =
        employee?.department ||
        "N/A";

    const attendanceStatus =
        employee?.attendance?.status ||
        employee?.status ||
        "Absent";

    const isAuthenticated =
        employee?.authenticated === true ||
        Boolean(user);

    return (
        <section className="employee-card">

            <div className="employee-card-top">

                <span className="employee-overline">
                    AUTHENTICATED EMPLOYEE
                </span>

                <div className="employee-secure">
                    <ShieldCheck size={13} />
                    Secure
                </div>

            </div>


            <div className="employee-profile">

                <div className="employee-avatar-wrap">

                    <div className="employee-avatar">
                        <UserRound
                            size={28}
                            strokeWidth={1.7}
                        />
                    </div>

                    <span className="employee-online" />

                </div>


                <div className="employee-identity">

                    <h2>
                        {employeeName}
                    </h2>

                    <span>
                        {isAuthenticated
                            ? "AI Verified Employee"
                            : "Employee Profile"}
                    </span>

                </div>

            </div>


            <div className="employee-divider" />


            <div className="employee-details">

                <div className="employee-detail">

                    <div className="detail-icon">
                        <IdCard size={15} />
                    </div>

                    <div>
                        <span>EMPLOYEE ID</span>
                        <strong>{employeeId}</strong>
                    </div>

                </div>


                <div className="employee-detail">

                    <div className="detail-icon purple">
                        <Building2 size={15} />
                    </div>

                    <div>
                        <span>DEPARTMENT</span>
                        <strong>{department}</strong>
                    </div>

                </div>


                <div className="employee-detail">

                    <div className="detail-icon green">
                        <BadgeCheck size={15} />
                    </div>

                    <div>
                        <span>ATTENDANCE</span>
                        <strong>{attendanceStatus}</strong>
                    </div>

                </div>

            </div>


            <div className="employee-footer">

                <div>
                    <Fingerprint size={14} />
                    Biometric identity protected
                </div>

                <span className="employee-status">
                    {isAuthenticated
                        ? "Verified"
                        : "Pending"}
                </span>

            </div>

        </section>
    );
}