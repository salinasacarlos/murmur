"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CitySelector } from "@/components/ui/city-selector"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Field, Input, Textarea } from "@/components/ui/input"
import { Tag } from "@/components/ui/tag"
import { Toggle } from "@/components/ui/toggle"
import { ProfilePhotoPicker } from "@/components/profile/profile-photo-picker"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { VerticalMultiSelect } from "@/components/ui/vertical-multi-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { CITIES_CATALOG } from "@/lib/catalogs"
import {
  defaultIndustryForFunctionalArea,
  deriveEditableTaxonomy,
  expertiseListForIndustryVerticals,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
  MAX_EXPERTISE_SLUGS,
  resolveHeroIndustrySlug,
  resolveProfileArea,
} from "@/lib/profile-taxonomy"
import {
  labelProfileVerticalSlug,
  filterProfileVerticalSlugsForIndustry,
} from "@/lib/industry-tree"
import {
  MAX_PROFILE_VERTICAL_SLUGS,
  MAX_TALENT_SLUGS,
} from "@/lib/product-config"
import {
  AVAILABILITY_LABELS,
  EXPERIENCE_LABELS,
  RELATION_LABELS,
  WORK_STYLE_LABELS,
  type Availability,
  type CurrentUser,
  type ExperienceRange,
  type Profile,
  type RelationType,
  type WorkStyle,
} from "@/lib/types"
import type { ProfileCompletenessItem } from "@/lib/profile-completeness"
import {
  computeProfileCompleteness,
  profileFromCurrentUserForCompleteness,
} from "@/lib/profile-completeness"
import { isPremiumPlan } from "@/lib/plan-limits"
import { useVisibility } from "@/components/providers/visibility-provider"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  deriveCurrentUser,
  initialsFromName,
  mergeEnrichedIntoCurrentUser,
} from "@/lib/current-user-mapping"
import { fetchProfileById } from "@/lib/data/profiles"
import { fetchLiveProfileStats, type LiveProfileStats } from "@/lib/data/profile-stats"
import {
  replaceProfileCities,
  replaceProfileRelationsLooking,
  replaceProfileWorkStyles,
} from "@/lib/data/profile-mutations"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { IconX } from "@/components/icons"
import { cn } from "@/lib/utils"
import { PROFILE_FIELD_COPY } from "@/lib/profile-field-copy"

export default function ProfilePage() {
  const { user: authUser, profile, refresh, mergeProfile } = useCurrentUser()
  const { visible, setVisible } = useVisibility()

  const [enrichedProfile, setEnrichedProfile] = React.useState<Profile | null>(
    null
  )

  const reloadEnriched = React.useCallback(async () => {
    if (!authUser?.id) return
    const supabase = getSupabaseBrowserClient()
    const next = await fetchProfileById(supabase, authUser.id)
    setEnrichedProfile(next)
  }, [authUser?.id])

  const [liveStats, setLiveStats] = React.useState<LiveProfileStats | null>(null)

  const reloadLiveStats = React.useCallback(async () => {
    if (!authUser?.id) return
    const supabase = getSupabaseBrowserClient()
    const s = await fetchLiveProfileStats(supabase, authUser.id)
    setLiveStats(s)
  }, [authUser?.id])

  React.useEffect(() => {
    void reloadLiveStats()
  }, [reloadLiveStats])

  React.useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") void reloadLiveStats()
    }
    document.addEventListener("visibilitychange", onVis)
    return () => document.removeEventListener("visibilitychange", onVis)
  }, [reloadLiveStats])

  React.useEffect(() => {
    void reloadEnriched()
  }, [reloadEnriched, profile?.updated_at])

  const profileUser = React.useMemo<CurrentUser | null>(() => {
    if (!authUser) return null
    const base = deriveCurrentUser(authUser, profile)
    const merged = enrichedProfile
      ? mergeEnrichedIntoCurrentUser(base, enrichedProfile)
      : base
    // Session profile row is the source of truth for scalars saved on `profiles`
    // (enriched join fetch can lag one tick after save and would show stale tags).
    if (!profile) return merged
    const rawTags = profile.functional_area_tags
    const rawExpertise = profile.expertise_slugs
    const rawTalents = profile.talent_slugs
    const rawIndustry = profile.primary_industry_slug
    const rawVerticals = profile.vertical_slugs
    const fromSession = {
      ...merged,
      area: (profile.area as CurrentUser["area"]) ?? merged.area,
      functionalAreaTags:
        Array.isArray(rawTags) && rawTags.length > 0 ? rawTags : merged.functionalAreaTags,
      primaryIndustrySlug:
        rawIndustry ??
        merged.primaryIndustrySlug ??
        inferIndustryFromExpertiseSlugs(
          Array.isArray(rawExpertise) && rawExpertise.length > 0
            ? rawExpertise
            : rawTags
        ),
      verticalSlugs:
        Array.isArray(rawVerticals) && rawVerticals.length > 0
          ? rawVerticals
          : merged.verticalSlugs,
      expertiseSlugs:
        Array.isArray(rawExpertise) && rawExpertise.length > 0
          ? rawExpertise
          : merged.expertiseSlugs,
      talentSlugs:
        Array.isArray(rawTalents) && rawTalents.length > 0
          ? rawTalents
          : merged.talentSlugs,
      funFact:
        typeof profile.fun_fact === "string" ? profile.fun_fact : merged.funFact,
    }
    return fromSession
  }, [authUser, profile, enrichedProfile])

  const [profileEditOpen, setProfileEditOpen] = React.useState(false)
  const [industryEditOpen, setIndustryEditOpen] = React.useState(false)
  const [expertiseEditOpen, setExpertiseEditOpen] = React.useState(false)
  const [talentsEditOpen, setTalentsEditOpen] = React.useState(false)
  const [locationEditOpen, setLocationEditOpen] = React.useState(false)
  const [workPrefsEditOpen, setWorkPrefsEditOpen] = React.useState(false)
  const [achievementEditOpen, setAchievementEditOpen] = React.useState(false)
  const [experienceEditOpen, setExperienceEditOpen] = React.useState(false)
  const [relationsEditOpen, setRelationsEditOpen] = React.useState(false)

  const [savingProfile, setSavingProfile] = React.useState(false)
  const [savingIndustry, setSavingIndustry] = React.useState(false)
  const [savingExpertiseTax, setSavingExpertiseTax] = React.useState(false)
  const [savingTalentsTax, setSavingTalentsTax] = React.useState(false)
  const [savingLocation, setSavingLocation] = React.useState(false)
  const [savingWorkPrefs, setSavingWorkPrefs] = React.useState(false)
  const [savingAchievement, setSavingAchievement] = React.useState(false)
  const [savingExperience, setSavingExperience] = React.useState(false)
  const [savingRelations, setSavingRelations] = React.useState(false)
  const [savingVisibility, setSavingVisibility] = React.useState(false)

  const emptyDraft = React.useMemo(
    () => ({
      name: "",
      photoUrl: undefined as string | undefined,
      role: "",
      bio: "",
      funFact: "",
    }),
    []
  )

  const [profileDraft, setProfileDraft] = React.useState(emptyDraft)

  const [industryDraft, setIndustryDraft] = React.useState<string | null>(null)
  const [expertiseDraftSlugs, setExpertiseDraftSlugs] = React.useState<
    string[]
  >([])
  const [verticalDraftSlugs, setVerticalDraftSlugs] = React.useState<string[]>(
    []
  )
  const [talentsDraftSlugs, setTalentsDraftSlugs] = React.useState<string[]>(
    []
  )

  const [locationDraft, setLocationDraft] = React.useState({
    city: "",
    cities: [] as string[],
    searchRadiusKm: 50,
  })

  const [workPrefsDraft, setWorkPrefsDraft] = React.useState<{
    availability: Availability
    workStyle: WorkStyle[]
  }>({
    availability: "full-time",
    workStyle: [],
  })

  const [achievementDraft, setAchievementDraft] = React.useState("")
  const [experienceDraft, setExperienceDraft] = React.useState<ExperienceRange>(
    "3-5"
  )
  const [relationsDraft, setRelationsDraft] = React.useState<RelationType[]>(
    []
  )

  const completeness = React.useMemo(() => {
    if (!profileUser) {
      return computeProfileCompleteness(null, {
        email: "",
        searchRadiusKm: 0,
      })
    }
    return computeProfileCompleteness(
      profileFromCurrentUserForCompleteness(profileUser),
      {
        email: profileUser.email,
        searchRadiusKm: profileUser.searchRadiusKm,
      }
    )
  }, [profileUser])

  const ONBOARDING_DISMISS_KEY = "murmur:profile-onboarding-dismissed"
  const [onboardingDismissed, setOnboardingDismissed] =
    React.useState(false)

  React.useEffect(() => {
    try {
      if (sessionStorage.getItem(ONBOARDING_DISMISS_KEY) === "1") {
        setOnboardingDismissed(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  const prevMissingCountRef = React.useRef<number | null>(null)
  React.useEffect(() => {
    const n = completeness.missing.length
    const prev = prevMissingCountRef.current
    prevMissingCountRef.current = n
    if (prev === 0 && n > 0) {
      try {
        sessionStorage.removeItem(ONBOARDING_DISMISS_KEY)
      } catch {
        /* ignore */
      }
      setOnboardingDismissed(false)
    }
  }, [completeness.missing.length])

  const showOnboardingCard =
    !onboardingDismissed && completeness.missing.length > 0

  async function afterSuccessfulSave() {
    await refresh()
    await reloadEnriched()
    await reloadLiveStats()
  }

  function openProfileEdit() {
    if (!profileUser) return
    setProfileDraft({
      name: profileUser.name,
      photoUrl: profileUser.photoUrl,
      role: profileUser.role,
      bio: profileUser.bio,
      funFact: profileUser.funFact,
    })
    setProfileEditOpen(true)
  }

  function openIndustryEdit() {
    if (!profileUser) return
    const { primaryIndustrySlug: inferred } = deriveEditableTaxonomy({
      primaryIndustrySlug: profileUser.primaryIndustrySlug,
      verticalSlugs: profileUser.verticalSlugs,
      expertiseSlugs: profileUser.expertiseSlugs,
      functionalAreaTags: profileUser.functionalAreaTags,
      area: profileUser.area,
    })
    setIndustryDraft(
      inferred ?? defaultIndustryForFunctionalArea(profileUser.area)
    )
    setIndustryEditOpen(true)
  }

  function openExpertiseEdit() {
    if (!profileUser) return
    const t = deriveEditableTaxonomy({
      primaryIndustrySlug: profileUser.primaryIndustrySlug,
      verticalSlugs: profileUser.verticalSlugs,
      expertiseSlugs: profileUser.expertiseSlugs,
      functionalAreaTags: profileUser.functionalAreaTags,
      area: profileUser.area,
    })
    setVerticalDraftSlugs(t.verticalSlugs)
    setExpertiseDraftSlugs(t.expertiseSlugs)
    setExpertiseEditOpen(true)
  }

  function openTalentsEdit() {
    if (!profileUser) return
    setTalentsDraftSlugs([...(profileUser.talentSlugs ?? [])])
    setTalentsEditOpen(true)
  }

  function openCompletenessItem(item: ProfileCompletenessItem) {
    switch (item.id) {
      case "name":
      case "role":
      case "bio":
      case "photo":
      case "fun_fact":
        openProfileEdit()
        break
      case "email":
        break
      case "primary_industry":
        openIndustryEdit()
        break
      case "verticals":
      case "expertise":
        openExpertiseEdit()
        break
      case "achievement":
        setAchievementEditOpen(true)
        break
      case "work_styles":
        setWorkPrefsEditOpen(true)
        break
      case "relations":
        setRelationsEditOpen(true)
        break
      case "city":
      case "radius":
        setLocationEditOpen(true)
        break
      default:
        break
    }
  }

  async function saveProfileEdit() {
    if (!authUser || savingProfile || !profileUser) return
    setSavingProfile(true)
    const nextInitials =
      initialsFromName(profileDraft.name) || profileUser.initials
    const supabase = getSupabaseBrowserClient()
    const baseUpdate = {
      name: profileDraft.name.trim(),
      initials: nextInitials,
      role: profileDraft.role.trim(),
      bio: profileDraft.bio,
      fun_fact: profileDraft.funFact.trim().slice(0, 500),
      photo_url: profileDraft.photoUrl ?? null,
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .update(baseUpdate)
        .eq("id", authUser.id)
      if (error) {
        console.error("Failed to save profile", error)
        setSavingProfile(false)
        return
      }
    } catch (e) {
      console.error("Failed to save profile", e)
      setSavingProfile(false)
      return
    }

    setSavingProfile(false)
    setProfileEditOpen(false)
    void afterSuccessfulSave()
  }

  async function saveIndustryEdit() {
    if (!authUser || savingIndustry || !profileUser) return
    setSavingIndustry(true)
    const nextSlug =
      industryDraft ?? defaultIndustryForFunctionalArea(profileUser.area)
    const prevSlug =
      profileUser.primaryIndustrySlug ??
      inferIndustryFromExpertiseSlugs(
        profileUser.expertiseSlugs?.length
          ? profileUser.expertiseSlugs
          : profileUser.functionalAreaTags
      ) ??
      defaultIndustryForFunctionalArea(profileUser.area)
    const keepExpertise = prevSlug === nextSlug
    const taxonomy = keepExpertise
      ? deriveEditableTaxonomy({
          primaryIndustrySlug: profileUser.primaryIndustrySlug,
          verticalSlugs: profileUser.verticalSlugs,
          expertiseSlugs: profileUser.expertiseSlugs,
          functionalAreaTags: profileUser.functionalAreaTags,
          area: profileUser.area,
        })
      : { verticalSlugs: [] as string[], expertiseSlugs: [] as string[] }
    const expertise = taxonomy.expertiseSlugs
    const verticals = filterProfileVerticalSlugsForIndustry(
      nextSlug,
      taxonomy.verticalSlugs,
      MAX_PROFILE_VERTICAL_SLUGS
    )
    const area = resolveProfileArea(nextSlug, expertise)
    const supabase = getSupabaseBrowserClient()
    const payload = {
      primary_industry_slug: nextSlug,
      vertical_slugs: verticals,
      expertise_slugs: expertise,
      functional_area_tags: [] as string[],
      area,
    }
    try {
      let { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", authUser.id)
      if (
        error?.code === "PGRST204" &&
        (error.message?.includes("functional_area_tags") ||
          error.message?.includes("primary_industry_slug") ||
          error.message?.includes("expertise_slugs") ||
          error.message?.includes("vertical_slugs"))
      ) {
        const second = await supabase
          .from("profiles")
          .update({ area })
          .eq("id", authUser.id)
        error = second.error
      }
      if (error) {
        console.error("Failed to save industry", error)
        setSavingIndustry(false)
        return
      }
    } catch (e) {
      console.error("Failed to save industry", e)
      setSavingIndustry(false)
      return
    }
    setSavingIndustry(false)
    setIndustryEditOpen(false)
    void afterSuccessfulSave()
  }

  async function saveExpertiseEdit() {
    if (!authUser || savingExpertiseTax || !profileUser) return
    setSavingExpertiseTax(true)
    const industrySlug = resolveHeroIndustrySlug({
      primaryIndustrySlug: profileUser.primaryIndustrySlug,
      expertiseSlugs: profileUser.expertiseSlugs,
      functionalAreaTags: profileUser.functionalAreaTags,
      area: profileUser.area,
    })
    const verticals = filterProfileVerticalSlugsForIndustry(
      industrySlug,
      verticalDraftSlugs,
      MAX_PROFILE_VERTICAL_SLUGS
    )
    const allowedSet = new Set(
      expertiseListForIndustryVerticals(industrySlug, verticals).map(
        (e) => e.slug
      )
    )
    const expertise = expertiseDraftSlugs
      .filter((s) => allowedSet.has(s))
      .slice(0, MAX_EXPERTISE_SLUGS)
    const area = resolveProfileArea(industrySlug, expertise)
    const supabase = getSupabaseBrowserClient()
    const payload = {
      primary_industry_slug: industrySlug,
      vertical_slugs: verticals,
      expertise_slugs: expertise,
      functional_area_tags: [] as string[],
      area,
    }
    try {
      let { error } = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", authUser.id)
      if (
        error?.code === "PGRST204" &&
        (error.message?.includes("functional_area_tags") ||
          error.message?.includes("expertise_slugs") ||
          error.message?.includes("primary_industry_slug") ||
          error.message?.includes("vertical_slugs"))
      ) {
        const second = await supabase
          .from("profiles")
          .update({ area })
          .eq("id", authUser.id)
        error = second.error
      }
      if (error) {
        console.error("Failed to save expertise", error)
        setSavingExpertiseTax(false)
        return
      }
    } catch (e) {
      console.error("Failed to save expertise", e)
      setSavingExpertiseTax(false)
      return
    }
    setSavingExpertiseTax(false)
    setExpertiseEditOpen(false)
    void afterSuccessfulSave()
  }

  async function saveTalentsEdit() {
    if (!authUser || savingTalentsTax || !profileUser) return
    setSavingTalentsTax(true)
    const talents = talentsDraftSlugs.slice(0, MAX_TALENT_SLUGS)
    const supabase = getSupabaseBrowserClient()
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ talent_slugs: talents })
        .eq("id", authUser.id)
      if (error) {
        console.error("Failed to save talents", error)
        setSavingTalentsTax(false)
        return
      }
    } catch (e) {
      console.error("Failed to save talents", e)
      setSavingTalentsTax(false)
      return
    }
    setSavingTalentsTax(false)
    setTalentsEditOpen(false)
    void afterSuccessfulSave()
  }

  function openLocationEdit() {
    if (!profileUser) return
    const multi = isPremiumPlan(profileUser.plan)
    setLocationDraft({
      city: profileUser.city,
      cities: multi
        ? profileUser.cities?.length
          ? profileUser.cities
          : profileUser.city
            ? [profileUser.city]
            : []
        : [],
      searchRadiusKm: profileUser.searchRadiusKm ?? 50,
    })
    setLocationEditOpen(true)
  }

  async function saveLocationEdit() {
    if (!authUser || !profileUser || savingLocation) return
    setSavingLocation(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        city: locationDraft.city.trim() || null,
        search_radius_km: locationDraft.searchRadiusKm,
      })
      .eq("id", authUser.id)
    if (error) {
      setSavingLocation(false)
      console.error("Failed to save location", error)
      return
    }
    const citiesForSave = isPremiumPlan(profileUser.plan)
      ? locationDraft.cities
      : []
    const citiesRes = await replaceProfileCities(
      supabase,
      authUser.id,
      locationDraft.city.trim(),
      citiesForSave,
      profileUser.plan
    )
    setSavingLocation(false)
    if (!citiesRes.ok) {
      console.error("Failed to save profile cities", citiesRes.error)
      return
    }
    setLocationEditOpen(false)
    void afterSuccessfulSave()
  }

  function openWorkPrefsEdit() {
    if (!profileUser) return
    setWorkPrefsDraft({
      availability: profileUser.availability,
      workStyle: profileUser.workStyle,
    })
    setWorkPrefsEditOpen(true)
  }

  function toggleWorkStyle(value: WorkStyle) {
    setWorkPrefsDraft((prev) => ({
      ...prev,
      workStyle: prev.workStyle.includes(value)
        ? prev.workStyle.filter((item) => item !== value)
        : [...prev.workStyle, value],
    }))
  }

  async function saveWorkPrefsEdit() {
    if (!authUser || savingWorkPrefs) return
    setSavingWorkPrefs(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        availability: workPrefsDraft.availability,
      })
      .eq("id", authUser.id)
    if (error) {
      setSavingWorkPrefs(false)
      console.error("Failed to save work preferences", error)
      return
    }
    const j = await replaceProfileWorkStyles(
      supabase,
      authUser.id,
      workPrefsDraft.workStyle
    )
    setSavingWorkPrefs(false)
    if (!j.ok) {
      console.error("Failed to save work styles", j.error)
      return
    }
    setWorkPrefsEditOpen(false)
    void afterSuccessfulSave()
  }

  function openAchievementEdit() {
    if (!profileUser) return
    setAchievementDraft(profileUser.achievement)
    setAchievementEditOpen(true)
  }

  async function saveAchievementEdit() {
    if (!authUser || savingAchievement) return
    setSavingAchievement(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        achievement: achievementDraft.trim(),
      })
      .eq("id", authUser.id)
    setSavingAchievement(false)
    if (error) {
      console.error("Failed to save achievement", error)
      return
    }
    setAchievementEditOpen(false)
    void afterSuccessfulSave()
  }

  function openExperienceEdit() {
    if (!profileUser) return
    setExperienceDraft(profileUser.experience)
    setExperienceEditOpen(true)
  }

  async function saveExperienceEdit() {
    if (!authUser || savingExperience || !profileUser) return
    setSavingExperience(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({
        experience: experienceDraft,
      })
      .eq("id", authUser.id)
    setSavingExperience(false)
    if (error) {
      console.error("Failed to save experience", error)
      return
    }
    setExperienceEditOpen(false)
    void afterSuccessfulSave()
  }

  function openRelationsEdit() {
    if (!profileUser) return
    setRelationsDraft([...profileUser.relationsLooking])
    setRelationsEditOpen(true)
  }

  function toggleRelation(value: RelationType) {
    setRelationsDraft((prev) =>
      prev.includes(value)
        ? prev.filter((x) => x !== value)
        : [...prev, value]
    )
  }

  async function saveRelationsEdit() {
    if (!authUser || savingRelations) return
    setSavingRelations(true)
    const supabase = getSupabaseBrowserClient()
    const j = await replaceProfileRelationsLooking(
      supabase,
      authUser.id,
      relationsDraft
    )
    setSavingRelations(false)
    if (!j.ok) {
      console.error("Failed to save relations", j.error)
      return
    }
    setRelationsEditOpen(false)
    void afterSuccessfulSave()
  }

  async function persistVisibility(next: boolean) {
    if (!authUser || savingVisibility) return
    setSavingVisibility(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("profiles")
      .update({ visible: next })
      .eq("id", authUser.id)
    setSavingVisibility(false)
    if (error) {
      console.error("Failed to save visibility", error)
      return
    }
    mergeProfile({ visible: next })
    setVisible(next)
    void afterSuccessfulSave()
  }

  if (!authUser || !profileUser) {
    return (
      <div className="px-4 md:px-6 py-10 text-[13px] text-[var(--text2)]">
        Cargando tu perfil...
      </div>
    )
  }

  const user = profileUser
  const statsDisplay = liveStats ?? user.stats
  const cityTags = user.cities?.length
    ? user.cities
    : user.city
      ? [user.city]
      : []

  const heroIndustrySlug = resolveHeroIndustrySlug({
    primaryIndustrySlug: user.primaryIndustrySlug,
    expertiseSlugs: user.expertiseSlugs,
    functionalAreaTags: user.functionalAreaTags,
    area: user.area,
  })
  const heroVerticalSlugs = user.verticalSlugs ?? []
  const heroExpertiseSlugs = user.expertiseSlugs ?? []

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full flex flex-col gap-4">
      <div className="md:hidden">
        <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">
          Mi perfil
        </h2>
      </div>

      {showOnboardingCard ? (
        <Card padding="default" className="ds-fade-up relative flex flex-col gap-3">
          <button
            type="button"
            onClick={() => {
              try {
                sessionStorage.setItem(ONBOARDING_DISMISS_KEY, "1")
              } catch {
                /* ignore */
              }
              setOnboardingDismissed(true)
            }}
            className="absolute right-3 top-3 rounded-md p-1.5 text-[var(--text3)] hover:bg-[var(--bg2)] hover:text-[var(--text)]"
            aria-label="Ocultar aviso de perfil hasta recargar la página"
          >
            <IconX size={16} />
          </button>
          <div className="flex items-start justify-between gap-3 pr-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[var(--text3)]">
                ONBOARDING
              </p>
              <p className="text-[20px] font-extrabold tracking-[-0.4px] mt-1">
                Perfil al {completeness.percent}%
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[12px] text-[var(--text2)]">Falta completar:</p>
            <ul className="flex flex-wrap gap-1.5">
              {completeness.missing.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    disabled={item.id === "email"}
                    onClick={() => openCompletenessItem(item)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      item.id === "email"
                        ? "border-[var(--border)] text-[var(--text3)] cursor-not-allowed"
                        : "border-[var(--amber)] text-[var(--text)] hover:bg-[var(--amber)]/10"
                    )}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      ) : null}

      <Card padding="default" className="ds-fade-up flex flex-col md:flex-row md:items-start gap-4">
        <Avatar
          initials={user.initials}
          imageUrl={user.photoUrl}
          alt={`Foto de ${user.name}`}
          size="xl"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[20px] font-extrabold tracking-[-0.4px]">
                {user.name}
              </h2>
              <p className="text-[13px] text-[var(--text2)] mt-0.5">
                {user.role || (
                  <span className="text-[var(--text3)]">Sin definir</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={openProfileEdit}
              className="text-[11px] font-medium text-[var(--p)] hover:underline shrink-0"
            >
              Editar
            </button>
          </div>
          <p className="text-[13px] text-[var(--text)] leading-relaxed mt-3">
            {user.bio || (
              <span className="text-[var(--text3)]">Sin bio todavía.</span>
            )}
          </p>
          {user.funFact.trim() ? (
            <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg2)]/50 px-3 py-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text3)] mb-1">
                Dato curioso
              </p>
              <p className="text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                {user.funFact}
              </p>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <Tag key="industry" variant="amber">
              {labelIndustrySlug(heroIndustrySlug)}
            </Tag>
            {heroVerticalSlugs.map((slug) => (
              <Tag key={`v-${slug}`} variant="amber">
                {labelProfileVerticalSlug(slug)}
              </Tag>
            ))}
            {heroExpertiseSlugs.length > 0 ? (
              heroExpertiseSlugs.map((slug) => (
                <Tag key={slug} variant="amber">
                  {labelExpertiseSlug(slug)}
                </Tag>
              ))
            ) : (
              <Tag variant="amber">Sin definir</Tag>
            )}
            {(user.talentSlugs ?? []).map((slug) => (
              <Tag key={`talent-${slug}`} variant="neutral">
                {labelTalentSlug(slug)}
              </Tag>
            ))}
            <Tag variant="neutral">{EXPERIENCE_LABELS[user.experience]}</Tag>
            <Tag variant="success">{AVAILABILITY_LABELS[user.availability]}</Tag>
          </div>
        </div>
      </Card>

      <Drawer
        open={profileEditOpen}
        onOpenChange={setProfileEditOpen}
        ariaLabel="Editar datos básicos del perfil"
      >
        <DrawerHeader
          title="Datos básicos"
          description={`Foto, nombre, cómo te presentas, bio y un dato curioso opcional. ${PROFILE_FIELD_COPY.industryPrincipal}, ${PROFILE_FIELD_COPY.verticales.toLowerCase()}, ${PROFILE_FIELD_COPY.expertise.toLowerCase()}, años de experiencia y ${PROFILE_FIELD_COPY.softSkills.toLowerCase()} los editas desde la sección Profesional.`}
        />

        <div className="flex flex-col gap-3 mb-4">
          <ProfilePhotoPicker
            value={profileDraft.photoUrl}
            initials={initialsFromName(profileDraft.name)}
            name={profileDraft.name}
            onChange={(photoUrl) =>
              setProfileDraft((prev) => ({ ...prev, photoUrl }))
            }
          />

          <Field label="Nombre">
            <Input
              value={profileDraft.name}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Título o rol actual">
            <Input
              value={profileDraft.role}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  role: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="Bio corta">
            <Textarea
              rows={4}
              value={profileDraft.bio}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  bio: e.target.value,
                }))
              }
            />
          </Field>

          <Field
            label="Dato curioso"
            hint="Opcional. Algo que te humanice frente a otros (hobby, anécdota breve…)."
          >
            <Textarea
              rows={5}
              value={profileDraft.funFact}
              onChange={(e) =>
                setProfileDraft((prev) => ({
                  ...prev,
                  funFact: e.target.value.slice(0, 500),
                }))
              }
              placeholder="Ej. Colecciono vinilos de jazz coreano, o hice un Ironman antes de meterme al mundo startup…"
            />
            <p className="text-[11px] text-[var(--text3)] mt-1">
              {profileDraft.funFact.length}/500 caracteres
            </p>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setProfileEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveProfileEdit}
            disabled={savingProfile}
          >
            {savingProfile ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={industryEditOpen}
        onOpenChange={setIndustryEditOpen}
        ariaLabel="Editar industria principal"
      >
        <DrawerHeader
          title={PROFILE_FIELD_COPY.industryPrincipal}
          description="Define tu industria principal. Si la cambias, se quitan las verticales guardadas para ajustarlas al nuevo contexto."
        />
        <div className="flex flex-col gap-3 mb-4">
          <Field label={PROFILE_FIELD_COPY.industryPrincipal}>
            <IndustrySingleSelect
              value={industryDraft}
              onChange={(slug) => {
                setIndustryDraft((prev) => {
                  if (prev !== slug) {
                    setExpertiseDraftSlugs([])
                    setVerticalDraftSlugs([])
                  }
                  return slug
                })
              }}
            />
          </Field>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setIndustryEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void saveIndustryEdit()}
            disabled={savingIndustry}
          >
            {savingIndustry ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={expertiseEditOpen}
        onOpenChange={setExpertiseEditOpen}
        ariaLabel="Editar verticales y expertise"
        className="flex min-h-0 flex-col !overflow-hidden"
      >
        <DrawerHeader
          className="shrink-0"
          title="Verticales y expertise"
          description={`${PROFILE_FIELD_COPY.industryPrincipal}: ${labelIndustrySlug(heroIndustrySlug)}. Hasta 3 verticales y 3 roles de expertise bajo ellas.`}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 pb-1">
            <Field label={PROFILE_FIELD_COPY.verticales}>
              <VerticalMultiSelect
                industrySlug={heroIndustrySlug}
                value={verticalDraftSlugs}
                onChange={setVerticalDraftSlugs}
                footerNote="Elige primero las verticales; definen el catálogo de expertise."
              />
            </Field>
            <Field label={PROFILE_FIELD_COPY.expertise}>
              <ExpertiseMultiSelect
                industrySlug={heroIndustrySlug}
                verticalSlugs={verticalDraftSlugs}
                value={expertiseDraftSlugs}
                onChange={setExpertiseDraftSlugs}
                footerNote="Para cambiar de industria, edita «Industria principal» en Profesional."
              />
            </Field>
          </div>
        </div>
        <div className="relative z-[60] mt-2 flex shrink-0 gap-2 border-t border-[var(--border)] bg-[var(--bg)] pt-3">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setExpertiseEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void saveExpertiseEdit()}
            disabled={savingExpertiseTax}
          >
            {savingExpertiseTax ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={talentsEditOpen}
        onOpenChange={setTalentsEditOpen}
        ariaLabel="Editar soft skills"
        className="flex min-h-0 flex-col !overflow-hidden"
      >
        <DrawerHeader
          className="shrink-0"
          title={PROFILE_FIELD_COPY.softSkills}
          description="Habilidades transversales. Elige hasta 5."
        />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-3 pb-1 md:gap-4 md:pb-2">
            <Field label={PROFILE_FIELD_COPY.softSkills}>
              <TalentMultiSelect
                value={talentsDraftSlugs}
                onChange={setTalentsDraftSlugs}
              />
            </Field>
          </div>
        </div>
        <div className="relative z-[60] mt-2 flex shrink-0 gap-2 border-t border-[var(--border)] bg-[var(--bg)] pt-3 pb-[2px]">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setTalentsEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void saveTalentsEdit()}
            disabled={savingTalentsTax}
          >
            {savingTalentsTax ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Drawer
        open={experienceEditOpen}
        onOpenChange={setExperienceEditOpen}
        ariaLabel="Editar años de experiencia"
      >
        <DrawerHeader
          title="Años de experiencia"
          description="Cuánto llevas recorriendo tu camino profesional en este tipo de roles."
        />
        <div className="flex flex-col gap-3 mb-4">
          <Field label="Rango">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(EXPERIENCE_LABELS) as ExperienceRange[]).map(
                (id) => (
                  <ProfileEditChip
                    key={id}
                    label={EXPERIENCE_LABELS[id]}
                    selected={experienceDraft === id}
                    onClick={() => setExperienceDraft(id)}
                  />
                )
              )}
            </div>
          </Field>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setExperienceEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => void saveExperienceEdit()}
            disabled={savingExperience}
          >
            {savingExperience ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up grid grid-cols-3 gap-4">
        <Stat label="Matches" value={statsDisplay.matches} />
        <Stat label="Conexiones" value={statsDisplay.connections} />
        <Stat label="Mensajes" value={statsDisplay.messages} />
      </Card>

      <Card padding="default" className="ds-fade-up flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-bold tracking-[-0.2px]">Visibilidad</h3>
          <p className="text-[12px] text-[var(--text2)] mt-0.5">
            {visible
              ? "Apareces en búsquedas de otros builders."
              : "Estás oculto. Nadie te ve en búsquedas."}
          </p>
          <p className="text-[11px] text-[var(--text3)] mt-1">
            Sincronizado con tu cuenta (no solo este dispositivo).
          </p>
        </div>
        <Toggle
          checked={visible}
          onCheckedChange={(next) => void persistVisibility(next)}
          label="Visibilidad"
          disabled={savingVisibility}
        />
      </Card>

      <Card padding="default" className="ds-fade-up flex flex-col gap-3">
        <div>
          <h3 className="ds-label-uppercase">Profesional</h3>
          <p className="text-[12px] text-[var(--text2)] mt-1">
            {PROFILE_FIELD_COPY.industryPrincipal}, {PROFILE_FIELD_COPY.verticales.toLowerCase()}, {PROFILE_FIELD_COPY.expertise.toLowerCase()}, años de experiencia y{" "}
            {PROFILE_FIELD_COPY.softSkills.toLowerCase()}: edita cada bloque con su enlace.
          </p>
        </div>
        <ProfileValueRow
          label={PROFILE_FIELD_COPY.industryPrincipal}
          value={labelIndustrySlug(heroIndustrySlug)}
          onEdit={openIndustryEdit}
        />
        <ProfileValueRow
          label={PROFILE_FIELD_COPY.verticales}
          value={
            heroVerticalSlugs.length > 0
              ? heroVerticalSlugs
                  .map((s) => labelProfileVerticalSlug(s))
                  .join(" · ")
              : "Sin definir"
          }
          onEdit={openExpertiseEdit}
        />
        <ProfileValueRow
          label={PROFILE_FIELD_COPY.expertise}
          value={
            heroExpertiseSlugs.length > 0
              ? heroExpertiseSlugs.map((s) => labelExpertiseSlug(s)).join(" · ")
              : "Sin definir"
          }
          onEdit={openExpertiseEdit}
        />
        <ProfileValueRow
          label={PROFILE_FIELD_COPY.softSkills}
          value={
            user.talentSlugs && user.talentSlugs.length > 0
              ? user.talentSlugs.map((s) => labelTalentSlug(s)).join(" · ")
              : "—"
          }
          onEdit={openTalentsEdit}
        />
        <ProfileValueRow
          label="Experiencia"
          value={EXPERIENCE_LABELS[user.experience]}
          onEdit={openExperienceEdit}
        />
        <ProfileValueRow
          label="Logro destacado"
          value={user.achievement}
          onEdit={openAchievementEdit}
        />
      </Card>

      <Drawer
        open={achievementEditOpen}
        onOpenChange={setAchievementEditOpen}
        ariaLabel="Editar logro destacado"
      >
        <DrawerHeader
          title="Logro destacado"
          description="Una línea sobre tu logro más relevante."
        />
        <div className="flex flex-col gap-3 mb-4">
          <Field label="Logro">
            <Input
              value={achievementDraft}
              onChange={(e) => setAchievementDraft(e.target.value)}
              placeholder="Ej. Llevé el producto de 0 a 100k usuarios..."
            />
          </Field>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setAchievementEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveAchievementEdit}
            disabled={savingAchievement}
          >
            {savingAchievement ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up">
        <h3 className="ds-label-uppercase mb-3">Ubicación y radio</h3>
        <div className="flex flex-col gap-3">
          <ProfileValueRow
            label="Ciudad principal"
            value={user.city}
            onEdit={openLocationEdit}
          />
          <ProfileValueRow
            label="Radio de búsqueda"
            value={
              user.searchRadiusKm != null
                ? `${user.searchRadiusKm} km`
                : undefined
            }
            onEdit={openLocationEdit}
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
              Ciudades activas
            </p>
            {cityTags.length ? (
              <div className="flex flex-wrap gap-1.5">
                {cityTags.map((city) => (
                  <Tag key={city} variant="neutral">
                    {city}
                  </Tag>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[var(--text3)]">Sin definir</p>
            )}
          </div>
        </div>
      </Card>

      <Drawer
        open={locationEditOpen}
        onOpenChange={setLocationEditOpen}
        ariaLabel="Editar ubicación y radio"
      >
        <DrawerHeader
          title="Editar ubicación y radio"
          description={
            isPremiumPlan(profileUser.plan)
              ? "Define dónde estás y en qué ciudades quieres aparecer cuando tu búsqueda esté activa."
              : "Plan Free: una sola ciudad. Amplía a Premium para activar tu búsqueda en varias ciudades."
          }
        />

        <div className="flex flex-col gap-3 mb-4">
          <Field label="Ciudad principal">
            <Input
              list="profile-cities-list"
              value={locationDraft.city}
              onChange={(e) =>
                setLocationDraft((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
              placeholder="ej. Ciudad de México"
            />
            <datalist id="profile-cities-list">
              {CITIES_CATALOG.map((city) => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </Field>

          {isPremiumPlan(profileUser.plan) ? (
            <Field
              label="Ciudades donde mi búsqueda está activa"
              hint="Puedes seleccionar varias ciudades principales de México, Colombia, EE.UU. y LatAm."
            >
              <CitySelector
                value={locationDraft.cities}
                onChange={(cities) =>
                  setLocationDraft((prev) => ({ ...prev, cities }))
                }
              />
            </Field>
          ) : (
            <p className="text-[12px] text-[var(--text2)] leading-relaxed">
              En el plan Free solo aplica tu ciudad principal arriba. Las ciudades
              extra están disponibles en Premium.
            </p>
          )}

          <Field
            label="Radio de búsqueda"
            hint={`${locationDraft.searchRadiusKm} km alrededor de tu ciudad principal`}
          >
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={locationDraft.searchRadiusKm}
              onChange={(e) =>
                setLocationDraft((prev) => ({
                  ...prev,
                  searchRadiusKm: Number(e.target.value),
                }))
              }
              className="w-full accent-[var(--p)]"
            />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--text3)]">
              <span>5 km</span>
              <span>300 km</span>
            </div>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setLocationEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveLocationEdit}
            disabled={savingLocation}
          >
            {savingLocation ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up">
        <h3 className="ds-label-uppercase mb-3">Disponibilidad y forma de trabajar</h3>
        <div className="flex flex-col gap-3">
          <ProfileValueRow
            label="Disponibilidad"
            value={AVAILABILITY_LABELS[user.availability]}
            onEdit={openWorkPrefsEdit}
          />
          <ProfileValueRow
            label="Forma de trabajar"
            value={
              user.workStyle.length > 0
                ? user.workStyle.map((w) => WORK_STYLE_LABELS[w]).join(" · ")
                : undefined
            }
            onEdit={openWorkPrefsEdit}
          />
        </div>
      </Card>

      <Drawer
        open={workPrefsEditOpen}
        onOpenChange={setWorkPrefsEditOpen}
        ariaLabel="Editar disponibilidad y forma de trabajar"
      >
        <DrawerHeader
          title="Disponibilidad y forma de trabajar"
          description="Elige únicamente opciones estandarizadas para mejorar el matching."
        />

        <div className="flex flex-col gap-3 mb-4">
          <Field label="Disponibilidad">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={AVAILABILITY_LABELS[id]}
                  selected={workPrefsDraft.availability === id}
                  onClick={() =>
                    setWorkPrefsDraft((prev) => ({
                      ...prev,
                      availability: id,
                    }))
                  }
                />
              ))}
            </div>
          </Field>

          <Field label="Forma de trabajar">
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(WORK_STYLE_LABELS) as WorkStyle[]).map((id) => (
                <ProfileEditChip
                  key={id}
                  label={WORK_STYLE_LABELS[id]}
                  selected={workPrefsDraft.workStyle.includes(id)}
                  onClick={() => toggleWorkStyle(id)}
                />
              ))}
            </div>
          </Field>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setWorkPrefsEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveWorkPrefsEdit}
            disabled={savingWorkPrefs}
          >
            {savingWorkPrefs ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up">
        <ProfileValueRow
          label="Tipos de relación que busco"
          value={
            user.relationsLooking.length > 0
              ? user.relationsLooking.map((r) => RELATION_LABELS[r]).join(" · ")
              : undefined
          }
          onEdit={openRelationsEdit}
        />
      </Card>

      <Drawer
        open={relationsEditOpen}
        onOpenChange={setRelationsEditOpen}
        ariaLabel="Editar tipos de relación"
      >
        <DrawerHeader
          title="Tipos de relación que busco"
          description="Elige los tipos de match que te interesan."
        />
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(Object.keys(RELATION_LABELS) as RelationType[]).map((id) => (
            <ProfileEditChip
              key={id}
              label={RELATION_LABELS[id]}
              selected={relationsDraft.includes(id)}
              onClick={() => toggleRelation(id)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setRelationsEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveRelationsEdit}
            disabled={savingRelations}
          >
            {savingRelations ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      {user.eventCodes && user.eventCodes.length > 0 ? (
        <Card padding="default" className="ds-fade-up">
          <h3 className="ds-label-uppercase mb-3">Eventos vinculados</h3>
          <div className="flex flex-wrap gap-1.5">
            {user.eventCodes.map((code) => (
              <Tag key={code} variant="neutral">
                {code}
              </Tag>
            ))}
          </div>
        </Card>
      ) : null}

      <Card padding="default" className="ds-fade-up flex flex-col gap-1">
        <p className="text-[11px] uppercase tracking-wide text-[var(--text3)]">
          Cuenta
        </p>
        <p className="text-[13px] text-[var(--text)]">{user.email}</p>
        <p className="text-[12px] text-[var(--text3)]">Plan {user.plan}</p>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="text-[22px] font-extrabold tracking-[-0.4px] text-[var(--text)]">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)] mt-1">
        {label}
      </div>
    </div>
  )
}

function ProfileValueRow({
  label,
  value,
  emptyLabel = "Sin definir",
  onEdit,
}: {
  label: string
  value: string | null | undefined
  emptyLabel?: string
  onEdit?: () => void
}) {
  const trimmed = value?.trim() ?? ""
  const isEmpty = trimmed.length === 0
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-[11px] uppercase tracking-wide text-[var(--text3)]">
          {label}
        </span>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="text-[11px] font-medium text-[var(--p)] hover:underline"
          >
            Editar
          </button>
        ) : null}
      </div>
      <p
        className={cn(
          "text-[13px] leading-relaxed",
          isEmpty ? "text-[var(--text3)]" : "text-[var(--text)]"
        )}
      >
        {isEmpty ? emptyLabel : trimmed}
      </p>
    </div>
  )
}

function ProfileEditChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-[12px] border transition-colors",
        selected
          ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)]"
          : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
    </button>
  )
}
