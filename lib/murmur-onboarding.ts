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
    "Arma tu perfil en la beta. Empiezas oculto hasta que quieras buscar.",
  ],
  profile: [
    "Con esto la IA filtra perfiles con match. Sin ubicación exacta ni mensajes al azar.",
  ],
  intent: [
    "Cada conexión tendrá un por qué. Siempre puedes cambiar cómo participas.",
  ],
  location: [
    "Ciudad y radio para el radar. Nunca mostramos dónde estás exactamente.",
  ],
  done: [
    "Listo. Crea una búsqueda, explora el feed o invita a alguien con tus códigos.",
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
