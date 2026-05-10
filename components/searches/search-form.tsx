"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HierarchicalIndustrySelector } from "@/components/ui/hierarchical-industry-selector"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { Field, Input, Textarea } from "@/components/ui/input"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  countActiveSearchesForOwner,
  createSearch,
  updateSearch,
} from "@/lib/data/searches"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  PROFILE_FIELD_COPY,
  PROFILE_FIELD_HINTS,
} from "@/lib/profile-field-copy"
import { deriveEditableTaxonomy } from "@/lib/profile-taxonomy"
import { isPremiumPlan, MSG_FREE_SEARCH_LIMIT } from "@/lib/plan-limits"
import { cn } from "@/lib/utils"
import { RELATION_LABELS, type FunctionalArea, type RelationType, type Search } from "@/lib/types"

interface SearchFormProps {
  initial?: Search
  mode: "create" | "edit"
  searchId?: string
}

export function SearchForm({ initial, mode, searchId }: SearchFormProps) {
  const router = useRouter()
  const { user, profile } = useCurrentUser()

  const hydrated = React.useMemo(() => {
    if (!initial) {
      return {
        primaryIndustrySlug: null as string | null,
        expertiseSlugs: [] as string[],
        talentSlugs: [] as string[],
      }
    }
    const t = deriveEditableTaxonomy(initial)
    return {
      primaryIndustrySlug: t.primaryIndustrySlug,
      expertiseSlugs: t.expertiseSlugs,
      talentSlugs: [...(initial.talentSlugs ?? [])].slice(0, 5),
    }
  }, [initial])

  const [title, setTitle] = React.useState(initial?.title ?? "")
  const [description, setDescription] = React.useState(
    initial?.description ?? ""
  )
  const [relations, setRelations] = React.useState<RelationType[]>(
    initial?.relations ?? []
  )
  const [primaryIndustrySlug, setPrimaryIndustrySlug] =
    React.useState<string | null>(() => hydrated.primaryIndustrySlug)
  const [expertiseSlugs, setExpertiseSlugs] = React.useState<string[]>(
    () => hydrated.expertiseSlugs
  )
  const [talentSlugs, setTalentSlugs] = React.useState<string[]>(
    () => hydrated.talentSlugs
  )

  const fromUserTaxonomy = React.useMemo(
    () =>
      profile
        ? deriveEditableTaxonomy({
            primaryIndustrySlug: profile.primary_industry_slug,
            expertiseSlugs: profile.expertise_slugs ?? undefined,
            functionalAreaTags: profile.functional_area_tags ?? undefined,
            area: (profile.area ?? "negocio") as FunctionalArea,
          })
        : { primaryIndustrySlug: null as string | null, expertiseSlugs: [] as string[] },
    [profile]
  )

  React.useEffect(() => {
    if (mode !== "create" || !profile) return
    setPrimaryIndustrySlug((prev) => prev ?? fromUserTaxonomy.primaryIndustrySlug)
    setExpertiseSlugs((prev) =>
      prev.length > 0 ? prev : fromUserTaxonomy.expertiseSlugs
    )
    setTalentSlugs((prev) =>
      prev.length > 0 ? prev : [...(profile.talent_slugs ?? [])].slice(0, 5)
    )
  }, [mode, profile, fromUserTaxonomy])
  const [industries, setIndustries] = React.useState<string[]>(
    initial?.industries ?? []
  )
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [activeSearchCount, setActiveSearchCount] = React.useState<number | null>(
    null
  )

  React.useEffect(() => {
    if (mode !== "create" || !user?.id) {
      setActiveSearchCount(null)
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const n = await countActiveSearchesForOwner(supabase, user.id)
      if (!cancelled) setActiveSearchCount(n)
    })()
    return () => {
      cancelled = true
    }
  }, [mode, user?.id])

  function toggleArr<T extends string>(
    list: T[],
    setList: (v: T[]) => void,
    value: T
  ) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  }

  async function save() {
    setError(null)
    if (!user?.id) {
      setError("Inicia sesión para continuar.")
      return
    }
    if (!title.trim() || !description.trim() || relations.length === 0) {
      setError("Completa título, descripción y al menos un tipo de relación.")
      return
    }

    setSaving(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const payload = {
        title,
        description,
        relations,
        primaryIndustrySlug,
        expertiseSlugs,
        talentSlugs,
        industryLabels: industries,
      }

      if (mode === "create") {
        const res = await createSearch(supabase, user.id, payload)
        if (!res.ok) {
          setError(res.error)
          return
        }
        router.push("/searches")
        return
      }

      if (!searchId) {
        setError("Falta el identificador de la búsqueda.")
        return
      }

      const res = await updateSearch(supabase, searchId, user.id, payload)
      if (!res.ok) {
        setError(res.error ?? "No se pudo guardar")
        return
      }
      router.push("/searches")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card padding="none" className="bg-[var(--bg)] p-6 md:p-8 max-w-[640px] mx-auto">
      <h1 className="text-[20px] font-extrabold tracking-[-0.4px] mb-1">
        {mode === "create" ? "Nueva búsqueda" : "Editar búsqueda"}
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6 leading-relaxed">
        Cada búsqueda genera sus propios matches en el feed. Puedes tener
        varias activas a la vez.
      </p>

      {error ? (
        <p className="text-[12px] text-[var(--red)] mb-4">{error}</p>
      ) : null}

      {mode === "create" &&
      profile &&
      !isPremiumPlan(profile.plan) &&
      activeSearchCount !== null &&
      activeSearchCount >= 1 ? (
        <p className="text-[12px] text-[var(--text2)] mb-4 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg2)]">
          {MSG_FREE_SEARCH_LIMIT}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 mb-6">
        <Field label="Título descriptivo" required>
          <Input
            placeholder="ej. Co-founder técnico (CTO)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Descripción" required>
          <Textarea
            placeholder="Describe en una o dos líneas qué buscas, qué ofreces y cualquier filtro importante..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field label="Tipo de relación" required>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(RELATION_LABELS) as RelationType[]).map((id) => (
              <ChipChoice
                key={id}
                label={RELATION_LABELS[id]}
                selected={relations.includes(id)}
                onClick={() => toggleArr(relations, setRelations, id)}
              />
            ))}
          </div>
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.industryPrincipal}
          hint={PROFILE_FIELD_HINTS.industryOptionalShort}
        >
          <IndustrySingleSelect
            value={primaryIndustrySlug}
            onChange={(slug) => {
              setPrimaryIndustrySlug(slug)
              setExpertiseSlugs([])
            }}
          />
          {primaryIndustrySlug ? (
            <button
              type="button"
              className="text-[11px] text-[var(--p)] underline font-medium self-start"
              onClick={() => {
                setPrimaryIndustrySlug(null)
                setExpertiseSlugs([])
                setIndustries([])
              }}
            >
              Quitar industria, verticales y afinidad
            </button>
          ) : null}
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.verticales}
          hint={PROFILE_FIELD_HINTS.verticalesOptional}
        >
          <ExpertiseMultiSelect
            industrySlug={primaryIndustrySlug}
            value={expertiseSlugs}
            onChange={setExpertiseSlugs}
            footerNote="Opcional. Mismo catálogo que tus Verticales en el perfil."
          />
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.talentos}
          hint={PROFILE_FIELD_HINTS.talentosOptional}
        >
          <TalentMultiSelect value={talentSlugs} onChange={setTalentSlugs} />
        </Field>

        <Field
          label={PROFILE_FIELD_COPY.verticalesAfinidad}
          hint={PROFILE_FIELD_HINTS.verticalesAfinidadOptional}
        >
          <HierarchicalIndustrySelector
            value={industries}
            onChange={setIndustries}
          />
        </Field>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Link href="/searches">
          <Button variant="ghost" size="md">
            Cancelar
          </Button>
        </Link>
        <Button
          size="lg"
          disabled={
            saving ||
            (mode === "create" &&
              !!profile &&
              !isPremiumPlan(profile.plan) &&
              activeSearchCount !== null &&
              activeSearchCount >= 1)
          }
          onClick={() => void save()}
        >
          {saving
            ? "Guardando…"
            : mode === "create"
              ? "Crear búsqueda"
              : "Guardar cambios"}
        </Button>
      </div>
    </Card>
  )
}

function ChipChoice({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-full text-[12px] border transition-colors",
        selected
          ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)]"
          : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)] hover:text-[var(--text)]"
      )}
    >
      {label}
    </button>
  )
}
