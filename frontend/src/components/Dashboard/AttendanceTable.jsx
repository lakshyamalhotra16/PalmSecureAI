import "./AttendanceTable.css";
import { CalendarDays } from "lucide-react";

export default function AttendanceTable({ user }) {

    const attendance = [
        {
            date: user?.attendance?.date ?? "--",
            time: user?.attendance?.time
                ? user.attendance.time.substring(0, 8)
                : "--",
            confidence: user?.confidence ?? "--",
            status: "Present",
        },
    ];

    return (

        <div className="attendance-table card">

            <div className="table-header">

                <CalendarDays size={22} />

                <h2>Recent Attendance</h2>

            </div>

            <table>

                <thead>

                    <tr>

                        <th>Date</th>

                        <th>Time</th>

                        <th>Confidence</th>

                        <th>Status</th>

                    </tr>

                </thead>

                <tbody>

                    {attendance.map((row, index) => (

                        <tr key={index}>

                            <td>{row.date}</td>

                            <td>{row.time}</td>

                            <td>{row.confidence}%</td>

                            <td>

                                <span className="present-badge">

                                    {row.status}

                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}