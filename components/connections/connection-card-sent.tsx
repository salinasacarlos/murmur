"use client"

import * as React from "react"
import Link from "next/link"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import {
  RELATION_LABELS,
  type ConnectionStatus,
  type SentConnection,
} from "@/lib/types"

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  pending: "Pendiente",
  accepted: "Conexión activa",
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

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="md"
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="card-header-stack">
            <div className="min-w-0 flex-1">
              <h3 className="person-name">{profile.name}</h3>
              <p className="person-subtitle mt-0.5">{profile.role}</p>
              {status === "pending" ? (
                <p className="text-[11px] text-[var(--text3)] mt-1 break-words [overflow-wrap:anywhere]">
                  Tú enviaste esta solicitud
                </p>
              ) : null}
            </div>
            <Tag variant={STATUS_VARIANT[status]} className="card-status-tag shrink-0">
              {STATUS_LABEL[status]}
            </Tag>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Tag variant="brand">{RELATION_LABELS[connection.relation]}</Tag>
      </div>

      <p className="text-[12px] text-[var(--text2)] line-clamp-3 sm:line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
        {connection.message}
      </p>

      <div className="card-footer-row">
        <span className="text-[11px] text-[var(--text3)] break-words [overflow-wrap:anywhere]">
          {status === "accepted"
            ? `Activa desde ${connection.sentAt}`
            : `Enviada ${connection.sentAt}`}
        </span>
        {status === "pending" ? (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={onCancel}>
            Cancelar
          </Button>
        ) : null}
        {status === "accepted" ? (
          <Link
            href={
              connection.chatId ? `/messages/${connection.chatId}` : "/messages"
            }
            className="shrink-0"
          >
            <Button variant="brand" size="sm">
              Ver chat
            </Button>
          </Link>
        ) : null}
      </div>
    </Card>
  )
}
