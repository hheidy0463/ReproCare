'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import Stepper from '../../components/Stepper'
import IntakeChat from '../../components/IntakeChat'
import PostVisitCards from '../../components/PostVisitCards'
import Button from '../../components/Button'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

async function fetchJSON(path: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }
  return response.json()
}

type Step = 'intake' | 'video' | 'postvisit' | 'pharmacy' | 'success'

const STEPS = ['Intake', 'Visit', 'Summary', 'Pharmacy']

export default function VisitPage() {
  const params = useParams()
  const router = useRouter()
  const visitId = params.id as string

  const [step, setStep] = useState<Step>('intake')
  const [visit, setVisit] = useState<any>(null)
  const [roomUrl, setRoomUrl] = useState<string | null>(null)
  const [postVisitSummary, setPostVisitSummary] = useState<any>(null)
  const [plainText, setPlainText] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    loadVisit()
  }, [visitId])

  const loadVisit = async () => {
    try {
      const data = await fetchJSON(`/visit/${visitId}`)
      setVisit(data)
      
      if (data.status === 'intake_complete' && step === 'intake') {
        setStep('video')
        await createRoom()
      } else if (data.status === 'visit_started' && step === 'intake') {
        setStep('video')
        // If we already have a room URL, use it; otherwise create one
        if (data.video_room_id && !roomUrl) {
          // Construct the correct URL format for repro-care subdomain
          setRoomUrl(`https://repro-care.whereby.com/${data.video_room_id}`)
        }
      } else if (data.status === 'summary_ready') {
        if (step === 'video') {
          setStep('postvisit')
          loadPostVisitSummary()
        } else if (step === 'postvisit') {
          loadPostVisitSummary()
        }
      } else if (data.status === 'pharmacy_created') {
        setOrderId(data.pharmacy_request?.order_id || null)
        if (step !== 'success') setStep('success')
      }
    } catch (error) {
      console.error('Failed to load visit:', error)
    }
  }

  const createRoom = async () => {
    try {
      const data = await fetchJSON('/create_room', {
        method: 'POST',
        body: JSON.stringify({ visit_id: visitId }),
      })
      // Use the join_url from API response, or construct from room_id if needed
      const url = data.join_url || `https://repro-care.whereby.com/${data.room_id}`
      setRoomUrl(url)
      console.log('Room URL set to:', url)
    } catch (error) {
      console.error('Failed to create room:', error)
      // Fallback to the actual room URL if we know the room ID
      const fallbackUrl = `https://repro-care.whereby.com/8d9d69e5-e702-4767-89af-ff6430a8e265`
      setRoomUrl(fallbackUrl)
    }
  }

  const handleIntakeComplete = async (qa: any[]) => {
    try {
      await fetchJSON('/intake_to_json', {
        method: 'POST',
        body: JSON.stringify({ visit_id: visitId, qa }),
      })
      await loadVisit()
      setStep('video')
      await createRoom()
    } catch (error) {
      console.error('Failed to process intake:', error)
      alert('Failed to process intake. Please try again.')
    }
  }

  const handleEndVisit = async () => {
    if (!visit?.provider_note || !visit?.intake_structured) {
      alert('Missing visit data')
      return
    }

    try {
      const data = await fetchJSON('/post_visit_explain', {
        method: 'POST',
        body: JSON.stringify({
          visit_id: visitId,
          provider_note: visit.provider_note,
          intake_structured: visit.intake_structured,
        }),
      })
      setPostVisitSummary(data.patient_summary)
      setPlainText(data.plain_text)
      await loadVisit()
      setStep('postvisit')
    } catch (error) {
      console.error('Failed to generate summary:', error)
      alert('Failed to generate summary. Please try again.')
    }
  }

  const loadPostVisitSummary = async () => {
    // If we already have the summary from handleEndVisit, don't reload
    if (postVisitSummary) {
      return
    }
    
    try {
      const data = await fetchJSON(`/visit/${visitId}`)
      if (data.patient_summary) {
        // patient_summary is stored as plain text, so create a simple structure
        setPostVisitSummary({
          what_we_discussed: data.patient_summary,
          next_steps: ['Follow up as recommended'],
          watch_fors: ['Contact us if you have concerns'],
        })
        setPlainText(data.patient_summary)
      }
    } catch (error) {
      console.error('Failed to load summary:', error)
    }
  }

  const handlePharmacyOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      const data = await fetchJSON('/pharmacy_order', {
        method: 'POST',
        body: JSON.stringify({
          visit_id: visitId,
          shipping: {
            name: formData.get('name') as string,
            address: formData.get('address') as string,
          },
          plan: formData.get('plan') as string,
        }),
      })
      setOrderId(data.order_id)
      await loadVisit()
      setStep('success')
    } catch (error) {
      console.error('Failed to place order:', error)
      alert('Failed to place order. Please try again.')
    }
  }


  const getCurrentStepIndex = () => {
    switch (step) {
      case 'intake': return 0
      case 'video': return 1
      case 'postvisit': return 2
      case 'pharmacy': return 3
      case 'success': return 3
      default: return 0
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Stepper steps={STEPS} currentStep={getCurrentStepIndex()} />

        <div className="bg-white rounded-lg shadow-sm p-8">
          {step === 'intake' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Intake</h2>
              <IntakeChat onComplete={handleIntakeComplete} />
            </div>
          )}

          {step === 'video' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Video visit</h2>
              {roomUrl && (
                <div className="mb-6">
                  <iframe
                    src={roomUrl}
                    className="w-full h-[700px] border border-gray-200 rounded-lg"
                    allow="camera; microphone; fullscreen; speaker; display-capture; compute-pressure"
                  />
                </div>
              )}
              <div className="flex justify-center">
                <Button onClick={handleEndVisit}>
                  End visit
                </Button>
              </div>
            </div>
          )}

          {step === 'postvisit' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Visit summary</h2>
              {postVisitSummary && (
                <PostVisitCards
                  summary={postVisitSummary}
                  plainText={plainText || visit?.patient_summary}
                />
              )}
              <div className="mt-6 flex justify-center">
                <Button onClick={() => setStep('pharmacy')}>
                  Continue to pharmacy
                </Button>
              </div>
            </div>
          )}

          {step === 'pharmacy' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Pharmacy</h2>
              <form onSubmit={handlePharmacyOrder} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment plan
                  </label>
                  <select
                    name="plan"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                <div className="pt-4">
                  <Button type="submit">
                    Place order
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Order placed</h2>
              <p className="text-gray-700 mb-6">
                Your order has been created successfully.
              </p>
              {orderId && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="text-lg font-mono text-gray-900">{orderId}</p>
                </div>
              )}
              <Button onClick={() => router.push('/')}>
                Start new visit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

