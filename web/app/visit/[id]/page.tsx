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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Stepper steps={STEPS} currentStep={getCurrentStepIndex()} />

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
          {step === 'intake' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Intake</h2>
                <p className="text-gray-500">Please answer a few questions to help us understand your needs</p>
              </div>
              <IntakeChat onComplete={handleIntakeComplete} />
            </div>
          )}

          {step === 'video' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Video visit</h2>
                <p className="text-gray-500">Join your provider for a consultation</p>
              </div>
              {roomUrl && (
                <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    src={roomUrl}
                    className="w-full h-[700px]"
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
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Visit summary</h2>
                <p className="text-gray-500">Here's what we discussed during your visit</p>
              </div>
              {postVisitSummary && (
                <PostVisitCards
                  summary={postVisitSummary}
                  plainText={plainText || visit?.patient_summary}
                />
              )}
              <div className="mt-8 flex justify-center">
                <Button onClick={() => setStep('pharmacy')}>
                  Continue to pharmacy
                </Button>
              </div>
            </div>
          )}

          {step === 'pharmacy' && (
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Pharmacy</h2>
                <p className="text-gray-500">Complete your order details</p>
              </div>
              <form onSubmit={handlePharmacyOrder} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                    placeholder="Enter your address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payment plan
                  </label>
                  <select
                    name="plan"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Place order
                  </Button>
                </div>
              </form>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Order placed</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Your order has been created successfully.
              </p>
              {orderId && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-6 rounded-xl mb-8 max-w-md mx-auto border border-blue-100 shadow-sm">
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">Order ID</p>
                  <p className="text-xl font-mono font-bold text-gray-900">{orderId}</p>
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
