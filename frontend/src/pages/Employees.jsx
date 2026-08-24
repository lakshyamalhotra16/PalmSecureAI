import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Users,
    UserPlus,
    Search,
    SlidersHorizontal,
    Building2,
    Fingerprint,
    ShieldCheck,
    CheckCircle2,
    Trash2,
    RefreshCw,
    X,
    LockKeyhole,
    ChevronDown,
    Activity,
    Mail,
    IdCard,
} from "lucide-react";

import "./Employees.css";

import DashboardLayout from "../components/Layout/DashboardLayout";

import {
    getEmployees,
    deleteEmployee,
} from "../services/employeeApi";

export default function Employees() {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [department, setDepartment] =
        useState("All Departments");

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [deleting, setDeleting] =
        useState(false);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getEmployees();

            setEmployees(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Employees API error:",
                err
            );

            setError(
                err?.response?.data?.detail ||
                    err?.message ||
                    "Unable to load employees."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    const departments = useMemo(() => {
        const uniqueDepartments = [
            ...new Set(
                employees
                    .map(
                        (employee) =>
                            employee?.department
                    )
                    .filter(Boolean)
            ),
        ];

        return [
            "All Departments",
            ...uniqueDepartments,
        ];
    }, [employees]);

    const filteredEmployees = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        return employees.filter((employee) => {
            const name =
                employee?.full_name ||
                employee?.name ||
                "";

            const employeeId =
                employee?.employee_id || "";

            const employeeDepartment =
                employee?.department || "";

            const matchesSearch =
                !query ||
                name
                    .toLowerCase()
                    .includes(query) ||
                employeeId
                    .toLowerCase()
                    .includes(query) ||
                employeeDepartment
                    .toLowerCase()
                    .includes(query);

            const matchesDepartment =
                department ===
                    "All Departments" ||
                employeeDepartment ===
                    department;

            return (
                matchesSearch &&
                matchesDepartment
            );
        });
    }, [
        employees,
        search,
        department,
    ]);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleting(true);

            await deleteEmployee(
                deleteTarget.id
            );

            setEmployees((current) =>
                current.filter(
                    (employee) =>
                        employee.id !==
                        deleteTarget.id
                )
            );

            setDeleteTarget(null);
        } catch (err) {
            console.error(
                "Delete employee error:",
                err
            );

            alert(
                err?.response?.data?.detail ||
                    "Unable to delete employee."
            );
        } finally {
            setDeleting(false);
        }
    };

    const getInitials = (name = "") => {
        const initials = name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) =>
                part
                    .charAt(0)
                    .toUpperCase()
            )
            .join("");

        return initials || "NA";
    };

    const totalEmployees =
        employees.length;

    const totalDepartments =
        Math.max(
            departments.length - 1,
            0
        );

    const showingEmployees =
        filteredEmployees.length;

    return (
        <DashboardLayout>
            <div className="employees-page">
                <div className="employees-container">

                    {/* HEADER */}

                    <section className="employees-header">

                        <div className="employees-heading">

                            <div className="page-eyebrow">
                                <span className="eyebrow-pulse" />
                                WORKFORCE MANAGEMENT
                            </div>

                            <h1>
                                Employee
                                <span> Directory</span>
                            </h1>

                            <p>
                                Manage your workforce,
                                biometric identities and
                                enrollment records from one
                                secure workspace.
                            </p>

                        </div>

                        <button
                            className="enroll-button"
                            onClick={() =>
                                navigate(
                                    "/enrollment"
                                )
                            }
                            type="button"
                        >
                            <UserPlus size={18} />
                            <span>
                                Enroll Employee
                            </span>
                        </button>

                    </section>


                    {/* KPI CARDS */}

                    <section className="employee-summary">

                        <div className="summary-card">

                            <div className="summary-icon employees">
                                <Users size={22} />
                            </div>

                            <div className="summary-content">
                                <span>
                                    Total Employees
                                </span>

                                <strong>
                                    {totalEmployees}
                                </strong>

                                <small>
                                    Registered workforce
                                </small>
                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon verified">
                                <ShieldCheck size={22} />
                            </div>

                            <div className="summary-content">
                                <span>
                                    Biometric Coverage
                                </span>

                                <strong>
                                    {totalEmployees > 0
                                        ? "100%"
                                        : "0%"}
                                </strong>

                                <small>
                                    Enrollment coverage
                                </small>
                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon departments">
                                <Building2 size={22} />
                            </div>

                            <div className="summary-content">
                                <span>
                                    Departments
                                </span>

                                <strong>
                                    {totalDepartments}
                                </strong>

                                <small>
                                    Active divisions
                                </small>
                            </div>

                        </div>


                        <div className="summary-card">

                            <div className="summary-icon system">
                                <Activity size={22} />
                            </div>

                            <div className="summary-content">
                                <span>
                                    System Status
                                </span>

                                <strong className="operational">
                                    Operational
                                </strong>

                                <small>
                                    All services running
                                </small>
                            </div>

                        </div>

                    </section>


                    {/* DIRECTORY */}

                    <section className="employees-card">

                        <div className="directory-top">

                            <div>

                                <div className="section-kicker">
                                    <span />
                                    PEOPLE
                                </div>

                                <h2>
                                    Employee Directory
                                </h2>

                                <p>
                                    Securely manage registered
                                    employees and biometric
                                    identity records.
                                </p>

                            </div>

                            {!loading &&
                                !error && (
                                    <div className="directory-meta">
                                        <span className="live-dot" />

                                        <strong>
                                            {showingEmployees}
                                        </strong>

                                        <span>
                                            {showingEmployees ===
                                            1
                                                ? "employee"
                                                : "employees"}
                                        </span>
                                    </div>
                                )}

                        </div>


                        {/* TOOLBAR */}

                        <div className="employee-toolbar">

                            <div className="search-box">

                                <Search size={18} />

                                <input
                                    type="text"
                                    placeholder="Search name, employee ID or department..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                />

                                {search && (
                                    <button
                                        className="clear-search"
                                        onClick={() =>
                                            setSearch("")
                                        }
                                        type="button"
                                        aria-label="Clear search"
                                    >
                                        <X size={15} />
                                    </button>
                                )}

                            </div>


                            <div className="department-filter">

                                <SlidersHorizontal
                                    size={16}
                                />

                                <select
                                    value={department}
                                    onChange={(event) =>
                                        setDepartment(
                                            event.target.value
                                        )
                                    }
                                >
                                    {departments.map(
                                        (item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown
                                    size={15}
                                    className="select-arrow"
                                />

                            </div>


                            <button
                                className="refresh-button"
                                onClick={loadEmployees}
                                disabled={loading}
                                type="button"
                                title="Refresh employees"
                            >
                                <RefreshCw
                                    size={17}
                                    className={
                                        loading
                                            ? "refresh-spin"
                                            : ""
                                    }
                                />
                            </button>

                        </div>


                        {/* LOADING */}

                        {loading && (
                            <div className="state-container">

                                <div className="loading-orbit">
                                    <div />
                                </div>

                                <h3>
                                    Loading employee
                                    directory
                                </h3>

                                <p>
                                    Securely fetching
                                    workforce records...
                                </p>

                            </div>
                        )}


                        {/* ERROR */}

                        {!loading && error && (
                            <div className="state-container error-state">

                                <div className="state-icon error">
                                    !
                                </div>

                                <h3>
                                    Directory unavailable
                                </h3>

                                <p>
                                    {error}
                                </p>

                                <button
                                    className="retry-button"
                                    onClick={
                                        loadEmployees
                                    }
                                    type="button"
                                >
                                    <RefreshCw
                                        size={16}
                                    />
                                    Try Again
                                </button>

                            </div>
                        )}


                        {/* EMPTY */}

                        {!loading &&
                            !error &&
                            filteredEmployees.length ===
                                0 && (
                                <div className="state-container">

                                    <div className="state-icon empty">
                                        <Users size={25} />
                                    </div>

                                    <h3>
                                        {employees.length ===
                                        0
                                            ? "No employees enrolled"
                                            : "No matching employees"}
                                    </h3>

                                    <p>
                                        {employees.length ===
                                        0
                                            ? "Begin by enrolling your first employee."
                                            : "Try adjusting your search or department filter."}
                                    </p>

                                    {employees.length ===
                                        0 && (
                                        <button
                                            className="empty-enroll-button"
                                            onClick={() =>
                                                navigate(
                                                    "/enrollment"
                                                )
                                            }
                                            type="button"
                                        >
                                            <UserPlus
                                                size={17}
                                            />
                                            Enroll First
                                            Employee
                                        </button>
                                    )}

                                </div>
                            )}


                        {/* TABLE */}

                        {!loading &&
                            !error &&
                            filteredEmployees.length >
                                0 && (
                                <div className="table-wrapper">

                                    <table className="employees-table">

                                        <thead>
                                            <tr>
                                                <th>
                                                    EMPLOYEE
                                                </th>

                                                <th>
                                                    EMPLOYEE ID
                                                </th>

                                                <th>
                                                    DEPARTMENT
                                                </th>

                                                <th>
                                                    BIOMETRIC
                                                </th>

                                                <th>
                                                    STATUS
                                                </th>

                                                <th>
                                                    ACTION
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {filteredEmployees.map(
                                                (employee) => {

                                                    const name =
                                                        employee?.full_name ||
                                                        employee?.name ||
                                                        "Unknown Employee";

                                                    return (
                                                        <tr
                                                            key={
                                                                employee.id
                                                            }
                                                        >

                                                            <td>

                                                                <div className="employee-profile">

                                                                    <div className="employee-avatar">
                                                                        {getInitials(
                                                                            name
                                                                        )}
                                                                    </div>

                                                                    <div className="employee-name-block">

                                                                        <strong>
                                                                            {
                                                                                name
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            <IdCard
                                                                                size={
                                                                                    13
                                                                                }
                                                                            />
                                                                            Employee #
                                                                            {
                                                                                employee.id
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                <span className="employee-id">
                                                                    {
                                                                        employee.employee_id ||
                                                                        "—"
                                                                    }
                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="department-badge">

                                                                    <Building2
                                                                        size={
                                                                            14
                                                                        }
                                                                    />

                                                                    {
                                                                        employee.department ||
                                                                        "Unassigned"
                                                                    }

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="status-badge biometric">

                                                                    <Fingerprint
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Enrolled

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <span className="status-badge active">

                                                                    <CheckCircle2
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Active

                                                                </span>

                                                            </td>


                                                            <td>

                                                                <button
                                                                    className="delete-button"
                                                                    onClick={() =>
                                                                        setDeleteTarget(
                                                                            employee
                                                                        )
                                                                    }
                                                                    type="button"
                                                                >

                                                                    <Trash2
                                                                        size={
                                                                            15
                                                                        }
                                                                    />

                                                                    Delete

                                                                </button>

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


                    {/* SECURITY FOOTER */}

                    {!loading &&
                        !error &&
                        employees.length > 0 && (
                            <div className="employees-security">

                                <div className="security-icon">
                                    <LockKeyhole size={19} />
                                </div>

                                <div className="security-copy">

                                    <strong>
                                        Biometric data protected
                                    </strong>

                                    <span>
                                        PalmSecureAI securely
                                        manages employee
                                        identity records.
                                    </span>

                                </div>

                                <div className="security-status">

                                    <CheckCircle2
                                        size={15}
                                    />

                                    Secure

                                </div>

                            </div>
                        )}

                </div>
            </div>


            {/* DELETE MODAL */}

            {deleteTarget && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        if (!deleting) {
                            setDeleteTarget(null);
                        }
                    }}
                >

                    <div
                        className="delete-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <button
                            className="modal-close"
                            onClick={() => {
                                if (!deleting) {
                                    setDeleteTarget(
                                        null
                                    );
                                }
                            }}
                            type="button"
                            aria-label="Close dialog"
                        >
                            <X size={18} />
                        </button>


                        <div className="delete-modal-icon">
                            <Trash2 size={23} />
                        </div>


                        <div className="modal-label">
                            DANGER ZONE
                        </div>


                        <h2>
                            Remove employee?
                        </h2>


                        <p>
                            You are about to permanently
                            remove{" "}
                            <strong>
                                {
                                    deleteTarget.full_name ||
                                    deleteTarget.name
                                }
                            </strong>{" "}
                            from the employee directory.
                        </p>


                        <div className="modal-employee">

                            <div className="mini-avatar">
                                {getInitials(
                                    deleteTarget.full_name ||
                                        deleteTarget.name
                                )}
                            </div>

                            <div>

                                <strong>
                                    {
                                        deleteTarget.full_name ||
                                        deleteTarget.name
                                    }
                                </strong>

                                <span>
                                    {
                                        deleteTarget.employee_id ||
                                        "Employee"
                                    }
                                </span>

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="cancel-button"
                                disabled={deleting}
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                type="button"
                            >
                                Cancel
                            </button>


                            <button
                                className="confirm-delete-button"
                                disabled={deleting}
                                onClick={
                                    handleDelete
                                }
                                type="button"
                            >

                                {deleting ? (
                                    <>
                                        <RefreshCw
                                            size={15}
                                            className="refresh-spin"
                                        />
                                        Removing...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            size={15}
                                        />
                                        Delete Employee
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </div>
            )}

        </DashboardLayout>
    );
}