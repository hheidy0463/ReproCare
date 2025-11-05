'use client'

import { useState } from 'react'
import Button from './Button'

interface QAPair {
  q: string
  a: string
}

interface IntakeChatProps {
  onComplete: (qa: QAPair[]) => void
}

const QUESTIONS = [
  { id: 'age', q: 'How old are you?', key: 'age' },
  { id: 'last_period', q: 'When was your last period? Please use month and day.', key: 'last_period' },
  { id: 'smoking', q: 'Do you smoke?', key: 'smoking' },
  { id: 'migraine', q: 'Do you have migraine headaches with aura?', key: 'migraine' },
  { id: 'pregnancy_risk', q: 'What is your risk of pregnancy today?', key: 'pregnancy_risk' },
  { id: 'method', q: 'Do you prefer a pill, patch, or ring?', key: 'method' },
  { id: 'insurance', q: 'Do you have insurance or will you pay cash?', key: 'insurance' },
]

export default function IntakeChat({ onComplete }: IntakeChatProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [qa, setQa] = useState<QAPair[]>([])
  const [currentAnswer, setCurrentAnswer] = useState('')

  const handleAnswer = () => {
    if (!currentAnswer.trim()) return

    const newQa = [
      ...qa,
      { q: QUESTIONS[currentIndex].q, a: currentAnswer.trim() }
    ]
    setQa(newQa)

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setCurrentAnswer('')
    } else {
      onComplete(newQa)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswer()
    }
  }

  const answeredCount = qa.length
  const totalQuestions = QUESTIONS.length

  return (
    <div className="flex gap-8 h-full">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-5 pr-2">
          {qa.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-5 rounded-xl max-w-md border border-blue-100 shadow-sm">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Question</p>
                <p className="text-gray-900 leading-relaxed">{item.q}</p>
              </div>
              <div className="bg-white p-5 rounded-xl max-w-md ml-auto border border-gray-200 shadow-sm">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Your answer</p>
                <p className="text-gray-900 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
          
          {currentIndex < QUESTIONS.length && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-50/50 p-5 rounded-xl max-w-md border border-blue-100 shadow-sm">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Question</p>
              <p className="text-gray-900 mb-4 leading-relaxed font-medium">{QUESTIONS[currentIndex].q}</p>
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
                autoFocus
              />
              <Button
                onClick={handleAnswer}
                className="mt-4"
                disabled={!currentAnswer.trim()}
              >
                {currentIndex < QUESTIONS.length - 1 ? 'Next' : 'Finish intake'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="w-72 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-semibold mb-5 text-gray-900 text-lg">Progress</h3>
        <div className="space-y-2">
          {QUESTIONS.map((q, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                idx < answeredCount
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : idx === currentIndex
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-400 shadow-sm'
                  : 'text-gray-400 border border-gray-100'
              }`}
            >
              <span className={`text-sm font-semibold flex-shrink-0 ${
                idx < answeredCount ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {idx < answeredCount ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : idx === currentIndex ? (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-blue-600"></div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                )}
              </span>
              <span className="text-sm leading-snug">{q.q.substring(0, 35)}...</span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-5 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600">Progress</p>
            <p className="text-sm font-semibold text-gray-900">
              {answeredCount} of {totalQuestions}
            </p>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

