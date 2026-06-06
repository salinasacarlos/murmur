"use client"

import * as React from "react"
import Link from "next/link"

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
  const isAccepted = connection.status === "accepted"

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          initials={profile.initials}
          imageUrl={profile.photoUrl}
          alt={`Foto de ${profile.name}`}
          size="md"
          online={profile.online}
          className="shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="card-header-stack">
            <div className="min-w-0 flex-1">
              <h3 className="person-name">{profile.name}</h3>
              <p className="person-subtitle mt-0.5">{profile.role}</p>
            </div>
            {isAccepted ? (
              <Tag variant="success" className="card-status-tag shrink-0">
                Conexión activa
              </Tag>
            ) : (
              <Tag variant="neutral" className="card-status-tag shrink-0">
                Nueva solicitud
              </Tag>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Tag variant="brand">{RELATION_LABELS[connection.relation]}</Tag>
        {connection.searchTitle ? (
          <Tag variant="neutral" className="card-status-tag">
            Para: {connection.searchTitle}
          </Tag>
        ) : null}
      </div>

      <p
        className={cn(
          "expandable-text text-[13px] text-[var(--text)] break-words [overflow-wrap:anywhere]",
          expanded && "expanded"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        {isAccepted ? (
          <>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text3)] block mb-1">
              Te escribió
            </span>
            {connection.message}
          </>
        ) : (
          connection.message
        )}
      </p>
      {!expanded && connection.message.length > 140 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-[11px] text-[var(--p)] font-semibold self-start -mt-1"
        >
          Ver más
        </button>
      ) : null}

      {isAccepted ? (
        <div className="card-footer-row">
          <span className="text-[11px] text-[var(--text3)] break-words [overflow-wrap:anywhere]">
            {connection.acceptedAt
              ? `Activa desde ${connection.acceptedAt}`
              : `Recibida ${connection.receivedAt}`}
          </span>
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
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            variant="primary"
            size="md"
            className="flex-1 justify-center min-h-[40px]"
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
            className="flex-1 justify-center min-h-[40px]"
            onClick={onIgnore}
            disabled={accepting}
          >
            <IconX size={12} />
            Ignorar
          </Button>
        </div>
      )}
    </Card>
  )
}
