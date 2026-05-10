/**
 * @deprecated Usar `profile-taxonomy.ts` (industria + expertise + talentos).
 * Re-exportamos alias para código legado y etiquetas de slugs antiguos.
 */
import type { FunctionalArea } from "@/lib/types"
import {
  ALL_EXPERTISE,
  labelExpertiseSlug,
  mapsToForExpertiseSlug,
} from "@/lib/profile-taxonomy"

/** @deprecated */
export type OnboardingFunctionalAreaOption = {
  slug: string
  label: string
  mapsTo: FunctionalArea
}

/** Lista plana de expertise (todas); preferir EXPERTISE_BY_INDUSTRY en UI nueva. */
export const ONBOARDING_FUNCTIONAL_AREA_OPTIONS: readonly OnboardingFunctionalAreaOption[] =
  ALL_EXPERTISE.map((e) => ({
    slug: e.slug,
    label: e.label,
    mapsTo: e.mapsTo,
  }))

export const labelForOnboardingAreaSlug = labelExpertiseSlug
export const mapsToForOnboardingSlug = mapsToForExpertiseSlug
