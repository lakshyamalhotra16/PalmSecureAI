from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np
from api.services.biometric_service import BiometricService

router = APIRouter(
    prefix="/authentication",
    tags=["Authentication"],
)

service = BiometricService()


@router.get("/")
async def authentication_info():
    return {
        "module": "Authentication API",
        "status": "Ready",
    }


@router.post("/authenticate")
async def authenticate_user(
    image: UploadFile = File(...),
):
    """
    Authenticate a user from an uploaded palm image.
    """

    try:

        image_bytes = await image.read()

        np_array = np.frombuffer(
            image_bytes,
            dtype=np.uint8,
        )

        frame = cv2.imdecode(
            np_array,
            cv2.IMREAD_COLOR,
        )

        if frame is None:
            raise HTTPException(
                status_code=400,
                detail="Invalid image.",
            )

        result = service.authenticate(frame)

        return {
            "success": result.success,
            "user_id": result.user_id,
            "confidence": result.confidence,
            "message": result.message,
            "processing_time": result.processing_time,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )