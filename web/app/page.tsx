import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Shield, Lock, Clock, CheckCircle2, Video, FileText } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">ReproCare</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benefits
            </Link>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance animate-slide-up">
              Discreet Birth Control Consultations with Licensed Providers
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto animate-slide-up animate-delay-100">
              Professional, confidential care from the comfort of your home. Get expert guidance and prescriptions
              delivered directly to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up animate-delay-200">
              <Button asChild size="lg" className="text-base transition-smooth hover:scale-105">
                <Link href="/intake">Start Consultation</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base bg-transparent transition-smooth hover:scale-105"
              >
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in animate-delay-300">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-accent" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-accent" />
                <span>100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>Licensed Providers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground leading-relaxed">
              Simple, secure, and designed with your privacy in mind
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center border-border animate-slide-up animate-delay-100 transition-smooth hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">1. Complete Intake</h3>
              <p className="text-muted-foreground leading-relaxed">
                Answer a few questions about your health history and preferences in our secure chat interface.
              </p>
            </Card>

            <Card className="p-8 text-center border-border animate-slide-up animate-delay-200 transition-smooth hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">2. Video Consultation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Meet with a licensed healthcare provider via secure video to discuss your options.
              </p>
            </Card>

            <Card className="p-8 text-center border-border animate-slide-up animate-delay-300 transition-smooth hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">3. Get Your Prescription</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive your prescription and have it delivered discreetly to your preferred pharmacy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16 animate-slide-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              Professional healthcare that respects your privacy and time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                title: "Complete Privacy",
                description: "Your consultation and medical information are fully confidential and HIPAA protected.",
              },
              {
                title: "Licensed Providers",
                description: "Consult with experienced, board-certified healthcare professionals.",
              },
              {
                title: "Convenient & Fast",
                description: "Complete your consultation from anywhere, with prescriptions available same-day.",
              },
              {
                title: "Personalized Care",
                description: "Get recommendations tailored to your health history, lifestyle, and preferences.",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className={`p-6 border-border animate-slide-up animate-delay-${(index + 1) * 100} transition-smooth hover:shadow-md hover:border-primary/30`}
              >
                <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground animate-scale-in">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Begin your confidential consultation today and take control of your reproductive health.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base transition-smooth hover:scale-105">
            <Link href="/intake">Start Your Consultation</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-serif text-lg font-semibold text-foreground">ReproCare</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Professional, confidential birth control consultations.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/intake" className="hover:text-foreground transition-colors">
                    Consultations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Prescriptions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Follow-up Care
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Our Providers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    HIPAA Notice
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              &copy; 2025 ReproCare. All rights reserved. This service is not a substitute for emergency medical care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
