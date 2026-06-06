"use client"

import * as React from "react"
import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  IconCheck,
  IconCompass,
  IconEye,
  IconSearch,
} from "@/components/icons"
import {
  FIRST_ACTIONS_STEP_COUNT,
  FIRST_ACTION_STEPS,
  type FirstActionId,
  type FirstActionsProgress,
} from "@/lib/first-actions"
import { cn } from "@/lib/utils"

type FirstActionsCardProps = {
  progress: FirstActionsProgress
  variant?: "onboarding" | "banner"
  onActivateVisibility?: () => void
  visibilitySaving?: boolean
  onActivateRadar?: () => void
  radarActivating?: boolean
  onDismiss?: () => void
  className?: string
}

const STEP_ICONS: Record<FirstActionId, React.ComponentType<{ size?: number }>> =
  {
    visibility: IconEye,
    search: IconSearch,
    radar: IconCompass,
  }

export function FirstActionsCard({
  progress,
  variant = "banner",
  onActivateVisibility,
  visibilitySaving = false,
  onActivateRadar,
  radarActivating = false,
  onDismiss,
  className,
}: FirstActionsCardProps) {
  const doneCount =
    Number(progress.visibility) + Number(progress.search) + Number(progress.radar)
  const isOnboarding = variant === "onboarding"

  return (
    <Card
      padding="default"
      className={cn(
        "ds-fade-up border-[var(--pm)] bg-[var(--pl)]/40",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="ds-label-uppercase mb-1">Primeros pasos</p>
          <h3
            className={cn(
              "font-bold tracking-[-0.2px] text-[var(--text)]",
              isOnboarding ? "text-[16px]" : "text-[14px]"
            )}
          >
            {doneCount === FIRST_ACTIONS_STEP_COUNT
              ? "¡Listo! Ya puedes construir en Murmur"
              : "Activa Murmur en 3 pasos"}
          </h3>
          <p className="text-[12px] text-[var(--text2)] mt-1 leading-relaxed">
            {isOnboarding
              ? "Completa estos pasos para empezar a recibir matches y conexiones."
              : "Te guiamos hasta que estés visible, con búsqueda activa y radar encendido."}
          </p>
        </div>
        {!isOnboarding && onDismiss ? (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 text-[11px] font-medium text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
          >
            Ocultar
          </button>
        ) : null}
      </div>

      <div
        className="h-1.5 rounded-full bg-[var(--bg3)] mb-4 overflow-hidden"
        role="progressbar"
        aria-valuenow={doneCount}
        aria-valuemin={0}
        aria-valuemax={FIRST_ACTIONS_STEP_COUNT}
        aria-label={`${doneCount} de ${FIRST_ACTIONS_STEP_COUNT} pasos completados`}
      >
        <div
          className="h-full rounded-full bg-[var(--p)] transition-all duration-300"
          style={{ width: `${(doneCount / FIRST_ACTIONS_STEP_COUNT) * 100}%` }}
        />
      </div>

      <ol className="flex flex-col gap-2.5">
        {FIRST_ACTION_STEPS.map((step, index) => {
          const done = progress[step.id]
          const StepIcon = STEP_ICONS[step.id]
          return (
            <li
              key={step.id}
              className={cn(
                "flex gap-3 rounded-xl border px-3 py-2.5",
                done
                  ? "border-[var(--g)]/30 bg-[var(--gl)]/50"
                  : "border-[var(--border)] bg-[var(--bg)]"
              )}
            >
              <div
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  done
                    ? "bg-[var(--g)] text-white"
                    : "bg-[var(--bg3)] text-[var(--text3)]"
                )}
                aria-hidden
              >
                {done ? <IconCheck size={14} /> : index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[var(--text)] flex items-start gap-1.5">
                      <span className="text-[var(--p)] shrink-0 mt-0.5">
                        <StepIcon size={14} />
                      </span>
                      <span className="break-words leading-snug [overflow-wrap:anywhere]">
                        {step.title}
                      </span>
                    </p>
                    <p className="text-[11px] text-[var(--text2)] mt-0.5 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {step.description}
                    </p>
                  </div>
                  {!done ? (
                    <FirstActionCta
                      stepId={step.id}
                      onActivateVisibility={onActivateVisibility}
                      visibilitySaving={visibilitySaving}
                      onActivateRadar={onActivateRadar}
                      radarActivating={radarActivating}
                    />
                  ) : (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.06em] text-[var(--g)]">
                      Hecho
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}

function FirstActionCta({
  stepId,
  onActivateVisibility,
  visibilitySaving,
  onActivateRadar,
  radarActivating,
}: {
  stepId: FirstActionId
  onActivateVisibility?: () => void
  visibilitySaving?: boolean
  onActivateRadar?: () => void
  radarActivating?: boolean
}) {
  if (stepId === "visibility") {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0"
        disabled={visibilitySaving}
        onClick={() => onActivateVisibility?.()}
      >
        {visibilitySaving ? "…" : "Activar"}
      </Button>
    )
  }

  if (stepId === "search") {
    return (
      <Link
        href="/searches/new"
        className={buttonVariants({
          variant: "secondary",
          size: "sm",
          className: "shrink-0 no-underline",
        })}
      >
        Crear
      </Link>
    )
  }

  if (onActivateRadar) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="shrink-0"
        disabled={radarActivating}
        onClick={onActivateRadar}
      >
        {radarActivating ? "…" : "Activar"}
      </Button>
    )
  }

  return (
    <Link
      href="/feed"
      className={buttonVariants({
        variant: "secondary",
        size: "sm",
        className: "shrink-0 no-underline",
      })}
    >
      Ir
    </Link>
  )
}
