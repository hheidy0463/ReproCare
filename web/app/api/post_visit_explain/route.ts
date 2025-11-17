import { NextRequest, NextResponse } from "next/server"
import { visitsStore } from "@/lib/api-helpers"
import { callLLM } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visit_id, provider_note, intake_structured } = body

    if (!visit_id) {
      return NextResponse.json({ error: "visit_id is required" }, { status: 400 })
    }

    const visit = visitsStore.get(visit_id)
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    // Note: Transcription fetching would go here if needed
    // For now, we'll use provider note
    const transcriptionText = visit.transcription_text || null

    const systemPrompt = "You write simple patient explanations. Reading level grade eight. Use short sentences."

    let userPrompt: string
    if (transcriptionText) {
      userPrompt = `Create a three part summary based on the actual meeting transcription:
one, what we talked about during the visit.
two, what to do next with any dates mentioned.
three, what to watch for and when to get help.

Meeting transcription:
${transcriptionText.substring(0, 4000)}`
    } else {
      userPrompt = `Create a three part summary:
one, what we talked about.
two, what to do next with any dates.
three, what to watch for and when to get help.

Provider note:
${provider_note || visit.provider_note || ""}

Intake structured JSON:
${JSON.stringify(intake_structured || visit.intake_structured || {})}`
    }

    const responseText = await callLLM(systemPrompt, userPrompt)

    let patientSummary: any = {
      what_we_discussed: "We discussed your birth control options.",
      next_steps: ["Follow up as recommended"],
      watch_fors: ["Contact us if you have concerns"],
    }
    let plainText = "We discussed your birth control options. Follow up as recommended. Contact us if you have concerns."

    try {
      const parsed = JSON.parse(responseText)
      patientSummary = parsed.patient_summary || patientSummary
      plainText = parsed.plain_text || plainText
    } catch {
      // Use defaults
    }

    visit.patient_summary = plainText
    visit.status = "summary_ready"
    if (!visit.audit_events) {
      visit.audit_events = []
    }
    visit.audit_events.push(`summary_ready:${new Date().toISOString()}`)
    visitsStore.set(visit_id, visit)

    return NextResponse.json({
      patient_summary: patientSummary,
      plain_text: plainText,
    })
  } catch (error) {
    console.error("Error generating summary:", error)
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 })
  }
}

