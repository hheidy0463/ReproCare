import os
import requests
import json
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()

LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1/chat/completions")
LLM_API_KEY = os.getenv("LLM_API_KEY")


def chat(system_prompt: str, user_prompt: str) -> str:
    """Call LLM API with system and user prompts."""
    
    if not LLM_API_KEY:
        # Return stub responses for demo
        return _get_stub_response(system_prompt, user_prompt)
    
    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Check if it's OpenAI-style chat completions
    if "chat/completions" in LLM_BASE_URL:
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7
        }
    else:
        # Legacy completions format
        payload = {
            "model": "gpt-3.5-turbo-instruct",
            "prompt": f"{system_prompt}\n\n{user_prompt}",
            "temperature": 0.7,
            "max_tokens": 1000
        }
    
    try:
        response = requests.post(LLM_BASE_URL, headers=headers, json=payload, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if "choices" in data:
            if "message" in data["choices"][0]:
                return data["choices"][0]["message"]["content"]
            return data["choices"][0]["text"]
        
        return str(data)
    except Exception as e:
        # Fallback to stub on error
        return _get_stub_response(system_prompt, user_prompt)


def _get_stub_response(system_prompt: str, user_prompt: str) -> str:
    """Return hardcoded stub responses for demo."""
    
    if "intake" in system_prompt.lower() or "intake" in user_prompt.lower():
        return '''{
  "intake_structured": {
    "reason": "birth control consult",
    "age": 20,
    "last_period": "2025-01-15",
    "pregnancy_risk": "low",
    "contra_indications": ["none known"],
    "preferences": {"method": "pill", "frequency": "daily"},
    "history": {"smoking": "no", "migraine_with_aura": "no"},
    "insurance": {"has_insurance": false}
  },
  "provider_note": "Chief concern: Patient seeking birth control pill for contraception.\nKey history: 20 year old, non-smoker, no migraine with aura, low pregnancy risk.\nRed flags: None identified.\nPlan suggestion: Consider combination oral contraceptive pill given preferences and no contraindications.",
  "patient_summary": "We talked about your birth control options today. You are 20 years old and prefer a daily pill. You do not smoke and have no history of migraine with aura. Your risk of pregnancy right now is low. We discussed starting a combination birth control pill that you take once a day."
}'''
    
    if "post visit" in system_prompt.lower() or "post visit" in user_prompt.lower():
        return '''{
  "patient_summary": {
    "what_we_discussed": "We talked about starting you on a birth control pill. This pill contains hormones that prevent pregnancy. You will take one pill every day at the same time. It is important to take it every day to keep you protected.",
    "next_steps": [
      "Start taking the pill tomorrow morning with your first meal",
      "Pick up your prescription at the pharmacy within 3 days",
      "Schedule a follow up in 3 months to check how you are doing"
    ],
    "watch_fors": [
      "If you miss a pill, take it as soon as you remember",
      "If you have severe chest pain or leg swelling, call us right away",
      "If you have unusual bleeding that lasts more than a week, let us know"
    ]
  },
  "plain_text": "We talked about starting you on a birth control pill. This pill contains hormones that prevent pregnancy. You will take one pill every day at the same time. It is important to take it every day to keep you protected.\\n\\nNext steps:\\n- Start taking the pill tomorrow morning with your first meal\\n- Pick up your prescription at the pharmacy within 3 days\\n- Schedule a follow up in 3 months to check how you are doing\\n\\nWatch for:\\n- If you miss a pill, take it as soon as you remember\\n- If you have severe chest pain or leg swelling, call us right away\\n- If you have unusual bleeding that lasts more than a week, let us know"
}'''
    
    return "{}"
