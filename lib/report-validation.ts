import {
  REPORT_REASONS,
  type ReportContextType,
  type ReportReason,
} from "@/lib/report-types"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const CONTEXT_TYPES = new Set<ReportContextType>([
  "profile",
  "chat",
  "connection",
])

export type ParsedReportBody = {
  reported_id: string
  reason: ReportReason
  details: string
  context_type: ReportContextType | null
  context_id: string | null
}

export function parseReportBody(
  body: unknown
): { ok: true; value: ParsedReportBody } | { ok: false; message: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, message: "Datos inválidos." }
  }

  const raw = body as Record<string, unknown>
  const reported_id =
    typeof raw.reported_id === "string" ? raw.reported_id.trim() : ""
  if (!UUID_RE.test(reported_id)) {
    return { ok: false, message: "Perfil no válido." }
  }

  const reason = raw.reason
  if (typeof reason !== "string" || !REPORT_REASONS.includes(reason as ReportReason)) {
    return { ok: false, message: "Elige un motivo de reporte." }
  }

  const details =
    typeof raw.details === "string" ? raw.details.trim().slice(0, 2000) : ""

  let context_type: ReportContextType | null = null
  if (raw.context_type != null && raw.context_type !== "") {
    if (
      typeof raw.context_type !== "string" ||
      !CONTEXT_TYPES.has(raw.context_type as ReportContextType)
    ) {
      return { ok: false, message: "Contexto de reporte inválido." }
    }
    context_type = raw.context_type as ReportContextType
  }

  let context_id: string | null = null
  if (raw.context_id != null && raw.context_id !== "") {
    if (typeof raw.context_id !== "string" || !UUID_RE.test(raw.context_id.trim())) {
      return { ok: false, message: "Referencia de contexto inválida." }
    }
    context_id = raw.context_id.trim()
  }

  return {
    ok: true,
    value: {
      reported_id,
      reason: reason as ReportReason,
      details,
      context_type,
      context_id,
    },
  }
}
