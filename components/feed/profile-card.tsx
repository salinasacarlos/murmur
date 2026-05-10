"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import {
  AREA_LABELS,
  AVAILABILITY_LABELS,
  COMPATIBILITY_COLORS,
  COMPATIBILITY_LABELS,
  EXPERIENCE_LABELS,
  type Profile,
} from "@/lib/types"
import {
  defaultIndustryForFunctionalArea,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
} from "@/lib/profile-taxonomy"
import { IconMapPin } from "@/components/icons"

interface ProfileCardProps {
  profile: Profile
  onClick?: () => void
}

export function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const heroIndustrySlug =
    profile.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      profile.expertiseSlugs?.length
        ? profile.expertiseSlugs
        : profile.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(profile.area)
  const heroExpertise =
    profile.expertiseSlugs?.length
      ? profile.expertiseSlugs
      : (profile.functionalAreaTags ?? [])
  const talentSlugs = profile.talentSlugs ?? []

  return (
    <Card
      interactive
      padding="default"
      className="ds-fade-up cursor-pointer flex flex-col gap-3"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      <div className="flex items-start gap-3">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="md"
          online={profile.online}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[14px] font-bold tracking-[-0.2px] text-[var(--text)] truncate">
              {profile.name}
            </h3>
            <CompatibilityBadge level={profile.compatibility} />
          </div>
          <p className="text-[12px] text-[var(--text2)] truncate">
            {profile.role}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Tag variant="amber">{labelIndustrySlug(heroIndustrySlug)}</Tag>
        {heroExpertise.length > 0 ? (
          <>
            {heroExpertise.slice(0, 2).map((slug) => (
              <Tag key={slug} variant="amber">
                {labelExpertiseSlug(slug)}
              </Tag>
            ))}
            {heroExpertise.length > 2 ? (
              <Tag variant="neutral">+{heroExpertise.length - 2}</Tag>
            ) : null}
          </>
        ) : (
          <Tag variant="amber">{AREA_LABELS[profile.area]}</Tag>
        )}
        {talentSlugs.slice(0, 1).map((slug) => (
          <Tag key={`talent-${slug}`} variant="neutral">
            {labelTalentSlug(slug)}
          </Tag>
        ))}
        {talentSlugs.length > 1 ? (
          <Tag variant="neutral">+{talentSlugs.length - 1}</Tag>
        ) : null}
        <Tag variant="neutral">{EXPERIENCE_LABELS[profile.experience]}</Tag>
        <Tag variant="success">{AVAILABILITY_LABELS[profile.availability]}</Tag>
      </div>

      <div className="rounded-lg border border-[var(--border)] bg-[var(--bg2)]/60 px-3 py-2">
        <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)]">
          Escrito por {profile.name.split(" ")[0]}
        </p>
        <p className="line-clamp-2 text-[12px] leading-relaxed text-[var(--text)]">
          {profile.achievement}
        </p>
      </div>

      {profile.funFact.trim() ? (
        <div className="rounded-lg border border-[var(--border)] border-dashed bg-[var(--bg2)]/40 px-3 py-2">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)]">
            Dato curioso
          </p>
          <p className="line-clamp-2 text-[12px] leading-relaxed text-[var(--text)]">
            {profile.funFact}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        {profile.industries.slice(0, 3).map((ind) => (
          <Tag key={ind} variant="green">
            {ind}
          </Tag>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text3)] mt-auto">
        <IconMapPin size={12} />
        <span>{profile.city}</span>
      </div>
    </Card>
  )
}

function CompatibilityBadge({
  level,
}: {
  level: Profile["compatibility"]
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.05em]"
      style={{ color: COMPATIBILITY_COLORS[level] }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: COMPATIBILITY_COLORS[level] }}
      />
      {COMPATIBILITY_LABELS[level].replace("Compatibilidad ", "")}
    </span>
  )
}
