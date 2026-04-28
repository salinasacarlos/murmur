"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import {
  AREA_LABELS,
  RELATION_LABELS,
  type Search,
} from "@/lib/types"
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
  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold tracking-[-0.2px] text-[var(--text)] mb-1">
            {search.title}
          </h3>
          <p className="text-[12px] text-[var(--text2)] leading-relaxed line-clamp-2">
            {search.description}
          </p>
        </div>
        <Tag variant={search.status === "active" ? "success" : "paused"}>
          {search.status === "active" ? "Activa" : "Pausada"}
        </Tag>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {search.relations.map((r) => (
          <Tag key={r} variant="brand">
            {RELATION_LABELS[r]}
          </Tag>
        ))}
        {search.area && (
          <Tag variant="amber">{AREA_LABELS[search.area]}</Tag>
        )}
        {search.industries.map((i) => (
          <Tag key={i} variant="green">
            {i}
          </Tag>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t-[0.5px] border-[var(--border)]">
        <span className="text-[11px] text-[var(--text3)] uppercase tracking-[0.05em] font-semibold">
          {search.matchesCount} matches
        </span>
        <div className="flex items-center gap-1">
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
