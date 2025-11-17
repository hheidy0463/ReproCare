import { NextRequest, NextResponse } from "next/server"
import { visitsStore } from "@/lib/api-helpers"
import { createWherebyRoom } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visit_id } = body

    if (!visit_id) {
      return NextResponse.json({ error: "visit_id is required" }, { status: 400 })
    }

    const visit = visitsStore.get(visit_id)
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    const roomData = await createWherebyRoom()

    visit.video_room_id = roomData.room_id
    visit.status = "visit_started"
    if (!visit.audit_events) {
      visit.audit_events = []
    }
    visit.audit_events.push(`visit_started:${new Date().toISOString()}`)
    visitsStore.set(visit_id, visit)

    return NextResponse.json({
      room_id: roomData.room_id,
      join_url: roomData.join_url,
    })
  } catch (error) {
    console.error("Error creating room:", error)
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
  }
}

