import { NextResponse } from "next/server"

import { parseAccessRequestBody } from "@/lib/access-request-validation"
import { sendAccessRequestReceivedEmail } from "@/lib/email/access-request-mail"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const parsed = parseAccessRequestBody(body)
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: 400 })
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[access-requests] admin client:", e)
    return NextResponse.json(
      { error: "No pudimos procesar tu solicitud. Intenta más tarde." },
      { status: 503 }
    )
  }

  const { data: row, error: insertError } = await admin
    .from("access_requests")
    .insert({
      full_name: parsed.full_name,
      email: parsed.email,
      building_description: parsed.building_description,
      project_stage: parsed.project_stage,
      proof_url: parsed.proof_url,
      status: "pending",
    })
    .select("id")
    .single()

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        {
          error:
            "Ya tienes una solicitud en revisión con este correo. Te avisaremos cuando haya novedades.",
        },
        { status: 409 }
      )
    }
    console.error("[access-requests] insert:", insertError)
    return NextResponse.json(
      { error: "No pudimos guardar tu solicitud. Intenta de nuevo." },
      { status: 500 }
    )
  }

  const { data: position, error: posError } = await admin.rpc(
    "access_request_queue_position",
    { p_request_id: row.id }
  )

  if (posError != null || position == null) {
    console.error("[access-requests] position:", posError)
    await admin.from("access_requests").delete().eq("id", row.id)
    return NextResponse.json(
      { error: "No pudimos confirmar tu lugar en la lista. Intenta de nuevo." },
      { status: 500 }
    )
  }

  const mail = await sendAccessRequestReceivedEmail({
    to: parsed.email,
    firstName: parsed.full_name,
    queuePosition: position,
  })

  if (!mail.ok) {
    console.error("[access-requests] email:", mail.message)
    return NextResponse.json({
      id: row.id,
      queue_position: position,
      email_sent: false,
    })
  }

  return NextResponse.json({
    id: row.id,
    queue_position: position,
    email_sent: true,
  })
}
