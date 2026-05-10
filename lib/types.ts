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

export interface Profile {
  id: string
  name: string
  initials: string
  photoUrl?: string
  role: string
  bio: string
  area: FunctionalArea
  experience: ExperienceRange
  achievement: string
  availability: Availability
  industries: string[]
  workStyle: WorkStyle[]
  city: string
  cities?: string[]
  relationsLooking: RelationType[]
  compatibility: Compatibility
  online?: boolean
  eventCodes?: string[]
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
  industries: string[]
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
  area: FunctionalArea
  experience: ExperienceRange
  achievement: string
  availability: Availability
  industries: string[]
  workStyle: WorkStyle[]
  city: string
  cities?: string[]
  searchRadiusKm?: number
  relationsLooking: RelationType[]
  plan: "free" | "premium"
  stats: {
    matches: number
    connections: number
    messages: number
  }
}

export const RELATION_LABELS: Record<RelationType, string> = {
  "co-founder": "Co-founder",
  empleo: "Contratar talento",
  colaboracion: "Colaboración",
  mentoria: "Mentoría",
  inversion: "Inversión",
  abierto: "Abierto a explorar",
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
