/** Alineado con public.normalize_invite_code (Postgres) — solo cliente. */
export function normalizeInviteCodeInput(raw: string): string | null {
  const s = raw
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
  if (s.length === 11 && s.startsWith("MRM")) {
    return `MRM-${s.slice(3)}`
  }
  if (s.length === 8) {
    return `MRM-${s}`
  }
  return null
}

export function mapInviteSignUpErrorMessage(raw: string | undefined): string {
  const m = (raw ?? "").toUpperCase()
  if (m.includes("INVITE_REQUIRED")) {
    return "Necesitas un código de invitación válido para registrarte."
  }
  if (m.includes("INVITE_INVALID") || m.includes("INVITE_NOT_FOUND")) {
    return "Este código de invitación no es válido."
  }
  if (m.includes("INVITE_USED") || m.includes("INVITE_ALREADY_USED")) {
    return "Este código ya fue usado."
  }
  if (m.includes("23514")) {
    return "Código de invitación inválido o no disponible."
  }
  return raw?.trim() || "No pudimos crear tu cuenta. Revisa el código e intenta de nuevo."
}
