from pydantic import BaseModel, ConfigDict


class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    department: str
    status: str

    model_config = ConfigDict(from_attributes=True)


class EmployeeListResponse(BaseModel):
    total: int
    employees: list[EmployeeResponse]