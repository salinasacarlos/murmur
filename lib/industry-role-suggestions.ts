const ROLE_SUGGESTIONS_BY_DOMAIN: Readonly<Record<string, readonly string[]>> = {
  "producto-digital-tech": [
    "Product Manager",
    "Engineering Lead",
    "Full-stack developer",
    "Data scientist",
    "UX / Product designer",
    "Founder técnico",
    "Growth / DevRel",
  ],
  "ciencia-ingenieria": [
    "Investigador/a",
    "Ingeniero/a de procesos",
    "Ingeniero/a de I+D",
    "Químico/a / formulación",
    "Especialista en supply chain",
    "Operaciones industriales",
  ],
  "artes-creativo": [
    "Director/a creativo/a",
    "Guionista",
    "Compositor/a / músico/a",
    "Actor/actriz / intérprete",
    "Realizador/a audiovisual",
    "Diseñador/a",
    "Productor/a cultural",
  ],
  "espacio-urbano": [
    "Arquitecto/a",
    "Urbanista",
    "Desarrollador inmobiliario",
    "Project manager de obra",
    "Diseño de interiores",
  ],
  "educacion-cultura": [
    "Docente",
    "Facilitador/a",
    "Diseñador/a instruccional",
    "Coordinador/a cultural",
  ],
  "salud-deporte": [
    "Médico/a",
    "Entrenador/a",
    "Fisioterapeuta",
    "Nutrición / wellness",
    "Operaciones en clínica o club",
  ],
  "impacto-comunidad": [
    "Coordinador/a de impacto",
    "Fundador/a social",
    "Comunidad / membership",
    "Sostenibilidad y reporting",
  ],
  "negocio-servicios": [
    "Founder / CEO",
    "Ventas B2B",
    "Account executive",
    "Marketing / brand",
    "Operaciones comerciales",
    "Reclutamiento / talento",
  ],
}

const DEFAULT_ROLES: readonly string[] = [
  "Founder",
  "Consultor/a",
  "Freelancer",
  "Operaciones",
  "Strategy / negocio",
]

/**
 * Role title chips from the selected industry domain (static rules, no LLM).
 */
export function suggestRoles(
  parentSlug: string | null | undefined,
  max = 8
): string[] {
  const key = parentSlug ?? ""
  const list =
    (key && ROLE_SUGGESTIONS_BY_DOMAIN[key]) || DEFAULT_ROLES
  const out: string[] = []
  const seen = new Set<string>()
  for (const item of list) {
    if (out.length >= max) break
    const t = item.trim()
    if (!t || seen.has(t)) continue
    seen.add(t)
    out.push(t)
  }
  return out
}
