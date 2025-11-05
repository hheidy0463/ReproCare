import os
import requests
from typing import Dict, Optional
from dotenv import load_dotenv
from pathlib import Path

# Try loading from multiple locations
base_dir = Path(__file__).parent.parent  # api/
root_dir = base_dir.parent  # ReproCare/

# Load in order: api/.env, api/app/.env, root/.env.api, root/.env
# Use override=True so later files override earlier ones
load_dotenv(base_dir / ".env", override=False)  # api/.env
load_dotenv(base_dir / "app" / ".env", override=True)  # api/app/.env (override if exists)
load_dotenv(root_dir / ".env.api", override=True)  # root/.env.api (override if exists)
load_dotenv(root_dir / ".env", override=True)  # root/.env (fallback)

WHEREBY_API_KEY = os.getenv("WHEREBY_API_KEY")
WHEREBY_ROOM_TEMPLATE_ID = os.getenv("WHEREBY_ROOM_TEMPLATE_ID")


def create_room() -> Dict[str, str]:
    """Create a Whereby room or return existing room URL."""
    
    # Re-check env vars at runtime in case they were updated
    api_key = os.getenv("WHEREBY_API_KEY") or WHEREBY_API_KEY
    template_id = os.getenv("WHEREBY_ROOM_TEMPLATE_ID") or WHEREBY_ROOM_TEMPLATE_ID
    
    # If we have a template/room ID, use it directly to construct the embed URL
    # This avoids API permission issues by using the existing room
    if template_id:
        room_id = template_id
        # Use the embed URL format from Whereby
        join_url = f"https://repro-care.whereby.com/{room_id}"
        print(f"Using existing Whereby room: {room_id[:20]}...")
        return {
            "room_id": room_id,
            "join_url": join_url
        }
    
    # If no template ID, try API creation (only if API key is available)
    if not api_key:
        print("WARNING: No WHEREBY_ROOM_TEMPLATE_ID or WHEREBY_API_KEY, using stub room")
        return {
            "room_id": "demo-room",
            "join_url": "https://whereby.com/your-demo"
        }
    
    # Try API creation as fallback
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "isLocked": False,
        "roomMode": "normal"
    }
    
    try:
        response = requests.post(
            "https://api.whereby.com/v1/meetings",
            headers=headers,
            json=payload,
            timeout=10
        )
        response.raise_for_status()
        data = response.json()
        print(f"SUCCESS: Created Whereby room via API: {data.get('meetingId', 'unknown')}")
        return {
            "room_id": data.get("meetingId", "demo-room"),
            "join_url": data.get("roomUrl", "https://whereby.com/your-demo")
        }
    except Exception as e:
        print(f"WARNING: API creation failed ({e}), using stub room")
        return {
            "room_id": "demo-room",
            "join_url": "https://whereby.com/your-demo"
        }


def get_transcription(room_name: str) -> Optional[str]:
    """Fetch transcription for a room session from Whereby API."""
    api_key = os.getenv("WHEREBY_API_KEY") or WHEREBY_API_KEY
    
    if not api_key:
        print("WARNING: No WHEREBY_API_KEY for transcription fetch")
        return None
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    
    try:
        # First, let's see ALL available transcriptions to debug
        print(f"DEBUG: Fetching transcriptions for room: {room_name}")
        all_transcriptions_response = requests.get(
            "https://api.whereby.dev/v1/transcriptions",
            headers=headers,
            params={"limit": 20, "sortBy": "startDate:desc"},
            timeout=10
        )
        
        if all_transcriptions_response.status_code == 200:
            all_data = all_transcriptions_response.json()
            all_results = all_data.get("results", [])
            print(f"DEBUG: Found {len(all_results)} total transcriptions available")
            if all_results:
                print("DEBUG: Available room names in transcriptions:")
                for idx, t in enumerate(all_results[:10]):  # Show first 10
                    room_name_in_transcription = t.get('roomName', 'N/A')
                    transcription_type = t.get('type', 'N/A')
                    state = t.get('state', 'N/A')
                    start_date = t.get('startDate', 'N/A')
                    print(f"  {idx+1}. roomName: '{room_name_in_transcription}' | type: {transcription_type} | state: {state} | start: {start_date}")
                    
                # Check if any transcription matches our room ID (even partially)
                room_id_short = room_name.split('-')[-1] if '-' in room_name else room_name
                matching = [t for t in all_results if room_id_short in t.get('roomName', '')]
                if matching:
                    print(f"DEBUG: Found {len(matching)} transcriptions that might match our room ID")
                    for m in matching:
                        print(f"  Potential match: {m.get('roomName')} (state: {m.get('state')})")
        
        # Get transcriptions for the room
        # Try different room name formats - Whereby might use different formats
        # Format 1: /room-prefix-{uuid}
        # Format 2: just the room ID
        # Format 3: /repro-care/{room_id}
        # Format 4: /{org_id}/{room_id}
        # Format 5: Look for room name that contains our room ID
        room_name_variants = []
        if room_name.startswith("/"):
            room_name_variants.append(room_name)
            room_name_variants.append(room_name[1:])
        else:
            room_name_variants.append(room_name)
            room_name_variants.append(f"/{room_name}")
            # Try with subdomain prefix
            room_name_variants.append(f"/repro-care/{room_name}")
        
        # If we found transcriptions, try to match by room ID substring
        if all_results:
            room_id_short = room_name.split('-')[-1] if '-' in room_name else room_name
            for t in all_results:
                potential_room_name = t.get('roomName', '')
                if room_id_short in potential_room_name or room_name in potential_room_name:
                    if potential_room_name not in room_name_variants:
                        room_name_variants.insert(0, potential_room_name)  # Try exact match first
                        print(f"DEBUG: Added potential match to variants: {potential_room_name}")
        
        # Try each variant until we find transcriptions
        response = None
        data = None
        results = []
        
        for variant in room_name_variants:
            print(f"DEBUG: Trying room name variant: {variant}")
            # Get more transcriptions so we can filter for ready ones
            response = requests.get(
                "https://api.whereby.dev/v1/transcriptions",
                headers=headers,
                params={"roomName": variant, "limit": 10, "sortBy": "startDate:desc"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                all_results_for_room = data.get("results", [])
                if all_results_for_room:
                    print(f"✓ Found {len(all_results_for_room)} transcription(s) using room name variant: {variant}")
                    # Filter for only ready transcriptions
                    ready_results = [r for r in all_results_for_room if r.get("state") == "ready"]
                    if ready_results:
                        results = ready_results
                        print(f"  Found {len(ready_results)} ready transcription(s), using most recent")
                        print(f"  Using transcription from: {ready_results[0].get('startDate')}")
                    else:
                        print(f"  Found {len(all_results_for_room)} transcription(s) but none are ready yet")
                        # Show states for debugging
                        for r in all_results_for_room[:3]:  # Show first 3
                            print(f"    - State: {r.get('state')}, Start: {r.get('startDate')}, End: {r.get('endDate')}")
                        results = []  # No ready results
                    break
                else:
                    print(f"  No results for variant: {variant}")
            else:
                print(f"  Error {response.status_code} for variant: {variant}")
        
        if not results or not response or response.status_code != 200:
            print(f"WARNING: No transcriptions found for room {room_name} (tried variants: {room_name_variants})")
            if response:
                print(f"Last response status: {response.status_code}, text: {response.text[:500]}")
            return None
        
        # Get the most recent ready transcription
        transcription = results[0]
        transcription_id = transcription.get("transcriptionId")
        state = transcription.get("state")
        
        if state != "ready":
            print(f"WARNING: Transcription not ready (state: {state})")
            print(f"DEBUG: Transcription details - ID: {transcription_id}, Start: {transcription.get('startDate')}, End: {transcription.get('endDate')}")
            print(f"NOTE: Transcriptions may take a few minutes to process after the meeting ends")
            print(f"TIP: Wait a moment and try 'End visit' again once the transcription is ready")
            return None
        
        # Get access link to download transcription
        access_response = requests.get(
            f"https://api.whereby.dev/v1/transcriptions/{transcription_id}/access-link",
            headers=headers,
            timeout=10
        )
        
        if access_response.status_code != 200:
            print(f"WARNING: Failed to get transcription access link: {access_response.status_code}")
            return None
        
        access_data = access_response.json()
        access_link = access_data.get("accessLink")
        
        if not access_link:
            print("WARNING: No access link in response")
            return None
        
        # Download the transcription content
        transcript_response = requests.get(access_link, timeout=10)
        if transcript_response.status_code == 200:
            transcription_text = transcript_response.text
            print(f"SUCCESS: Retrieved transcription ({len(transcription_text)} chars)")
            return transcription_text
        else:
            print(f"WARNING: Failed to download transcription: {transcript_response.status_code}")
            return None
            
    except Exception as e:
        print(f"ERROR fetching transcription: {e}")
        return None
