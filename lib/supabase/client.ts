"use client"

import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/lib/database.types"

import { getSupabasePublicEnv } from "@/lib/supabase/public-env"

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null

/** Avoid Navigator LockManager deadlocks from React Strict Mode (auth calls hang forever). */
async function authLockNoOp<R>(
  _name: string,
  _acquireTimeout: number,
  fn: () => Promise<R>
): Promise<R> {
  return await fn()
}

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient
  const env = getSupabasePublicEnv()
  if (!env) {
    throw new Error(
      "Faltan variables de Supabase. En tu Mac: murmur1/.env.local con NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, luego reinicia npm run dev. En producción: Vercel → Settings → Environment Variables y Redeploy. Si .env.local se ve atenuado en el editor, es porque no sube a Git; la app sí lo usa."
    )
  }
  const { url, key } = env
  browserClient = createBrowserClient<Database>(url, key, {
    auth: {
      lock: authLockNoOp,
    },
  })
  return browserClient
}
