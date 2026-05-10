/**
 * Emite INSERT ... ON CONFLICT para filas de expertise_catalog presentes en
 * lib/profile-taxonomy pero no en migraciones base (16120000 + expansión tech).
 * Uso: npx tsx scripts/emit-expertise-delta-sql.ts > supabase/migrations/YYYYMMDD...sql
 */
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { EXPERTISE_BY_INDUSTRY, INDUSTRIES } from "../lib/profile-taxonomy"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function esc(s: string): string {
  return s.replace(/'/g, "''")
}

/** Líneas de valor en INSERT expertise_catalog: 2º campo es industry_slug (sin espacios). */
function collectLegacyExpertiseSlugs(): Set<string> {
  const dir = path.join(__dirname, "../supabase/migrations")
  const files = [
    "20260516120000_industries_replace_ambitos.sql",
    "20260527120000_tecnologia_ia_expertise_expand.sql",
  ]
  const slugs = new Set<string>()
  const lineRe =
    /^\s+\('([a-z0-9-]+)',\s*'([a-z0-9-]+)',\s*'(?:[^']|'')*',\s*\d+,\s*'(negocio|producto|operaciones|ciencia|tecnico)'\)/
  for (const f of files) {
    const text = fs.readFileSync(path.join(dir, f), "utf8")
    if (!text.includes("expertise_catalog")) continue
    for (const line of text.split("\n")) {
      const m = line.match(lineRe)
      if (m) slugs.add(m[1])
    }
  }
  return slugs
}

const legacy = collectLegacyExpertiseSlugs()
const rows: string[] = []
for (const ind of INDUSTRIES) {
  for (const e of EXPERTISE_BY_INDUSTRY[ind.slug] ?? []) {
    if (!legacy.has(e.slug)) {
      rows.push(
        `  ('${e.slug}', '${ind.slug}', '${esc(e.label)}', ${e.sortOrder}, '${e.mapsTo}')`
      )
    }
  }
}

if (rows.length === 0) {
  console.error("emit-expertise-delta-sql: no hay filas nuevas (¿legacy demasiado amplio?)")
  process.exit(1)
}

console.log(
  "-- Verticales de foco adicionales por industria (alineado con lib/profile-taxonomy.ts).\n" +
    "INSERT INTO public.expertise_catalog (slug, industry_slug, label, sort_order, maps_to) VALUES\n" +
    rows.join(",\n") +
    "\nON CONFLICT (slug) DO NOTHING;"
)
