import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** Same rules as lib/supabase/public-env.ts — project root URL only. */
function normalizeSupabaseUrl(raw) {
  let u = String(raw).trim().replace(/\/+$/, "")
  for (const s of [
    "/rest/v1",
    "/auth/v1",
    "/storage/v1",
    "/realtime/v1",
    "/graphql/v1",
  ]) {
    if (u.endsWith(s)) {
      u = u.slice(0, -s.length).replace(/\/+$/, "")
    }
  }
  return u
}

/** First matching non-empty env (Supabase docs / templates use several names). */
function firstNonEmpty(...values) {
  for (const v of values) {
    let s = typeof v === "string" ? v.trim() : ""
    if (
      (s.startsWith('"') && s.endsWith('"')) ||
      (s.startsWith("'") && s.endsWith("'"))
    ) {
      s = s.slice(1, -1).trim()
    }
    if (s) return s
  }
  return ""
}

// Expose URL + key to the browser bundle even if only unprefixed or ANON vars exist in .env.local.
// IMPORTANT: do not set keys to "" — that can override real values from .env.local in the client bundle.
const resolvedSupabaseUrl = normalizeSupabaseUrl(
  firstNonEmpty(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL
  )
)
const resolvedSupabaseKey = firstNonEmpty(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.SUPABASE_ANON_KEY
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ...(resolvedSupabaseUrl
      ? { NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl }
      : {}),
    ...(resolvedSupabaseKey
      ? { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: resolvedSupabaseKey }
      : {}),
  },
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
