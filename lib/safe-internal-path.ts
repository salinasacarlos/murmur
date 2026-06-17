/** Rutas internas seguras para redirects post-login (evita open redirect). */
export function safeInternalPath(
  next: string | null | undefined,
  fallback = "/feed"
): string {
  if (!next || typeof next !== "string") return fallback
  const trimmed = next.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback
  if (trimmed.includes("://")) return fallback
  return trimmed
}
