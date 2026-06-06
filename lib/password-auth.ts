/** Longitud mínima alineada con Supabase Auth y signup. */
export const MIN_PASSWORD_LENGTH = 8

export function validatePassword(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  }
  return null
}

export function validatePasswordMatch(
  password: string,
  confirm: string
): string | null {
  const base = validatePassword(password)
  if (base) return base
  if (password !== confirm) {
    return "Las contraseñas no coinciden."
  }
  return null
}
