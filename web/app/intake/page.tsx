"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/Logo"
import { ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Message = {
  id: number
  type: "bot" | "user"
  content: string
  options?: string[]
}

const questions = [
  {
    id: 1,
    question: "Hi! What's your name?",
    type: "text" as const,
    field: "name",
  },
  {
    id: 2,
    question: "Nice to meet you, {name}! How old are you?",
    type: "text" as const,
    field: "age",
  },
  {
    id: 3,
    question: "Have you used birth control before?",
    type: "options" as const,
    options: ["Yes", "No"],
    field: "previousUse",
  },
  {
    id: 4,
    question: "Do you smoke?",
    type: "options" as const,
    options: ["Yes", "No"],
    field: "smoking",
  },
  {
    id: 5,
    question: "What matters most to you?",
    type: "options" as const,
    options: ["Effectiveness", "Convenience", "Minimal side effects", "Hormone-free"],
    field: "priority",
  },
]

export default function IntakePage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "bot",
      content: questions[0].question,
    },
  ])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [inputValue, setInputValue] = useState("")
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      type: "user",
      content,
    }
    setMessages((prev) => [...prev, userMessage])

    // Save form data
    const currentField = questions[currentQuestion].field
    const newFormData = { ...formData, [currentField]: content }
    setFormData(newFormData)

    // Move to next question
    const nextQuestionIndex = currentQuestion + 1
    if (nextQuestionIndex < questions.length) {
      setTimeout(() => {
        let nextQuestion = questions[nextQuestionIndex].question
        // Replace {name} placeholder
        if (newFormData.name) {
          nextQuestion = nextQuestion.replace("{name}", newFormData.name)
        }

        const botMessage: Message = {
          id: messages.length + 1,
          type: "bot",
          content: nextQuestion,
          options: questions[nextQuestionIndex].type === "options" ? questions[nextQuestionIndex].options : undefined,
        }
        setMessages((prev) => [...prev, botMessage])
        setCurrentQuestion(nextQuestionIndex)
      }, 500)
    } else {
      // All questions answered
      setTimeout(() => {
        const finalMessage: Message = {
          id: messages.length + 1,
          type: "bot",
          content: "Perfect! Ready to meet your provider.",
        }
        setMessages((prev) => [...prev, finalMessage])
        setIsComplete(true)
      }, 500)
    }

    setInputValue("")
  }

  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Question {Math.min(currentQuestion + 1, questions.length)} of {questions.length}
            </div>
            <div className="w-32 md:w-40 h-2.5 bg-secondary rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 rounded-full shadow-sm" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        {/* Welcome Card */}
        {currentQuestion === 0 && (
          <div className="mb-8 animate-slide-up">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-semibold text-foreground">Quick Health Check</h2>
                  <p className="text-xs text-muted-foreground">Just 5 quick questions</p>
                </div>
              </div>
            </Card>
          </div>
        )}
        <div className="space-y-4 mb-24">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-slide-up`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-6 py-4 transition-smooth shadow-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border-2 border-border text-foreground"
                }`}
              >
                {message.type === "bot" && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">ReproCare</span>
                  </div>
                )}
                <p className="leading-relaxed">{message.content}</p>

                {message.options && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {message.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptionClick(option)}
                        className="bg-background hover:bg-accent transition-smooth hover:scale-105"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isComplete && (
            <div className="flex justify-center pt-4 animate-scale-in">
              <Card className="p-8 text-center max-w-md border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-xl">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-3">All Set!</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed text-sm">
                  Ready to meet your provider?
                </p>
                <Button onClick={() => router.push("/video-visit")} className="w-full shadow-lg" size="lg">
                  Continue to Video Visit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      {!isComplete && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm animate-slide-up">
          <div className="container mx-auto px-4 py-4 max-w-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputValue)
              }}
              className="flex gap-2"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={!inputValue.trim()}>
                Send
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Your information is encrypted and HIPAA compliant
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
