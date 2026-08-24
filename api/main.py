from fastapi import FastAPI

from database.connection import create_database
from api.routes.health import router as health_router
from api.routes.enrollment import router as enrollment_router
from api.routes.authentication import router as authentication_router

create_database()

app = FastAPI(
    title="PalmSecureAI API",
    version="1.0.0",
    description="Palm Biometric Authentication API",
)

app.include_router(health_router)
app.include_router(enrollment_router)
app.include_router(authentication_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to PalmSecureAI API"
    }