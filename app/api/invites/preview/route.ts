import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import type { InvitePreviewResponse } from "@/lib/invite-preview"
import { getSupabasePublicEnv } from "@/lib/supabase/public-env"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")?.trim() ?? ""
  if (!code) {
    return NextResponse.json<InvitePreviewResponse>(
      { ok: false, error: "missing" },
      { status: 400 }
    )
  }

  const env = getSupabasePublicEnv()
  if (!env) {
    return NextResponse.json<InvitePreviewResponse>(
      { ok: false, error: "config" },
      { status: 503 }
    )
  }

  const supabase = createClient<Database>(env.url, env.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase.rpc("preview_invitation", {
    p_code: code,
  })

  if (error) {
    console.error("[invites/preview]", error.message)
    return NextResponse.json<InvitePreviewResponse>(
      { ok: false, error: "server" },
      { status: 500 }
    )
  }

  const payload = data as unknown as InvitePreviewResponse
  return NextResponse.json(payload)
}
