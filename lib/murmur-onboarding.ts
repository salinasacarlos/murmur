/** Guardado en localStorage al vincular un código de evento válido */
export const PENDING_EVENT_STORAGE_KEY = "murmur:pending-event"

export const EVENT_CODE_LENGTH = 6

/** Semilla de sesión para variantes de copy en cliente */
export const MURM_SESSION_SEED_KEY = "murmur:murm-session-seed"

export type OnboardingMurmStep =
  | "intro"
  | "profile"
  | "intent"
  | "location"
  | "done"

const MURM_LEADS: Record<OnboardingMurmStep, string[]> = {
  intro: [
    "Cuando termines, tu perfil quedará listo. Tú decides cuándo mostrarte.",
  ],
  profile: [
    "Con esto te mostramos perfiles que encajan. Tú controlas la visibilidad.",
  ],
  intent: [
    "Cómo participas y qué buscas orientan las sugerencias. Siempre lo puedes cambiar.",
  ],
  location: [
    "Ciudad y radio ayudan a filtrar. Nunca mostramos tu ubicación exacta.",
  ],
  done: [
    "Listo. Puedes crear una búsqueda o ir al feed cuando quieras.",
  ],
}

/** Copy corto para el componente Murm; `seed` elige variante estable por sesión. */
export function getMurmVoice(
  step: OnboardingMurmStep,
  seed: number,
  branch?: string
): { lead: string; aside?: string } {
  void branch
  const variants = MURM_LEADS[step]
  const lead = variants[Math.abs(seed) % variants.length] ?? variants[0] ?? ""
  return { lead }
}
