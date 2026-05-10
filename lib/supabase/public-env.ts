/** Trim and strip optional surrounding quotes from .env lines */
function stripEnvQuotes(raw: string | undefined): string {
  if (raw == null) return ""
  let s = raw.trim()
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim()
  }
  return s
}

/** https://PROJECT_REF.supabase.co — no trailing slash, no /rest/v1 ni /auth/v1 */
export function normalizeSupabaseUrl(raw: string): string {
  let u = stripEnvQuotes(raw).replace(/\/+$/, "")
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
  const rawUrl = stripEnvQuotes(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const key = stripEnvQuotes(
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  if (!rawUrl || !key) return null
  const url = normalizeSupabaseUrl(rawUrl)
  if (!url) return null
  return { url, key }
}
