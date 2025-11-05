from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import json

from app.db import get_db, init_db
from app.models import Visit
from app.schemas import (
    IntakeRequest, IntakeResponse,
    RoomRequest, RoomResponse,
    PostVisitRequest, PostVisitResponse,
    PharmacyRequest, PharmacyResponse,
    VisitResponse
)
from app.llm import chat
from app.whereby import create_room

app = FastAPI(title="ReproCare API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.get("/")
def root():
    return {"message": "ReproCare API"}


@app.post("/intake_to_json", response_model=IntakeResponse)
def intake_to_json(request: IntakeRequest, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == request.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    # Format Q&A for LLM
    qa_text = "\n".join([f"Q: {item.q}\nA: {item.a}" for item in request.qa])
    
    system_prompt = """You convert short intake Q and A into JSON for a clinician and a patient.
Follow the target schema. Unknown fields are null. Do not invent data."""

    user_prompt = f"""Convert the following Q and A into:
1) intake_structured JSON with fields reason, age, last_period, pregnancy_risk, contra_indications, preferences, history, insurance
2) provider_note with four lines: chief concern, key history, red flags, plan suggestion
3) patient_summary at grade eight reading level with two short paragraphs

Q and A:
{qa_text}"""

    response_text = chat(system_prompt, user_prompt)
    
    try:
        # Parse JSON response
        parsed = json.loads(response_text)
        intake_structured = parsed.get("intake_structured", {})
        provider_note = parsed.get("provider_note", "")
        patient_summary = parsed.get("patient_summary", "")
    except:
        # Fallback if JSON parsing fails
        intake_structured = {}
        provider_note = "Intake completed. Review patient responses."
        patient_summary = "We reviewed your intake information."
    
    # Update visit
    visit.intake_raw = [{"q": item.q, "a": item.a} for item in request.qa]
    visit.intake_structured = intake_structured
    visit.provider_note = provider_note
    visit.patient_summary = patient_summary
    visit.status = "intake_complete"
    
    # Add audit event
    if not visit.audit_events:
        visit.audit_events = []
    visit.audit_events.append(f"intake_finished:{datetime.utcnow().isoformat()}")
    
    db.commit()
    
    return IntakeResponse(
        intake_structured=intake_structured,
        provider_note=provider_note,
        patient_summary=patient_summary,
        events_added=["intake_finished"]
    )


@app.post("/create_room", response_model=RoomResponse)
def create_room_endpoint(request: RoomRequest, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == request.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    room_data = create_room()
    
    visit.video_room_id = room_data["room_id"]
    visit.status = "visit_started"
    
    if not visit.audit_events:
        visit.audit_events = []
    visit.audit_events.append(f"visit_started:{datetime.utcnow().isoformat()}")
    
    db.commit()
    
    return RoomResponse(**room_data)


@app.post("/post_visit_explain", response_model=PostVisitResponse)
def post_visit_explain(request: PostVisitRequest, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == request.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    system_prompt = """You write simple patient explanations. Reading level grade eight. Use short sentences."""

    user_prompt = f"""Create a three part summary:
one, what we talked about.
two, what to do next with any dates.
three, what to watch for and when to get help.

Provider note:
{request.provider_note}

Intake structured JSON:
{json.dumps(request.intake_structured)}"""

    response_text = chat(system_prompt, user_prompt)
    
    try:
        parsed = json.loads(response_text)
        patient_summary = parsed.get("patient_summary", {})
        plain_text = parsed.get("plain_text", "")
    except:
        patient_summary = {
            "what_we_discussed": "We discussed your birth control options.",
            "next_steps": ["Follow up as recommended"],
            "watch_fors": ["Contact us if you have concerns"]
        }
        plain_text = "We discussed your birth control options. Follow up as recommended. Contact us if you have concerns."
    
    visit.patient_summary = plain_text
    visit.status = "summary_ready"
    
    if not visit.audit_events:
        visit.audit_events = []
    visit.audit_events.append(f"summary_ready:{datetime.utcnow().isoformat()}")
    
    db.commit()
    
    return PostVisitResponse(
        patient_summary=patient_summary,
        plain_text=plain_text
    )


@app.post("/pharmacy_order", response_model=PharmacyResponse)
def pharmacy_order(request: PharmacyRequest, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == request.visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    order_id = f"stub-{visit.id[:8]}"
    
    visit.pharmacy_request = {
        "shipping": request.shipping,
        "plan": request.plan,
        "order_id": order_id
    }
    visit.status = "pharmacy_created"
    
    if not visit.audit_events:
        visit.audit_events = []
    visit.audit_events.append(f"pharmacy_created:{datetime.utcnow().isoformat()}")
    
    db.commit()
    
    return PharmacyResponse(
        order_id=order_id,
        status="created"
    )


@app.get("/visit/{visit_id}", response_model=VisitResponse)
def get_visit(visit_id: str, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")
    
    return VisitResponse(
        id=visit.id,
        created_at=visit.created_at,
        status=visit.status,
        patient_profile=visit.patient_profile,
        intake_raw=visit.intake_raw,
        intake_structured=visit.intake_structured,
        provider_note=visit.provider_note,
        patient_summary=visit.patient_summary,
        video_room_id=visit.video_room_id,
        pharmacy_request=visit.pharmacy_request,
        audit_events=visit.audit_events
    )


@app.post("/visit")
def create_visit(db: Session = Depends(get_db)):
    visit = Visit()
    db.add(visit)
    db.commit()
    db.refresh(visit)
    
    if not visit.audit_events:
        visit.audit_events = []
    visit.audit_events.append(f"visit_created:{datetime.utcnow().isoformat()}")
    db.commit()
    
    return {"visit_id": visit.id}

