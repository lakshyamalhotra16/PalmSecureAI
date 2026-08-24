from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class AuthenticationConfig:
    similarity_threshold: float = 0.85
    max_authentication_time: float = 5.0
    require_single_hand: bool = True
    save_failed_attempts: bool = False
    log_authentication: bool = True
