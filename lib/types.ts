export type RelationType =
  | "co-founder"
  | "empleo"
  | "colaboracion"
  | "mentoria"
  | "inversion"
  | "abierto"

export type FunctionalArea =
  | "tecnico"
  | "producto"
  | "negocio"
  | "operaciones"
  | "ciencia"

export type ExperienceRange = "0-2" | "3-5" | "6-10" | "10+"

export type Availability = "full-time" | "part-time" | "3-6m"

export type WorkStyle =
  | "remoto"
  | "presencial"
  | "hibrido"
  | "rapido"
  | "estructurado"
  | "async"

export type Compatibility = "alta" | "media" | "baja"

export type OnboardingIntent =
  | "founder"
  | "contributor"
  | "both"
  | "investor"

/** Situación declarada del inversionista (obligatorio si intent === investor). */
export type InvestorActivity =
  | "actively_investing"
  | "can_help_source"
  | "not_investing_now"

export type ProjectStage =
  | "idea"
  | "validando"
  | "construyendo"
  | "en_manos_de_personas"
  | "generando_ingresos"
  | "creciendo"

export interface Profile {
  id: string
  name: string
  initials: string
  photoUrl?: string
  role: string
  bio: string
  funFact: string
  area: FunctionalArea
  /** @deprecated prefer primaryIndustrySlug + expertiseSlugs */
  functionalAreaTags?: string[]
  primaryIndustrySlug?: string | null
  /** Verticales (nivel 2) bajo la industria principal; hasta 3. */
  verticalSlugs?: string[]
  expertiseSlugs?: string[]
  talentSlugs?: string[]
  experience: ExperienceRange
  achievement: string
  availability: Availability
  workStyle: WorkStyle[]
  city: string
  cities?: string[]
  relationsLooking: RelationType[]
  compatibility: Compatibility
  online?: boolean
  eventCodes?: string[]
  onboardingIntent?: OnboardingIntent | null
  projectStage?: ProjectStage | null
  projectName?: string | null
  projectSeekSummary?: string | null
  opportunitySeekSummary?: string | null
  contributorPitch?: string | null
  investorActivity?: InvestorActivity | null
}

export interface EventEntry {
  code: string
  name: string
  description?: string
}

export type SearchStatus = "active" | "paused"

export interface Search {
  id: string
  title: string
  description: string
  relations: RelationType[]
  area?: FunctionalArea
  /** @deprecated */
  functionalAreaTags?: string[]
  primaryIndustrySlug?: string | null
  verticalSlugs?: string[]
  expertiseSlugs?: string[]
  talentSlugs?: string[]
  status: SearchStatus
  matchesCount: number
  createdAt: string
}

export type ConnectionStatus = "pending" | "accepted" | "rejected"

export interface ReceivedConnection {
  id: string
  profile: Profile
  relation: RelationType
  message: string
  searchTitle?: string
  receivedAt: string
}

export interface SentConnection {
  id: string
  profile: Profile
  relation: RelationType
  message: string
  status: ConnectionStatus
  sentAt: string
  /** Present when status is accepted and a chat was created */
  chatId?: string | null
}

export interface IgnoredConnection {
  id: string
  profile: Profile
  relation: RelationType
  ignoredAt: string
}

export interface Message {
  id: string
  fromMe: boolean
  text: string
  sentAt: string
}

export interface Chat {
  id: string
  profile: Profile
  messages: Message[]
  unread: number
  lastSeen?: string
}

export interface CurrentUser {
  id: string
  name: string
  initials: string
  photoUrl?: string
  email: string
  role: string
  bio: string
  funFact: string
  area: FunctionalArea
  functionalAreaTags?: string[]
  primaryIndustrySlug?: string | null
  verticalSlugs?: string[]
  expertiseSlugs?: string[]
  talentSlugs?: string[]
  experience: ExperienceRange
  achievement: string
  availability: Availability
  workStyle: WorkStyle[]
  city: string
  cities?: string[]
  searchRadiusKm?: number
  relationsLooking: RelationType[]
  /** Eventos vinculados (solo lectura en perfil) */
  eventCodes?: string[]
  plan: "free" | "premium"
  stats: {
    matches: number
    connections: number
    messages: number
  }
  onboardingIntent?: OnboardingIntent | null
  projectStage?: ProjectStage | null
  projectName?: string | null
  projectSeekSummary?: string | null
  opportunitySeekSummary?: string | null
  contributorPitch?: string | null
  investorActivity?: InvestorActivity | null
}

export const RELATION_LABELS: Record<RelationType, string> = {
  "co-founder": "Co-founder",
  empleo: "Contratar talento",
  colaboracion: "Colaboración",
  mentoria: "Mentoría",
  inversion: "Inversión",
  abierto: "Abierto a explorar",
}

export const ONBOARDING_INTENT_LABELS: Record<OnboardingIntent, string> = {
  founder: "Tengo proyecto",
  contributor: "Quiero contribuir",
  both: "Tengo proyecto y también contribuir",
  investor: "Soy inversionista",
}

export const AREA_LABELS: Record<FunctionalArea, string> = {
  tecnico: "Técnico / Ing.",
  producto: "Producto",
  negocio: "Negocio / Growth",
  operaciones: "Operaciones",
  ciencia: "Ciencia / Experto",
}

export const EXPERIENCE_LABELS: Record<ExperienceRange, string> = {
  "0-2": "0–2 años",
  "3-5": "3–5 años",
  "6-10": "6–10 años",
  "10+": "10+ años",
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  "full-time": "Full-time ya",
  "part-time": "Part-time explorando",
  "3-6m": "En 3–6 meses",
}

export const WORK_STYLE_LABELS: Record<WorkStyle, string> = {
  remoto: "Remoto",
  presencial: "Presencial",
  hibrido: "Híbrido",
  rapido: "Decisiones rápidas",
  estructurado: "Proceso estructurado",
  async: "Async",
}

export const COMPATIBILITY_LABELS: Record<Compatibility, string> = {
  alta: "Compatibilidad alta",
  media: "Compatibilidad media",
  baja: "Compatibilidad baja",
}

export const COMPATIBILITY_COLORS: Record<Compatibility, string> = {
  alta: "var(--g)",
  media: "var(--amber)",
  baja: "var(--text3)",
}
