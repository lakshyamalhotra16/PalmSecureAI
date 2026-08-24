from pydantic import BaseModel
class PalmCreate(BaseModel):
    image_path: str
    feature_vector: str
    quality_score: float

class PalmResponse(BaseModel):
    id: int
    image_path: str
    quality_score: float

    model_config = {
        "from_attributes": True
    }

class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    department: str


class UserResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    department: str | None = None

    model_config = {
        "from_attributes": True
    }
