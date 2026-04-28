"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { chatIdForProfile } from "@/lib/mock-data"
import {
  RELATION_LABELS,
  type ConnectionStatus,
  type SentConnection,
} from "@/lib/types"

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
}

const STATUS_VARIANT: Record<ConnectionStatus, "neutral" | "success" | "paused"> = {
  pending: "neutral",
  accepted: "success",
  rejected: "paused",
}

interface ConnectionCardSentProps {
  connection: SentConnection
  onCancel?: () => void
}

export function ConnectionCardSent({
  connection,
  onCancel,
}: ConnectionCardSentProps) {
  const { profile, status } = connection
  const chatId = chatIdForProfile(profile.id)

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[14px] font-bold tracking-[-0.2px] truncate">
                {profile.name}
              </h3>
              <p className="text-[12px] text-[var(--text2)] truncate">
                {profile.role}
              </p>
            </div>
            <Tag variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Tag>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Tag variant="brand">{RELATION_LABELS[connection.relation]}</Tag>
      </div>

      <p className="text-[12px] text-[var(--text2)] line-clamp-2 leading-relaxed">
        {connection.message}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-[var(--text3)]">
          Enviada {connection.sentAt}
        </span>
        {status === "pending" && (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        {status === "accepted" && (
          <Link href={chatId ? `/messages/${chatId}` : "/messages"}>
            <Button variant="brand" size="sm">
              Ver chat
            </Button>
          </Link>
        )}
      </div>
    </Card>
  )
}
