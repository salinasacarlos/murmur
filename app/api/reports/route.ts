import { NextResponse } from "next/server"

import { sendUserReportNotifyEmail } from "@/lib/email/report-mail"
import { parseReportBody } from "@/lib/report-validation"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Inicia sesión para reportar." },
      { status: 401 }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const parsed = parseReportBody(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 })
  }

  if (parsed.value.reported_id === user.id) {
    return NextResponse.json(
      { error: "No puedes reportarte a ti mismo." },
      { status: 400 }
    )
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[reports] admin client:", e)
    return NextResponse.json(
      { error: "No pudimos enviar el reporte. Intenta más tarde." },
      { status: 503 }
    )
  }

  const { data: reportedProfile } = await admin
    .from("profiles")
    .select("id, name")
    .eq("id", parsed.value.reported_id)
    .maybeSingle()

  if (!reportedProfile) {
    return NextResponse.json(
      { error: "No encontramos ese perfil." },
      { status: 404 }
    )
  }

  const { data: reporterProfile } = await admin
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .maybeSingle()

  const { data: row, error: insertError } = await admin
    .from("user_reports")
    .insert({
      reporter_id: user.id,
      reported_id: parsed.value.reported_id,
      reason: parsed.value.reason,
      details: parsed.value.details,
      context_type: parsed.value.context_type,
      context_id: parsed.value.context_id,
      status: "pending",
    })
    .select("id")
    .single()

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        {
          error:
            "Ya tienes un reporte pendiente sobre esta persona. Revisaremos el anterior.",
        },
        { status: 409 }
      )
    }
    console.error("[reports] insert:", insertError)
    return NextResponse.json(
      { error: "No pudimos guardar el reporte. Intenta de nuevo." },
      { status: 500 }
    )
  }

  void sendUserReportNotifyEmail({
    reportId: row.id,
    reason: parsed.value.reason,
    details: parsed.value.details,
    reporterName: reporterProfile?.name ?? "Usuario",
    reportedName: reportedProfile.name ?? "Perfil",
    contextType: parsed.value.context_type,
  }).then((mail) => {
    if (!mail.ok) console.error("[reports] notify email:", mail.message)
  })

  return NextResponse.json({ ok: true, id: row.id })
}
