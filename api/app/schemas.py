from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class QAPair(BaseModel):
    q: str
    a: str


class IntakeRequest(BaseModel):
    visit_id: str
    qa: List[QAPair]


class IntakeStructured(BaseModel):
    reason: Optional[str] = None
    age: Optional[int] = None
    last_period: Optional[str] = None
    pregnancy_risk: Optional[str] = None
    contra_indications: Optional[List[str]] = None
    preferences: Optional[Dict[str, Any]] = None
    history: Optional[Dict[str, Any]] = None
    insurance: Optional[Dict[str, Any]] = None


class IntakeResponse(BaseModel):
    intake_structured: Dict[str, Any]
    provider_note: str
    patient_summary: str
    events_added: List[str]


class RoomRequest(BaseModel):
    visit_id: str


class RoomResponse(BaseModel):
    room_id: str
    join_url: str


class PostVisitRequest(BaseModel):
    visit_id: str
    provider_note: str
    intake_structured: Dict[str, Any]


class PostVisitResponse(BaseModel):
    patient_summary: Dict[str, Any]
    plain_text: str


class PharmacyRequest(BaseModel):
    visit_id: str
    shipping: Dict[str, str]
    plan: str


class PharmacyResponse(BaseModel):
    order_id: str
    status: str


class VisitResponse(BaseModel):
    id: str
    created_at: datetime
    status: str
    patient_profile: Optional[Dict[str, Any]] = None
    intake_raw: Optional[List[Dict[str, Any]]] = None
    intake_structured: Optional[Dict[str, Any]] = None
    provider_note: Optional[str] = None
    patient_summary: Optional[str] = None
    video_room_id: Optional[str] = None
    pharmacy_request: Optional[Dict[str, Any]] = None
    audit_events: Optional[List[str]] = None
