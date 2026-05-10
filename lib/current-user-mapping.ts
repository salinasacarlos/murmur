import type { User } from "@supabase/supabase-js"

import type { ProfileRow } from "@/components/providers/current-user-provider"
import type {
  Availability,
  CurrentUser,
  ExperienceRange,
  FunctionalArea,
} from "@/lib/types"

const DEFAULT_AREA: FunctionalArea = "negocio"
const DEFAULT_EXPERIENCE: ExperienceRange = "3-5"
const DEFAULT_AVAILABILITY: Availability = "full-time"

export function deriveCurrentUser(
  user: User,
  profile: ProfileRow | null
): CurrentUser {
  const name =
    profile?.name?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    user.email?.split("@")[0] ||
    "Tu cuenta"

  const initials =
    profile?.initials?.trim() ||
    initialsFromName(name) ||
    "TU"

  return {
    id: user.id,
    name,
    initials,
    photoUrl: profile?.photo_url ?? undefined,
    email: profile?.email ?? user.email ?? "",
    role: profile?.role ?? "",
    bio: profile?.bio ?? "",
    area: (profile?.area as FunctionalArea | null) ?? DEFAULT_AREA,
    experience:
      (profile?.experience as ExperienceRange | null) ?? DEFAULT_EXPERIENCE,
    achievement: profile?.achievement ?? "",
    availability:
      (profile?.availability as Availability | null) ?? DEFAULT_AVAILABILITY,
    industries: [],
    workStyle: [],
    city: profile?.city ?? "",
    cities: profile?.city ? [profile.city] : [],
    searchRadiusKm: profile?.search_radius_km ?? 50,
    relationsLooking: [],
    plan: profile?.plan === "premium" ? "premium" : "free",
    stats: {
      matches: profile?.stats_matches ?? 0,
      connections: profile?.stats_connections ?? 0,
      messages: profile?.stats_messages ?? 0,
    },
  }
}

export function initialsFromName(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || ""
  )
}
