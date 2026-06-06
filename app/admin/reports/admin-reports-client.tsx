"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { REPORT_REASON_LABELS, type ReportReason } from "@/lib/report-types"

type AdminReportRow = {
  id: string
  reason: ReportReason
  details: string
  context_type: string | null
  status: string
  created_at: string
  reporter_name: string
  reported_name: string
}

export function AdminReportsClient() {
  const [rows, setRows] = React.useState<AdminReportRow[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [busyId, setBusyId] = React.useState<string | null>(null)

  const reload = React.useCallback(async () => {
    setError(null)
    const res = await fetch("/api/admin/reports")
    const body = (await res.json()) as {
      error?: string
      reports?: AdminReportRow[]
    }
    if (!res.ok) {
      setError(body.error ?? "No pudimos cargar los reportes.")
      setRows([])
      return
    }
    setRows(body.reports ?? [])
  }, [])

  React.useEffect(() => {
    void reload()
  }, [reload])

  async function setStatus(id: string, status: "reviewed" | "dismissed") {
    setBusyId(id)
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        setError(body.error ?? "No pudimos actualizar.")
        return
      }
      await reload()
    } finally {
      setBusyId(null)
    }
  }

  if (rows === null) {
    return (
      <p className="text-[13px] text-[var(--text2)]">Cargando reportes…</p>
    )
  }

  const pending = rows.filter((r) => r.status === "pending")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 text-[12px] text-[var(--text2)]">
        <span>
          <strong className="text-[var(--text)]">{pending.length}</strong>{" "}
          pendientes
        </span>
        <span>·</span>
        <span>{rows.length} total</span>
        <Link href="/admin/access-requests" className="text-[var(--p)] font-semibold">
          Solicitudes de acceso
        </Link>
      </div>

      {error ? (
        <p className="text-[12px] text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <div className="ds-card p-10 text-center">
          <p className="text-[13px] text-[var(--text2)]">No hay reportes aún.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li
              key={r.id}
              className="ds-card p-4 flex flex-col gap-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-[14px] font-bold text-[var(--text)]">
                    {r.reported_name}
                  </p>
                  <p className="text-[11px] text-[var(--text3)]">
                    Reportado por {r.reporter_name} ·{" "}
                    {formatDate(r.created_at)}
                  </p>
                </div>
                <Tag
                  variant={
                    r.status === "pending"
                      ? "amber"
                      : r.status === "reviewed"
                        ? "success"
                        : "neutral"
                  }
                >
                  {r.status === "pending"
                    ? "Pendiente"
                    : r.status === "reviewed"
                      ? "Revisado"
                      : "Descartado"}
                </Tag>
              </div>
              <p className="text-[12px] font-semibold text-[var(--text)]">
                {REPORT_REASON_LABELS[r.reason]}
                {r.context_type ? (
                  <span className="font-normal text-[var(--text3)]">
                    {" "}
                    · {r.context_type}
                  </span>
                ) : null}
              </p>
              {r.details ? (
                <p className="text-[12px] text-[var(--text2)] leading-relaxed whitespace-pre-wrap">
                  {r.details}
                </p>
              ) : null}
              {r.status === "pending" ? (
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={busyId === r.id}
                    onClick={() => void setStatus(r.id, "dismissed")}
                  >
                    Descartar
                  </Button>
                  <Button
                    size="sm"
                    disabled={busyId === r.id}
                    onClick={() => void setStatus(r.id, "reviewed")}
                  >
                    Marcar revisado
                  </Button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("es-MX", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
