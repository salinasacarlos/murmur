/** URL pública de la web (landing, compartir). Sin barra final. */
export function getPublicSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) {
    return raw.replace(/\/+$/, "")
  }
  return "https://joinmurmur.xyz"
}
