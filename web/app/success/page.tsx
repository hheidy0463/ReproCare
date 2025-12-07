"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/Logo"
import { CheckCircle2, Clock, Package, Phone, Mail, Home } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  const [confirmationNumber, setConfirmationNumber] = useState<string>("")
  const [consultationDate, setConsultationDate] = useState<string>("")

  useEffect(() => {
    // Generate these values only on the client to avoid hydration mismatches
    setConfirmationNumber(`HC-${Math.floor(Math.random() * 1000000)}`)
    setConsultationDate(
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    )
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="relative w-32 h-32 mx-auto mb-6 animate-scale-in">
              {/* Optional: Add success illustration */}
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                {/* <Image src="/success-illustration.png" alt="Success" fill className="object-contain" /> */}
                <CheckCircle2 className="h-16 w-16 text-primary" />
              </div>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 animate-slide-up animate-delay-100">
              You're All Set!
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto animate-slide-up animate-delay-200">
              Your prescription has been sent. You'll receive a confirmation email shortly.
            </p>
          </div>

          {/* What's Next */}
          <Card className="p-6 md:p-8 mb-6 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-6">What's Next</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Within 1-2 Hours</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Your prescription will be processed by the pharmacy. You'll receive a text notification when it's ready for pickup.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Pickup or Delivery</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    Pick up your prescription at your selected pharmacy, or it will be delivered to your address within 2-3 business days.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Follow-Up Care</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    We'll send you a reminder for your 3-month follow-up consultation. You can schedule anytime through your patient portal.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-6 md:p-8 mb-6 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Consultation Date</span>
                <span className="font-medium text-foreground">
                  {consultationDate || "Loading..."}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Provider</span>
                <span className="font-medium text-foreground">Dr. Sarah Mitchell, MD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Prescription</span>
                <span className="font-medium text-foreground">Lo Loestrin Fe (3-month supply)</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Confirmation Number</span>
                <span className="font-medium text-foreground font-mono">
                  {confirmationNumber || "Loading..."}
                </span>
              </div>
            </div>
          </Card>

          {/* Contact Support */}
          <Card className="p-6 md:p-8 mb-8 border-border bg-muted/30 animate-slide-up animate-delay-300">
            <div className="flex items-start gap-3 mb-4">
              <Phone className="h-5 w-5 text-primary mt-1" />
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">Need Help?</h2>
                <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                  Our care team is available 24/7 to answer any questions about your prescription or consultation.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">1-800-REPROCARE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">support@reprocare.com</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animate-delay-400">
            <Button asChild size="lg" variant="outline" className="transition-smooth hover:scale-105 bg-transparent">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild size="lg" className="transition-smooth hover:scale-105">
              <Link href="/summary">View Consultation Summary</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Thank you for choosing ReproCare for your birth control consultation
          </p>
          <p className="text-xs text-muted-foreground">All information is confidential and HIPAA protected</p>
        </div>
      </footer>
    </div>
  )
}
