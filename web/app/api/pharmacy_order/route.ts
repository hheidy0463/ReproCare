import { NextRequest, NextResponse } from "next/server"
import { visitsStore } from "@/lib/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { visit_id, shipping, plan } = body

    if (!visit_id) {
      return NextResponse.json({ error: "visit_id is required" }, { status: 400 })
    }

    const visit = visitsStore.get(visit_id)
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 })
    }

    const orderId = `stub-${visit_id.substring(0, 8)}`

    visit.pharmacy_request = {
      shipping: shipping || {},
      plan: plan || "cash",
      order_id: orderId,
    }
    visit.status = "pharmacy_created"
    if (!visit.audit_events) {
      visit.audit_events = []
    }
    visit.audit_events.push(`pharmacy_created:${new Date().toISOString()}`)
    visitsStore.set(visit_id, visit)

    return NextResponse.json({
      order_id: orderId,
      status: "created",
    })
  } catch (error) {
    console.error("Error creating pharmacy order:", error)
    return NextResponse.json({ error: "Failed to create pharmacy order" }, { status: 500 })
  }
}

