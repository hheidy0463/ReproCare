import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Download, FileText, CheckCircle2, ArrowRight, Calendar, Pill } from "lucide-react"
import Link from "next/link"

export default function SummaryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">ReproCare</span>
          </Link>
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
              Consultation Complete
            </h1>
            <p className="text-muted-foreground leading-relaxed animate-slide-up animate-delay-200">
              Your visit with Dr. Sarah Mitchell on{" "}
              {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>

          {/* Provider Notes */}
          <Card className="p-6 md:p-8 mb-6 border-border animate-slide-up animate-delay-100 transition-smooth hover:shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary mt-1" />
              <div>
                <h2 className="font-serif text-xl font-semibold text-foreground mb-2">Provider Notes</h2>
                <p className="text-muted-foreground text-sm">Dr. Sarah Mitchell, MD</p>
              </div>
            </div>
            <div className="space-y-4 text-foreground leading-relaxed">
              <p>
                Thank you for your consultation today. Based on our discussion of your medical history, lifestyle, and
                preferences, I'm recommending the following birth control option:
              </p>
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-semibold mb-2">Recommended Option</h3>
                <p className="text-sm">Combined oral contraceptive pill (low-dose estrogen/progestin combination)</p>
              </div>
              <p>
                This option aligns well with your priorities for effectiveness and convenience. The low-dose formulation
                should minimize potential side effects while providing reliable contraception.
              </p>
            </div>
          </Card>

          {/* Prescription Details */}
          <Card className="p-6 md:p-8 mb-6 border-border animate-slide-up animate-delay-200 transition-smooth hover:shadow-md">
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
          <Card className="p-6 md:p-8 mb-6 border-border animate-slide-up animate-delay-300 transition-smooth hover:shadow-md">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Important Instructions</h2>
            <ul className="space-y-3 text-foreground">
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Take one tablet at the same time each day, preferably with food</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">Use backup contraception for the first 7 days when starting</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  If you miss a pill, take it as soon as you remember and continue as normal
                </span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  Contact us immediately if you experience severe headaches, chest pain, or vision changes
                </span>
              </li>
            </ul>
          </Card>

          {/* Follow-up */}
          <Card className="p-6 md:p-8 mb-8 border-border animate-slide-up animate-delay-400 transition-smooth hover:shadow-md">
            <div className="flex items-start gap-3 mb-4">
              <Calendar className="h-5 w-5 text-primary mt-1" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Follow-Up Care</h2>
            </div>
            <p className="text-foreground leading-relaxed mb-4">
              We recommend a follow-up consultation in 3 months to discuss how you're adjusting to the medication and
              address any concerns. You can schedule this through your patient portal or contact us directly.
            </p>
            <p className="text-sm text-muted-foreground">
              If you have any questions or concerns before then, please don't hesitate to reach out to our care team.
            </p>
          </Card>

          {/* Next Steps */}
          <div className="bg-primary text-primary-foreground rounded-xl p-8 text-center animate-scale-in">
            <h2 className="font-serif text-2xl font-bold mb-3">Next Step: Select Your Pharmacy</h2>
            <p className="mb-6 opacity-90 leading-relaxed">
              Choose where you'd like your prescription sent for convenient pickup or delivery
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
