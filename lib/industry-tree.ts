/**
 * Verticales (hojas) agrupadas por industria de producto (`public.industries` /
 * `INDUSTRIES` en profile-taxonomy). Alineado con migración
 * `20260524120000_industries_catalog_profile_parents.sql`.
 */

import type { FunctionalArea } from "@/lib/types"
import {
  ALL_INDUSTRY_LEAVES,
  LEAF_SLUG_TO_PROFILE_INDUSTRY,
  type IndustryLeaf,
} from "@/lib/leaf-catalog"
import { INDUSTRIES } from "@/lib/profile-taxonomy"

export type { IndustryLeaf }
export { LEAF_SLUG_TO_PROFILE_INDUSTRY } from "@/lib/leaf-catalog"

const ALL_LEAVES = ALL_INDUSTRY_LEAVES
function buildLeavesByProfileIndustry(): Readonly<
  Record<string, readonly IndustryLeaf[]>
> {
  const out: Record<string, IndustryLeaf[]> = {}
  for (const ind of INDUSTRIES) {
    out[ind.slug] = []
  }
  for (const leaf of ALL_LEAVES) {
    const p = LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]!
    if (!out[p]) out[p] = []
    out[p]!.push(leaf)
  }
  for (const k of Object.keys(out)) {
    out[k]!.sort((a, b) => a.label.localeCompare(b.label, "es"))
  }
  return out
}

/** Verticales por industria de perfil (tabs del selector). */
export const INDUSTRY_LEAVES_BY_PROFILE_INDUSTRY: Readonly<
  Record<string, readonly IndustryLeaf[]>
> = buildLeavesByProfileIndustry()

const _slugToLabel = new Map<string, string>()
const _labelToProfileIndustry = new Map<string, string>()

for (const ind of INDUSTRIES) {
  _slugToLabel.set(ind.slug, ind.label)
}

for (const leaf of ALL_LEAVES) {
  _slugToLabel.set(leaf.slug, leaf.label)
  _labelToProfileIndustry.set(
    leaf.label,
    LEAF_SLUG_TO_PROFILE_INDUSTRY[leaf.slug]!
  )
}

/** Slug (industria de perfil o vertical) → nombre mostrado. */
export const INDUSTRY_SLUG_TO_LABEL: ReadonlyMap<string, string> = _slugToLabel

/** Vertical (por label) → industria de perfil activa sugerida. */
export function profileIndustrySlugForLeafLabel(
  label: string
): string | undefined {
  return _labelToProfileIndustry.get(label)
}

/** Todas las etiquetas de verticales (búsqueda / completitud). */
export const ALL_INDUSTRY_LEAF_LABELS: readonly string[] = ALL_LEAVES.map(
  (l) => l.label
)

export function leavesForProfileIndustry(
  profileIndustrySlug: string
): readonly IndustryLeaf[] {
  return INDUSTRY_LEAVES_BY_PROFILE_INDUSTRY[profileIndustrySlug] ?? []
}

/** Primera industria de perfil por sortOrder del catálogo. */
export const DEFAULT_PROFILE_INDUSTRY_SLUG = INDUSTRIES[0]!.slug

/** @deprecated usar profileIndustrySlugForLeafLabel */
export function domainSlugForLeafLabel(
  label: string
): string | undefined {
  return profileIndustrySlugForLeafLabel(label)
}

/** @deprecated usar leavesForProfileIndustry */
export function leavesForDomain(
  domainSlug: string
): readonly IndustryLeaf[] {
  return leavesForProfileIndustry(domainSlug)
}

/** @deprecated usar DEFAULT_PROFILE_INDUSTRY_SLUG */
export const DEFAULT_INDUSTRY_DOMAIN_SLUG = DEFAULT_PROFILE_INDUSTRY_SLUG

/** Vertical de perfil (nivel 2): General + hojas (`IndustryLeaf`) por industria. */
export interface ProfileVerticalDefinition {
  slug: string
  label: string
  sortOrder: number
  mapsTo: FunctionalArea
  industrySlug: string
}

function buildProfileVerticalsByIndustry(): Readonly<
  Record<string, readonly ProfileVerticalDefinition[]>
> {
  const out: Record<string, ProfileVerticalDefinition[]> = {}
  for (const ind of INDUSTRIES) {
    const genSlug = `${ind.slug}-general`
    const rows: ProfileVerticalDefinition[] = [
      {
        slug: genSlug,
        label: "General",
        sortOrder: 0,
        mapsTo: ind.mapsTo,
        industrySlug: ind.slug,
      },
    ]
    let ord = 100
    for (const leaf of leavesForProfileIndustry(ind.slug)) {
      rows.push({
        slug: leaf.slug,
        label: leaf.label,
        sortOrder: ord,
        mapsTo: ind.mapsTo,
        industrySlug: ind.slug,
      })
      ord += 10
    }
    out[ind.slug] = rows
  }
  return out
}

/** Catálogo UI verticales (nivel 2) por industria principal. */
export const PROFILE_VERTICALS_BY_INDUSTRY: Readonly<
  Record<string, readonly ProfileVerticalDefinition[]>
> = buildProfileVerticalsByIndustry()

const PROFILE_VERTICAL_MAP = new Map<string, ProfileVerticalDefinition>()
for (const ind of INDUSTRIES) {
  for (const v of PROFILE_VERTICALS_BY_INDUSTRY[ind.slug] ?? []) {
    PROFILE_VERTICAL_MAP.set(v.slug, v)
  }
}

export function labelProfileVerticalSlug(slug: string): string {
  return PROFILE_VERTICAL_MAP.get(slug)?.label ?? slug
}

export function profileVerticalBelongsToIndustry(
  verticalSlug: string,
  industrySlug: string
): boolean {
  return PROFILE_VERTICAL_MAP.get(verticalSlug)?.industrySlug === industrySlug
}

export function filterProfileVerticalSlugsForIndustry(
  industrySlug: string | null | undefined,
  verticalSlugs: string[] | null | undefined,
  max = 3
): string[] {
  if (!industrySlug || !verticalSlugs?.length) return []
  const allowed = new Set(
    (PROFILE_VERTICALS_BY_INDUSTRY[industrySlug] ?? []).map((v) => v.slug)
  )
  return verticalSlugs.filter((s) => allowed.has(s)).slice(0, max)
}

export function defaultGeneralVerticalSlug(industrySlug: string): string {
  return `${industrySlug}-general`
}
