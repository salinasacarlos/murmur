"use client"

import * as React from "react"

import { Isotipo } from "@/components/brand/isotipo"
import {
  type OnboardingMurmStep,
  MURM_SESSION_SEED_KEY,
  getMurmVoice,
} from "@/lib/murmur-onboarding"
import { cn } from "@/lib/utils"

let murmSeedCache: number | null = null

/** Semilla estable por pestaña; lectura solo en cliente (evita setState en effect). */
function readMurmSeed(): number {
  if (typeof window === "undefined") return 0
  if (murmSeedCache !== null) return murmSeedCache
  try {
    let raw = sessionStorage.getItem(MURM_SESSION_SEED_KEY)
    if (!raw) {
      raw = String(Math.floor(Math.random() * 1_000_000_000))
      sessionStorage.setItem(MURM_SESSION_SEED_KEY, raw)
    }
    murmSeedCache = parseInt(raw, 10) || 0
    return murmSeedCache
  } catch {
    murmSeedCache = 0
    return murmSeedCache
  }
}

export interface MurmVoiceProps {
  step: OnboardingMurmStep
  branch?: string
  children?: React.ReactNode
  className?: string
}

export function MurmVoice({ step, branch, children, className }: MurmVoiceProps) {
  const { lead, aside } = React.useMemo(
    () => getMurmVoice(step, readMurmSeed(), branch),
    [step, branch]
  )

  return (
    <div
      role="note"
      aria-label="Murm"
      className={cn(
        "flex gap-3 rounded-[14px] border border-[var(--pm)] bg-[var(--pl)] p-3.5",
        className
      )}
    >
      <div className="flex-shrink-0 pt-0.5" aria-hidden>
        <Isotipo size={28} color="var(--p)" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--p)] mb-1">
          Murm
        </p>
        <p className="text-[13px] font-medium leading-relaxed text-[var(--text)]">
          {lead}
        </p>
        {aside ? (
          <p className="mt-2 text-[12px] leading-relaxed text-[var(--text2)] italic">
            {aside}
          </p>
        ) : null}
        {children ? (
          <div className="mt-2 text-[12px] text-[var(--text2)] leading-relaxed">
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}
