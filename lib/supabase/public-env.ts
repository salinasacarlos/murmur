/** https://PROJECT_REF.supabase.co — no trailing slash, no /rest/v1 ni /auth/v1 */
export function normalizeSupabaseUrl(raw: string): string {
  let u = raw.trim().replace(/\/+$/, "")
  const stripSuffixes = [
    "/rest/v1",
    "/auth/v1",
    "/storage/v1",
    "/realtime/v1",
    "/graphql/v1",
  ]
  for (const s of stripSuffixes) {
    if (u.endsWith(s)) {
      u = u.slice(0, -s.length).replace(/\/+$/, "")
    }
  }
  return u
}

/** Publishable (anon) key — see next.config.mjs for additional env aliases. */
export function getSupabasePublicEnv(): { url: string; key: string } | null {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim()
  if (!rawUrl || !key) return null
  const url = normalizeSupabaseUrl(rawUrl)
  if (!url) return null
  return { url, key }
}
