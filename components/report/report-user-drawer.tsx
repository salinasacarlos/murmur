"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Field, Textarea } from "@/components/ui/input"
import {
  REPORT_REASONS,
  REPORT_REASON_LABELS,
  type ReportContextType,
  type ReportReason,
} from "@/lib/report-types"
import { cn } from "@/lib/utils"

type ReportUserDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  reportedUserId: string
  reportedUserName: string
  contextType?: ReportContextType | null
  contextId?: string | null
}

export function ReportUserDrawer({
  open,
  onOpenChange,
  reportedUserId,
  reportedUserName,
  contextType = "profile",
  contextId = null,
}: ReportUserDrawerProps) {
  const [reason, setReason] = React.useState<ReportReason>("other")
  const [details, setDetails] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setReason("other")
    setDetails("")
    setError(null)
    setDone(false)
    setSubmitting(false)
  }, [open, reportedUserId])

  async function handleSubmit() {
    if (submitting || done) return
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reported_id: reportedUserId,
          reason,
          details,
          context_type: contextType,
          context_id: contextId,
        }),
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(body.error ?? "No pudimos enviar el reporte.")
        return
      }
      setDone(true)
    } catch {
      setError("No pudimos enviar el reporte. Intenta de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  const firstName = reportedUserName.split(" ")[0] ?? reportedUserName

  return (
    <Drawer open={open} onOpenChange={onOpenChange} ariaLabel="Reportar usuario">
      <DrawerHeader
        title={done ? "Reporte recibido" : `Reportar a ${firstName}`}
        description={
          done
            ? "Gracias. Revisaremos tu reporte y tomaremos acción si corresponde."
            : "Cuéntanos qué pasó. Tu reporte es confidencial."
        }
      />

      {done ? (
        <Button
          size="lg"
          className="w-full justify-center"
          onClick={() => onOpenChange(false)}
        >
          Cerrar
        </Button>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
              Motivo
            </p>
            <div className="flex flex-col gap-1.5">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-[12px] transition-colors",
                    reason === r
                      ? "border-[var(--p)] bg-[var(--pl)] text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--bg)] text-[var(--text2)] hover:border-[var(--border2)]"
                  )}
                >
                  {REPORT_REASON_LABELS[r]}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="Detalle (opcional)"
            hint="Máximo 2000 caracteres"
            className="mb-3"
          >
            <Textarea
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 2000))}
              placeholder="Qué viste, cuándo y por qué te preocupa…"
            />
          </Field>

          {error ? (
            <p className="text-[12px] text-[var(--red)] mb-3" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 justify-center"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              size="lg"
              className="flex-1 justify-center"
              disabled={submitting}
              onClick={() => void handleSubmit()}
            >
              {submitting ? "Enviando…" : "Enviar reporte"}
            </Button>
          </div>
        </>
      )}
    </Drawer>
  )
}
