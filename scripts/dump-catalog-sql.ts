/**
 * Genera INSERTs SQL para industries + expertise_catalog desde lib/profile-taxonomy.
 * Uso: npx tsx scripts/dump-catalog-sql.ts
 */
import {
  INDUSTRIES,
  EXPERTISE_BY_INDUSTRY,
} from "../lib/profile-taxonomy"

function esc(s: string): string {
  return s.replace(/'/g, "''")
}

const indVals = INDUSTRIES.map(
  (i) =>
    `  ('${i.slug}', '${esc(i.label)}', ${i.sortOrder}, '${i.mapsTo}')`
).join(",\n")

const exRows = INDUSTRIES.flatMap((i) =>
  (EXPERTISE_BY_INDUSTRY[i.slug] ?? []).map(
    (e) =>
      `  ('${e.slug}', '${i.slug}', '${esc(e.label)}', ${e.sortOrder}, '${e.mapsTo}')`
  )
)

console.log("INSERT INTO public.industries (slug, label, sort_order, maps_to) VALUES")
console.log(indVals + ";")
console.log("")
console.log(
  "INSERT INTO public.expertise_catalog (slug, industry_slug, label, sort_order, maps_to) VALUES"
)
console.log(exRows.join(",\n") + ";")
