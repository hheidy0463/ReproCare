import os
import requests
from typing import Dict
from dotenv import load_dotenv

load_dotenv()

WHEREBY_API_KEY = os.getenv("WHEREBY_API_KEY")
WHEREBY_ROOM_TEMPLATE_ID = os.getenv("WHEREBY_ROOM_TEMPLATE_ID")


def create_room() -> Dict[str, str]:
    """Create a Whereby room or return stub."""
    
    if not WHEREBY_API_KEY:
        return {
            "room_id": "demo-room",
            "join_url": "https://whereby.com/your-demo"
        }
    
    headers = {
        "Authorization": f"Bearer {WHEREBY_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "isLocked": False,
        "roomMode": "normal"
    }
    
    if WHEREBY_ROOM_TEMPLATE_ID:
        payload["roomTemplateId"] = WHEREBY_ROOM_TEMPLATE_ID
    
    try:
        response = requests.post(
            "https://api.whereby.com/v1/meetings",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        return {
            "room_id": data.get("meetingId", "demo-room"),
            "join_url": data.get("roomUrl", "https://whereby.com/your-demo")
        }
    except Exception as e:
        # Fallback to stub
        return {
            "room_id": "demo-room",
            "join_url": "https://whereby.com/your-demo"
        }

