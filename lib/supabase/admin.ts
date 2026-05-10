import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/database.types"
import { normalizeSupabaseUrl } from "@/lib/supabase/public-env"

/** Cliente con service role: solo rutas servidor (p. ej. webhooks Stripe). */
export function createSupabaseAdmin() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? ""
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!rawUrl || !serviceKey) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL (o SUPABASE_URL) y SUPABASE_SERVICE_ROLE_KEY para el admin de Supabase."
    )
  }
  const url = normalizeSupabaseUrl(rawUrl)
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
