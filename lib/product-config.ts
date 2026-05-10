/**
 * Configuración de producto visible en app y marketing (precios, límites de taxonomía).
 * Límites del plan Free (búsquedas, conexiones, ciudades): ver plan-limits.ts.
 * Al cambiar límites que también viven en RPCs SQL, migrar en sync (ver PRD §7).
 */

export const MAX_PROFILE_VERTICAL_SLUGS = 3
export const MAX_TALENT_SLUGS = 5

/** Precios mostrados en landing (MXN); alinear con Stripe Price amounts / PRD. */
export const PREMIUM_PRICE_WEEKLY_MXN = 49
export const PREMIUM_PRICE_ANNUAL_MXN = 699

export function formatPremiumWeeklyLabel(): string {
  return `$${PREMIUM_PRICE_WEEKLY_MXN} MXN`
}

export function formatPremiumAnnualLabel(): string {
  return `$${PREMIUM_PRICE_ANNUAL_MXN} MXN`
}

const DEFAULT_SUPPORT_EMAIL = "hola@usemurmur.com"

/** Email de contacto (footer, soporte); configurable en Vercel. */
export function getSupportEmail(): string {
  const raw = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()
  return raw && raw.length > 0 ? raw : DEFAULT_SUPPORT_EMAIL
}
