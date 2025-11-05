'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from './components/Button'

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

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleStartVisit = async () => {
    setLoading(true)
    try {
      const data = await fetchJSON('/visit', {
        method: 'POST',
      })
      router.push(`/visit/${data.visit_id}`)
    } catch (error) {
      console.error('Failed to create visit:', error)
      alert('Failed to start visit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 tracking-tight">
            Birth control visit
          </h1>
          <div className="w-16 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>
        
        <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">
          By continuing you allow us to process your answers. This is a demo.
        </p>

        <div className="flex justify-center">
          <Button onClick={handleStartVisit} disabled={loading}>
            {loading ? 'Starting...' : 'Start visit'}
          </Button>
        </div>
      </div>
    </div>
  )
}

