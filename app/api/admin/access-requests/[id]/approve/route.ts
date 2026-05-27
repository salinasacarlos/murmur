import { NextResponse } from "next/server"

import { sendAccessRequestApprovedEmail } from "@/lib/email/access-request-mail"
import { resolveAccessIssuerProfileId } from "@/lib/access-issuer-profile"
import { getMurmurAdminSession } from "@/lib/murmur-admin"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: Request, context: RouteContext) {
  const session = await getMurmurAdminSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const issuerId = resolveAccessIssuerProfileId(session.user)

  const { id } = await context.params

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[approve access-request] admin client:", e)
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 503 }
    )
  }

  const { data: code, error: rpcError } = await admin.rpc(
    "approve_access_request",
    { p_request_id: id, p_inviter_id: issuerId }
  )

  if (rpcError != null || !code) {
    const msg = rpcError?.message ?? ""
    console.error("[approve access-request] rpc:", rpcError)
    if (msg.includes("ACCESS_REQUEST_NOT_FOUND")) {
      return NextResponse.json({ error: "Solicitud no encontrada." }, { status: 404 })
    }
    if (msg.includes("ACCESS_REQUEST_NOT_PENDING")) {
      return NextResponse.json(
        { error: "Esta solicitud ya fue procesada." },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: "No pudimos emitir el código de invitación." },
      { status: 500 }
    )
  }

  const { data: reqRow, error: fetchError } = await admin
    .from("access_requests")
    .select("full_name, email")
    .eq("id", id)
    .single()

  if (fetchError || !reqRow) {
    console.error("[approve access-request] fetch row:", fetchError)
    return NextResponse.json(
      {
        ok: true,
        code,
        email_sent: false,
        warning:
          "Código creado pero no pudimos leer el correo para enviarlo; reenvía manualmente.",
      },
      { status: 200 }
    )
  }

  const mail = await sendAccessRequestApprovedEmail({
    to: reqRow.email,
    firstName: reqRow.full_name,
    inviteCode: code,
  })

  return NextResponse.json({
    ok: true,
    code,
    email_sent: mail.ok,
    email_error: mail.ok ? undefined : mail.message,
  })
}
