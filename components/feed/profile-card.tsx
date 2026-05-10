"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import type { PeerConnectionHint } from "@/lib/data/connections"
import {
  AVAILABILITY_LABELS,
  COMPATIBILITY_COLORS,
  COMPATIBILITY_LABELS,
  EXPERIENCE_LABELS,
  type Profile,
} from "@/lib/types"
import { labelProfileVerticalSlug } from "@/lib/industry-tree"
import {
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
  resolveHeroIndustrySlug,
} from "@/lib/profile-taxonomy"
import { IconMapPin } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  profile: Profile
  onClick?: () => void
  connectionHint?: PeerConnectionHint
}

export function ProfileCard({
  profile,
  onClick,
  connectionHint = { state: "none" },
}: ProfileCardProps) {
  const heroIndustrySlug = resolveHeroIndustrySlug({
    primaryIndustrySlug: profile.primaryIndustrySlug,
    expertiseSlugs: profile.expertiseSlugs,
    functionalAreaTags: profile.functionalAreaTags,
    area: profile.area,
  })
  const heroVerticals = profile.verticalSlugs ?? []
  const heroExpertise = profile.expertiseSlugs ?? []
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
        {heroVerticals.slice(0, 1).map((slug) => (
          <Tag key={`v-${slug}`} variant="amber">
            {labelProfileVerticalSlug(slug)}
          </Tag>
        ))}
        {heroVerticals.length > 1 ? (
          <Tag variant="neutral">+{heroVerticals.length - 1} vert.</Tag>
        ) : null}
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
          <Tag variant="neutral">Sin roles</Tag>
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

      <div className="flex items-center gap-1.5 text-[11px] text-[var(--text3)] mt-auto">
        <IconMapPin size={12} />
        <span>{profile.city}</span>
      </div>

      <ProfileCardConnectionRow hint={connectionHint} onOpenProfile={() => onClick?.()} />
    </Card>
  )
}

function ProfileCardConnectionRow({
  hint,
  onOpenProfile,
}: {
  hint: PeerConnectionHint
  onOpenProfile: () => void
}) {
  return (
    <div
      className="mt-2 flex w-full gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {hint.state === "none" ? (
        <Button
          type="button"
          variant="primary"
          size="sm"
          className="flex-1 min-h-[40px] touch-manipulation"
          onClick={() => onOpenProfile()}
        >
          Conectar
        </Button>
      ) : hint.state === "connected" ? (
        hint.chatId ? (
          <Link
            href={`/messages/${hint.chatId}`}
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "flex-1 min-h-[40px] justify-center no-underline touch-manipulation"
            )}
          >
            Ir al chat
          </Link>
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "flex-1 min-h-[40px] inline-flex items-center justify-center text-[var(--text2)]"
            )}
          >
            Conectado
          </span>
        )
      ) : hint.state === "request_sent" ? (
        <span
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "flex-1 min-h-[40px] inline-flex items-center justify-center cursor-default text-[var(--text3)]"
          )}
        >
          Solicitud enviada
        </span>
      ) : (
        <Link
          href="/connections?tab=received"
          className={cn(
            buttonVariants({ variant: "brand", size: "sm" }),
            "flex-1 min-h-[40px] justify-center no-underline touch-manipulation"
          )}
        >
          Ver solicitud
        </Link>
      )}
    </div>
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
