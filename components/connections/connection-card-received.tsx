"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { RELATION_LABELS, type ReceivedConnection } from "@/lib/types"
import { IconCheck, IconX } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ConnectionCardReceivedProps {
  connection: ReceivedConnection
  onAccept: () => void
  onIgnore: () => void
  accepting?: boolean
}

export function ConnectionCardReceived({
  connection,
  onAccept,
  onIgnore,
  accepting = false,
}: ConnectionCardReceivedProps) {
  const [expanded, setExpanded] = React.useState(false)
  const { profile } = connection

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="md"
          online={profile.online}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[14px] font-bold tracking-[-0.2px] truncate">
            {profile.name}
          </h3>
          <p className="text-[12px] text-[var(--text2)] truncate">
            {profile.role}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Tag variant="brand">{RELATION_LABELS[connection.relation]}</Tag>
        {connection.searchTitle && (
          <Tag variant="neutral">Para: {connection.searchTitle}</Tag>
        )}
      </div>

      <p
        className={cn("expandable-text text-[13px] text-[var(--text)]", expanded && "expanded")}
        onClick={() => setExpanded(!expanded)}
      >
        {connection.message}
      </p>
      {!expanded && connection.message.length > 140 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[11px] text-[var(--p)] font-semibold self-start -mt-1"
        >
          Ver más
        </button>
      )}

      <div className="flex items-center gap-2 pt-1">
        <Button
          variant="primary"
          size="md"
          className="flex-1 justify-center"
          onClick={onAccept}
          disabled={accepting}
        >
          {accepting ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <IconCheck size={12} />
          )}
          {accepting ? "Abriendo chat..." : "Aceptar"}
        </Button>
        <Button
          variant="secondary"
          size="md"
          className="flex-1 justify-center"
          onClick={onIgnore}
          disabled={accepting}
        >
          <IconX size={12} />
          Ignorar
        </Button>
      </div>
    </Card>
  )
}
