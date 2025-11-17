import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { visitsStore } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const visitId = uuidv4()
    const visit = {
      id: visitId,
      created_at: new Date().toISOString(),
      status: "created",
      patient_profile: null,
      intake_raw: null,
      intake_structured: null,
      provider_note: null,
      patient_summary: null,
      video_room_id: null,
      transcription_text: null,
      pharmacy_request: null,
      audit_events: [`visit_created:${new Date().toISOString()}`],
    }

    visitsStore.set(visitId, visit)

    return NextResponse.json({ visit_id: visitId })
  } catch (error) {
    console.error("Error creating visit:", error)
    return NextResponse.json({ error: "Failed to create visit" }, { status: 500 })
  }
}

