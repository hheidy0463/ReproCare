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
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {qa.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="bg-blue-50 p-4 rounded-lg max-w-md">
                <p className="text-sm text-gray-600 mb-1">Question</p>
                <p className="text-gray-900">{item.q}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg max-w-md ml-auto">
                <p className="text-sm text-gray-600 mb-1">Your answer</p>
                <p className="text-gray-900">{item.a}</p>
              </div>
            </div>
          ))}
          
          {currentIndex < QUESTIONS.length && (
            <div className="bg-blue-50 p-4 rounded-lg max-w-md">
              <p className="text-sm text-gray-600 mb-1">Question</p>
              <p className="text-gray-900 mb-3">{QUESTIONS[currentIndex].q}</p>
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your answer..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <Button
                onClick={handleAnswer}
                className="mt-3"
                disabled={!currentAnswer.trim()}
              >
                {currentIndex < QUESTIONS.length - 1 ? 'Next' : 'Finish intake'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="w-64 bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold mb-4 text-gray-900">Progress</h3>
        <div className="space-y-2">
          {QUESTIONS.map((q, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 p-2 rounded ${
                idx < answeredCount
                  ? 'bg-blue-100 text-blue-700'
                  : idx === currentIndex
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-sm">
                {idx < answeredCount ? '✓' : idx === currentIndex ? '○' : '○'}
              </span>
              <span className="text-sm">{q.q.substring(0, 30)}...</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {answeredCount} of {totalQuestions} answered
          </p>
        </div>
      </div>
    </div>
  )
}

