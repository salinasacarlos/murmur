"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SearchCard } from "@/components/searches/search-card"
import { IconPlus } from "@/components/icons"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  deleteSearchForOwner,
  fetchSearchesForOwner,
  updateSearchStatus,
} from "@/lib/data/searches"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Search } from "@/lib/types"

export default function SearchesPage() {
  const { user } = useCurrentUser()
  const [searches, setSearches] = React.useState<Search[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const supabase = getSupabaseBrowserClient()
      const rows = await fetchSearchesForOwner(supabase, user.id)
      if (!cancelled) {
        setSearches(rows)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  async function toggleStatus(id: string) {
    if (!user?.id) return
    const target = searches.find((s) => s.id === id)
    if (!target) return
    const next =
      target.status === "active" ? ("paused" as const) : ("active" as const)
    const supabase = getSupabaseBrowserClient()
    const res = await updateSearchStatus(supabase, id, user.id, next)
    if (!res.ok) {
      console.error(res.error)
      return
    }
    setSearches((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: next } : s
      )
    )
  }

  async function remove(id: string) {
    if (!user?.id) return
    const supabase = getSupabaseBrowserClient()
    const res = await deleteSearchForOwner(supabase, id, user.id)
    if (!res.ok) {
      console.error(res.error)
      return
    }
    setSearches((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="px-4 md:px-6 py-5 md:py-6 max-w-[820px] mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="md:hidden text-[18px] font-extrabold tracking-[-0.4px]">
            Mis búsquedas
          </h2>
          <p className="text-[12px] text-[var(--text2)] mt-1">
            Gestiona tus búsquedas paralelas. Cada una alimenta el feed.
          </p>
        </div>
        <Link href="/searches/new">
          <Button size="md">
            <IconPlus size={14} />
            Nueva
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="ds-card p-10 text-center">
          <p className="text-[12px] text-[var(--text2)]">Cargando…</p>
        </div>
      ) : searches.length === 0 ? (
        <div className="ds-card p-10 text-center">
          <h3 className="text-[14px] font-bold mb-1">No tienes búsquedas</h3>
          <p className="text-[12px] text-[var(--text2)] mb-4">
            Crea una para empezar a recibir matches.
          </p>
          <Link href="/searches/new">
            <Button size="md">
              <IconPlus size={14} />
              Crear búsqueda
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {searches.map((s) => (
            <SearchCard
              key={s.id}
              search={s}
              onToggleStatus={() => void toggleStatus(s.id)}
              onDelete={() => void remove(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
