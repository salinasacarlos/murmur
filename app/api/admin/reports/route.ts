import { NextResponse } from "next/server"

import { getMurmurAdminSession } from "@/lib/murmur-admin"
import { createSupabaseAdmin } from "@/lib/supabase/admin"
import type { ReportReason } from "@/lib/report-types"

export async function GET() {
  const session = await getMurmurAdminSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[admin reports] admin client:", e)
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 503 }
    )
  }

  const { data: rows, error } = await admin
    .from("user_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(99)

  if (error) {
    console.error("[admin reports] select:", error)
    return NextResponse.json(
      { error: "No pudimos cargar los reportes." },
      { status: 500 }
    )
  }

  const list = rows ?? []
  const profileIds = [
    ...new Set(
      list.flatMap((r) => [r.reporter_id as string, r.reported_id as string])
    ),
  ]

  const nameById = new Map<string, string>()
  if (profileIds.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, name")
      .in("id", profileIds)
    for (const p of profiles ?? []) {
      nameById.set(p.id, p.name ?? "—")
    }
  }

  const reports = list.map((r) => ({
    id: r.id as string,
    reason: r.reason as ReportReason,
    details: (r.details as string) ?? "",
    context_type: r.context_type as string | null,
    status: r.status as string,
    created_at: r.created_at as string,
    reporter_name: nameById.get(r.reporter_id as string) ?? "—",
    reported_name: nameById.get(r.reported_id as string) ?? "—",
  }))

  return NextResponse.json({ reports })
}

export async function PATCH(request: Request) {
  const session = await getMurmurAdminSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 })
  }

  const raw = body as { id?: string; status?: string }
  const id = typeof raw.id === "string" ? raw.id.trim() : ""
  const status = raw.status

  if (!id) {
    return NextResponse.json({ error: "Falta id del reporte." }, { status: 400 })
  }
  if (status !== "reviewed" && status !== "dismissed") {
    return NextResponse.json({ error: "Estado inválido." }, { status: 400 })
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[admin reports] admin client:", e)
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 503 }
    )
  }

  const { error } = await admin
    .from("user_reports")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("[admin reports] update:", error)
    return NextResponse.json(
      { error: "No pudimos actualizar el reporte." },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
