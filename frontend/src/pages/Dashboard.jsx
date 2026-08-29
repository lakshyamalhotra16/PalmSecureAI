import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
    RefreshCw,
    ShieldCheck,
    Activity,
} from "lucide-react";

import "./Dashboard.css";

import DashboardLayout from "../components/Layout/DashboardLayout";

import Hero from "../components/Dashboard/Hero/Hero";
import SystemOverview from "../components/Dashboard/SystemOverview/SystemOverview";
import EmployeeCard from "../components/Dashboard/EmployeeCard/EmployeeCard";
import AuthenticationCard from "../components/Dashboard/AuthenticationCard/AuthenticationCard";
import AttendanceChart from "../components/Dashboard/AttendanceChart/AttendanceChart";
import RecentActivity from "../components/Dashboard/RecentActivity/RecentActivity";
import AttendanceTable from "../components/Dashboard/AttendanceTable/AttendanceTable";
import QuickActions from "../components/Dashboard/QuickActions/QuickActions";

import { getDashboard } from "../services/dashboardApi";


export default function Dashboard() {

    const location = useLocation();

    const authenticatedUser =
        location.state || null;

    const [dashboardData, setDashboardData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError(null);

            const data = await getDashboard();

            console.log(
                "Dashboard API response:",
                data
            );

            setDashboardData(data);

        } catch (error) {

            console.error(
                "Dashboard API error:",
                error
            );

            setError(
                error?.response?.data?.detail ||
                error?.message ||
                "Unable to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadDashboard();

    }, []);


    /* ============================================================
       LOADING STATE
    ============================================================ */

    if (loading) {

        return (

            <DashboardLayout>

                <div className="dashboard-page">

                    <div className="dashboard-shell">

                        <div className="dashboard-state">

                            <div className="dashboard-loader">
                                <div></div>
                            </div>

                            <h2>
                                Loading Dashboard
                            </h2>

                            <p>
                                Preparing your workforce intelligence...
                            </p>

                        </div>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    /* ============================================================
       ERROR STATE
    ============================================================ */

    if (error) {

        return (

            <DashboardLayout>

                <div className="dashboard-page">

                    <div className="dashboard-shell">

                        <div className="dashboard-state dashboard-error-state">

                            <div className="dashboard-state-icon">
                                <ShieldCheck size={28} />
                            </div>

                            <h2>
                                Dashboard Unavailable
                            </h2>

                            <p>
                                {error}
                            </p>

                            <button
                                className="dashboard-retry"
                                onClick={loadDashboard}
                            >
                                <RefreshCw size={16} />
                                Try Again
                            </button>

                        </div>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    /* ============================================================
       MAIN DASHBOARD
    ============================================================ */

    return (

        <DashboardLayout>

            <main className="dashboard-page">

                <div className="dashboard-shell">

                    {/* ==================================================
                        DASHBOARD HEADER
                    ================================================== */}

                    <section className="dashboard-heading">

                        <div>

                            <div className="dashboard-eyebrow">
                                <span className="eyebrow-dot"></span>

                                WORKFORCE INTELLIGENCE
                            </div>

                            <h1>
                                Control Center
                            </h1>

                            <p>
                                Monitor biometric authentication,
                                workforce attendance and system activity
                                from one secure workspace.
                            </p>

                        </div>


                        <div className="dashboard-header-actions">

                            <button
                                type="button"
                                className="dashboard-refresh-button"
                                onClick={loadDashboard}
                                disabled={loading}
                                aria-label="Refresh dashboard data"
                            >
                                <RefreshCw
                                    size={15}
                                    className={
                                        loading
                                            ? "dashboard-refresh-spinning"
                                            : ""
                                    }
                                />
                                Refresh
                            </button>

                            <div className="dashboard-live-status">

                                <span className="live-indicator">
                                    <Activity size={15} />
                                </span>

                                <div>
                                    <strong>
                                        System Operational
                                    </strong>

                                    <small>
                                        All services running normally
                                    </small>
                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        HERO
                    ================================================== */}

                    <section className="dashboard-section dashboard-hero-section">

                        <Hero
                            user={authenticatedUser}
                            dashboard={dashboardData}
                        />

                    </section>


                    {/* ==================================================
                        SYSTEM OVERVIEW
                    ================================================== */}

                    <section className="dashboard-section">

                        <SystemOverview
                            dashboard={dashboardData}
                        />

                    </section>


                    {/* ==================================================
                        EMPLOYEE + AUTHENTICATION
                    ================================================== */}

                    <section className="dashboard-main-grid">

                        <div className="dashboard-panel">

                            <EmployeeCard
                                user={authenticatedUser}
                                dashboard={dashboardData}
                            />

                        </div>


                        <div className="dashboard-panel dashboard-auth-panel">

                            <AuthenticationCard
                                confidence={
                                    authenticatedUser?.confidence
                                }
                                similarity={
                                    authenticatedUser?.similarity
                                }
                                dashboard={dashboardData}
                            />

                        </div>

                    </section>


                    {/* ==================================================
                        ANALYTICS + RECENT ACTIVITY
                    ================================================== */}

                    <section className="dashboard-analytics-grid">

                        <div className="dashboard-panel dashboard-chart-panel">

                            <AttendanceChart
                                dashboard={dashboardData}
                            />

                        </div>


                        <div className="dashboard-panel dashboard-activity-panel">

                            <RecentActivity
                                dashboard={dashboardData}
                            />

                        </div>

                    </section>


                    {/* ==================================================
                        ATTENDANCE TABLE
                    ================================================== */}

                    <section className="dashboard-panel dashboard-table-panel">

                        <AttendanceTable
                            dashboard={dashboardData}
                        />

                    </section>


                    {/* ==================================================
                        QUICK ACTIONS
             a       ================================================== */}

                    <section className="dashboard-panel dashboard-actions-panel">

                        <QuickActions
                            dashboard={dashboardData}
                        />

                    </section>


                    {/* ==================================================
                        FOOTER STATUS
                    ================================================== */}

                    <footer className="dashboard-footer">

                        <div className="footer-status">

                            <span></span>

                            PalmSecureAI services operational

                        </div>

                        <div>
                            Secure Workforce Intelligence
                        </div>

                    </footer>

                </div>

            </main>

        </DashboardLayout>
    );
}
