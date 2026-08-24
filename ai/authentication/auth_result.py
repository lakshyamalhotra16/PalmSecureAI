from dataclasses import dataclass
from typing import Optional

@dataclass
class AuthenticationResult:
    success: bool
    user_id: Optional[str]
    confidence: float
    message: str
    processing_time: float