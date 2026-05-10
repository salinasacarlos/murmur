import type { Tables } from "@/lib/database.types"
import type {
  Availability,
  Compatibility,
  EventEntry,
  ExperienceRange,
  FunctionalArea,
  Message,
  Profile,
  RelationType,
  Search,
  SearchStatus,
  WorkStyle,
} from "@/lib/types"

type ProfileJoinRow = Tables<"profiles"> & {
  profile_relations_looking?:
    | { relation: RelationType }[]
    | { relation: RelationType }
    | null
  profile_work_styles?:
    | { work_style: WorkStyle }[]
    | { work_style: WorkStyle }
    | null
  profile_events?:
    | { event_code: string }[]
    | { event_code: string }
    | null
  profile_cities?:
    | { city_slug: string; is_primary: boolean }[]
    | { city_slug: string; is_primary: boolean }
    | null
}

function asArray<T>(v: T | T[] | null | undefined): T[] {
  if (v == null) return []
  return Array.isArray(v) ? v : [v]
}

export function mapEventRowToEntry(row: Pick<Tables<"events">, "code" | "name" | "description">): EventEntry {
  return {
    code: row.code,
    name: row.name,
    description: row.description ?? undefined,
  }
}

export function mapProfileJoinRow(row: ProfileJoinRow): Profile {
  const rels = asArray(row.profile_relations_looking).map((x) => x.relation)
  const workStyle = asArray(row.profile_work_styles).map((x) => x.work_style)
  const eventCodes = asArray(row.profile_events).map((x) => x.event_code)
  const citySlugs = asArray(row.profile_cities)
  const cities =
    citySlugs.length > 0
      ? citySlugs.map((c) =>
          c.city_slug
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        )
      : row.city
        ? [row.city]
        : []

  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    photoUrl: row.photo_url ?? undefined,
    role: row.role,
    bio: row.bio,
    funFact: row.fun_fact ?? "",
    area: (row.area ?? "negocio") as FunctionalArea,
    functionalAreaTags:
      row.functional_area_tags?.length ? row.functional_area_tags : undefined,
    primaryIndustrySlug: row.primary_industry_slug ?? undefined,
    verticalSlugs: row.vertical_slugs?.length ? row.vertical_slugs : undefined,
    expertiseSlugs:
      row.expertise_slugs?.length ? row.expertise_slugs : undefined,
    talentSlugs: row.talent_slugs?.length ? row.talent_slugs : undefined,
    experience: (row.experience ?? "3-5") as ExperienceRange,
    achievement: row.achievement,
    availability: (row.availability ?? "full-time") as Availability,
    workStyle,
    city: row.city ?? cities[0] ?? "",
    cities: cities.length > 0 ? cities : undefined,
    relationsLooking: rels,
    compatibility: (row.compatibility ?? "media") as Compatibility,
    online: row.online,
    eventCodes: eventCodes.length > 0 ? eventCodes : undefined,
  }
}

/** RPC / bare `profiles` row without joins — best-effort UI shape. */
export function mapProfileBareRow(row: Tables<"profiles">): Profile {
  return mapProfileJoinRow({
    ...row,
    profile_relations_looking: [],
    profile_work_styles: [],
    profile_events: [],
    profile_cities: [],
  })
}

type SearchJoinRow = Tables<"searches"> & {
  search_relations?: { relation: RelationType }[] | { relation: RelationType } | null
}

export function mapSearchJoinRow(row: SearchJoinRow): Search {
  const relations = asArray(row.search_relations).map((r) => r.relation)
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    relations,
    area: (row.area ?? undefined) as FunctionalArea | undefined,
    functionalAreaTags:
      row.functional_area_tags?.length ? row.functional_area_tags : undefined,
    primaryIndustrySlug: row.primary_industry_slug ?? undefined,
    verticalSlugs: row.vertical_slugs?.length ? row.vertical_slugs : undefined,
    expertiseSlugs:
      row.expertise_slugs?.length ? row.expertise_slugs : undefined,
    talentSlugs: row.talent_slugs?.length ? row.talent_slugs : undefined,
    status: row.status as SearchStatus,
    matchesCount: row.matches_count,
    createdAt: row.created_at,
  }
}

export function mapMessageRow(
  row: Tables<"messages">,
  currentUserId: string
): Message {
  return {
    id: row.id,
    fromMe: row.sender_id === currentUserId,
    text: row.body,
    sentAt: row.sent_at,
  }
}
