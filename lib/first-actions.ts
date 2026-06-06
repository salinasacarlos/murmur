export const FIRST_ACTIONS_STEP_COUNT = 3

export const FIRST_ACTIONS_DISMISS_KEY = "murmur:first-actions-dismissed"

export type FirstActionId = "visibility" | "search" | "radar"

export type FirstActionStepDef = {
  id: FirstActionId
  title: string
  description: string
}

export const FIRST_ACTION_STEPS: FirstActionStepDef[] = [
  {
    id: "visibility",
    title: "Activa tu visibilidad",
    description:
      "Así otros pueden verte en Descubrir y enviarte conexiones con contexto.",
  },
  {
    id: "search",
    title: "Crea tu primera búsqueda",
    description:
      "Define a quién buscas (socio, talento, mentor…) para rankear el feed.",
  },
  {
    id: "radar",
    title: "Activa el radar",
    description:
      "Escanea perfiles cerca de ti y empieza a explorar quién encaja contigo.",
  },
]

function dismissKey(userId: string) {
  return `${FIRST_ACTIONS_DISMISS_KEY}:${userId}`
}

export function readFirstActionsDismissed(userId: string): boolean {
  try {
    return localStorage.getItem(dismissKey(userId)) === "1"
  } catch {
    return false
  }
}

export function writeFirstActionsDismissed(userId: string, dismissed: boolean) {
  try {
    if (dismissed) localStorage.setItem(dismissKey(userId), "1")
    else localStorage.removeItem(dismissKey(userId))
  } catch {
    /* ignore */
  }
}

export type FirstActionsProgress = {
  visibility: boolean
  search: boolean
  radar: boolean
}

export function countFirstActionsDone(progress: FirstActionsProgress): number {
  return Number(progress.visibility) + Number(progress.search) + Number(progress.radar)
}

export function allFirstActionsDone(progress: FirstActionsProgress): boolean {
  return progress.visibility && progress.search && progress.radar
}
