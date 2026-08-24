import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Layout/Navbar/Navbar";
import { getDashboard } from "../services/dashboardApi";

import "./Analytics.css";

export default function Analytics() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDashboard();
            setDashboard(data);
        } catch (err) {
            console.error("Analytics API error:", err);

            setError(
                err?.response?.data?.detail ||
                "Unable to load analytics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    const stats = dashboard?.stats || {};
    const analytics = Array.isArray(dashboard?.analytics)
        ? dashboard.analytics
        : [];

    const weeklyAverage = useMemo(() => {
        if (!analytics.length) return 0;

        const total = analytics.reduce(
            (sum, item) => sum + Number(item.attendance || 0),
            0
        );

        return (total / analytics.length).toFixed(1);
    }, [analytics]);

    const bestDay = useMemo(() => {
        if (!analytics.length) return null;

        return analytics.reduce((best, current) => {
            return Number(current.attendance || 0) >
                Number(best.attendance || 0)
                ? current
                : best;
        }, analytics[0]);
    }, [analytics]);

    const maxAttendance = Math.max(
        ...analytics.map((item) => Number(item.attendance || 0)),
        100
    );

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="analytics-page">
                    <div className="analytics-container">
                        <div className="analytics-loading">
                            <div className="loading-spinner"></div>
                            <h2>Loading Analytics</h2>
                            <p>
                                Preparing workforce attendance insights...
                            </p>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />

                <main className="analytics-page">
                    <div className="analytics-container">
                        <div className="analytics-error">
                            <div className="error-icon">!</div>

                            <h2>Analytics Unavailable</h2>

                            <p>{error}</p>

                            <button
                                className="analytics-refresh-button"
                                onClick={loadAnalytics}
                            >
                                ↻ Retry
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="analytics-page">
                <div className="analytics-container">

                    {/* HEADER */}
                    <section className="analytics-header">

                        <div>
                            <div className="eyebrow">
                                <span className="eyebrow-dot"></span>
                                WORKFORCE INTELLIGENCE
                            </div>

                            <h1>
                                Analytics <span>Overview</span>
                            </h1>

                            <p>
                                Monitor workforce attendance, biometric
                                performance and daily authentication insights.
                            </p>
                        </div>

                        <button
                            className="analytics-refresh-button"
                            onClick={loadAnalytics}
                        >
                            <span>↻</span>
                            Refresh Data
                        </button>

                    </section>

                    {/* TOP STATS */}
                    <section className="analytics-stats-grid">

                        <div className="analytics-card stat-card recognition-card">
                            <div className="stat-top">
                                <div className="stat-icon blue">
                                    ◎
                                </div>

                                <span>RECOGNITION</span>
                            </div>

                            <div className="stat-value">
                                {stats.recognition_accuracy ?? 0}%
                            </div>

                            <p>Recognition accuracy</p>

                            <div className="stat-progress">
                                <span
                                    style={{
                                        width: `${Math.min(
                                            Number(
                                                stats.recognition_accuracy || 0
                                            ),
                                            100
                                        )}%`
                                    }}
                                ></span>
                            </div>
                        </div>

                        <div className="analytics-card stat-card workforce-card">
                            <div className="stat-top">
                                <div className="stat-icon purple">
                                    ♟
                                </div>

                                <span>WORKFORCE</span>
                            </div>

                            <div className="stat-value">
                                {stats.total_employees ?? 0}
                            </div>

                            <p>Registered employees</p>

                            <div className="stat-status purple-status">
                                <span></span>
                                Active employee database
                            </div>
                        </div>

                        <div className="analytics-card stat-card today-card">
                            <div className="stat-top">
                                <div className="stat-icon green">
                                    ✓
                                </div>

                                <span>TODAY</span>
                            </div>

                            <div className="stat-value">
                                {stats.today_attendance ?? 0}
                            </div>

                            <p>Employees authenticated today</p>

                            <div className="stat-status green-status">
                                <span></span>
                                Attendance monitoring active
                            </div>
                        </div>

                        <div className="analytics-card stat-card attendance-card">
                            <div className="stat-top">
                                <div className="stat-icon cyan">
                                    ↗
                                </div>

                                <span>ATTENDANCE RATE</span>
                            </div>

                            <div className="stat-value">
                                {stats.attendance_percentage ?? 0}%
                            </div>

                            <p>Current workforce attendance</p>

                            <div className="stat-progress">
                                <span
                                    style={{
                                        width: `${Math.min(
                                            Number(
                                                stats.attendance_percentage ||
                                                0
                                            ),
                                            100
                                        )}%`
                                    }}
                                ></span>
                            </div>
                        </div>

                    </section>

                    {/* WEEKLY ANALYTICS */}
                    <section className="analytics-card weekly-card">

                        <div className="weekly-header">

                            <div>
                                <div className="section-eyebrow">
                                    <span>↗</span>
                                    ATTENDANCE PERFORMANCE
                                </div>

                                <h2>Weekly Attendance</h2>

                                <p>
                                    Workforce attendance trend across the
                                    available reporting period.
                                </p>
                            </div>

                            <div className="live-badge">
                                <span></span>
                                Live Data
                            </div>

                        </div>

                        {/* SUMMARY */}
                        <div className="weekly-summary">

                            <div>
                                <span>PERIOD AVERAGE</span>
                                <strong>{weeklyAverage}%</strong>
                                <small>Weekly average</small>
                            </div>

                            <div>
                                <span>BEST DAY</span>
                                <strong>
                                    {bestDay
                                        ? `${bestDay.attendance}%`
                                        : "0%"}
                                </strong>
                                <small>
                                    {bestDay?.day || "No data"}
                                </small>
                            </div>

                            <div>
                                <span>REPORTING DAYS</span>
                                <strong>{analytics.length}</strong>
                                <small>Available records</small>
                            </div>

                        </div>

                        {/* CHART */}
                        <div className="chart-wrapper">

                            <div className="chart-grid">

                                <div className="chart-label">100%</div>
                                <div className="chart-label">75%</div>
                                <div className="chart-label">50%</div>
                                <div className="chart-label">25%</div>
                                <div className="chart-label">0%</div>

                            </div>

                            <div className="chart-area">

                                {[100, 75, 50, 25, 0].map(
                                    (value) => (
                                        <div
                                            className="chart-line"
                                            style={{
                                                bottom: `${value}%`
                                            }}
                                            key={value}
                                        />
                                    )
                                )}

                                <div className="chart-bars">

                                    {analytics.map((item, index) => {

                                        const attendance =
                                            Number(
                                                item.attendance || 0
                                            );

                                        const height =
                                            attendance === 0
                                                ? 3
                                                : Math.max(
                                                    (attendance /
                                                        maxAttendance) *
                                                    100,
                                                    5
                                                );

                                        return (
                                            <div
                                                className="chart-column"
                                                key={index}
                                            >

                                                <div className="chart-value">
                                                    {attendance}%
                                                </div>

                                                <div
                                                    className={
                                                        attendance > 0
                                                            ? "chart-bar active"
                                                            : "chart-bar"
                                                    }
                                                    style={{
                                                        height: `${height}%`
                                                    }}
                                                >
                                                    {attendance > 0 && (
                                                        <span className="chart-glow"></span>
                                                    )}
                                                </div>

                                                <span className="chart-day">
                                                    {item.day}
                                                </span>

                                            </div>
                                        );
                                    })}

                                </div>

                            </div>

                        </div>

                        {/* BREAKDOWN */}
                        <div className="breakdown">

                            <div className="breakdown-header">

                                <div>
                                    <h3>Attendance Breakdown</h3>
                                    <p>
                                        Daily workforce attendance records
                                    </p>
                                </div>

                                <span className="period-badge">
                                    {analytics.length} Days
                                </span>

                            </div>

                            <div className="breakdown-table">

                                <div className="breakdown-row breakdown-heading">
                                    <span>DAY</span>
                                    <span>ATTENDANCE</span>
                                    <span>PERFORMANCE</span>
                                    <span>STATUS</span>
                                </div>

                                {analytics.map((item, index) => {

                                    const attendance =
                                        Number(item.attendance || 0);

                                    const status =
                                        attendance >= 75
                                            ? "Healthy"
                                            : attendance > 0
                                                ? "Moderate"
                                                : "Low";

                                    return (
                                        <div
                                            className="breakdown-row"
                                            key={index}
                                        >

                                            <div className="day-cell">
                                                <span className="day-number">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        "0"
                                                    )}
                                                </span>

                                                <strong>
                                                    {item.day}
                                                </strong>
                                            </div>

                                            <strong>
                                                {attendance}%
                                            </strong>

                                            <div className="performance-track">
                                                <span
                                                    className={
                                                        attendance > 0
                                                            ? "performance-fill"
                                                            : ""
                                                    }
                                                    style={{
                                                        width: `${attendance}%`
                                                    }}
                                                ></span>
                                            </div>

                                            <span
                                                className={`status-badge ${status.toLowerCase()}`}
                                            >
                                                <i></i>
                                                {status}
                                            </span>

                                        </div>
                                    );
                                })}

                            </div>

                        </div>

                    </section>

                    {/* SECURITY FOOTER */}
                    <section className="analytics-security">

                        <div className="security-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Biometric analytics protected
                            </strong>

                            <p>
                                Attendance insights are securely processed
                                through PalmSecureAI authentication
                                infrastructure.
                            </p>
                        </div>

                        <span>
                            <i></i>
                            SYSTEM SECURE
                        </span>

                    </section>

                </div>
            </main>
        </>
    );
}