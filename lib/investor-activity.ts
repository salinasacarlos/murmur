import type { InvestorActivity } from "@/lib/types"

/** Opciones de actividad como inversionista (orden fijo). */
export const INVESTOR_ACTIVITY_OPTIONS: {
  slug: InvestorActivity
  title: string
  description: string
}[] = [
  {
    slug: "actively_investing",
    title: "Inviertes activamente",
    description: "Sí, estoy invirtiendo o cerrando deals en este momento",
  },
  {
    slug: "can_help_source",
    title: "Ayudas a conseguir",
    description: "Puedo conectar equipos con capital, fondos o oportunidades",
  },
  {
    slug: "not_investing_now",
    title: "No por ahora",
    description: "No estoy invirtiendo ni cerrando cheques en este momento",
  },
]

const SHORT: Record<InvestorActivity, string> = {
  actively_investing: "Invirtiendo activo",
  can_help_source: "Facilita capital",
  not_investing_now: "Sin invertir ahora",
}

/** Chip en tarjeta / listados. */
export function labelInvestorActivityShort(slug: InvestorActivity): string {
  return SHORT[slug]
}

/** Línea completa onboarding / perfil. */
export function labelInvestorActivityLong(slug: InvestorActivity): string {
  const o = INVESTOR_ACTIVITY_OPTIONS.find((x) => x.slug === slug)
  if (!o) return slug
  return `${o.title} — ${o.description}`
}
