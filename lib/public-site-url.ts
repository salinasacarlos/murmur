import { getCanonicalSiteOrigin } from "@/lib/site-origin"

/** URL pública de la web (landing, compartir). Sin barra final. */
export function getPublicSiteUrl(): string {
  return getCanonicalSiteOrigin()
}

export { getCanonicalSiteOrigin } from "@/lib/site-origin"

export function buildSignupInviteUrl(inviteCode: string): string {
  return `${getPublicSiteUrl()}/auth/signup?invite=${encodeURIComponent(inviteCode)}`
}
