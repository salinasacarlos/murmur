import type { Database } from "@/lib/database.types"

export type AccessRequestProjectStage =
  Database["public"]["Enums"]["project_stage"]

const PROJECT_STAGES: AccessRequestProjectStage[] = [
  "idea",
  "validando",
  "construyendo",
  "en_manos_de_personas",
  "generando_ingresos",
  "creciendo",
]

const STAGE_SET = new Set<string>(PROJECT_STAGES)

export function normalizeAccessRequestEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function parseAccessRequestBody(input: unknown): {
  ok: true
  full_name: string
  email: string
  building_description: string
  project_stage: AccessRequestProjectStage
  proof_url: string
} | { ok: false; message: string } {
  if (input == null || typeof input !== "object") {
    return { ok: false, message: "Cuerpo inválido." }
  }
  const b = input as Record<string, unknown>

  const fullName = typeof b.full_name === "string" ? b.full_name.trim() : ""
  if (!fullName || fullName.length > 200) {
    return {
      ok: false,
      message: "Indica tu nombre completo (máx. 200 caracteres).",
    }
  }

  const email = normalizeAccessRequestEmail(
    typeof b.email === "string" ? b.email : ""
  )
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Correo electrónico no válido." }
  }

  const building =
    typeof b.building_description === "string"
      ? b.building_description.trim()
      : ""
  if (!building) {
    return {
      ok: false,
      message: "Cuéntanos en qué estás trabajando o qué impulsas.",
    }
  }
  if (building.length > 300) {
    return {
      ok: false,
      message: "La descripción no puede superar 300 caracteres.",
    }
  }

  const stageRaw =
    typeof b.project_stage === "string" ? b.project_stage.trim() : ""
  if (!STAGE_SET.has(stageRaw)) {
    return { ok: false, message: "Elige una etapa del proyecto." }
  }
  const project_stage = stageRaw as AccessRequestProjectStage

  const proofRaw = typeof b.proof_url === "string" ? b.proof_url.trim() : ""
  if (!proofRaw) {
    return {
      ok: false,
      message: "Comparte un enlace que respalde lo que haces.",
    }
  }
  let proof_url: string
  try {
    const u = new URL(proofRaw)
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      return { ok: false, message: "El enlace debe ser http o https." }
    }
    proof_url = u.toString()
  } catch {
    return { ok: false, message: "El enlace no es una URL válida." }
  }

  return {
    ok: true,
    full_name: fullName,
    email,
    building_description: building,
    project_stage,
    proof_url,
  }
}
