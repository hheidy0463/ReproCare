import { NextRequest, NextResponse } from "next/server"
import { visitsStore } from "@/lib/api-helpers"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ visitId: string }> }
) {
  try {
    const { visitId } = await params

    if (!visitId) {
      return NextResponse.json({ error: "visit_id is required" }, { status: 400 })
    }

    const visit = visitsStore.get(visitId)

    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    return NextResponse.json(visit)
  } catch (error) {
    console.error("Error getting visit:", error)
    return NextResponse.json({ error: "Failed to get visit" }, { status: 500 })
  }
}

