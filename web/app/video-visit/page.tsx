"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, Video, Phone } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

async function fetchJSON(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }
  return response.json()
}

function VideoVisitPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [visitId, setVisitId] = useState<string | null>(null)
  const [visit, setVisit] = useState<any>(null)
  const [roomUrl, setRoomUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const roomCreationInitiatedRef = useRef(false)
  const hasEndedRef = useRef(false)

  // Initialize visit ID from URL params or create new one
  useEffect(() => {
    const initVisit = async () => {
      const idFromParams = searchParams.get("visitId")
      let visitIdToUse: string
      
      if (idFromParams) {
        visitIdToUse = idFromParams
        setVisitId(idFromParams)
        await loadVisit(idFromParams)
      } else {
        // Create new visit
        try {
          const data = await fetchJSON("/visit", { method: "POST" })
          visitIdToUse = data.visit_id
          setVisitId(data.visit_id)
          await loadVisit(data.visit_id)
        } catch (error) {
          console.error("Failed to create visit:", error)
          setIsLoading(false)
          return
        }
      }
      
      // Try to create room after a short delay to allow visit to load
      setTimeout(() => {
        if (!roomCreationInitiatedRef.current) {
          roomCreationInitiatedRef.current = true
          createRoom(visitIdToUse)
        }
      }, 1500)
    }
    initVisit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Poll visit status
  useEffect(() => {
    if (!visitId) return

    const pollInterval = setInterval(() => {
      loadVisit(visitId)
    }, 3000) // Poll every 3 seconds

    return () => clearInterval(pollInterval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId])

  // Handle room creation when intake is complete or visit is started
  useEffect(() => {
    if (visitId && !roomUrl && !roomCreationInitiatedRef.current) {
      // If we have a visit but no room, try to create one
      if (visit?.status === "intake_complete" || visit?.status === "visit_started" || !visit?.status) {
        roomCreationInitiatedRef.current = true
        createRoom(visitId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visit?.status, roomUrl, visitId])

  const loadVisit = async (id: string) => {
    try {
      const data = await fetchJSON(`/visit/${id}`)
      setVisit(data)

      // If we have a room ID but no URL yet, construct it
      if (data.video_room_id) {
        const newRoomUrl = `https://repro-care.whereby.com/${data.video_room_id}`
        console.log("Found existing room ID, using URL:", newRoomUrl)
        setRoomUrl((prevUrl) => {
          if (!prevUrl) {
            return newRoomUrl
          }
          return prevUrl
        })
      }


      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load visit:", error)
      setIsLoading(false)
    }
  }

  const createRoom = async (id: string) => {
    try {
      console.log("Creating room for visit:", id)
      const data = await fetchJSON("/create_room", {
        method: "POST",
        body: JSON.stringify({ visit_id: id }),
      })
      const url = data.join_url || `https://repro-care.whereby.com/${data.room_id}`
      console.log("Room created successfully, URL:", url)
      setRoomUrl(url)
    } catch (error) {
      console.error("Failed to create room:", error)
      // Fallback to demo room if API fails
      const fallbackUrl = `https://repro-care.whereby.com/8d9d69e5-e702-4767-89af-ff6430a8e265`
      console.log("Using fallback room URL:", fallbackUrl)
      setRoomUrl(fallbackUrl)
    }
  }

  const handleEndCall = async () => {
    if (hasEndedRef.current) return // Prevent multiple calls
    hasEndedRef.current = true

    if (!visitId) {
      alert("Visit ID not found. Please refresh the page.")
      hasEndedRef.current = false
      return
    }

    // Navigate to summary - if visit data isn't ready, still go to summary page
    try {
      if (visit?.provider_note && visit?.intake_structured) {
        await fetchJSON("/post_visit_explain", {
          method: "POST",
          body: JSON.stringify({
            visit_id: visitId,
            provider_note: visit.provider_note,
            intake_structured: visit.intake_structured,
          }),
        })
      }
      router.push(`/summary?visitId=${visitId}`)
    } catch (error) {
      console.error("Failed to generate summary:", error)
      // Still navigate even if API call fails
      router.push(`/summary?visitId=${visitId}`)
    }
  }

  // Listen for Whereby postMessage events to detect when user leaves
  useEffect(() => {
    if (!roomUrl || !visitId) return

    const handleMessage = (event: MessageEvent) => {
      // Whereby sends messages when events occur
      // Check if it's from Whereby domain
      if (event.origin.includes("whereby.com")) {
        console.log("Whereby message received:", event.data)
        
        // Check for various Whereby event types that indicate leaving
        if (
          event.data?.type === "meeting-ended" ||
          event.data?.event === "meeting-ended" ||
          event.data?.action === "leave" ||
          (typeof event.data === "string" && event.data.includes("leave"))
        ) {
          console.log("User left the meeting, navigating to summary")
          if (!hasEndedRef.current) {
            handleEndCall()
          }
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUrl, visitId])

  // Also detect when user might have closed the iframe or navigated away
  useEffect(() => {
    if (!roomUrl) return

    const handleVisibilityChange = () => {
      // If user switches tabs/windows and comes back, check if they're still in the room
      // This is a fallback - not perfect but helps catch some cases
      if (document.hidden) {
        // User switched away - might have left the room
        // We'll let the message listener handle it primarily
      }
    }

    const handleBeforeUnload = () => {
      // User is navigating away - try to end the visit
      if (!hasEndedRef.current && visitId) {
        // Use sendBeacon for reliability during page unload
        if (visit?.provider_note && visit?.intake_structured) {
          navigator.sendBeacon(
            `${API_BASE}/post_visit_explain`,
            JSON.stringify({
              visit_id: visitId,
              provider_note: visit.provider_note,
              intake_structured: visit.intake_structured,
            })
          )
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [roomUrl, visitId, visit])

  if (!roomUrl || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b border-border bg-card animate-slide-down">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-serif text-xl font-semibold text-foreground">ReproCare</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-gentle-pulse">
              <Video className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-foreground mb-3">Loading...</h1>
            <p className="text-muted-foreground">Setting up your video consultation</p>
            </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-serif text-lg font-semibold text-foreground">ReproCare</span>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEndCall}
            className="gap-2"
          >
            <Phone className="h-4 w-4 rotate-135" />
            End Visit
          </Button>
        </div>
      </header>

      {/* Full-screen Whereby Video Room */}
      <main className="flex-1 relative">
        <iframe
          src={roomUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: "none" }}
          allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
          allowFullScreen
        />
        {/* Overlay button for ending visit - appears on hover */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            variant="default"
            size="lg"
            onClick={handleEndCall}
            className="gap-2 shadow-lg"
          >
            <Phone className="h-4 w-4 rotate-135" />
            End Visit & Continue
          </Button>
        </div>
      </main>
    </div>
  )
}

export default function VideoVisitPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-border bg-card animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-serif text-xl font-semibold text-foreground">ReproCare</span>
              </Link>
            </div>
          </header>
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-gentle-pulse">
                <Video className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">Loading...</h1>
              <p className="text-muted-foreground">Setting up your video consultation</p>
            </div>
          </main>
        </div>
      }
    >
      <VideoVisitPageContent />
    </Suspense>
  )
}
