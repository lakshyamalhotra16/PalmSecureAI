import "./AttendanceChart.css";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

import {
    TrendingUp,
    CalendarDays,
    Activity,
} from "lucide-react";

export default function AttendanceChart({ dashboard }) {

    const analytics = dashboard?.analytics || [];

    const data = analytics.map((item) => ({
        day: item.day,
        attendance: Number(item.attendance) || 0,
    }));

    const overallAttendance =
        dashboard?.stats?.attendance_percentage;

    const todayAttendance =
        dashboard?.stats?.today_attendance;

    const totalEmployees =
        dashboard?.stats?.total_employees;

    const hasData = data.length > 0;

    const averageAttendance = hasData
        ? (
            data.reduce(
                (sum, item) => sum + item.attendance,
                0
            ) / data.length
        ).toFixed(1)
        : "--";

    return (
        <section className="attendance-chart">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="attendance-chart-header">

                <div className="attendance-chart-title">

                    <div className="attendance-chart-icon">
                        <Activity size={22} />
                    </div>

                    <div>
                        <h2>
                            Attendance Analytics
                        </h2>

                        <p>
                            Workforce attendance performance
                        </p>
                    </div>

                </div>

                <div className="attendance-period">

                    <CalendarDays size={18} />

                    <span>
                        Last 7 Days
                    </span>

                </div>

            </div>


            {/* =====================================================
                SUMMARY
            ===================================================== */}

            <div className="attendance-summary">

                <div className="attendance-summary-item">

                    <span>
                        Overall
                    </span>

                    <strong>
                        {overallAttendance !== undefined &&
                        overallAttendance !== null
                            ? `${overallAttendance}%`
                            : "--"}
                    </strong>

                </div>


                <div className="attendance-summary-divider" />


                <div className="attendance-summary-item">

                    <span>
                        7-Day Average
                    </span>

                    <strong>
                        {averageAttendance !== "--"
                            ? `${averageAttendance}%`
                            : "--"}
                    </strong>

                </div>


                <div className="attendance-summary-divider" />


                <div className="attendance-summary-item">

                    <span>
                        Today
                    </span>

                    <strong>
                        {todayAttendance !== undefined &&
                        todayAttendance !== null
                            ? `${todayAttendance}/${totalEmployees ?? "--"}`
                            : "--"}
                    </strong>

                </div>

            </div>


            {/* =====================================================
                CHART
            ====================================================== */}

            <div className="attendance-chart-area">

                {hasData ? (

                    <ResponsiveContainer
                        width="100%"
                        height={360}
                    >

                        <AreaChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 10,
                                bottom: 10,
                            }}
                        >

                            <defs>

                                <linearGradient
                                    id="attendanceAreaGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >

                                    <stop
                                        offset="0%"
                                        stopColor="#22c55e"
                                        stopOpacity={0.30}
                                    />

                                    <stop
                                        offset="65%"
                                        stopColor="#22c55e"
                                        stopOpacity={0.10}
                                    />

                                    <stop
                                        offset="100%"
                                        stopColor="#22c55e"
                                        stopOpacity={0}
                                    />

                                </linearGradient>


                                <filter
                                    id="attendanceGlow"
                                    x="-50%"
                                    y="-50%"
                                    width="200%"
                                    height="200%"
                                >

                                    <feGaussianBlur
                                        stdDeviation="4"
                                        result="blur"
                                    />

                                    <feMerge>

                                        <feMergeNode in="blur" />

                                        <feMergeNode
                                            in="SourceGraphic"
                                        />

                                    </feMerge>

                                </filter>

                            </defs>


                            {/* =================================================
                                GRID
                            ================================================= */}

                            <CartesianGrid
                                vertical={false}
                                stroke="rgba(148,163,184,0.10)"
                                strokeDasharray="4 6"
                            />


                            {/* =================================================
                                X AXIS
                            ================================================= */}

                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{
                                    fill: "#94a3b8",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                                dy={14}
                                height={40}
                            />


                            {/* =================================================
                                Y AXIS
                            ================================================= */}

                            <YAxis
                                domain={[0, 100]}
                                tickLine={false}
                                axisLine={false}
                                width={55}
                                tick={{
                                    fill: "#94a3b8",
                                    fontSize: 14,
                                    fontWeight: 600,
                                }}
                                tickFormatter={(value) =>
                                    `${value}%`
                                }
                            />


                            {/* =================================================
                                PREMIUM TOOLTIP
                            ================================================= */}

                            <Tooltip
                                cursor={{
                                    stroke: "rgba(34,197,94,0.40)",
                                    strokeWidth: 1.5,
                                }}

                                formatter={(value) => [
                                    `${Number(value).toFixed(1)}%`,
                                    "Attendance",
                                ]}

                                labelFormatter={(label) =>
                                    `${label}`
                                }

                                contentStyle={{
                                    background:
                                        "rgba(8,15,28,0.97)",

                                    border:
                                        "1px solid rgba(34,197,94,0.30)",

                                    borderRadius: "14px",

                                    boxShadow:
                                        "0 18px 50px rgba(0,0,0,0.45)",

                                    padding: "14px 16px",

                                    minWidth: "150px",

                                    fontSize: "14px",
                                }}

                                labelStyle={{
                                    color: "#e2e8f0",

                                    fontWeight: 700,

                                    fontSize: "14px",

                                    lineHeight: "1.4",

                                    marginBottom: "7px",
                                }}

                                itemStyle={{
                                    color: "#4ade80",

                                    fontWeight: 700,

                                    fontSize: "15px",

                                    lineHeight: "1.5",

                                    padding: "2px 0",
                                }}

                                wrapperStyle={{
                                    outline: "none",
                                }}
                            />


                            {/* =================================================
                                ATTENDANCE AREA
                            ================================================= */}

                            <Area
                                type="monotone"

                                dataKey="attendance"

                                stroke="#22c55e"

                                strokeWidth={3}

                                fill="url(#attendanceAreaGradient)"

                                dot={{
                                    r: 5,

                                    fill: "#0f172a",

                                    stroke: "#22c55e",

                                    strokeWidth: 2,
                                }}

                                activeDot={{
                                    r: 7,

                                    fill: "#22c55e",

                                    stroke: "#0f172a",

                                    strokeWidth: 3,

                                    filter:
                                        "url(#attendanceGlow)",
                                }}
                            />

                        </AreaChart>

                    </ResponsiveContainer>

                ) : (

                    <div className="attendance-empty">

                        <div className="attendance-empty-icon">

                            <Activity size={24} />

                        </div>

                        <h3>
                            No attendance analytics yet
                        </h3>

                        <p>
                            Attendance activity will appear here
                            once records are available.
                        </p>

                    </div>

                )}

            </div>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <div className="attendance-chart-footer">

                <div className="attendance-status">

                    <span className="attendance-status-dot" />

                    <span>
                        Live attendance data
                    </span>

                </div>


                <div className="attendance-trend">

                    <TrendingUp size={18} />

                    <span>
                        Monitoring active
                    </span>

                </div>

            </div>

        </section>
    );
}