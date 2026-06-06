import { getEmailFrom, getResendClient } from "@/lib/email/resend-env"
import { REPORT_REASON_LABELS, type ReportReason } from "@/lib/report-types"
import { getSupportEmail } from "@/lib/product-config"

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function sendUserReportNotifyEmail(args: {
  reportId: string
  reason: ReportReason
  details: string
  reporterName: string
  reportedName: string
  contextType: string | null
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const resend = getResendClient()
  if (!resend) {
    return { ok: false, message: "Resend no configurado." }
  }

  const to =
    process.env.REPORT_NOTIFY_EMAIL?.trim() || getSupportEmail()
  const reasonLabel = REPORT_REASON_LABELS[args.reason]
  const ctx = args.contextType ? ` · contexto: ${args.contextType}` : ""

  const { error } = await resend.emails.send({
    from: getEmailFrom(),
    to,
    subject: `[Murmur] Reporte: ${args.reportedName}`,
    text: `Nuevo reporte (${args.reportId})

Reportado: ${args.reportedName}
Reporta: ${args.reporterName}
Motivo: ${reasonLabel}${ctx}

Detalle:
${args.details || "(sin detalle adicional)"}
`,
    html: `<p><strong>Nuevo reporte</strong> <code>${escapeHtml(args.reportId)}</code></p>
<p>Reportado: <strong>${escapeHtml(args.reportedName)}</strong><br/>
Reporta: ${escapeHtml(args.reporterName)}<br/>
Motivo: ${escapeHtml(reasonLabel)}${escapeHtml(ctx)}</p>
<p>${escapeHtml(args.details || "(sin detalle adicional)")}</p>`,
  })

  if (error) {
    return { ok: false, message: error.message }
  }
  return { ok: true }
}
