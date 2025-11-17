// Shared in-memory store (replace with Vercel Postgres for production)
declare global {
  var visits: Map<string, any> | undefined
}

if (!global.visits) {
  global.visits = new Map()
}

export const visitsStore = global.visits

// LLM helper
export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const llmApiKey = process.env.LLM_API_KEY
  const llmBaseUrl = process.env.LLM_BASE_URL || "https://api.openai.com/v1/chat/completions"

  if (!llmApiKey) {
    // Return stub response
    return getStubResponse(systemPrompt, userPrompt)
  }

  try {
    const response = await fetch(llmBaseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${llmApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || data.choices[0]?.text || "{}"
  } catch (error) {
    console.error("LLM API error:", error)
    return getStubResponse(systemPrompt, userPrompt)
  }
}

function getStubResponse(systemPrompt: string, userPrompt: string): string {
  if (systemPrompt.includes("intake") || userPrompt.includes("intake")) {
    return JSON.stringify({
      intake_structured: {
        reason: "birth control consult",
        age: 20,
        last_period: "2025-01-15",
        pregnancy_risk: "low",
        contra_indications: ["none known"],
        preferences: { method: "pill", frequency: "daily" },
        history: { smoking: "no", migraine_with_aura: "no" },
        insurance: { has_insurance: false },
      },
      provider_note:
        "Chief concern: Patient seeking birth control pill for contraception.\nKey history: 20 year old, non-smoker, no migraine with aura, low pregnancy risk.\nRed flags: None identified.\nPlan suggestion: Consider combination oral contraceptive pill given preferences and no contraindications.",
      patient_summary:
        "We talked about your birth control options today. You are 20 years old and prefer a daily pill. You do not smoke and have no history of migraine with aura. Your risk of pregnancy right now is low. We discussed starting a combination birth control pill that you take once a day.",
    })
  }

  if (systemPrompt.includes("post visit") || userPrompt.includes("post visit")) {
    return JSON.stringify({
      patient_summary: {
        what_we_discussed:
          "We talked about starting you on a birth control pill. This pill contains hormones that prevent pregnancy. You will take one pill every day at the same time. It is important to take it every day to keep you protected.",
        next_steps: [
          "Start taking the pill tomorrow morning with your first meal",
          "Pick up your prescription at the pharmacy within 3 days",
          "Schedule a follow up in 3 months to check how you are doing",
        ],
        watch_fors: [
          "If you miss a pill, take it as soon as you remember",
          "If you have severe chest pain or leg swelling, call us right away",
          "If you have unusual bleeding that lasts more than a week, let us know",
        ],
      },
      plain_text:
        "We talked about starting you on a birth control pill. This pill contains hormones that prevent pregnancy. You will take one pill every day at the same time. It is important to take it every day to keep you protected.\n\nNext steps:\n- Start taking the pill tomorrow morning with your first meal\n- Pick up your prescription at the pharmacy within 3 days\n- Schedule a follow up in 3 months to check how you are doing\n\nWatch for:\n- If you miss a pill, take it as soon as you remember\n- If you have severe chest pain or leg swelling, call us right away\n- If you have unusual bleeding that lasts more than a week, let us know",
    })
  }

  return "{}"
}

// Whereby helper
export async function createWherebyRoom(): Promise<{ room_id: string; join_url: string }> {
  const templateId = process.env.WHEREBY_ROOM_TEMPLATE_ID
  const apiKey = process.env.WHEREBY_API_KEY

  // Use template if available
  if (templateId) {
    return {
      room_id: templateId,
      join_url: `https://repro-care.whereby.com/${templateId}`,
    }
  }

  // Try to create via API if key is available
  if (apiKey) {
    try {
      const response = await fetch("https://api.whereby.com/v1/meetings", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isLocked: false,
          roomMode: "normal",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          room_id: data.meetingId || "demo-room",
          join_url: data.roomUrl || "https://whereby.com/your-demo",
        }
      }
    } catch (error) {
      console.error("Whereby API error:", error)
    }
  }

  // Fallback to demo room
  return {
    room_id: "demo-room",
    join_url: "https://whereby.com/your-demo",
  }
}

