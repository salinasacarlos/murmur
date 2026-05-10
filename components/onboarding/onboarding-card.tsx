"use client"

import Link from "next/link"

import { MurmVoice } from "@/components/murm/murm-voice"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { IconArrowLeft } from "@/components/icons"
import type { OnboardingMurmStep } from "@/lib/murmur-onboarding"

interface OnboardingCardProps {
  title: string
  description?: string
  /** Voz de Murm al inicio de la tarjeta */
  murmurStep?: OnboardingMurmStep
  /** Rama de copy (p. ej. role: founder | contributor | both) */
  murmurBranch?: string
  children: React.ReactNode
  back?: string
  next: string
  nextLabel?: string
  nextDisabled?: boolean
}

export function OnboardingCard({
  title,
  description,
  murmurStep,
  murmurBranch,
  children,
  back,
  next,
  nextLabel = "Siguiente",
  nextDisabled,
}: OnboardingCardProps) {
  return (
    <Card padding="none" className="bg-[var(--bg)] p-6 md:p-8">
      {murmurStep ? (
        <MurmVoice
          step={murmurStep}
          branch={murmurBranch}
          className="mb-5"
        />
      ) : null}
      <h1 className="text-[20px] font-extrabold tracking-[-0.4px] mb-1.5">
        {title}
      </h1>
      {description && (
        <p className="text-[13px] text-[var(--text2)] mb-6 leading-relaxed">
          {description}
        </p>
      )}

      <div className="flex flex-col gap-2.5 mb-6">{children}</div>

      <div className="flex items-center justify-between gap-3">
        {back ? (
          <Link href={back}>
            <Button variant="ghost" size="md">
              <IconArrowLeft size={14} />
              Atrás
            </Button>
          </Link>
        ) : (
          <span />
        )}

        <Link
          href={next}
          aria-disabled={nextDisabled}
          className={nextDisabled ? "pointer-events-none opacity-50" : ""}
        >
          <Button size="lg" disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </Link>
      </div>
    </Card>
  )
}
