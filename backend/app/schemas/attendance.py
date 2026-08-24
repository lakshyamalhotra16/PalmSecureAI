from datetime import date, time

from pydantic import BaseModel


class AttendanceCreate(BaseModel):

    user_id: int
    date: date
    check_in: time
    check_out: time | None = None
    working_hours: float = 0.0
    confidence: float
    status: str = "Present"


class AttendanceResponse(BaseModel):

    id: int
    user_id: int
    date: date
    check_in: time
    check_out: time | None = None
    working_hours: float
    confidence: float
    status: str

    model_config = {
        "from_attributes": True,
    }