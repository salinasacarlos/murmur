"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Field, Textarea } from "@/components/ui/input"
import { IconSpark } from "@/components/icons"
import {
  countProfilesInEvent,
  createEventWithCode,
  fetchEventByCode,
  joinEventByCode,
} from "@/lib/data/events"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { EventEntry } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EventCodeJoinProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onJoin: (event: EventEntry) => void | Promise<void>
}

const CODE_MAX = 6

type Mode = "join" | "create"

export function EventCodeJoin({
  open,
  onOpenChange,
  onJoin,
}: EventCodeJoinProps) {
  const [mode, setMode] = React.useState<Mode>("join")
  const [code, setCode] = React.useState("")
  const [eventName, setEventName] = React.useState("")
  const [eventDescription, setEventDescription] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [resolved, setResolved] = React.useState<EventEntry | null>(null)
  const [peopleCount, setPeopleCount] = React.useState(0)
  const [resolving, setResolving] = React.useState(false)
  const [creating, setCreating] = React.useState(false)

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        setMode("join")
        setCode("")
        setEventName("")
        setEventDescription("")
        setError(null)
        setResolved(null)
        setPeopleCount(0)
        setCreating(false)
      }
      onOpenChange(next)
    },
    [onOpenChange]
  )

  const normalized = code.trim().toUpperCase()

  React.useEffect(() => {
    if (!open || mode !== "join" || normalized.length !== CODE_MAX) {
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
  }, [open, mode, normalized])

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

  async function attemptCreate() {
    if (normalized.length !== CODE_MAX) {
      setError(`El código debe tener ${CODE_MAX} caracteres.`)
      return
    }
    if (eventName.trim().length < 2) {
      setError("Añade un nombre de evento (al menos 2 caracteres).")
      return
    }

    setCreating(true)
    setError(null)
    const supabase = getSupabaseBrowserClient()
    const res = await createEventWithCode(supabase, {
      code: normalized,
      name: eventName.trim(),
      description: eventDescription.trim() || null,
    })
    setCreating(false)

    if (!res.ok) {
      setError(res.message)
      return
    }

    await onJoin(res.event)
  }

  const codeHintJoin = `Hasta ${CODE_MAX} caracteres. Suelen aparecer en la pantalla del evento.`
  const codeHintCreate = `Define ${CODE_MAX} letras o números; así otros podrán unirse con el mismo código.`

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      ariaLabel="Evento en vivo"
    >
      <DrawerHeader
        title="Evento en vivo"
        description="Únete con un código que ya existe o crea uno nuevo para tu meetup, feria o sala."
      />

      <div
        className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[var(--bg2)] mb-4"
        role="tablist"
        aria-label="Tipo de acción"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === "join"}
          onClick={() => {
            setMode("join")
            setError(null)
          }}
          className={cn(
            "py-2 px-2 rounded-lg text-[12px] font-semibold transition-colors",
            mode === "join"
              ? "bg-[var(--bg)] text-[var(--text)] shadow-sm border border-[var(--border)]"
              : "text-[var(--text2)] hover:text-[var(--text)]"
          )}
        >
          Unirme
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "create"}
          onClick={() => {
            setMode("create")
            setError(null)
            setResolved(null)
            setPeopleCount(0)
          }}
          className={cn(
            "py-2 px-2 rounded-lg text-[12px] font-semibold transition-colors",
            mode === "create"
              ? "bg-[var(--bg)] text-[var(--text)] shadow-sm border border-[var(--border)]"
              : "text-[var(--text2)] hover:text-[var(--text)]"
          )}
        >
          Crear código
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-4">
        <Field
          label="Código del evento"
          hint={mode === "join" ? codeHintJoin : codeHintCreate}
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
                void (mode === "join" ? attemptJoin() : attemptCreate())
              }
            }}
            placeholder="EJ. BLDR26"
            className={cn(
              "ds-input text-center text-[18px] font-mono tracking-[0.4em] uppercase"
            )}
            style={{ letterSpacing: "0.4em" }}
          />
        </Field>

        {mode === "join" && resolved && (
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

        {mode === "create" ? (
          <>
            <Field
              label="Nombre del evento"
              hint="Ej. Networking women in tech · CDMX"
            >
              <input
                type="text"
                value={eventName}
                onChange={(e) => {
                  setEventName(e.target.value)
                  setError(null)
                }}
                placeholder="Cómo se llama el espacio"
                className="ds-input"
                autoComplete="off"
              />
            </Field>
            <Field
              label="Descripción (opcional)"
              hint="Una línea para quien escanee el código."
            >
              <Textarea
                rows={3}
                value={eventDescription}
                onChange={(e) => {
                  setEventDescription(e.target.value)
                  setError(null)
                }}
                placeholder="Ej. Stand 12 · pasa a saludar"
                className="resize-none min-h-[72px]"
              />
            </Field>
          </>
        ) : null}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 justify-center"
          onClick={() => handleOpenChange(false)}
          disabled={creating}
        >
          Cancelar
        </Button>
        {mode === "join" ? (
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void attemptJoin()}
            disabled={normalized.length !== CODE_MAX || resolving}
          >
            Unirme
          </Button>
        ) : (
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void attemptCreate()}
            disabled={
              normalized.length !== CODE_MAX ||
              eventName.trim().length < 2 ||
              creating
            }
          >
            {creating ? "Creando…" : "Crear y entrar"}
          </Button>
        )}
      </div>
    </Drawer>
  )
}
