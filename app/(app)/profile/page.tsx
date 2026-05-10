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
import { HierarchicalIndustrySelector } from "@/components/ui/hierarchical-industry-selector"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { CITIES_CATALOG } from "@/lib/catalogs"
import {
  defaultIndustryForFunctionalArea,
  deriveEditableTaxonomy,
  expertiseSlugsForIndustry,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
  resolveHeroIndustrySlug,
  resolveProfileArea,
} from "@/lib/profile-taxonomy"
import {
  AREA_LABELS,
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
  replaceProfileIndustries,
  replaceProfileRelationsLooking,
  replaceProfileWorkStyles,
} from "@/lib/data/profile-mutations"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { IconEdit } from "@/components/icons"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user: authUser, profile, refresh } = useCurrentUser()
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
  const [industriesEditOpen, setIndustriesEditOpen] = React.useState(false)
  const [relationsEditOpen, setRelationsEditOpen] = React.useState(false)

  const [savingProfile, setSavingProfile] = React.useState(false)
  const [savingIndustry, setSavingIndustry] = React.useState(false)
  const [savingExpertiseTax, setSavingExpertiseTax] = React.useState(false)
  const [savingTalentsTax, setSavingTalentsTax] = React.useState(false)
  const [savingLocation, setSavingLocation] = React.useState(false)
  const [savingWorkPrefs, setSavingWorkPrefs] = React.useState(false)
  const [savingAchievement, setSavingAchievement] = React.useState(false)
  const [savingExperience, setSavingExperience] = React.useState(false)
  const [savingIndustries, setSavingIndustries] = React.useState(false)
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
  const [industriesDraft, setIndustriesDraft] = React.useState<string[]>([])
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
    const { expertiseSlugs: expertiseFiltered } = deriveEditableTaxonomy({
      primaryIndustrySlug: profileUser.primaryIndustrySlug,
      expertiseSlugs: profileUser.expertiseSlugs,
      functionalAreaTags: profileUser.functionalAreaTags,
      area: profileUser.area,
    })
    setExpertiseDraftSlugs(expertiseFiltered)
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
      case "achievement":
        setAchievementEditOpen(true)
        break
      case "work_styles":
        setWorkPrefsEditOpen(true)
        break
      case "industries":
        setIndustriesEditOpen(true)
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
    const expertise = keepExpertise
      ? deriveEditableTaxonomy({
          primaryIndustrySlug: profileUser.primaryIndustrySlug,
          expertiseSlugs: profileUser.expertiseSlugs,
          functionalAreaTags: profileUser.functionalAreaTags,
          area: profileUser.area,
        }).expertiseSlugs
      : []
    const area = resolveProfileArea(nextSlug, expertise)
    const supabase = getSupabaseBrowserClient()
    const payload = {
      primary_industry_slug: nextSlug,
      expertise_slugs: expertise,
      functional_area_tags: expertise,
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
          error.message?.includes("expertise_slugs"))
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
    const allowedSet = new Set(expertiseSlugsForIndustry(industrySlug))
    const expertise = expertiseDraftSlugs
      .filter((s) => allowedSet.has(s))
      .slice(0, 5)
    const area = resolveProfileArea(industrySlug, expertise)
    const supabase = getSupabaseBrowserClient()
    const payload = {
      primary_industry_slug: industrySlug,
      expertise_slugs: expertise,
      functional_area_tags: expertise,
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
          error.message?.includes("primary_industry_slug"))
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
    const talents = talentsDraftSlugs.slice(0, 5)
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
    setLocationDraft({
      city: profileUser.city,
      cities: profileUser.cities ?? [profileUser.city],
      searchRadiusKm: profileUser.searchRadiusKm ?? 50,
    })
    setLocationEditOpen(true)
  }

  async function saveLocationEdit() {
    if (!authUser || savingLocation) return
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
    const citiesRes = await replaceProfileCities(
      supabase,
      authUser.id,
      locationDraft.city.trim(),
      locationDraft.cities
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

  function openIndustriesEdit() {
    if (!profileUser) return
    setIndustriesDraft([...profileUser.industries])
    setIndustriesEditOpen(true)
  }

  async function saveIndustriesEdit() {
    if (!authUser || savingIndustries) return
    setSavingIndustries(true)
    const supabase = getSupabaseBrowserClient()
    const j = await replaceProfileIndustries(
      supabase,
      authUser.id,
      industriesDraft
    )
    setSavingIndustries(false)
    if (!j.ok) {
      console.error("Failed to save industries", j.error)
      return
    }
    setIndustriesEditOpen(false)
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
  const heroExpertiseSlugs =
    user.expertiseSlugs && user.expertiseSlugs.length > 0
      ? user.expertiseSlugs
      : (user.functionalAreaTags ?? [])

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full flex flex-col gap-4">
      <div className="md:hidden">
        <h2 className="text-[18px] font-extrabold tracking-[-0.4px]">
          Mi perfil
        </h2>
      </div>

      <Card padding="default" className="ds-fade-up flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[var(--text3)]">
              ONBOARDING
            </p>
            <p className="text-[20px] font-extrabold tracking-[-0.4px] mt-1">
              Perfil al {completeness.percent}%
            </p>
          </div>
        </div>
        {completeness.missing.length > 0 ? (
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
        ) : (
          <p className="text-[12px] text-[var(--g)] font-medium">
            Tu perfil está completo en los campos clave.
          </p>
        )}
      </Card>

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
            <Button variant="ghost" size="sm" onClick={openProfileEdit}>
              <IconEdit size={12} />
              Datos básicos
            </Button>
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
            {heroExpertiseSlugs.length > 0 ? (
              heroExpertiseSlugs.map((slug) => (
                <Tag key={slug} variant="amber">
                  {labelExpertiseSlug(slug)}
                </Tag>
              ))
            ) : (
              <Tag variant="amber">{AREA_LABELS[user.area]}</Tag>
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
          description="Foto, nombre, cómo te presentas, bio y un dato curioso opcional. Industria, expertise, años de experiencia y talentos los editas desde la sección Profesional."
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
          title="Industria principal"
          description="Define tu industria de referencia. Si la cambias, se quitan las especialidades (expertise) guardadas para ajustarlas al nuevo contexto."
        />
        <div className="flex flex-col gap-3 mb-4">
          <Field label="Industria">
            <IndustrySingleSelect
              value={industryDraft}
              onChange={(slug) => setIndustryDraft(slug)}
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
        ariaLabel="Editar expertise"
        className="flex max-h-[90dvh] flex-col !overflow-hidden"
      >
        <DrawerHeader
          className="shrink-0"
          title="Especialidades (expertise)"
          description={`Industria de referencia: ${labelIndustrySlug(heroIndustrySlug)}. Puedes elegir hasta 5 especialidades de esa industria.`}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 pb-1">
            <Field label="Expertise">
              <ExpertiseMultiSelect
                industrySlug={heroIndustrySlug}
                value={expertiseDraftSlugs}
                onChange={setExpertiseDraftSlugs}
                footerNote="Máximo 5. Para cambiar de industria, edita primero «Industria principal» arriba en Profesional."
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
        ariaLabel="Editar talentos"
      >
        <DrawerHeader
          title="Talentos"
          description="Habilidades transversales (soft skills). Elige hasta 5."
        />
        <div className="flex flex-col gap-3 mb-4">
          <Field label="Talentos">
            <TalentMultiSelect
              value={talentsDraftSlugs}
              onChange={setTalentsDraftSlugs}
            />
          </Field>
        </div>
        <div className="flex gap-2">
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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="ds-label-uppercase">Profesional</h3>
            <p className="text-[12px] text-[var(--text2)] mt-1">
              Industria, especialidades, años de experiencia y talentos: edita
              cada bloque con su enlace.
            </p>
          </div>
          <button
            type="button"
            onClick={openAchievementEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1 shrink-0"
            aria-label="Editar logro destacado"
          >
            <IconEdit size={14} />
          </button>
        </div>
        <ProfileValueRow
          label="Industria"
          value={labelIndustrySlug(heroIndustrySlug)}
          onEdit={openIndustryEdit}
        />
        <ProfileValueRow
          label="Expertise"
          value={
            heroExpertiseSlugs.length > 0
              ? heroExpertiseSlugs.map((s) => labelExpertiseSlug(s)).join(" · ")
              : AREA_LABELS[user.area]
          }
          onEdit={openExpertiseEdit}
        />
        <ProfileValueRow
          label="Talentos"
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
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Ubicación y radio</h3>
          <button
            type="button"
            onClick={openLocationEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar ubicación y radio"
          >
            <IconEdit size={14} />
          </button>
        </div>
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
          description="Define dónde estás y en qué ciudades quieres aparecer cuando tu búsqueda esté activa."
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
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Disponibilidad y forma de trabajar</h3>
          <button
            type="button"
            onClick={openWorkPrefsEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar disponibilidad y forma de trabajar"
          >
            <IconEdit size={14} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <ProfileValueRow
            label="Disponibilidad"
            value={AVAILABILITY_LABELS[user.availability]}
          />
          <div>
            <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
              Forma de trabajar
            </p>
            {user.workStyle.length ? (
              <div className="flex flex-wrap gap-1.5">
                {user.workStyle.map((w) => (
                  <Tag key={w} variant="neutral">
                    {WORK_STYLE_LABELS[w]}
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
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Industrias de afinidad</h3>
          <button
            type="button"
            onClick={openIndustriesEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar industrias"
          >
            <IconEdit size={14} />
          </button>
        </div>
        {user.industries.length ? (
          <div className="flex flex-wrap gap-1.5">
            {user.industries.map((i) => (
              <Tag key={i} variant="green">
                {i}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[var(--text3)]">Sin definir</p>
        )}
      </Card>

      <Drawer
        open={industriesEditOpen}
        onOpenChange={setIndustriesEditOpen}
        ariaLabel="Editar industrias"
      >
        <DrawerHeader
          title="Industrias de afinidad"
          description="Elige un ámbito y luego las subindustrias. Puedes sumar etiquetas de varios ámbitos."
        />
        <div className="max-h-[min(70vh,520px)] overflow-y-auto mb-4 pr-1">
          <HierarchicalIndustrySelector
            value={industriesDraft}
            onChange={setIndustriesDraft}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setIndustriesEditOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={saveIndustriesEdit}
            disabled={savingIndustries}
          >
            {savingIndustries ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </Drawer>

      <Card padding="default" className="ds-fade-up">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="ds-label-uppercase">Tipos de relación que busco</h3>
          <button
            type="button"
            onClick={openRelationsEdit}
            className="text-[var(--text3)] hover:text-[var(--p)] p-1 -m-1"
            aria-label="Editar tipos de relación"
          >
            <IconEdit size={14} />
          </button>
        </div>
        {user.relationsLooking.length ? (
          <div className="flex flex-wrap gap-1.5">
            {user.relationsLooking.map((r) => (
              <Tag key={r} variant="brand">
                {RELATION_LABELS[r]}
              </Tag>
            ))}
          </div>
        ) : (
          <p className="text-[13px] text-[var(--text3)]">Sin definir</p>
        )}
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
