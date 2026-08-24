from pydantic import BaseModel


class AuthenticationResponse(BaseModel):
    authenticated: bool
    confidence: float
    distance: float
    similarity: float
    employee_id: str
    full_name: str