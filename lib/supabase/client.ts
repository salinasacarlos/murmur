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
      "Faltan variables de Supabase. Crea murmur1/.env.local (copia .env.local.example) con la URL y la clave publishable/anon del dashboard, o configúralas en Vercel → Settings → Environment Variables y vuelve a desplegar."
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
