"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Avatar } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tag } from "@/components/ui/tag"
import { ConnectionCardReceived } from "@/components/connections/connection-card-received"
import { ConnectionCardSent } from "@/components/connections/connection-card-sent"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { putConnectionsBoard, peekConnectionsBoard } from "@/lib/connections-board-cache"
import {
  acceptConnectionRpc,
  cancelPendingConnection,
  fetchConnectionsBoard,
  ignoreConnectionRpc,
} from "@/lib/data/connections"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  RELATION_LABELS,
  type IgnoredConnection,
  type ReceivedConnection,
  type SentConnection,
} from "@/lib/types"

export function ConnectionsClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useCurrentUser()
  const [tab, setTab] = React.useState<
    "received" | "sent" | "history"
  >("received")
  const [received, setReceived] = React.useState<ReceivedConnection[]>([])
  const [sent, setSent] = React.useState<SentConnection[]>([])
  const [ignored, setIgnored] = React.useState<IgnoredConnection[]>([])
  const [loading, setLoading] = React.useState(true)
  const [acceptingId, setAcceptingId] = React.useState<string | null>(null)
  const redirectTimer = React.useRef<number | null>(null)

  React.useLayoutEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }
    const c = peekConnectionsBoard(user.id)
    if (c) {
      setReceived(c.received)
      setSent(c.sent)
      setIgnored(c.ignored)
      setLoading(false)
    }
  }, [user?.id])

  React.useEffect(() => {
    const t = searchParams.get("tab")
    if (t === "sent" || t === "received" || t === "history") {
      setTab(t)
    }
  }, [searchParams])

  function handleTabChange(v: string) {
    const next = v as typeof tab
    setTab(next)
    const p = new URLSearchParams(searchParams.toString())
    p.set("tab", next)
    const qs = p.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  async function reload() {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    const board = await fetchConnectionsBoard(supabase, user.id)
    setReceived(board.received)
    setSent(board.sent)
    setIgnored(board.ignored)
    putConnectionsBoard(user.id, board)
  }

  React.useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      const cached = peekConnectionsBoard(user.id)
      const hasCache =
        cached &&
        (cached.received.length > 0 ||
          cached.sent.length > 0 ||
          cached.ignored.length > 0)
      if (!hasCache) setLoading(true)
      await reload()
      if (!cancelled) setLoading(false)
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload uses current user id
  }, [user?.id])

  React.useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current)
    }
  }, [])

  async function accept(c: ReceivedConnection) {
    if (acceptingId || !user?.id) return

    setAcceptingId(c.id)
    const supabase = getSupabaseBrowserClient()
    const res = await acceptConnectionRpc(supabase, c.id)
    if (!res.ok) {
      setAcceptingId(null)
      console.error(res.message)
      return
    }

    redirectTimer.current = window.setTimeout(() => {
      setAcceptingId(null)
      setReceived((prev) => prev.filter((x) => x.id !== c.id))
      router.push(res.chatId ? `/messages/${res.chatId}` : "/messages")
    }, 1100)
  }

  async function ignore(c: ReceivedConnection) {
    const supabase = getSupabaseBrowserClient()
    const res = await ignoreConnectionRpc(supabase, c.id)
    if (!res.ok) {
      console.error(res.error)
      return
    }
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

  async function cancel(id: string) {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    const res = await cancelPendingConnection(supabase, id, user.id)
    if (!res.ok) {
      console.error(res.error)
      return
    }
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

      {loading ? (
        <Card padding="default" className="text-center py-10">
          <p className="text-[12px] text-[var(--text2)]">Cargando…</p>
        </Card>
      ) : (
        <Tabs defaultValue="received" value={tab} onValueChange={handleTabChange}>
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
                  onAccept={() => void accept(c)}
                  onIgnore={() => void ignore(c)}
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
                  onCancel={() => void cancel(c.id)}
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
      )}
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
