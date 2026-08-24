from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.database import crud


router = APIRouter(
    prefix="/palms",
    tags=["Palms"],
)


@router.get("/")
def get_all_palms(
    db: Session = Depends(get_db),
):
    palms = crud.get_all_palms(db)

    return [
        {
            "id": palm.id,
            "user_id": palm.user_id,
            "image_path": palm.image_path,
            "quality_score": palm.quality_score,
        }
        for palm in palms
    ]


@router.get("/{palm_id}")
def get_palm(
    palm_id: int,
    db: Session = Depends(get_db),
):
    palm = crud.get_palm_by_id(
        db,
        palm_id,
    )

    if palm is None:
        raise HTTPException(
            status_code=404,
            detail="Palm not found.",
        )

    return {
        "id": palm.id,
        "user_id": palm.user_id,
        "image_path": palm.image_path,
        "quality_score": palm.quality_score,
    }


@router.delete("/{palm_id}")
def delete_palm(
    palm_id: int,
    db: Session = Depends(get_db),
):
    deleted = crud.delete_palm(
        db,
        palm_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Palm not found.",
        )

    return {
        "message": "Palm deleted successfully.",
        "palm_id": palm_id,
    }