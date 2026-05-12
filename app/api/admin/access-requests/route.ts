import { NextResponse } from "next/server"

import { getMurmurAdminSession } from "@/lib/murmur-admin"
import { createSupabaseAdmin } from "@/lib/supabase/admin"

export async function GET() {
  const session = await getMurmurAdminSession()
  if (!session) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 })
  }

  let admin: ReturnType<typeof createSupabaseAdmin>
  try {
    admin = createSupabaseAdmin()
  } catch (e) {
    console.error("[admin access-requests] admin client:", e)
    return NextResponse.json(
      { error: "Configuración del servidor incompleta." },
      { status: 503 }
    )
  }

  const { data: rows, error } = await admin
    .from("access_requests")
    .select("*")
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("[admin access-requests] select:", error)
    return NextResponse.json(
      { error: "No pudimos cargar las solicitudes." },
      { status: 500 }
    )
  }

  const list = [...(rows ?? [])].sort((a, b) => {
    const pa = a.status === "pending" ? 0 : 1
    const pb = b.status === "pending" ? 0 : 1
    if (pa !== pb) return pa - pb
    if (a.status === "pending" && b.status === "pending") {
      return a.submitted_at.localeCompare(b.submitted_at)
    }
    return b.submitted_at.localeCompare(a.submitted_at)
  })

  return NextResponse.json({ requests: list })
}
