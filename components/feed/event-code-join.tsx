"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Field } from "@/components/ui/input"
import { IconSpark } from "@/components/icons"
import { countProfilesInEvent, fetchEventByCode, joinEventByCode } from "@/lib/data/events"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { EventEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EventCodeJoinProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoin: (event: EventEntry) => void | Promise<void>
}

const CODE_MAX = 6

export function EventCodeJoin({
  open,
  onOpenChange,
  onJoin,
}: EventCodeJoinProps) {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [resolved, setResolved] = React.useState<EventEntry | null>(null)
  const [peopleCount, setPeopleCount] = React.useState(0)
  const [resolving, setResolving] = React.useState(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        setCode("")
        setError(null)
        setResolved(null)
        setPeopleCount(0)
      }
      onOpenChange(next)
    },
    [onOpenChange]
  )

  const normalized = code.trim().toUpperCase()

  React.useEffect(() => {
    if (!open || normalized.length !== CODE_MAX) {
      setResolved(null)
      setPeopleCount(0)
      setResolving(false)
      return
    }

    let cancelled = false
    setResolving(true)
    ;(async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        const event = await fetchEventByCode(supabase, normalized)
        const count = event
          ? await countProfilesInEvent(supabase, event.code)
          : 0
        if (!cancelled) {
          setResolved(event)
          setPeopleCount(count)
        }
      } finally {
        if (!cancelled) setResolving(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [open, normalized])

  async function attemptJoin() {
    if (normalized.length !== CODE_MAX) {
      setError(`El código debe tener ${CODE_MAX} caracteres.`)
      return
    }
    const supabase = getSupabaseBrowserClient()
    const found = await fetchEventByCode(supabase, normalized)
    if (!found) {
      setError("No encontramos un evento con ese código.")
      return
    }

    const joined = await joinEventByCode(supabase, found.code)
    if (!joined.ok) {
      setError(joined.message)
      return
    }

    setError(null)
    await onJoin(joined.event)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      ariaLabel="Unirme a un evento"
    >
      <DrawerHeader
        title="Estoy en un evento"
        description="Ingresa el código del evento para ver solo a las personas que también están ahí."
      />

      <div className="flex flex-col gap-3 mb-4">
        <Field
          label="Código del evento"
          hint={`Hasta ${CODE_MAX} caracteres. Suelen aparecer en la pantalla del evento.`}
          error={error ?? undefined}
        >
          <input
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            maxLength={CODE_MAX}
            value={code}
            onChange={(e) => {
              const next = e.target.value
                .replace(/[^a-zA-Z0-9]/g, "")
                .slice(0, CODE_MAX)
                .toUpperCase()
              setCode(next)
              setError(null)
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                void attemptJoin()
              }
            }}
            placeholder="EJ. BLDR26"
            className={cn(
              "ds-input text-center text-[18px] font-mono tracking-[0.4em] uppercase"
            )}
            style={{ letterSpacing: "0.4em" }}
          />
        </Field>

        {resolved && (
          <div className="rounded-lg border border-[var(--pm)] bg-[var(--pl)] p-3">
            <div className="flex items-start gap-2">
              <IconSpark size={14} className="mt-0.5 text-[var(--p)]" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[var(--text)]">
                  {resolved.name}
                </p>
                {resolved.description && (
                  <p className="mt-0.5 text-[12px] text-[var(--text2)]">
                    {resolved.description}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-[var(--text3)]">
                  {resolving
                    ? "Contando participantes…"
                    : `${peopleCount} ${peopleCount === 1 ? "persona" : "personas"} en este evento`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 justify-center"
          onClick={() => handleOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button
          size="lg"
          className="flex-1 justify-center"
          onClick={() => void attemptJoin()}
          disabled={normalized.length !== CODE_MAX || resolving}
        >
          Unirme
        </Button>
      </div>
    </Drawer>
  )
}
