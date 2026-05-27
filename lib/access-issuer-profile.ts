import type { User } from "@supabase/supabase-js"

/**
 * Perfil que figura como invitador al emitir códigos desde la cola de acceso.
 * Opcional: ACCESS_ISSUER_PROFILE_ID fija un perfil “equipo” (p. ej. cuenta Murmur).
 * Si no está definido, usa el admin que aprueba (su user id = profiles.id).
 */
export function resolveAccessIssuerProfileId(approvingUser: User): string {
  const fromEnv = process.env.ACCESS_ISSUER_PROFILE_ID?.trim()
  if (fromEnv) return fromEnv
  return approvingUser.id
}
