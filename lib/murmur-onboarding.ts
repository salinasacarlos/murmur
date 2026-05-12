/** Guardado en localStorage al vincular un código de evento válido */
export const PENDING_EVENT_STORAGE_KEY = "murmur:pending-event"

export const EVENT_CODE_LENGTH = 6

/** Semilla de sesión para variantes de copy en cliente */
export const MURM_SESSION_SEED_KEY = "murmur:murm-session-seed"

export type OnboardingMurmStep =
  | "intro"
  | "role"
  | "relationships"
  | "profile"
  | "location"
  | "done"

const MURM_LEADS: Record<OnboardingMurmStep, string[]> = {
  intro: [
    "Cuando termines, tu perfil quedará listo para que decidas cuándo mostrarte.",
  ],
  role: [
    "Una elección aquí orienta el matching; puedes detallar proyecto u oportunidad en tus búsquedas.",
  ],
  relationships: [
    "Esto alimenta el tipo de conexiones que verás; siempre lo puedes ajustar.",
  ],
  profile: [
    "Estos datos son los que usamos para el matching; tú controlas la visibilidad.",
  ],
  location: [
    "Ciudad y radio ayudan al radar sin exponer tu ubicación exacta.",
  ],
  done: [
    "Listo. Puedes crear una búsqueda específica o explorar el feed cuando quieras.",
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
