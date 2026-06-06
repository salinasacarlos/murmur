export const REPORT_REASONS = [
  "spam",
  "harassment",
  "fake_profile",
  "inappropriate",
  "other",
] as const

export type ReportReason = (typeof REPORT_REASONS)[number]

export type ReportContextType = "profile" | "chat" | "connection"

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  spam: "Spam o publicidad",
  harassment: "Acoso o comportamiento dañino",
  fake_profile: "Perfil falso o suplantación",
  inappropriate: "Contenido inapropiado",
  other: "Otro",
}

export type UserReportRow = {
  id: string
  reporter_id: string
  reported_id: string
  reason: ReportReason
  details: string
  context_type: ReportContextType | null
  context_id: string | null
  status: "pending" | "reviewed" | "dismissed"
  created_at: string
  reviewed_at: string | null
}
