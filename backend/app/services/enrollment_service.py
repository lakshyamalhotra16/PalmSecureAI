from sqlalchemy.orm import Session

from app.ai.detector import PalmDetector
from app.ai.feature_extractor import FeatureExtractor

from app.database import crud

from app.schemas.palm import PalmCreate
from app.schemas.user import UserCreate

from app.utils.feature_vector import serialize_feature_vector


class EnrollmentService:
    """
    Handles employee palm enrollment.

    Workflow:
    1. Find existing employee by employee ID.
    2. Create the employee if it does not exist.
    3. Detect a palm from the supplied image.
    4. Extract palm landmarks.
    5. Generate the 1445-dimensional feature vector.
    6. Validate the feature vector.
    7. Serialize the vector before storing it in the database.
    8. Create a palm biometric record.
    9. Return the enrolled user and palm record.
    """

    EXPECTED_FEATURE_COUNT = 1445

    detector = PalmDetector()

    @staticmethod
    def enroll_user(
        db: Session,
        user: UserCreate,
        image_path: str,
    ):
        try:
            # ====================================================
            # VALIDATE INPUT
            # ====================================================

            if not image_path:
                raise ValueError(
                    "Palm image path is required."
                )

            if not user.employee_id:
                raise ValueError(
                    "Employee ID is required."
                )

            if not user.full_name:
                raise ValueError(
                    "Employee name is required."
                )

            if not user.department:
                raise ValueError(
                    "Department is required."
                )

            print(
                f"Starting enrollment for employee: "
                f"{user.employee_id}"
            )

            print(
                f"Enrollment image path: {image_path}"
            )

            # ====================================================
            # FIND EXISTING USER
            # ====================================================

            existing_user = (
                crud.get_user_by_employee_id(
                    db,
                    user.employee_id,
                )
            )

            # ====================================================
            # CREATE USER ONLY IF NOT EXISTS
            # ====================================================

            if existing_user is None:

                created_user = crud.create_user(
                    db,
                    user,
                )

                print(
                    f"Created new employee: "
                    f"{created_user.employee_id}"
                )

            else:

                created_user = existing_user

                print(
                    f"Using existing employee: "
                    f"{created_user.employee_id}"
                )

            # ====================================================
            # PALM DETECTION
            # ====================================================

            results = (
                EnrollmentService.detector.detect(
                    image_path
                )
            )

            if results is None:
                raise ValueError(
                    "Palm detection failed."
                )

            if not results.multi_hand_landmarks:
                raise ValueError(
                    "No palm detected in the uploaded image."
                )

            print(
                "Palm detected successfully."
            )

            # ====================================================
            # LANDMARK EXTRACTION
            # ====================================================

            landmarks = (
                FeatureExtractor.extract_landmarks(
                    results
                )
            )

            if not landmarks:
                raise ValueError(
                    "Palm landmarks could not be extracted."
                )

            print(
                f"Palm landmarks extracted: "
                f"{len(landmarks)}"
            )

            # ====================================================
            # FEATURE VECTOR GENERATION
            # ====================================================

            feature_vector = (
                FeatureExtractor.build_feature_vector(
                    landmarks,
                    image_path=image_path,
                )
            )

            if not feature_vector:
                raise ValueError(
                    "Could not generate palm feature vector."
                )

            print(
                "Feature vector generated."
            )

            print(
                f"Feature vector size: "
                f"{len(feature_vector)}"
            )

            # ====================================================
            # FEATURE VECTOR SIZE VALIDATION
            # ====================================================

            if (
                len(feature_vector)
                != EnrollmentService.EXPECTED_FEATURE_COUNT
            ):
                raise ValueError(
                    "Invalid palm feature vector size: "
                    f"{len(feature_vector)}. "
                    "Expected "
                    f"{EnrollmentService.EXPECTED_FEATURE_COUNT}."
                )

            # ====================================================
            # ENSURE FEATURE VECTOR CONTAINS NUMBERS
            # ====================================================

            try:
                feature_vector = [
                    float(value)
                    for value in feature_vector
                ]
            except (TypeError, ValueError) as exc:
                raise ValueError(
                    "Feature vector contains invalid values."
                ) from exc

            # ====================================================
            # SERIALIZE FEATURE VECTOR
            #
            # IMPORTANT:
            # Database expects feature_vector as STRING.
            # Do NOT pass the list directly to PalmCreate.
            # ====================================================

            serialized_vector = (
                serialize_feature_vector(
                    feature_vector
                )
            )

            if not isinstance(
                serialized_vector,
                str,
            ):
                raise ValueError(
                    "Feature vector serialization failed."
                )

            print(
                "Feature vector serialized successfully."
            )

            print(
                f"Serialized vector length: "
                f"{len(serialized_vector)}"
            )

            # ====================================================
            # CREATE PALM DATABASE RECORD
            # ====================================================

            palm_data = PalmCreate(
                image_path=image_path,
                feature_vector=serialized_vector,
                quality_score=0.0,
            )

            palm = crud.create_palm(
                db=db,
                user_id=created_user.id,
                palm=palm_data,
            )

            # ====================================================
            # FINAL LOG
            # ====================================================

            print(
                "================================================"
            )

            print(
                "PALM ENROLLMENT SUCCESSFUL"
            )

            print(
                f"Employee ID : "
                f"{created_user.employee_id}"
            )

            print(
                f"Employee Name : "
                f"{created_user.full_name}"
            )

            print(
                f"Department : "
                f"{created_user.department}"
            )

            print(
                f"User ID : "
                f"{created_user.id}"
            )

            print(
                f"Palm ID : "
                f"{palm.id}"
            )

            print(
                f"Feature Count : "
                f"{len(feature_vector)}"
            )

            print(
                "================================================"
            )

            # ====================================================
            # RETURN RESULT
            # ====================================================

            return {
                "user": created_user,
                "palm": palm,
            }

        except ValueError:
            db.rollback()
            raise

        except Exception as exc:
            db.rollback()

            import traceback

            traceback.print_exc()

            raise RuntimeError(
                "Palm enrollment failed."
            ) from exc