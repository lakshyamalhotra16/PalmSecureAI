from datetime import date, time
from pydantic import BaseModel, ConfigDict


class DashboardStats(BaseModel):
    recognition_accuracy: float
    total_employees: int
    today_attendance: int
    attendance_percentage: float
    security_status: str


class EmployeeDashboardItem(BaseModel):
    id: int
    employee_id: str
    full_name: str
    department: str
    status: str


class AttendanceHistoryItem(BaseModel):
    employee: str
    employee_id: str
    date: date
    login: time | None
    logout: time | None
    working_hours: float | None
    confidence: float | None
    status: str

    model_config = ConfigDict(from_attributes=True)


class RecentActivityItem(BaseModel):
    type: str
    title: str
    description: str
    timestamp: str


class AnalyticsPoint(BaseModel):
    day: str
    attendance: float


class DashboardResponse(BaseModel):
    stats: DashboardStats
    employees: list[EmployeeDashboardItem]
    attendance_history: list[AttendanceHistoryItem]
    recent_activity: list[RecentActivityItem]
    analytics: list[AnalyticsPoint]