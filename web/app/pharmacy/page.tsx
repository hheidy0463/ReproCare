"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Search, MapPin, Package, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const popularPharmacies = [
  { name: "CVS Pharmacy", address: "123 Main St, New York, NY 10001", distance: "0.5 mi" },
  { name: "Walgreens", address: "456 Broadway, New York, NY 10013", distance: "0.8 mi" },
  { name: "Rite Aid", address: "789 Park Ave, New York, NY 10021", distance: "1.2 mi" },
  { name: "Duane Reade", address: "321 5th Ave, New York, NY 10016", distance: "1.5 mi" },
]

export default function PharmacyPage() {
  const router = useRouter()
  const [selectedPharmacy, setSelectedPharmacy] = useState<number | null>(null)
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup")
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState({
    insuranceProvider: "",
    insuranceId: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedPharmacy === null) {
      alert("Please select a pharmacy")
      return
    }
    router.push("/success")
  }

  const filteredPharmacies = searchQuery
    ? popularPharmacies.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : popularPharmacies

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card animate-slide-down">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-serif text-xl font-semibold text-foreground">ReproCare</span>
          </Link>
          <div className="text-sm text-muted-foreground">Step 5 of 5</div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">Select Your Pharmacy</h1>
            <p className="text-muted-foreground leading-relaxed">
              Choose where you'd like to receive your prescription
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Method */}
            <Card className="p-6 border-border animate-slide-up animate-delay-100">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Delivery Preference</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-border hover:border-primary/50 hover:scale-102"
                  }`}
                >
                  <MapPin className="h-5 w-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">Pharmacy Pickup</h3>
                  <p className="text-sm text-muted-foreground">Pick up at your local pharmacy</p>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`p-4 rounded-lg border-2 transition-smooth text-left ${
                    deliveryMethod === "delivery"
                      ? "border-primary bg-primary/5 scale-105"
                      : "border-border hover:border-primary/50 hover:scale-102"
                  }`}
                >
                  <Package className="h-5 w-5 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">Home Delivery</h3>
                  <p className="text-sm text-muted-foreground">Discreet delivery to your address</p>
                </button>
              </div>
            </Card>

            {/* Pharmacy Selection */}
            <Card className="p-6 border-border animate-slide-up animate-delay-200">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Choose Pharmacy</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for a pharmacy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Pharmacy List */}
              <div className="space-y-3">
                {filteredPharmacies.map((pharmacy, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedPharmacy(index)}
                    className={`w-full p-4 rounded-lg border-2 transition-smooth text-left ${
                      selectedPharmacy === index
                        ? "border-primary bg-primary/5 scale-102"
                        : "border-border hover:border-primary/50 hover:scale-[1.01]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{pharmacy.name}</h3>
                        <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{pharmacy.distance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Insurance Information */}
            <Card className="p-6 border-border animate-slide-up animate-delay-300">
              <div className="flex items-start gap-3 mb-4">
                <CreditCard className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h2 className="font-serif text-xl font-semibold text-foreground">Insurance Information</h2>
                  <p className="text-sm text-muted-foreground">Optional - helps reduce costs</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    type="text"
                    placeholder="e.g., Blue Cross Blue Shield"
                    value={formData.insuranceProvider}
                    onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceId">Member ID</Label>
                  <Input
                    id="insuranceId"
                    type="text"
                    placeholder="Your insurance ID"
                    value={formData.insuranceId}
                    onChange={(e) => setFormData({ ...formData, insuranceId: e.target.value })}
                  />
                </div>
              </div>
            </Card>

            {/* Delivery Address (if delivery selected) */}
            {deliveryMethod === "delivery" && (
              <Card className="p-6 border-border animate-slide-up">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="New York"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder="NY"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Submit */}
            <div className="flex gap-4 justify-end pt-4 animate-fade-in">
              <Button
                type="button"
                variant="outline"
                asChild
                className="transition-smooth hover:scale-105 bg-transparent"
              >
                <Link href="/summary">Back</Link>
              </Button>
              <Button type="submit" size="lg" className="transition-smooth hover:scale-105">
                Complete Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Your prescription will be sent securely to your selected pharmacy
          </p>
        </div>
      </footer>
    </div>
  )
}
