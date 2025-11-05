from sqlalchemy import Column, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class Visit(Base):
    __tablename__ = "visit"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="created")
    patient_profile = Column(JSON, nullable=True)
    intake_raw = Column(JSON, nullable=True)
    intake_structured = Column(JSON, nullable=True)
    provider_note = Column(Text, nullable=True)
    patient_summary = Column(Text, nullable=True)
    video_room_id = Column(String, nullable=True)
    transcription_text = Column(Text, nullable=True)
    pharmacy_request = Column(JSON, nullable=True)
    audit_events = Column(JSON, default=list)

