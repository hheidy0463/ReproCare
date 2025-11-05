'use client'

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
      navigator.clipboard.writeText(textToCopy)
      alert('Text copied to clipboard')
    } else {
      alert('No text available to copy')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">What we discussed</h3>
        <p className="text-gray-700 leading-relaxed">
          {summary.what_we_discussed || 'We discussed your birth control options.'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Next steps</h3>
        <ul className="space-y-2">
          {(summary.next_steps || []).map((step, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="text-blue-600 mt-1">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">What to watch for</h3>
        <ul className="space-y-2">
          {(summary.watch_fors || []).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <span className="text-blue-600 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4 no-print">
        <Button onClick={handleCopy} variant="secondary">
          Copy text
        </Button>
        <Button onClick={handlePrint} variant="secondary">
          Save as PDF
        </Button>
      </div>
    </div>
  )
}

