from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

UPLOAD_DIR = Path("storage/palm_images")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_image(file: UploadFile) -> str:
    extension = Path(file.filename).suffix

    filename = f"{uuid4()}{extension}"

    file_path = UPLOAD_DIR / filename

    with open(file_path, "wb") as image:
        image.write(file.file.read())

    return str(file_path)