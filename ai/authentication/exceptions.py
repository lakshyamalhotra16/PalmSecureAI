class AuthenticationError(Exception):
    """Base exception for authentication."""


class HandNotDetectedError(AuthenticationError):
    """Raised when no hand is detected."""


class ROIExtractionError(AuthenticationError):
    """Raised when ROI extraction fails."""


class FeatureExtractionError(AuthenticationError):
    """Raised when embedding generation fails."""


class DatabaseError(AuthenticationError):
    """Raised when database access fails."""


class MatcherError(AuthenticationError):
    """Raised when matching fails."""