"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SearchCard } from "@/components/searches/search-card"
import { mockSearches } from "@/lib/mock-data"
import { IconPlus } from "@/components/icons"
import type { Search } from "@/lib/types"

export default function SearchesPage() {
  const [searches, setSearches] = React.useState<Search[]>(mockSearches)

  function toggleStatus(id: string) {
    setSearches((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "paused" : "active" }
          : s
      )
    )
  }

  function remove(id: string) {
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

      {searches.length === 0 ? (
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
              onToggleStatus={() => toggleStatus(s.id)}
              onDelete={() => remove(s.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
