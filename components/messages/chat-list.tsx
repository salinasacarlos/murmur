"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import { fetchChatsForProfile } from "@/lib/data/chats"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Chat } from "@/lib/types"
import { cn } from "@/lib/utils"

export function ChatList({ className }: { className?: string }) {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const [query, setQuery] = React.useState("")
  const [chats, setChats] = React.useState<Chat[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()
      const list = await fetchChatsForProfile(supabase, user.id)
      if (!cancelled) {
        setChats(list)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const filtered = chats.filter((c) =>
    c.profile.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <aside
      className={cn(
        "flex flex-col bg-[var(--bg)] border-r-[0.5px] border-[var(--border)] min-h-0",
        className
      )}
    >
      <div className="px-4 pt-4 pb-3 border-b-[0.5px] border-[var(--border)]">
        <h2 className="text-[16px] font-extrabold tracking-[-0.3px] mb-3 hidden md:block">
          Mensajes
        </h2>
        <Input
          placeholder="Buscar conversación..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-4 py-6 text-center">
            <p className="text-[12px] text-[var(--text3)]">Cargando…</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-[12px] text-[var(--text3)]">
              Sin conversaciones
            </p>
          </div>
        )}
        {!loading &&
          filtered.map((chat) => {
            const last = chat.messages[chat.messages.length - 1]
            const active = pathname === `/messages/${chat.id}`
            return (
              <Link
                key={chat.id}
                href={`/messages/${chat.id}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 border-b-[0.5px] border-[var(--border)] transition-colors",
                  active
                    ? "bg-[var(--pl)]"
                    : "hover:bg-[var(--bg2)]"
                )}
              >
                <Avatar
                  initials={chat.profile.initials}
                  imageUrl={chat.profile.photoUrl}
                  alt={`Foto de ${chat.profile.name}`}
                  size="md"
                  online={chat.profile.online}
                  unread={chat.unread > 0}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-[13px] font-semibold truncate",
                        active ? "text-[var(--p)]" : "text-[var(--text)]"
                      )}
                    >
                      {chat.profile.name}
                    </span>
                    <span className="text-[10px] text-[var(--text3)] flex-shrink-0">
                      {formatTime(last?.sentAt)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "text-[12px] truncate mt-0.5",
                      chat.unread > 0
                        ? "text-[var(--text)] font-medium"
                        : "text-[var(--text2)]"
                    )}
                  >
                    {last?.fromMe ? "Tú: " : ""}
                    {last?.text ?? "Sin mensajes"}
                  </p>
                </div>
              </Link>
            )
          })}
      </div>
    </aside>
  )
}

function formatTime(iso?: string) {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}
