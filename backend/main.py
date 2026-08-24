from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.enrollment import router as enrollment_router
from app.api.routes.authentication import router as authentication_router
from app.api.routes.dashboard import router as dashboard_router
from app.api.routes.users import router as users_router
from app.api.routes.attendance import router as attendance_router
from app.api.routes.palms import router as palms_router
from app.core.config import settings
from app.core.logger import logger

from app.database.base import Base
from app.database.database import engine

# Import models so SQLAlchemy registers all model metadata
from app.database import models  # noqa: F401


# ============================================================
# DATABASE INITIALIZATION
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# STARTUP LOG
# ============================================================

logger.info("PalmSecureAI Backend Started")


# ============================================================
# API ROUTES
# ============================================================

app.include_router(
    health_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    enrollment_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    authentication_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    dashboard_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    users_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    attendance_router,
    prefix=settings.API_PREFIX,
)

app.include_router(
    palms_router,
    prefix=settings.API_PREFIX,
)

# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get(
    "/",
    tags=["Root"],
)
async def root():
    logger.info("Root endpoint accessed")

    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
    }