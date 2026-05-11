import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import type { Database } from "@/lib/database.types"
import { getSupabasePublicEnv } from "@/lib/supabase/public-env"

function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/feed"
  }
  return raw
}

export async function GET(request: NextRequest) {
  const env = getSupabasePublicEnv()
  if (!env) {
    return NextResponse.redirect(new URL("/auth/login?error=config", request.url))
  }

  const code = request.nextUrl.searchParams.get("code")
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth", request.url))
  }

  let sessionCookies: {
    name: string
    value: string
    options?: Parameters<NextResponse["cookies"]["set"]>[2]
  }[] = []

  const supabase = createServerClient<Database>(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        sessionCookies = cookiesToSet
      },
    },
  })

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
    code
  )

  if (exchangeError) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth", request.url))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login?error=oauth", request.url))
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle()

  const destination =
    profile?.onboarding_completed === true ? nextPath : "/onboarding"

  const response = NextResponse.redirect(new URL(destination, request.url))

  for (const { name, value, options } of sessionCookies) {
    response.cookies.set(name, value, options)
  }

  return response
}
