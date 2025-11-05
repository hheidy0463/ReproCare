from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from app.models import Base
import os
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL", "sqlite:///./mvp.sqlite")

engine = create_engine(
    database_url,
    connect_args={"check_same_thread": False} if "sqlite" in database_url else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initialize database and run migrations."""
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Run migrations for existing tables
    if "sqlite" in database_url:
        inspector = inspect(engine)
        if "visit" in inspector.get_table_names():
            columns = [col["name"] for col in inspector.get_columns("visit")]
            
            # Migration: Add transcription_text column if it doesn't exist
            if "transcription_text" not in columns:
                with engine.connect() as conn:
                    conn.execute(text("ALTER TABLE visit ADD COLUMN transcription_text TEXT"))
                    conn.commit()
                print("✓ Added transcription_text column to visit table")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
