import { cookies } from "next/headers"

import { createServerClient } from "@supabase/ssr"

import type { Database } from "@/lib/database.types"

import { getSupabasePublicEnv } from "@/lib/supabase/public-env"

export async function getSupabaseServerClient() {
  const env = getSupabasePublicEnv()
  if (!env) {
    throw new Error(
      "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)"
    )
  }
  const { url, key } = env
  const cookieStore = await cookies()
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Called from a Server Component; cookies are read-only there.
          // Rely on middleware to refresh the session in that case.
        }
      },
    },
  })
}
