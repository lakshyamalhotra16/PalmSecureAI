from __future__ import annotations

from ai.database.embedding_database import EmbeddingDatabase
from ai.database.enrollment import Enrollment


def main() -> None:
    """
    Test the enrollment and embedding database.
    """

    database = EmbeddingDatabase()

    enrollment = Enrollment(
        database=database,
    )

    enrollment.enroll_user(
        user_name="Lakshya",
        image_path=r"C:\PalmSecureAI\data\dataset\Lakshya\WIN_20260725_13_19_38_Pro.jpg",
    )

    print("\n" + "=" * 50)
    print("Embedding Database")
    print("=" * 50)

    print(f"Total Users : {database.total_users()}")

    print("\nRegistered Users:")

    for user in database.list_users():
        print(f"• {user}")

    print("\nEnrollment completed successfully.")


if __name__ == "__main__":
    main()