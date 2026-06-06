import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import type { Database } from "@/lib/database.types"
import { getRedirectOrigin } from "@/lib/site-origin"
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
    return NextResponse.redirect(
      new URL("/auth/login?error=config", getRedirectOrigin(request))
    )
  }

  const code = request.nextUrl.searchParams.get("code")
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth", getRedirectOrigin(request))
    )
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
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth", getRedirectOrigin(request))
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(
      new URL("/auth/login?error=oauth", getRedirectOrigin(request))
    )
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle()

  // Sin fila, error de lectura o onboarding pendiente → siempre al flujo de onboarding
  // (p. ej. registro con Google). No confiar solo en nextPath.
  const onboardingDone =
    !profileError && profile?.onboarding_completed === true
  const destination = onboardingDone ? nextPath : "/onboarding"
  const origin = getRedirectOrigin(request)

  const response = NextResponse.redirect(new URL(destination, origin))

  for (const { name, value, options } of sessionCookies) {
    response.cookies.set(name, value, options)
  }

  return response
}
