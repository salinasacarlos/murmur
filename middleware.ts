import { type NextRequest, NextResponse } from "next/server"

import { createServerClient } from "@supabase/ssr"

import type { Database } from "@/lib/database.types"

import { getSupabasePublicEnv } from "@/lib/supabase/public-env"
import {
  getCanonicalSiteOrigin,
  isVercelAppHost,
} from "@/lib/site-origin"

const PROTECTED_PREFIXES = [
  "/admin",
  "/feed",
  "/searches",
  "/connections",
  "/messages",
  "/profile",
  "/invitations",
  "/notifications",
  "/onboarding",
  "/upgrade",
]

const AUTH_PAGES = ["/auth/login", "/auth/signup"]

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? ""

  // Producción: nunca servir la app en *.vercel.app (cookies OAuth quedan en el host equivocado).
  if (
    process.env.VERCEL_ENV === "production" &&
    isVercelAppHost(host)
  ) {
    const canonical = new URL(getCanonicalSiteOrigin())
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.protocol = canonical.protocol
    redirectUrl.host = canonical.host
    return NextResponse.redirect(redirectUrl, 308)
  }

  const env = getSupabasePublicEnv()

  let response = NextResponse.next({ request })

  if (!env) {
    return response
  }

  const { url, key } = env
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value)
        }
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )
  const isAuthPage = AUTH_PAGES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  )

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/auth/login"
    const nextPath = `${pathname}${request.nextUrl.search}`
    redirectUrl.searchParams.set("next", nextPath)
    return NextResponse.redirect(redirectUrl)
  }

  if (isAuthPage && user) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/feed"
    redirectUrl.search = ""
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
