/**
 * Copy curado para Murm en onboarding (sin LLM).
 * Tono: sabio, empático, motivador; guiños ligeros a historia, mitos y ciencia ficción.
 */

export const MURM_SESSION_SEED_KEY = "murmur:murm-seed"

/** Payload guardado al completar onboarding con código de evento válido */
export const PENDING_EVENT_STORAGE_KEY = "murmur:pending-event"

export const EVENT_CODE_LENGTH = 6

export type OnboardingMurmStep =
  | "welcome"
  | "event"
  | "role"
  | "relationships"
  | "profile"
  | "project"
  | "location"
  | "done"

type MurmBlock = { lead: string; asides: string[] }

const COPY: Record<OnboardingMurmStep, MurmBlock> = {
  welcome: {
    lead:
      "Soy Murm. No vengo a llenarte de formularios infinitos: vengo a ayudarte a cruzar el puente entre dos orillas que aún no se han encontrado.",
    asides: [
      "Como en la Biblioteca de Alejandría, lo valioso no es el ruido: es la conexión correcta entre ideas y personas.",
      "En algún relato de viajeros entre estrellas, quien encuentra a su tripulación llega antes que quien viaja solo.",
      "Odiseo no buscaba islas al azar: buscaba casa. Aquí eliges con qué propósito apareces.",
      "Un mentor es un espejo que ya cruzó la niebla. Dame unos minutos y te ayudo a aclarar la tuya.",
    ],
  },
  event: {
    lead:
      "A veces el contexto lo es todo: un salón, un escenario, una noche en la que coincidir importa más que mil mensajes en frío.",
    asides: [
      "Piensa en el código como la llave de un mapa estelar temporal: solo la gente que está en la misma órbita la reconoce.",
      "Si no traes código, no pasa nada: el universo de Murmur sigue abierto; solo tendrás que elegir tu constelación más tarde.",
      "En ciertos festivales de historias, los protagonistas se reconocen por una palabra secreta. Aquí es parecido, pero con propósito.",
    ],
  },
  role: {
    lead:
      "Antes de buscar a alguien, es justo decir quién eres en esta historia: ¿traes un proyecto, buscas abordar uno, o ambas cosas a la vez?",
    asides: [
      "Como en las novelas de fundaciones: algunos levantan imperios, otros eligen la facción donde su talento marcará el giro.",
      "No hay rol incorrecto; solo narrativas distintas. El mapa se dibuja con honestidad.",
      "El héroe y el mentore son quienes cambian de rol según la escena. Eso también cuenta.",
    ],
  },
  relationships: {
    lead:
      "¿Qué tipo de vínculo buscas? Co-founder, empleo, mentoría… cada etiqueta es una brújula distinta para quien te lea.",
    asides: [
      "En los cuentos de taberna, siempre preguntan qué buscas antes de presentarte a la mesa correcta.",
      "Las alianzas que cambian industrias empiezan con una intención clara, no con un 'hola' vacío.",
      "Si aún exploras, elijo yo un camino abierto: también es una forma valiente de empezar.",
    ],
  },
  profile: {
    lead:
      "Esta es la primera página de tu dossier público: quien tú quieras que otros lean cuando decidas mostrarte.",
    asides: [
      "Piensa en ello como la hoja que dejarías en un consejo pequeño, no en un curriculum infinito.",
      "Un buen perfil no grita; invita al diálogo.",
      "Los cartógrafos antiguos ponían 'aquí hay dragones' donde faltaba información. Tú decides cuánto mapa revelar.",
    ],
  },
  project: {
    lead:
      "Contexto de proyecto u oportunidad: lo que escribas aquí crea el marco para que otros entiendan por qué escribirías luego.",
    asides: [
      "Un fundador cuenta qué está construyendo; el co-piloto cuenta qué energía aporta. Ambas son piezas del mismo relato.",
      "Como en los informes de exploración: ubicación, etapa, qué falta. Simple, humano, verdadero.",
      "La ciencia ficción nos enseña que la misión importa más que el título de la nave.",
    ],
  },
  location: {
    lead:
      "El lugar ancla coincidencias reales: una ciudad, un radio, las ciudades donde tu búsqueda tiene sentido.",
    asides: [
      "No compartimos tu dirección exacta: solo el contexto geográfico que tú declaras.",
      "Incluso los navegantes estelares fijan coordenadas antes de encontrar puerto.",
      "La distancia importa cuando dos mentes quieren encontrarse fuera de la pantalla.",
    ],
  },
  done: {
    lead:
      "Levantaste un perfil con intención. El siguiente capítulo no lo escribo yo: lo escriben las personas con las que elijas cruzar palabras.",
    asides: [
      "Como dice el viajero que ya vio varios mundos: el primer paso fuera de la nave es el más valiente.",
      "En algunas sagas, el capítulo uno termina justo cuando el grupo se forma. Bienvenido a ese momento.",
      "Lo que sigue es descubrimiento con contexto, no ruído.",
    ],
  },
}

const ROLE_BRANCH_LEADS: Record<string, string> = {
  founder:
    "Ambición con forma: buscas quien abone a lo que ya empujas. Elegir bien aquí ahorra meses de conversaciones que no encajan.",
  contributor:
    "Viene de un lugar generoso: quieres sumar talento a un fuego que ya arde en otro lado. Eso también es liderazgo.",
  both:
    "Doble puerta: construyes lo tuyo y mantienes el oído abierto a otras convocatorias. Murm respeta esa complejidad.",
}

function hashStepAndSeed(step: OnboardingMurmStep, seed: number): number {
  let h = seed ^ step.length * 374761393
  for (let i = 0; i < step.length; i++) {
    h = Math.imul(h ^ step.charCodeAt(i), 1274126177)
  }
  return Math.abs(h) >>> 0
}

export function getMurmVoice(
  step: OnboardingMurmStep,
  seed: number,
  branch?: string
): { lead: string; aside: string } {
  const block = COPY[step]
  let lead = block.lead
  if (step === "role" && branch && ROLE_BRANCH_LEADS[branch]) {
    lead = ROLE_BRANCH_LEADS[branch]
  }
  const idx =
    block.asides.length === 0
      ? 0
      : hashStepAndSeed(step, seed) % block.asides.length
  return { lead, aside: block.asides[idx] ?? "" }
}
