import { useEffect, useMemo, useState } from "react";

import {
    Activity,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Download,
    Fingerprint,
    RefreshCw,
    Search,
    ShieldCheck,
    Users,
    X,
    XCircle,
} from "lucide-react";

import DashboardLayout from "../components/Layout/DashboardLayout";
import { getDashboard } from "../services/dashboardApi";

import "./Attendance.css";

export default function Attendance() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] =
        useState("All Status");

    const loadAttendance = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDashboard();

            setRecords(
                Array.isArray(data?.attendance_history)
                    ? data.attendance_history
                    : []
            );
        } catch (err) {
            console.error(
                "Attendance API error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                "Unable to load attendance."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    /* =========================================================
       CLEAN EMPLOYEE NAME
       ========================================================= */

    const getEmployeeName = (record) => {
        const rawName = String(
            record?.employee || ""
        ).trim();

        if (!rawName) {
            return "Unknown Employee";
        }

        /*
         * Backend may currently return:
         *
         * LakshyaEmployee
         * Lakshya MalhotraEmployee
         * Kamal MalhotraEmployee
         *
         * Remove only a trailing "Employee" suffix.
         */

        return rawName
            .replace(/\s*employee\s*$/i, "")
            .trim() || "Unknown Employee";
    };

    /* =========================================================
       NORMALIZE STATUS
       ========================================================= */

    const getStatus = (record) => {
        return String(
            record?.status || "Unknown"
        ).trim();
    };

    /* =========================================================
       FILTER RECORDS
       ========================================================= */

    const filteredRecords = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return records.filter((record) => {
            const employee =
                getEmployeeName(record)
                    .toLowerCase();

            const employeeId =
                String(
                    record?.employee_id || ""
                ).toLowerCase();

            const status =
                getStatus(record);

            const matchesSearch =
                !query ||
                employee.includes(query) ||
                employeeId.includes(query);

            const matchesStatus =
                statusFilter === "All Status" ||
                status.toLowerCase() ===
                    statusFilter.toLowerCase();

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [
        records,
        search,
        statusFilter,
    ]);

    /* =========================================================
       ATTENDANCE STATISTICS
       ========================================================= */

    const statistics = useMemo(() => {
        const total = records.length;

        const present = records.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase()
                    .includes("present")
        ).length;

        const absent = records.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase()
                    .includes("absent")
        ).length;

        const late = records.filter(
            (record) =>
                getStatus(record)
                    .toLowerCase()
                    .includes("late")
        ).length;

        const percentage =
            total > 0
                ? Math.round(
                      (present / total) * 100
                  )
                : 0;

        return {
            total,
            present,
            absent,
            late,
            percentage,
        };
    }, [records]);

    /* =========================================================
       CURRENT DATE
       ========================================================= */

    const currentDate =
        new Date().toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    /* =========================================================
       EXPORT REPORT
       ========================================================= */

    const handleExport = () => {
        if (!filteredRecords.length) {
            return;
        }

        const headers = [
            "Employee",
            "Employee ID",
            "Date",
            "Login",
            "Status",
        ];

        const rows =
            filteredRecords.map(
                (record) => [
                    getEmployeeName(record),
                    record?.employee_id || "",
                    record?.date || "",
                    record?.login || "",
                    record?.status || "",
                ]
            );

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "attendance-report.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    return (
        <DashboardLayout>
            <div className="attendance-page">

                <div className="attendance-container">

                    {/* =================================================
                       HEADER
                    ================================================= */}

                    <section className="attendance-header">

                        <div className="attendance-heading">

                            <div className="attendance-eyebrow">
                                <span className="eyebrow-dot" />
                                WORKFORCE INTELLIGENCE
                            </div>

                            <h1>
                                Attendance
                                <span> Overview</span>
                            </h1>

                            <p>
                                Monitor workforce presence,
                                authentication activity and
                                daily attendance records.
                            </p>

                        </div>

                        <div className="attendance-header-actions">

                            <div className="attendance-date">

                                <CalendarDays size={17} />

                                <div>
                                    <span>
                                        TODAY
                                    </span>

                                    <strong>
                                        {currentDate}
                                    </strong>
                                </div>

                            </div>

                            <button
                                className="attendance-refresh"
                                onClick={loadAttendance}
                                disabled={loading}
                                type="button"
                            >

                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "attendance-spin"
                                            : ""
                                    }
                                />

                                Refresh

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                       STATISTICS
                    ================================================= */}

                    <section className="attendance-stats">

                        <div className="attendance-stat-card">

                            <div className="attendance-stat-top">

                                <div className="attendance-stat-icon blue">
                                    <Users size={20} />
                                </div>

                                <span>
                                    TOTAL RECORDS
                                </span>

                            </div>

                            <strong>
                                {statistics.total}
                            </strong>

                            <small>
                                Attendance records
                            </small>

                        </div>


                        <div className="attendance-stat-card">

                            <div className="attendance-stat-top">

                                <div className="attendance-stat-icon green">
                                    <CheckCircle2 size={20} />
                                </div>

                                <span>
                                    PRESENT
                                </span>

                            </div>

                            <strong>
                                {statistics.present}
                            </strong>

                            <small>
                                Employees present
                            </small>

                        </div>


                        <div className="attendance-stat-card">

                            <div className="attendance-stat-top">

                                <div className="attendance-stat-icon amber">
                                    <Clock3 size={20} />
                                </div>

                                <span>
                                    LATE
                                </span>

                            </div>

                            <strong>
                                {statistics.late}
                            </strong>

                            <small>
                                Late arrivals
                            </small>

                        </div>


                        <div className="attendance-stat-card">

                            <div className="attendance-stat-top">

                                <div className="attendance-stat-icon purple">
                                    <Activity size={20} />
                                </div>

                                <span>
                                    ATTENDANCE RATE
                                </span>

                            </div>

                            <strong>
                                {statistics.percentage}%
                            </strong>

                            <small>
                                Current attendance
                            </small>

                            <div className="attendance-progress">
                                <span
                                    style={{
                                        width: `${statistics.percentage}%`,
                                    }}
                                />
                            </div>

                        </div>

                    </section>


                    {/* =================================================
                       MAIN ATTENDANCE PANEL
                    ================================================= */}

                    <section className="attendance-panel">

                        <div className="attendance-panel-header">

                            <div>

                                <div className="panel-kicker">
                                    <span />
                                    LIVE DIRECTORY
                                </div>

                                <h2>
                                    Attendance Records
                                </h2>

                                <p>
                                    Authentication and
                                    attendance activity
                                    collected by PalmSecureAI.
                                </p>

                            </div>


                            <button
                                className="export-button"
                                onClick={handleExport}
                                disabled={
                                    !filteredRecords.length
                                }
                                type="button"
                            >

                                <Download size={16} />

                                Export Report

                            </button>

                        </div>


                        {/* =================================================
                           TOOLBAR
                        ================================================= */}

                        <div className="attendance-toolbar">

                            <div className="attendance-search">

                                <Search size={17} />

                                <input
                                    type="text"
                                    placeholder="Search employee or ID..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        aria-label="Clear search"
                                    >
                                        <X size={15} />
                                    </button>
                                )}

                            </div>


                            <div className="attendance-filter">

                                <select
                                    value={statusFilter}
                                    onChange={(event) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option>
                                        All Status
                                    </option>

                                    <option>
                                        Present
                                    </option>

                                    <option>
                                        Absent
                                    </option>

                                    <option>
                                        Late
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                           LOADING
                        ================================================= */}

                        {loading && (
                            <div className="attendance-state">

                                <div className="attendance-loader">
                                    <RefreshCw size={25} />
                                </div>

                                <h3>
                                    Loading attendance
                                </h3>

                                <p>
                                    Fetching the latest
                                    attendance records...
                                </p>

                            </div>
                        )}


                        {/* =================================================
                           ERROR
                        ================================================= */}

                        {!loading && error && (
                            <div className="attendance-state error">

                                <div className="attendance-state-icon">
                                    <XCircle size={25} />
                                </div>

                                <h3>
                                    Unable to load
                                    attendance
                                </h3>

                                <p>
                                    {error}
                                </p>

                                <button
                                    onClick={loadAttendance}
                                    type="button"
                                >

                                    <RefreshCw size={15} />

                                    Try Again

                                </button>

                            </div>
                        )}


                        {/* =================================================
                           EMPTY
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredRecords.length === 0 && (

                                <div className="attendance-state">

                                    <div className="attendance-state-icon">
                                        <Fingerprint size={25} />
                                    </div>

                                    <h3>
                                        No attendance
                                        records found
                                    </h3>

                                    <p>
                                        No records match
                                        your current
                                        search or filter.
                                    </p>

                                </div>
                            )}


                        {/* =================================================
                           TABLE
                        ================================================= */}

                        {!loading &&
                            !error &&
                            filteredRecords.length > 0 && (

                                <div className="attendance-table-wrapper">

                                    <table className="attendance-table">

                                        <thead>

                                            <tr>

                                                <th>
                                                    EMPLOYEE
                                                </th>

                                                <th>
                                                    EMPLOYEE ID
                                                </th>

                                                <th>
                                                    DATE
                                                </th>

                                                <th>
                                                    LOGIN TIME
                                                </th>

                                                <th>
                                                    STATUS
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {filteredRecords.map(
                                                (
                                                    record,
                                                    index
                                                ) => {

                                                    const status =
                                                        getStatus(
                                                            record
                                                        );

                                                    const employeeName =
                                                        getEmployeeName(
                                                            record
                                                        );

                                                    const isPresent =
                                                        status
                                                            .toLowerCase()
                                                            .includes(
                                                                "present"
                                                            );

                                                    const isLate =
                                                        status
                                                            .toLowerCase()
                                                            .includes(
                                                                "late"
                                                            );

                                                    const initials =
                                                        employeeName
                                                            .split(
                                                                /\s+/
                                                            )
                                                            .slice(
                                                                0,
                                                                2
                                                            )
                                                            .map(
                                                                (part) =>
                                                                    part
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()
                                                            )
                                                            .join("");

                                                    return (
                                                        <tr
                                                            key={`${record?.employee_id}-${record?.date}-${index}`}
                                                        >

                                                            {/* EMPLOYEE */}

                                                            <td>

                                                                <div className="attendance-employee">

                                                                    <div className="attendance-avatar">

                                                                        {initials ||
                                                                            "NA"}

                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                employeeName
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            Biometric identity
                                                                            verified
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* EMPLOYEE ID */}

                                                            <td>

                                                                <span className="attendance-id">

                                                                    {
                                                                        record?.employee_id ||
                                                                        "—"
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* DATE */}

                                                            <td>

                                                                <div className="attendance-date-cell">

                                                                    <CalendarDays
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    {
                                                                        record?.date ||
                                                                        "—"
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* LOGIN TIME */}

                                                            <td>

                                                                <div className="login-time">

                                                                    <Clock3
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    {
                                                                        record?.login ||
                                                                        "—"
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td>

                                                                <span
                                                                    className={`attendance-status ${
                                                                        isLate
                                                                            ? "late"
                                                                            : isPresent
                                                                            ? "present"
                                                                            : "absent"
                                                                    }`}
                                                                >

                                                                    {isPresent && (
                                                                        <CheckCircle2
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    )}

                                                                    {isLate && (
                                                                        <Clock3
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    )}

                                                                    {!isPresent &&
                                                                        !isLate && (
                                                                            <XCircle
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                        )}

                                                                    {status}

                                                                </span>

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>
                            )}

                    </section>


                    {/* =================================================
                       SECURITY FOOTER
                    ================================================= */}

                    <div className="attendance-security">

                        <div className="attendance-security-icon">

                            <ShieldCheck size={19} />

                        </div>

                        <div>

                            <strong>
                                Biometric attendance
                                protected
                            </strong>

                            <span>
                                Attendance activity is
                                securely processed through
                                PalmSecureAI authentication.
                            </span>

                        </div>

                        <div className="attendance-secure-badge">

                            <span />

                            SYSTEM SECURE

                        </div>

                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}