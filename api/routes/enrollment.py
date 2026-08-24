from fastapi import APIRouter, UploadFile, File, HTTPException
import cv2
import numpy as np

from api.services.biometric_service import BiometricService

router = APIRouter(
    prefix="/enrollment",
    tags=["Enrollment"],
)

service = BiometricService()


@router.get("/")
async def enrollment_info():
    return {
        "module": "Enrollment API",
        "status": "Ready",
        "database_users": service.total_users(),
    }



@router.post("/enroll")
async def enroll_user(
    user_name: str,
    image: UploadFile = File(...),
):
    """
    Enroll a new user.
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

        service.enroll(
            user_name=user_name,
            frame=frame,
        )

        return {
            "success": True,
            "message": f"{user_name} enrolled successfully.",
            "total_users": service.total_users(),
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error),
        )