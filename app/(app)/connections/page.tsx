"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tag } from "@/components/ui/tag"
import { ConnectionCardReceived } from "@/components/connections/connection-card-received"
import { ConnectionCardSent } from "@/components/connections/connection-card-sent"
import {
  chatIdForProfile,
  mockIgnoredConnections,
  mockReceivedConnections,
  mockSentConnections,
} from "@/lib/mock-data"
import {
  RELATION_LABELS,
  type IgnoredConnection,
  type ReceivedConnection,
  type SentConnection,
} from "@/lib/types"

export default function ConnectionsPage() {
  const router = useRouter()
  const [received, setReceived] = React.useState<ReceivedConnection[]>(
    mockReceivedConnections
  )
  const [sent, setSent] = React.useState<SentConnection[]>(mockSentConnections)
  const [ignored, setIgnored] = React.useState<IgnoredConnection[]>(
    mockIgnoredConnections
  )
  const [acceptingId, setAcceptingId] = React.useState<string | null>(null)
  const redirectTimer = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current)
    }
  }, [])

  function accept(c: ReceivedConnection) {
    if (acceptingId) return

    const chatId = chatIdForProfile(c.profile.id)
    setAcceptingId(c.id)
    redirectTimer.current = window.setTimeout(() => {
      setReceived((prev) => prev.filter((x) => x.id !== c.id))
      router.push(chatId ? `/messages/${chatId}` : "/messages")
    }, 1100)
  }

  function ignore(c: ReceivedConnection) {
    setReceived((prev) => prev.filter((x) => x.id !== c.id))
    setIgnored((prev) => [
      {
        id: `ignored-${c.id}`,
        profile: c.profile,
        relation: c.relation,
        ignoredAt: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ])
  }

  function cancel(id: string) {
    setSent((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full">
      <div className="mb-4 md:mb-5">
        <h2 className="md:hidden text-[18px] font-extrabold tracking-[-0.4px] mb-1">
          Conexiones
        </h2>
        <p className="text-[12px] text-[var(--text2)]">
          Recibidas, enviadas y solicitudes que ignoraste.
        </p>
      </div>

      <Tabs defaultValue="received">
        <TabsList>
          <TabsTrigger value="received">
            Recibidas
            {received.length > 0 && (
              <span className="ml-1.5 text-[10px] font-bold rounded-full px-1.5 bg-[var(--pl)] text-[var(--p)]">
                {received.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviadas</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          {received.length === 0 ? (
            <EmptyState
              title="Sin solicitudes nuevas"
              description="Las solicitudes que recibas aparecerán aquí."
            />
          ) : (
            received.map((c) => (
              <ConnectionCardReceived
                key={c.id}
                connection={c}
                onAccept={() => accept(c)}
                onIgnore={() => ignore(c)}
                accepting={acceptingId === c.id}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="sent">
          {sent.length === 0 ? (
            <EmptyState
              title="No has enviado solicitudes"
              description="Las solicitudes que envíes aparecerán aquí."
            />
          ) : (
            sent.map((c) => (
              <ConnectionCardSent
                key={c.id}
                connection={c}
                onCancel={() => cancel(c.id)}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="history">
          {ignored.length === 0 ? (
            <EmptyState
              title="Sin historial"
              description="Aquí verás solicitudes que ignoraste."
            />
          ) : (
            ignored.map((c) => (
              <Card
                key={c.id}
                padding="default"
                className="ds-fade-up flex items-center gap-3 opacity-75"
              >
                <Avatar
                  initials={c.profile.initials}
                  imageUrl={c.profile.photoUrl}
                  alt={`Foto de ${c.profile.name}`}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] font-semibold truncate">
                    {c.profile.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text3)]">
                    Ignorada · {c.ignoredAt}
                  </p>
                </div>
                <Tag variant="paused">{RELATION_LABELS[c.relation]}</Tag>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card padding="default" className="text-center py-10">
      <h3 className="text-[14px] font-bold mb-1">{title}</h3>
      <p className="text-[12px] text-[var(--text2)]">{description}</p>
    </Card>
  )
}
