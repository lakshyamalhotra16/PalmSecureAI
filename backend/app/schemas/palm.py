from pydantic import BaseModel


class PalmCreate(BaseModel):
    image_path: str
    feature_vector: str
    quality_score: float = 0.0


class PalmResponse(BaseModel):
    id: int
    image_path: str
    quality_score: float

    model_config = {
        "from_attributes": True
    }