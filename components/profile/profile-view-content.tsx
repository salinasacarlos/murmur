"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Tag } from "@/components/ui/tag"
import { profileShowsRecommendationCount } from "@/lib/recommendation-display"
import {
  AVAILABILITY_LABELS,
  COMPATIBILITY_COLORS,
  COMPATIBILITY_LABELS,
  EXPERIENCE_LABELS,
  RELATION_LABELS,
  WORK_STYLE_LABELS,
  type Profile,
} from "@/lib/types"
import {
  defaultIndustryForFunctionalArea,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
} from "@/lib/profile-taxonomy"
import { labelProfileVerticalSlug } from "@/lib/industry-tree"
import { labelProjectStageLong } from "@/lib/project-stage"
import { labelInvestorActivityLong } from "@/lib/investor-activity"
import {
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconSpark,
  IconHeart,
} from "@/components/icons"
import {
  ProfileViewRow,
  ProfileViewSection,
} from "@/components/profile/profile-view-section"

interface ProfileViewContentProps {
  profile: Profile
  /** Ocultar hint de logro en vista pública compartida */
  showAchievementHint?: boolean
}

export function ProfileViewContent({
  profile,
  showAchievementHint = false,
}: ProfileViewContentProps) {
  const heroIndustrySlug =
    profile.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      profile.expertiseSlugs?.length
        ? profile.expertiseSlugs
        : profile.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(profile.area)
  const verticalPart =
    profile.verticalSlugs && profile.verticalSlugs.length > 0
      ? profile.verticalSlugs.map((s) => labelProfileVerticalSlug(s)).join(" · ")
      : null
  const expertisePart =
    profile.expertiseSlugs && profile.expertiseSlugs.length > 0
      ? profile.expertiseSlugs.map((s) => labelExpertiseSlug(s)).join(" · ")
      : "Sin definir"
  const talentsLine =
    profile.talentSlugs && profile.talentSlugs.length > 0
      ? profile.talentSlugs.map((s) => labelTalentSlug(s)).join(" · ")
      : null

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="xl"
          online={profile.online}
        />
        <div className="flex-1 min-w-0">
          <h1 className="person-name-lg">{profile.name}</h1>
          <p className="person-subtitle-md mt-0.5">{profile.role}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.05em]"
              style={{ color: COMPATIBILITY_COLORS[profile.compatibility] }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: COMPATIBILITY_COLORS[profile.compatibility],
                }}
              />
              {COMPATIBILITY_LABELS[profile.compatibility]}
            </span>
            {profileShowsRecommendationCount(profile) ? (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[var(--p)]">
                <IconHeart size={11} />
                {profile.recommendationCount}{" "}
                {profile.recommendationCount === 1
                  ? "recomendación"
                  : "recomendaciones"}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <ProfileViewSection title="Bio">
        <p className="text-[13px] text-[var(--text)] leading-relaxed">
          {profile.bio}
        </p>
      </ProfileViewSection>

      {profile.funFact.trim() ? (
        <ProfileViewSection title="Dato curioso">
          <p className="text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap">
            {profile.funFact}
          </p>
        </ProfileViewSection>
      ) : null}

      <ProfileViewSection
        title="Éxito o descripción breve"
        hint={
          showAchievementHint
            ? "Algo que te llene de orgullo y sume razones para conectar; sin exagerar."
            : undefined
        }
      >
        <div className="flex items-start gap-2">
          <IconSpark size={14} className="mt-0.5 text-[var(--p)]" />
          <p className="text-[13px] text-[var(--text)]">{profile.achievement}</p>
        </div>
      </ProfileViewSection>

      {profile.projectStage ||
      (profile.projectName && profile.projectName.trim()) ||
      (profile.projectSeekSummary && profile.projectSeekSummary.trim()) ? (
        <ProfileViewSection title="Proyecto">
          {profile.projectName?.trim() ? (
            <p className="text-[13px] font-semibold text-[var(--text)] mb-1">
              {profile.projectName.trim()}
            </p>
          ) : null}
          {profile.projectStage ? (
            <p className="text-[13px] text-[var(--text)] leading-relaxed mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] block mb-1">
                Etapa
              </span>
              {labelProjectStageLong(profile.projectStage)}
            </p>
          ) : null}
          {profile.projectSeekSummary?.trim() ? (
            <p className="text-[13px] text-[var(--text2)] leading-relaxed whitespace-pre-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] block mb-1">
                Qué busca
              </span>
              {profile.projectSeekSummary.trim()}
            </p>
          ) : null}
        </ProfileViewSection>
      ) : null}

      {profile.onboardingIntent === "investor" && profile.investorActivity ? (
        <ProfileViewSection title="Inversión">
          <p className="text-[13px] text-[var(--text)] leading-relaxed">
            {labelInvestorActivityLong(profile.investorActivity)}
          </p>
        </ProfileViewSection>
      ) : null}

      {(profile.opportunitySeekSummary?.trim() ||
        profile.contributorPitch?.trim()) &&
      !profile.projectStage ? (
        <ProfileViewSection title="Oportunidad y aporte">
          {profile.opportunitySeekSummary?.trim() ? (
            <p className="text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] block mb-1">
                Busca
              </span>
              {profile.opportunitySeekSummary.trim()}
            </p>
          ) : null}
          {profile.contributorPitch?.trim() ? (
            <p className="text-[13px] text-[var(--text2)] leading-relaxed whitespace-pre-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] block mb-1">
                Puede aportar
              </span>
              {profile.contributorPitch.trim()}
            </p>
          ) : null}
        </ProfileViewSection>
      ) : null}

      <ProfileViewSection title="Sobre su trabajo">
        <div className="flex flex-col gap-2.5">
          <ProfileViewRow icon={<IconBriefcase size={14} />}>
            <span className="font-medium text-[var(--text)]">
              {labelIndustrySlug(heroIndustrySlug)}
            </span>
            {verticalPart ? (
              <>
                <span className="text-[var(--text3)]"> · </span>
                <span>{verticalPart}</span>
              </>
            ) : null}
            <span className="text-[var(--text3)]"> · </span>
            <span>{expertisePart}</span>
            <span className="text-[var(--text3)]"> · </span>
            {EXPERIENCE_LABELS[profile.experience]}
          </ProfileViewRow>
          {talentsLine ? (
            <ProfileViewRow icon={<IconSpark size={14} />}>
              <span className="text-[var(--text3)]">Soft skills: </span>
              {talentsLine}
            </ProfileViewRow>
          ) : null}
          <ProfileViewRow icon={<IconClock size={14} />}>
            {AVAILABILITY_LABELS[profile.availability]}
          </ProfileViewRow>
          <ProfileViewRow icon={<IconMapPin size={14} />}>
            {profile.city}
            {profile.cities && profile.cities.length > 0 && (
              <span className="text-[var(--text3)]">
                {" "}
                · también {profile.cities.join(", ")}
              </span>
            )}
          </ProfileViewRow>
        </div>
      </ProfileViewSection>

      <ProfileViewSection title="Forma de trabajar">
        <div className="flex flex-wrap gap-1.5">
          {profile.workStyle.map((w) => (
            <Tag key={w} variant="neutral">
              {WORK_STYLE_LABELS[w]}
            </Tag>
          ))}
        </div>
      </ProfileViewSection>

      <ProfileViewSection title="Tipos de relación que busca">
        <div className="flex flex-wrap gap-1.5">
          {profile.relationsLooking.map((r) => (
            <Tag key={r} variant="brand">
              {RELATION_LABELS[r]}
            </Tag>
          ))}
        </div>
      </ProfileViewSection>
    </div>
  )
}
