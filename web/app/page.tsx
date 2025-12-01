import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Logo } from "@/components/Logo"
import { Lock, Clock, CheckCircle2, Video, FileText, Sparkles, Heart, Shield, ArrowRight } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Part of Included Health</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </Link>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Text Content */}
            <div className="text-center md:text-left animate-slide-up">
              <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
                Birth Control Care.<br />Simple. Private. Fast.
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed animate-slide-up animate-delay-100">
                Expert care from home. Licensed providers. Prescriptions delivered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-slide-up animate-delay-200">
                <Button asChild size="lg" className="text-base transition-smooth hover:scale-105 shadow-lg">
                  <Link href="/intake">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Visual Trust Cards */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-12 animate-fade-in animate-delay-300">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">100% Private</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Licensed Providers</span>
                </div>
              </div>
            </div>

            {/* Right: Hero Image/Illustration */}
            <div className="relative animate-slide-up animate-delay-200">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="w-full h-full rounded-3xl overflow-hidden relative">
                  <Image
                    src="/hero-illustration.png"
                    alt="ReproCare - Birth Control Care"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-slide-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">How It Works</h2>
            <p className="text-muted-foreground text-sm">Three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto relative">
            {/* Connection Line (desktop only) */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 -z-10" />
            
            <Card className="p-6 md:p-8 text-center border-2 border-border bg-gradient-to-br from-card via-card to-primary/5 animate-slide-up animate-delay-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/30 hover:scale-[1.02] group">
              <div className="relative mb-6">
                {/* Optional: Add illustration image here */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                  {/* <Image src="/step-1-intake.png" alt="Quick Intake" width={80} height={80} className="object-contain" /> */}
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </div>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">Quick Intake</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                5 minutes. A few questions.
              </p>
            </Card>

            <Card className="p-6 md:p-8 text-center border-2 border-border bg-gradient-to-br from-card via-card to-primary/5 animate-slide-up animate-delay-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/30 hover:scale-[1.02] group relative md:-mt-4">
              <div className="relative mb-6">
                {/* Optional: Add illustration image here */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                  {/* <Image src="/step-2-video.png" alt="Video Visit" width={80} height={80} className="object-contain" /> */}
                  <Video className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                  2
                </div>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">Video Visit</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Meet your provider. Get guidance.
              </p>
            </Card>

            <Card className="p-6 md:p-8 text-center border-2 border-border bg-gradient-to-br from-card via-card to-primary/5 animate-slide-up animate-delay-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:border-primary/30 hover:scale-[1.02] group">
              <div className="relative mb-6">
                {/* Optional: Add illustration image here */}
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                  {/* <Image src="/step-3-prescription.png" alt="Get Prescription" width={80} height={80} className="object-contain" /> */}
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                  3
                </div>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-foreground mb-2">Get Prescription</h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                Sent to pharmacy. Same day.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits - Visual Cards */}
      <section id="benefits" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 animate-slide-up">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">Why ReproCare</h2>
            <p className="text-muted-foreground text-sm">Built for your privacy and convenience</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                title: "100% Private",
                description: "HIPAA protected",
                icon: Lock,
              },
              {
                title: "Licensed Providers",
                description: "Board-certified experts",
                icon: CheckCircle2,
              },
              {
                title: "Fast & Convenient",
                description: "From home, same-day",
                icon: Clock,
              },
              {
                title: "Personalized Care",
                description: "Tailored to you",
                icon: Heart,
              },
            ].map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={index}
                  className={`p-6 border-2 border-border bg-gradient-to-br from-card via-card to-primary/5 animate-slide-up animate-delay-${(index + 1) * 100} transition-all duration-300 hover:shadow-xl hover:border-primary/30 hover:scale-[1.02] hover:-translate-y-1`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-border flex items-center justify-center flex-shrink-0">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground text-xs">{benefit.description}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3">Ready to Start?</h2>
            <p className="text-lg mb-8 opacity-95">
              Get your birth control consultation today.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-base transition-smooth hover:scale-105 shadow-xl">
              <Link href="/intake">
                Start Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <Logo className="justify-center mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Part of Included Health
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; 2025 ReproCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
