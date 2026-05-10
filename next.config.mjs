import path from "node:path"
import { fileURLToPath } from "node:url"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

/** First matching non-empty env (Supabase docs / templates use several names). */
function firstNonEmpty(...values) {
  for (const v of values) {
    const s = typeof v === "string" ? v.trim() : ""
    if (s) return s
  }
  return ""
}

// Expose URL + key to the browser bundle even if only unprefixed or ANON vars exist in .env.local.
const resolvedSupabaseUrl = firstNonEmpty(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_URL
)
const resolvedSupabaseKey = firstNonEmpty(
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  process.env.SUPABASE_ANON_KEY
)

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: resolvedSupabaseUrl,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: resolvedSupabaseKey,
  },
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
