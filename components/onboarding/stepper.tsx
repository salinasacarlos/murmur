import * as React from "react"

import { cn } from "@/lib/utils"

interface StepperProps {
  current: number
  total: number
  className?: string
}

export function Stepper({ current, total, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)]">
        Paso {current} de {total}
      </span>
      <div className="flex-1 h-1 rounded-full bg-[var(--bg3)] overflow-hidden">
        <div
          className="h-full bg-[var(--p)] rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
