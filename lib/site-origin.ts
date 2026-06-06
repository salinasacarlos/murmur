import { CANONICAL_SITE_ORIGIN } from "@/lib/site"

/** Origen público canónico (sin barra final). */
export function getCanonicalSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) return raw.replace(/\/+$/, "")
  return CANONICAL_SITE_ORIGIN
}

function isLocalHostname(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? ""
  return h === "localhost" || h === "127.0.0.1"
}

/**
 * Origen para OAuth redirectTo en el cliente.
 * En producción usa siempre el dominio canónico (joinmurmur.xyz), no *.vercel.app.
 */
export function getClientAuthOrigin(): string {
  if (typeof window !== "undefined" && isLocalHostname(window.location.hostname)) {
    return window.location.origin
  }
  return getCanonicalSiteOrigin()
}

export function buildAuthCallbackUrl(nextPath?: string | null): string {
  const params = new URLSearchParams()
  if (
    nextPath &&
    nextPath.startsWith("/") &&
    !nextPath.startsWith("//")
  ) {
    params.set("next", nextPath)
  }
  const qs = params.toString()
  const origin = getClientAuthOrigin()
  return `${origin}/auth/callback${qs ? `?${qs}` : ""}`
}

/**
 * Origen para redirects del servidor tras OAuth (callback route, etc.).
 */
export function getRedirectOrigin(request: Request): string {
  const url = new URL(request.url)
  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ?? url.host

  if (isLocalHostname(host)) {
    const proto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
      url.protocol.replace(":", "")
    return `${proto}://${host}`
  }

  return getCanonicalSiteOrigin()
}

/** true si la petición llegó por un host *.vercel.app (producción). */
export function isVercelAppHost(host: string): boolean {
  return host.toLowerCase().endsWith(".vercel.app")
}
