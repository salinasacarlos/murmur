import { NextResponse } from "next/server"

import { getMurmurAdminSession } from "@/lib/murmur-admin"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(_request: Request, context: RouteContext) {
  const session = await getMurmurAdminSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  const { id } = await context.params

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[reject access-request] admin client:", e)
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 503 }
    )
  }

  const now = new Date().toISOString()
  const { data: updated, error } = await admin
    .from("access_requests")
    .update({ status: "rejected", reviewed_at: now })
    .eq("id", id)
    .eq("status", "pending")
    .select("id")

  if (error) {
    console.error("[reject access-request] update:", error)
    return NextResponse.json(
      { error: "No pudimos rechazar la solicitud." },
      { status: 500 }
    )
  }

  if (!updated?.length) {
    return NextResponse.json(
      { error: "Esta solicitud ya no está pendiente." },
      { status: 409 }
    )
  }

  return NextResponse.json({ ok: true })
}
