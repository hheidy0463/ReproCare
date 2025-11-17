import { NextRequest, NextResponse } from "next/server"
import { visitsStore } from "@/lib/api-helpers"
import { callLLM } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visit_id, qa } = body

    if (!visit_id || !qa) {
      return NextResponse.json({ error: "visit_id and qa are required" }, { status: 400 })
    }

    const visit = visitsStore.get(visit_id)
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    // Format Q&A for LLM
    const qaText = qa.map((item: any) => `Q: ${item.q}\nA: ${item.a}`).join("\n")

    const systemPrompt =
      "You convert short intake Q and A into JSON for a clinician and a patient. Follow the target schema. Unknown fields are null. Do not invent data."

    const userPrompt = `Convert the following Q and A into:
1) intake_structured JSON with fields reason, age, last_period, pregnancy_risk, contra_indications, preferences, history, insurance
2) provider_note with four lines: chief concern, key history, red flags, plan suggestion
3) patient_summary at grade eight reading level with two short paragraphs

Q and A:
${qaText}`

    const responseText = await callLLM(systemPrompt, userPrompt)

    let intakeStructured = {}
    let providerNote = ""
    let patientSummary = ""

    try {
      const parsed = JSON.parse(responseText)
      intakeStructured = parsed.intake_structured || {}
      providerNote = parsed.provider_note || "Intake completed. Review patient responses."
      patientSummary = parsed.patient_summary || "We reviewed your intake information."
    } catch {
      intakeStructured = {}
      providerNote = "Intake completed. Review patient responses."
      patientSummary = "We reviewed your intake information."
    }

    // Update visit
    visit.intake_raw = qa.map((item: any) => ({ q: item.q, a: item.a }))
    visit.intake_structured = intakeStructured
    visit.provider_note = providerNote
    visit.patient_summary = patientSummary
    visit.status = "intake_complete"
    if (!visit.audit_events) {
      visit.audit_events = []
    }
    visit.audit_events.push(`intake_finished:${new Date().toISOString()}`)
    visitsStore.set(visit_id, visit)

    return NextResponse.json({
      intake_structured: intakeStructured,
      provider_note: providerNote,
      patient_summary: patientSummary,
      events_added: ["intake_finished"],
    })
  } catch (error) {
    console.error("Error processing intake:", error)
    return NextResponse.json({ error: "Failed to process intake" }, { status: 500 })
  }
}

