/** URL pública compartible de un perfil (v1: UUID). */
export function profilePublicPath(profileId: string): string {
  return `/p/${profileId}`
}

export function profilePublicUrl(
  profileId: string,
  origin = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://joinmurmur.xyz"
): string {
  return `${origin}${profilePublicPath(profileId)}`
}
