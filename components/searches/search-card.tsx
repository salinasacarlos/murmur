"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import {
  RELATION_LABELS,
  type Search,
} from "@/lib/types"
import { labelProfileVerticalSlug } from "@/lib/industry-tree"
import {
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
  resolveHeroIndustrySlug,
} from "@/lib/profile-taxonomy"
import { IconEdit, IconPause, IconPlay, IconTrash } from "@/components/icons"

interface SearchCardProps {
  search: Search
  onToggleStatus?: () => void
  onDelete?: () => void
}

export function SearchCard({
  search,
  onToggleStatus,
  onDelete,
}: SearchCardProps) {
  const heroIndustrySlug = resolveHeroIndustrySlug({
    primaryIndustrySlug: search.primaryIndustrySlug,
    expertiseSlugs: search.expertiseSlugs,
    functionalAreaTags: search.functionalAreaTags,
    area: search.area ?? "negocio",
  })
  const heroVerticals = search.verticalSlugs ?? []
  const heroExpertise = search.expertiseSlugs ?? []
  const talentSlugs = search.talentSlugs ?? []

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="card-header-stack">
        <div className="flex-1 min-w-0">
          <h3 className="card-title mb-1">{search.title}</h3>
          <p className="card-subtitle leading-relaxed line-clamp-3 sm:line-clamp-2">
            {search.description}
          </p>
        </div>
        <Tag
          variant={search.status === "active" ? "success" : "paused"}
          className="card-status-tag shrink-0"
        >
          {search.status === "active" ? "Activa" : "Pausada"}
        </Tag>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {search.relations.map((r) => (
          <Tag key={r} variant="brand">
            {RELATION_LABELS[r]}
          </Tag>
        ))}
        {heroIndustrySlug ? (
          <Tag variant="amber">{labelIndustrySlug(heroIndustrySlug)}</Tag>
        ) : null}
        {heroVerticals.map((slug) => (
          <Tag key={`v-${slug}`} variant="amber">
            {labelProfileVerticalSlug(slug)}
          </Tag>
        ))}
        {heroExpertise.length > 0
          ? heroExpertise.map((slug) => (
              <Tag key={slug} variant="amber">
                {labelExpertiseSlug(slug)}
              </Tag>
            ))
          : search.primaryIndustrySlug || heroVerticals.length > 0 ? (
              <Tag variant="neutral">Sin roles</Tag>
            ) : null}
        {talentSlugs.map((slug) => (
          <Tag key={`talent-${slug}`} variant="neutral">
            {labelTalentSlug(slug)}
          </Tag>
        ))}
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t-[0.5px] border-[var(--border)] sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[11px] text-[var(--text3)] uppercase tracking-[0.05em] font-semibold shrink-0">
          {search.matchesCount} matches
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <Link href={`/searches/${search.id}`}>
            <Button variant="ghost" size="sm">
              <IconEdit size={12} />
              Editar
            </Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={onToggleStatus}>
            {search.status === "active" ? (
              <>
                <IconPause size={12} />
                Pausar
              </>
            ) : (
              <>
                <IconPlay size={12} />
                Activar
              </>
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>
            <IconTrash size={12} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
