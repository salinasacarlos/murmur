import type { Compatibility, CurrentUser, Profile } from "@/lib/types"

export type ProfileCompletenessSection =
  | "identity"
  | "professional"
  | "work"
  | "location"
  | "interests"

export interface ProfileCompletenessItem {
  id: string
  label: string
  ok: boolean
  section: ProfileCompletenessSection
}

export interface ProfileCompleteness {
  percent: number
  items: ProfileCompletenessItem[]
  missing: ProfileCompletenessItem[]
}

/** Maps session user + enriched fields into a `Profile` for completeness rules. */
export function profileFromCurrentUserForCompleteness(
  user: CurrentUser,
  compatibility: Compatibility = "media"
): Profile {
  return {
    id: user.id,
    name: user.name,
    initials: user.initials,
    photoUrl: user.photoUrl,
    role: user.role,
    bio: user.bio,
    area: user.area,
    experience: user.experience,
    achievement: user.achievement,
    availability: user.availability,
    industries: user.industries,
    workStyle: user.workStyle,
    city: user.city,
    cities: user.cities,
    relationsLooking: user.relationsLooking,
    compatibility,
    eventCodes: user.eventCodes,
  }
}

export function computeProfileCompleteness(
  profile: Profile | null,
  extras: {
    email: string
    searchRadiusKm: number | null | undefined
  }
): ProfileCompleteness {
  if (!profile) {
    return {
      percent: 0,
      items: [],
      missing: [],
    }
  }

  const hasPhoto = Boolean(profile.photoUrl)
  const items: ProfileCompletenessItem[] = [
    {
      id: "name",
      label: "Nombre",
      ok: profile.name.trim().length > 0,
      section: "identity",
    },
    {
      id: "role",
      label: "Título o rol",
      ok: profile.role.trim().length > 0,
      section: "identity",
    },
    {
      id: "bio",
      label: "Bio",
      ok: profile.bio.trim().length > 0,
      section: "identity",
    },
    {
      id: "photo",
      label: "Foto de perfil",
      ok: hasPhoto,
      section: "identity",
    },
    {
      id: "achievement",
      label: "Logro destacado",
      ok: profile.achievement.trim().length > 0,
      section: "professional",
    },
    {
      id: "work_styles",
      label: "Forma de trabajar",
      ok: profile.workStyle.length > 0,
      section: "work",
    },
    {
      id: "industries",
      label: "Industrias",
      ok: profile.industries.length > 0,
      section: "interests",
    },
    {
      id: "relations",
      label: "Tipos de relación",
      ok: profile.relationsLooking.length > 0,
      section: "interests",
    },
    {
      id: "city",
      label: "Ciudad principal",
      ok: profile.city.trim().length > 0,
      section: "location",
    },
    {
      id: "radius",
      label: "Radio de búsqueda",
      ok: (extras.searchRadiusKm ?? 0) > 0,
      section: "location",
    },
    {
      id: "email",
      label: "Email verificado",
      ok: extras.email.trim().length > 0,
      section: "identity",
    },
  ]

  const core = items.filter((i) => i.id !== "photo")
  const okCore = core.filter((i) => i.ok).length
  const percent = Math.round((okCore / core.length) * 100)
  const missing = items.filter((i) => !i.ok)

  return { percent, items, missing }
}
