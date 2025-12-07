"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/Logo"
import { Download, FileText, CheckCircle2, ArrowRight, Calendar, Pill } from "lucide-react"
import Link from "next/link"

export default function SummaryPage() {
  const [visitDate, setVisitDate] = useState<string>("")

  useEffect(() => {
    setVisitDate(
      new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    )
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Summary
          </Button>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3 animate-slide-up animate-delay-100">
              Your Consultation Summary
            </h1>
            <p className="text-muted-foreground leading-relaxed animate-slide-up animate-delay-200">
              Visit with Dr. Sarah Mitchell on {visitDate || "Loading..."}
            </p>
          </div>

          {/* Provider Notes */}
          <Card className="p-6 md:p-8 mb-6 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-100 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">Provider Notes</h2>
                <p className="text-muted-foreground text-sm">Dr. Sarah Mitchell, MD</p>
              </div>
            </div>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Based on our discussion, I'm recommending:
              </p>
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold mb-2">Recommended</h3>
                <p className="text-sm">Low-dose combination pill</p>
              </div>
              <p className="text-sm">
                This option fits your needs for effectiveness and convenience.
              </p>
            </div>
          </Card>

          {/* Prescription Details */}
          <Card className="p-6 md:p-8 mb-6 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-200 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <Pill className="h-5 w-5 text-primary mt-1" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Prescription Details</h2>
            </div>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Medication</p>
                  <p className="font-medium text-foreground">Lo Loestrin Fe</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dosage</p>
                  <p className="font-medium text-foreground">1 tablet daily</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                  <p className="font-medium text-foreground">3-month supply</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Refills</p>
                  <p className="font-medium text-foreground">3 refills authorized</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 md:p-8 mb-6 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-300 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Important Instructions</h2>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-sm">Take one tablet daily at the same time</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-sm">Use backup for first 7 days</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-sm">
                  If you miss a pill, take it ASAP and continue
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed text-sm">
                  Contact us if you have severe headaches, chest pain, or vision changes
                </span>
              </li>
            </ul>
          </Card>

          {/* Follow-up */}
          <Card className="p-6 md:p-8 mb-8 border-border bg-gradient-to-br from-card to-card/50 animate-slide-up animate-delay-400 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Follow-Up Care</h2>
            </div>
            <p className="text-foreground leading-relaxed mb-4 text-sm">
              Follow-up in 3 months. Schedule through your portal or contact us.
            </p>
            <p className="text-sm text-muted-foreground">
              Questions? Reach out anytime.
            </p>
          </Card>

          {/* Next Steps */}
          <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center animate-scale-in">
            <h2 className="font-serif text-2xl font-bold mb-3">Next: Choose Your Pharmacy</h2>
            <p className="mb-6 opacity-90 leading-relaxed text-sm">
              Select where you'd like to receive your prescription
            </p>
            <Button asChild size="lg" variant="secondary" className="transition-smooth hover:scale-105">
              <Link href="/pharmacy">
                Continue to Pharmacy Selection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            This summary is confidential and protected under HIPAA regulations
          </p>
        </div>
      </footer>
    </div>
  )
}
