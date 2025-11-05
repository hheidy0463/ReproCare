'use client'

import { useState } from 'react'
import Button from './Button'

interface PatientSummary {
  what_we_discussed?: string
  next_steps?: string[]
  watch_fors?: string[]
}

interface PostVisitCardsProps {
  summary: PatientSummary
  plainText?: string
}

export default function PostVisitCards({ summary, plainText }: PostVisitCardsProps) {
  const [copyButtonText, setCopyButtonText] = useState('Copy text')
  
  const handleCopy = () => {
    let textToCopy = plainText
    
    if (!textToCopy) {
      // Generate text from summary if plainText not provided
      const parts = []
      if (summary.what_we_discussed) {
        parts.push(summary.what_we_discussed)
      }
      if (summary.next_steps && summary.next_steps.length > 0) {
        parts.push('\n\nNext steps:\n' + summary.next_steps.map(s => `- ${s}`).join('\n'))
      }
      if (summary.watch_fors && summary.watch_fors.length > 0) {
        parts.push('\n\nWatch for:\n' + summary.watch_fors.map(w => `- ${w}`).join('\n'))
      }
      textToCopy = parts.join('')
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopyButtonText('Copied!')
        setTimeout(() => {
          setCopyButtonText('Copy text')
        }, 2000)
      }).catch(() => {
        alert('Failed to copy text')
      })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-md border border-gray-200/60">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">What we discussed</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-base ml-[52px]">
          {summary.what_we_discussed || 'We discussed your birth control options.'}
        </p>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-md border border-gray-200/60">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Next steps</h3>
        </div>
        <ul className="space-y-3 ml-[52px]">
          {(summary.next_steps || []).map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-md border border-gray-200/60">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">What to watch for</h3>
        </div>
        <ul className="space-y-3 ml-[52px]">
          {(summary.watch_fors || []).map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-gray-700">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 no-print pt-2">
        <Button onClick={handleCopy} variant="secondary">
          {copyButtonText}
        </Button>
        <Button onClick={handlePrint} variant="secondary">
          Save as PDF
        </Button>
      </div>
    </div>
  )
}

