from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(slots=True)
class DatabaseConfig:

    database_directory: Path = Path("data/database")
    database_file: str = "embeddings.pkl"
    create_directory: bool = True
    overwrite_existing: bool = False

    @property
    def database_path(self) -> Path:


        return self.database_directory / self.database_file