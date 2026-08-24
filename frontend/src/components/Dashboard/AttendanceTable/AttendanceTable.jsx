import "./AttendanceTable.css";

import {
    CalendarDays,
    Clock3,
    UserRound,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ArrowUpRight,
    ClipboardCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function AttendanceTable({ dashboard }) {

    const navigate = useNavigate();

    const rows =
        dashboard?.attendance_history || [];


    const formatDate = (date) => {

        if (!date) {
            return "--";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    const formatLoginTime = (login) => {

        if (!login) {
            return "--";
        }

        const parts = login.split(":");

        if (parts.length < 2) {
            return login;
        }

        const hours = Number(parts[0]);
        const minutes = parts[1];

        if (Number.isNaN(hours)) {
            return login;
        }

        const period =
            hours >= 12
                ? "PM"
                : "AM";

        const displayHour =
            hours % 12 || 12;

        return `${String(displayHour).padStart(2, "0")}:${minutes} ${period}`;
    };


    const getInitials = (name) => {

        if (!name) {
            return "?";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(
                (part) =>
                    part
                        .charAt(0)
                        .toUpperCase()
            )
            .join("");
    };


    const getStatusConfig = (status) => {

        const normalized =
            status
                ?.toLowerCase()
                .trim();


        if (
            normalized === "present" ||
            normalized === "on time" ||
            normalized === "verified"
        ) {

            return {
                label: status,
                className: "present",
                icon: CheckCircle2,
            };
        }


        if (
            normalized === "late"
        ) {

            return {
                label: status,
                className: "late",
                icon: AlertCircle,
            };
        }


        if (
            normalized === "absent"
        ) {

            return {
                label: status,
                className: "absent",
                icon: XCircle,
            };
        }


        return {
            label: status || "Unknown",
            className: "unknown",
            icon: AlertCircle,
        };
    };


    const handleViewRecord = (row) => {

        navigate("/attendance", {
            state: {
                attendanceRecord: row,
            },
        });
    };


    return (

        <section className="attendance-table">


            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="attendance-table-header">

                <div className="attendance-heading">

                    <div className="attendance-heading-icon">

                        <ClipboardCheck size={20} />

                    </div>


                    <div>

                        <h2>
                            Attendance History
                        </h2>

                        <p>
                            Recent employee attendance records
                        </p>

                    </div>

                </div>


                <div className="attendance-summary">

                    <span className="summary-dot"></span>

                    <span>
                        {rows.length} Records
                    </span>

                </div>

            </div>


            {/* =====================================================
                TABLE
            ====================================================== */}

            {rows.length === 0 ? (

                <div className="attendance-empty">

                    <div className="attendance-empty-icon">

                        <CalendarDays size={25} />

                    </div>


                    <h3>
                        No attendance records
                    </h3>


                    <p>
                        Attendance activity will appear here
                        once employees are authenticated.
                    </p>

                </div>

            ) : (

                <div className="attendance-table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Employee
                                </th>

                                <th>
                                    Employee ID
                                </th>

                                <th>
                                    Date
                                </th>

                                <th>
                                    Login Time
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Activity
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {rows.map(
                                (row, index) => {

                                    const status =
                                        getStatusConfig(
                                            row.status
                                        );

                                    const StatusIcon =
                                        status.icon;


                                    return (

                                        <tr
                                            key={
                                                `${row.employee_id}-${row.date}-${row.login}-${index}`
                                            }
                                        >


                                            {/* EMPLOYEE */}

                                            <td>

                                                <div className="attendance-employee">

                                                    <div className="attendance-avatar">

                                                        {getInitials(
                                                            row.employee
                                                        )}

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {row.employee || "--"}
                                                        </strong>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* EMPLOYEE ID */}

                                            <td>

                                                <div className="employee-id-cell">

                                                    <UserRound size={14} />

                                                    <span>
                                                        {row.employee_id || "--"}
                                                    </span>

                                                </div>

                                            </td>


                                            {/* DATE */}

                                            <td>

                                                <div className="date-cell">

                                                    <CalendarDays size={15} />

                                                    <span>

                                                        {formatDate(
                                                            row.date
                                                        )}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* LOGIN */}

                                            <td>

                                                <div className="login-cell">

                                                    <Clock3 size={15} />

                                                    <span>

                                                        {formatLoginTime(
                                                            row.login
                                                        )}

                                                    </span>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`attendance-status ${status.className}`}
                                                >

                                                    <StatusIcon size={14} />

                                                    {status.label}

                                                </span>

                                            </td>


                                            {/* ACTIVITY */}

                                            <td>

                                                <div className="activity-cell">

                                                    <button
                                                        type="button"
                                                        className="attendance-view-button"
                                                        onClick={() =>
                                                            handleViewRecord(row)
                                                        }
                                                        title={`View attendance record for ${row.employee || "employee"}`}
                                                        aria-label={`View attendance record for ${row.employee || "employee"}`}
                                                    >

                                                        <span>
                                                            View Record
                                                        </span>

                                                        <ArrowUpRight
                                                            size={15}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =====================================================
                FOOTER
            ====================================================== */}

            {rows.length > 0 && (

                <div className="attendance-table-footer">

                    <div>

                        <span className="footer-live-dot"></span>

                        <span>
                            Attendance monitoring active
                        </span>

                    </div>

                    <span>
                        Showing latest records
                    </span>

                </div>

            )}

        </section>
    );
}