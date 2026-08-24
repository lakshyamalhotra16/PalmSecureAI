import json
import logging

from sqlalchemy.orm import Session

from app.ai.detector import PalmDetector
from app.ai.feature_extractor import FeatureExtractor
from app.ai.matcher import PalmMatcher
from app.database import crud


logger = logging.getLogger("PalmSecureAI")


class AuthenticationService:

    detector = PalmDetector()

    FEATURE_COUNT = 1445

    # Keep this realistic for the current matcher.
    SIMILARITY_THRESHOLD = 0.70

    # Prevent two nearly identical candidates from being accepted.
    MINIMUM_MARGIN = 0.02

    @staticmethod
    def authenticate(
        db: Session,
        image_path: str,
    ) -> dict:

        logger.info(
            "Authentication process started."
        )

        # =========================================================
        # VALIDATE IMAGE
        # =========================================================

        if not image_path:
            raise ValueError(
                "Authentication image path is empty."
            )

        logger.info(
            f"Authentication image path: {image_path}"
        )

        # =========================================================
        # PALM DETECTION
        # =========================================================

        results = AuthenticationService.detector.detect(
            image_path
        )

        if results is None:
            raise ValueError(
                "Palm detection failed."
            )

        if not results.multi_hand_landmarks:
            raise ValueError(
                "No palm detected in the uploaded image."
            )

        # =========================================================
        # LANDMARK EXTRACTION
        # =========================================================

        landmarks = (
            FeatureExtractor.extract_landmarks(
                results
            )
        )

        if not landmarks:
            raise ValueError(
                "Palm landmarks could not be extracted."
            )

        logger.info(
            f"Extracted landmarks: {len(landmarks)}"
        )

        # =========================================================
        # FEATURE VECTOR
        # =========================================================

        input_vector = (
            FeatureExtractor.build_feature_vector(
                landmarks=landmarks,
                image_path=image_path,
            )
        )

        if not input_vector:
            raise ValueError(
                "Could not generate palm feature vector."
            )

        logger.info(
            "Authentication feature vector size: "
            f"{len(input_vector)}"
        )

        if len(input_vector) != (
            AuthenticationService.FEATURE_COUNT
        ):
            raise ValueError(
                "Invalid authentication feature vector "
                f"size: {len(input_vector)}. "
                f"Expected "
                f"{AuthenticationService.FEATURE_COUNT}."
            )

        # =========================================================
        # LOAD ENROLLED PALMS
        # =========================================================

        all_palms = crud.get_all_palms(db)

        if not all_palms:
            raise ValueError(
                "No enrolled palms found."
            )

        logger.info(
            f"Total enrolled palms: {len(all_palms)}"
        )

        # =========================================================
        # MATCH AGAINST EVERY ENROLLED PALM
        # =========================================================

        matches = []

        for palm in all_palms:

            if not palm.feature_vector:
                logger.warning(
                    f"Skipping Palm ID {palm.id}: "
                    "feature vector is empty."
                )
                continue

            try:

                stored_vector = palm.feature_vector

                if isinstance(
                    stored_vector,
                    str
                ):
                    stored_vector = json.loads(
                        stored_vector
                    )

                result = PalmMatcher.authenticate(
                    stored_vector,
                    input_vector,
                )

                user = crud.get_user_by_id(
                    db,
                    palm.user_id,
                )

                if user is None:
                    logger.warning(
                        f"User not found for Palm ID "
                        f"{palm.id}. Skipping."
                    )
                    continue

                matches.append(
                    {
                        "palm": palm,
                        "user": user,
                        "result": result,
                    }
                )

                logger.info(
                    f"Palm ID {palm.id} | "
                    f"Employee {user.employee_id} | "
                    f"Similarity "
                    f"{result.similarity:.6f} | "
                    f"Confidence "
                    f"{result.confidence:.2f}% | "
                    f"Distance "
                    f"{result.distance:.6f}"
                )

            except Exception as exc:

                logger.warning(
                    f"Unable to compare Palm ID "
                    f"{palm.id}: {exc}"
                )

        # =========================================================
        # NO COMPARISONS
        # =========================================================

        if not matches:
            raise ValueError(
                "Unable to compare authentication data "
                "with enrolled palms."
            )

        # =========================================================
        # SORT BEST MATCH FIRST
        # =========================================================

        matches.sort(
            key=lambda item: (
                item["result"].similarity
            ),
            reverse=True,
        )

        best_match = matches[0]

        best_result = best_match["result"]
        best_palm = best_match["palm"]
        best_user = best_match["user"]

        # =========================================================
        # SECOND BEST MATCH
        # =========================================================

        second_best_similarity = 0.0

        if len(matches) > 1:
            second_best_similarity = (
                matches[1]["result"].similarity
            )

        margin = (
            best_result.similarity
            - second_best_similarity
        )

        # =========================================================
        # LOG BEST MATCH
        # =========================================================

        logger.info(
            "Best match | "
            f"Palm ID: {best_palm.id} | "
            f"Employee: {best_user.employee_id} | "
            f"Similarity: "
            f"{best_result.similarity:.6f} | "
            f"Confidence: "
            f"{best_result.confidence:.2f}% | "
            f"Second Best: "
            f"{second_best_similarity:.6f} | "
            f"Margin: {margin:.6f} | "
            f"Threshold: "
            f"{AuthenticationService.SIMILARITY_THRESHOLD:.6f}"
        )

        # =========================================================
        # AUTHENTICATION DECISION
        # =========================================================

        passes_threshold = (
            best_result.similarity
            >= AuthenticationService.SIMILARITY_THRESHOLD
        )

        passes_margin = (
            len(matches) == 1
            or margin
            >= AuthenticationService.MINIMUM_MARGIN
        )

        authenticated = (
            passes_threshold
            and passes_margin
        )

        if not authenticated:

            if not passes_threshold:

                logger.warning(
                    "Authentication rejected. "
                    f"Best similarity "
                    f"{best_result.similarity:.6f} "
                    f"is below "
                    f"{AuthenticationService.SIMILARITY_THRESHOLD:.6f}."
                )

            elif not passes_margin:

                logger.warning(
                    "Authentication rejected. "
                    f"Best and second-best matches "
                    f"are too close. "
                    f"Margin: {margin:.6f}."
                )

            raise ValueError(
                "Palm authentication failed."
            )

        # =========================================================
        # SUCCESS
        # =========================================================

        logger.info(
            "Authentication successful | "
            f"Employee: {best_user.employee_id} | "
            f"Similarity: "
            f"{best_result.similarity:.6f} | "
            f"Confidence: "
            f"{best_result.confidence:.2f}%"
        )

        return {
            "authenticated": True,
            "user_id": best_user.id,
            "employee_id": best_user.employee_id,
            "full_name": best_user.full_name,
            "department": best_user.department,
            "palm_id": best_palm.id,
            "confidence": best_result.confidence,
            "similarity": best_result.similarity,
            "distance": best_result.distance,
            "second_best_similarity": round(
                second_best_similarity,
                6,
            ),
            "margin": round(
                margin,
                6,
            ),
        }