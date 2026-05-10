"use client"

import * as React from "react"

import { PublicFieldNotice } from "@/components/murm/public-field-notice"
import { Stepper } from "@/components/onboarding/stepper"
import { OnboardingCard } from "@/components/onboarding/onboarding-card"
import { IndustrySingleSelect } from "@/components/ui/industry-single-select"
import { ExpertiseMultiSelect } from "@/components/ui/expertise-multi-select"
import { TalentMultiSelect } from "@/components/ui/talent-multi-select"
import { HierarchicalIndustrySelector } from "@/components/ui/hierarchical-industry-selector"
import { Field, Input, Textarea } from "@/components/ui/input"
import { DEFAULT_INDUSTRY_DOMAIN_SLUG } from "@/lib/industry-tree"
import {
  persistOnboardingProfileStep,
  requireUserId,
} from "@/lib/onboarding-persist"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  AVAILABILITY_LABELS,
  EXPERIENCE_LABELS,
  WORK_STYLE_LABELS,
  type Availability,
  type ExperienceRange,
  type WorkStyle,
} from "@/lib/types"

const WORK_STYLES_ONBOARDING = (
  Object.keys(WORK_STYLE_LABELS) as WorkStyle[]
).filter((id) => id !== "rapido")

export default function ProfileStepPage() {
  const [name, setName] = React.useState("")
  const [jobTitle, setJobTitle] = React.useState("")
  const [bio, setBio] = React.useState("")
  const [funFact, setFunFact] = React.useState("")
  const [highlight, setHighlight] = React.useState("")
  const [primaryIndustrySlug, setPrimaryIndustrySlug] =
    React.useState<string | null>(null)
  const [expertiseSlugs, setExpertiseSlugs] = React.useState<string[]>([])
  const [talentSlugs, setTalentSlugs] = React.useState<string[]>([])
  const [experience, setExperience] = React.useState<ExperienceRange | null>(
    null
  )
  const [availability, setAvailability] = React.useState<Availability | null>(
    null
  )
  const [workStyle, setWorkStyle] = React.useState<WorkStyle[]>([])
  const [industries, setIndustries] = React.useState<string[]>([])
  const [, setIndustryBrowseDomain] = React.useState(
    DEFAULT_INDUSTRY_DOMAIN_SLUG
  )

  function toggleArr<T extends string>(
    list: T[],
    setList: (v: T[]) => void,
    value: T
  ) {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper current={4} total={6} />
      <OnboardingCard
        title="Cuéntanos quién eres"
        description="Información para el matching. Tú eliges cuándo mostrarte. Los detalles de tu proyecto u oportunidad los puedes refinar después en una búsqueda."
        back="/onboarding/relationships"
        next="/onboarding/location"
        nextDisabled={
          !primaryIndustrySlug ||
          expertiseSlugs.length === 0 ||
          experience == null ||
          availability == null ||
          !name.trim() ||
          !jobTitle.trim()
        }
        onBeforeNext={async () => {
          if (experience == null || availability == null) return false
          const supabase = getSupabaseBrowserClient()
          const uid = await requireUserId(supabase)
          if (!uid) return false
          const r = await persistOnboardingProfileStep(supabase, uid, {
            name,
            jobTitle,
            bio,
            funFact,
            achievement: highlight,
            primaryIndustrySlug: primaryIndustrySlug!,
            expertiseSlugs,
            talentSlugs,
            experience,
            availability,
            workStyle,
            industries,
          })
          if (!r.ok) {
            console.error(r.error)
            return false
          }
        }}
      >
        <Field label="Nombre" required>
          <PublicFieldNotice className="mb-1" compact />
          <Input
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Título o rol actual" required>
          <PublicFieldNotice className="mb-1" compact />
          <Input
            placeholder="ej. Senior Product Engineer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </Field>

        <Field
          label="Bio corta"
          hint={`${bio.length}/200 caracteres`}
        >
          <PublicFieldNotice className="mb-1" />
          <Textarea
            placeholder="Una o dos líneas sobre ti..."
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 200))}
            rows={3}
          />
        </Field>

        <Field
          label="Dato curioso (opcional)"
          hint={`${funFact.length}/500 · Párrafo corto que te humanice en el perfil`}
        >
          <PublicFieldNotice className="mb-1" />
          <Textarea
            placeholder="Un hobby raro, un viaje memorable, algo que sorprenda en buen sentido…"
            value={funFact}
            onChange={(e) => setFunFact(e.target.value.slice(0, 500))}
            rows={4}
          />
        </Field>

        <Field
          label="Tu industria"
          required
          hint="Solo una: el sector donde te mueves (ej. tecnología, salud, educación)."
        >
          <PublicFieldNotice className="mb-1" compact />
          <IndustrySingleSelect
            value={primaryIndustrySlug}
            onChange={(slug) => {
              setPrimaryIndustrySlug(slug)
              setExpertiseSlugs([])
            }}
          />
        </Field>

        <Field
          label="Expertise en esa industria"
          required
          hint="Hasta 5: vertical u oficio concreto dentro de la industria elegida."
        >
          <PublicFieldNotice className="mb-1" compact />
          <ExpertiseMultiSelect
            industrySlug={primaryIndustrySlug}
            value={expertiseSlugs}
            onChange={setExpertiseSlugs}
            footerNote="La primera expertise define el matiz principal para matching."
          />
        </Field>

        <Field
          label="Talentos"
          hint="Hasta 5: cómo aportas o trabajas (transversal, no es industria)."
        >
          <PublicFieldNotice className="mb-1" compact />
          <TalentMultiSelect value={talentSlugs} onChange={setTalentSlugs} />
        </Field>

        <Field label="Años de experiencia" required>
          <PublicFieldNotice className="mb-1" compact />
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(EXPERIENCE_LABELS) as ExperienceRange[]).map((id) => (
              <ChipChoice
                key={id}
                label={EXPERIENCE_LABELS[id]}
                selected={experience === id}
                onClick={() => setExperience(id)}
              />
            ))}
          </div>
        </Field>

        <Field
          label="Éxito o descripción breve para tu card"
          hint={`${highlight.length}/120 caracteres · Esto aparecerá en el feed`}
        >
          <PublicFieldNotice className="mb-1" />
          <Input
            placeholder="ej. Llevé una app de 0 a 100k usuarios"
            value={highlight}
            onChange={(e) => setHighlight(e.target.value.slice(0, 120))}
          />
        </Field>

        <Field label="Disponibilidad" required>
          <PublicFieldNotice className="mb-1" compact />
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(AVAILABILITY_LABELS) as Availability[]).map((id) => (
              <ChipChoice
                key={id}
                label={AVAILABILITY_LABELS[id]}
                selected={availability === id}
                onClick={() => setAvailability(id)}
              />
            ))}
          </div>
        </Field>

        <Field label="Forma de trabajar (multi)">
          <PublicFieldNotice className="mb-1" compact />
          <div className="flex flex-wrap gap-1.5">
            {WORK_STYLES_ONBOARDING.map((id) => (
              <ChipChoice
                key={id}
                label={WORK_STYLE_LABELS[id]}
                selected={workStyle.includes(id)}
                onClick={() => toggleArr(workStyle, setWorkStyle, id)}
              />
            ))}
          </div>
        </Field>

        <Field label="Industrias de afinidad (multi)">
          <PublicFieldNotice className="mb-1" compact />
          <HierarchicalIndustrySelector
            value={industries}
            onChange={setIndustries}
            onActiveDomainChange={setIndustryBrowseDomain}
          />
        </Field>
      </OnboardingCard>
    </div>
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
