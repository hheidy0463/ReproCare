"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Shield } from "lucide-react"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      {imageError ? (
        <Shield className={`${sizeClasses[size]} text-primary`} />
      ) : (
        <Image
          src="/reprocare-logo.png"
          alt="ReproCare"
          width={iconSizes[size]}
          height={iconSizes[size]}
          className={`${sizeClasses[size]} object-contain`}
          priority
          onError={() => setImageError(true)}
          unoptimized
        />
      )}
      {showText && (
        <span className={`font-serif font-semibold text-foreground ${textSizes[size]}`}>ReproCare</span>
      )}
    </Link>
  )
}

