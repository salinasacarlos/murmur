"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import type { Database } from "@/lib/database.types"
import { labelProjectStageShort } from "@/lib/project-stage"
import type { ProjectStage } from "@/lib/types"

type Row = Database["public"]["Tables"]["access_requests"]["Row"]

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("es", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export function AdminAccessRequestsClient() {
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [busy, setBusy] = React.useState<string | null>(null)

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/access-requests")
    const body = (await res.json()) as { error?: string; requests?: Row[] }
    if (!res.ok) {
      setError(body.error ?? "Error al cargar.")
      return
    }
    setError(null)
    setRows(body.requests ?? [])
  }, [])

  React.useEffect(() => {
    void load()
  }, [load])

  async function approve(id: string) {
    setBusy(`${id}-a`)
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/approve`, {
        method: "POST",
      })
      const body = (await res.json()) as {
        error?: string
        code?: string
        email_sent?: boolean
        email_error?: string
      }
      if (!res.ok) {
        window.alert(body.error ?? "No se pudo aprobar.")
        return
      }
      if (!body.email_sent) {
        window.alert(
          `Código generado: ${body.code ?? "?"}. El correo no salió: ${body.email_error ?? "error desconocido"}.`
        )
      }
      await load()
    } finally {
      setBusy(null)
    }
  }

  async function reject(id: string) {
    setBusy(`${id}-r`)
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/reject`, {
        method: "POST",
      })
      const body = (await res.json()) as { error?: string }
      if (!res.ok) {
        window.alert(body.error ?? "No se pudo rechazar.")
        return
      }
      await load()
    } finally {
      setBusy(null)
    }
  }

  if (rows === null && !error) {
    return <p className="text-[13px] text-[var(--text2)]">Cargando…</p>
  }

  if (rows === null && error) {
    return (
      <div className="space-y-3">
        <p className="text-[13px] text-[var(--red)]" role="alert">
          {error}
        </p>
        <Button type="button" variant="secondary" onClick={() => void load()}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (rows !== null && rows.length === 0) {
    return (
      <p className="text-[13px] text-[var(--text2)]">No hay solicitudes aún.</p>
    )
  }

  if (rows == null) {
    return null
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--red)]/30 bg-[var(--red-bg)] px-3 py-2 text-[12px] text-[var(--red)]">
          <span>{error}</span>
          <Button type="button" variant="secondary" size="sm" onClick={() => void load()}>
            Reintentar
          </Button>
        </div>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg)]">
      <table className="w-full min-w-[720px] text-left text-[12px]">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--text3)] uppercase tracking-wide">
            <th className="p-3 font-semibold">Recibida</th>
            <th className="p-3 font-semibold">Estado</th>
            <th className="p-3 font-semibold">Nombre</th>
            <th className="p-3 font-semibold">Email</th>
            <th className="p-3 font-semibold">Etapa</th>
            <th className="p-3 font-semibold">Qué construye</th>
            <th className="p-3 font-semibold">Enlace</th>
            <th className="p-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              className="border-b border-[var(--border)] align-top hover:bg-[var(--bg2)]/60"
            >
              <td className="p-3 text-[var(--text2)] whitespace-nowrap">
                {formatDate(r.submitted_at)}
              </td>
              <td className="p-3 font-medium">{r.status}</td>
              <td className="p-3 max-w-[140px] break-words">{r.full_name}</td>
              <td className="p-3 max-w-[180px] break-all text-[var(--text2)]">
                {r.email}
              </td>
              <td className="p-3 text-[var(--text2)] max-w-[120px]">
                {labelProjectStageShort(r.project_stage as ProjectStage)}
              </td>
              <td className="p-3 max-w-[220px] text-[var(--text2)] break-words">
                {r.building_description}
              </td>
              <td className="p-3 max-w-[160px]">
                <a
                  href={r.proof_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--p)] font-semibold underline-offset-2 hover:underline break-all"
                >
                  Abrir
                </a>
              </td>
              <td className="p-3 whitespace-nowrap">
                {r.status === "pending" ? (
                  <div className="flex flex-col gap-1.5">
                    <Button
                      type="button"
                      size="sm"
                      disabled={busy != null}
                      onClick={() => void approve(r.id)}
                    >
                      {busy === `${r.id}-a` ? "…" : "Aprobar"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      disabled={busy != null}
                      onClick={() => void reject(r.id)}
                    >
                      {busy === `${r.id}-r` ? "…" : "Rechazar"}
                    </Button>
                  </div>
                ) : (
                  <span className="text-[var(--text3)]">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  )
}
