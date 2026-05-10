"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerHeader, SidePanel } from "@/components/ui/drawer"
import { Tag } from "@/components/ui/tag"
import { Textarea } from "@/components/ui/input"
import {
  AREA_LABELS,
  AVAILABILITY_LABELS,
  COMPATIBILITY_COLORS,
  COMPATIBILITY_LABELS,
  EXPERIENCE_LABELS,
  RELATION_LABELS,
  WORK_STYLE_LABELS,
  type Profile,
} from "@/lib/types"
import {
  defaultIndustryForFunctionalArea,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
} from "@/lib/profile-taxonomy"
import {
  IconMapPin,
  IconBriefcase,
  IconClock,
  IconX,
  IconSpark,
} from "@/components/icons"

interface ProfileDetailPanelProps {
  profile: Profile | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDetailPanel({
  profile,
  open,
  onOpenChange,
}: ProfileDetailPanelProps) {
  const [connectOpen, setConnectOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [messageProfileId, setMessageProfileId] = React.useState<string | null>(
    null
  )

  if (profile && messageProfileId !== profile.id) {
    setMessageProfileId(profile.id)
    setMessage(generateMessage(profile))
  }

  if (!profile) return null

  const heroIndustrySlug =
    profile.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      profile.expertiseSlugs?.length
        ? profile.expertiseSlugs
        : profile.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(profile.area)
  const heroExpertise =
    profile.expertiseSlugs?.length
      ? profile.expertiseSlugs
      : (profile.functionalAreaTags ?? [])
  const expertiseLine =
    heroExpertise.length > 0
      ? heroExpertise.map((s) => labelExpertiseSlug(s)).join(" · ")
      : AREA_LABELS[profile.area]
  const talentsLine =
    profile.talentSlugs && profile.talentSlugs.length > 0
      ? profile.talentSlugs.map((s) => labelTalentSlug(s)).join(" · ")
      : null

  return (
    <>
      <SidePanel
        open={open}
        onOpenChange={onOpenChange}
        ariaLabel={`Perfil de ${profile.name}`}
      >
        <div className="flex flex-col h-full">
          <div
            className="flex items-center justify-between px-5 py-4 border-b-[0.5px] border-[var(--border)] sticky top-0 bg-[var(--bg)]"
            style={{ paddingTop: "calc(16px + var(--sat))" }}
          >
            <h2 className="text-[16px] font-bold tracking-[-0.3px]">
              Perfil
            </h2>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-md hover:bg-[var(--bg2)] text-[var(--text2)]"
              aria-label="Cerrar"
            >
              <IconX size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Avatar
                initials={profile.initials}
                imageUrl={profile.photoUrl}
                alt={`Foto de ${profile.name}`}
                size="xl"
                online={profile.online}
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-[18px] font-extrabold tracking-[-0.4px]">
                  {profile.name}
                </h3>
                <p className="text-[13px] text-[var(--text2)] mt-0.5">
                  {profile.role}
                </p>
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.05em] mt-2"
                  style={{ color: COMPATIBILITY_COLORS[profile.compatibility] }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: COMPATIBILITY_COLORS[profile.compatibility],
                    }}
                  />
                  {COMPATIBILITY_LABELS[profile.compatibility]}
                </span>
              </div>
            </div>

            <Section title="Bio">
              <p className="text-[13px] text-[var(--text)] leading-relaxed">
                {profile.bio}
              </p>
            </Section>

            {profile.funFact.trim() ? (
              <Section title="Dato curioso">
                <p className="text-[13px] text-[var(--text)] leading-relaxed whitespace-pre-wrap">
                  {profile.funFact}
                </p>
              </Section>
            ) : null}

            <Section title="Éxito o descripción breve">
              <div className="flex items-start gap-2">
                <IconSpark size={14} className="mt-0.5 text-[var(--p)]" />
                <p className="text-[13px] text-[var(--text)]">
                  {profile.achievement}
                </p>
              </div>
            </Section>

            <Section title="Sobre su trabajo">
              <div className="flex flex-col gap-2.5">
                <Row icon={<IconBriefcase size={14} />}>
                  <span className="font-medium text-[var(--text)]">
                    {labelIndustrySlug(heroIndustrySlug)}
                  </span>
                  <span className="text-[var(--text3)]"> · </span>
                  <span>{expertiseLine}</span>
                  <span className="text-[var(--text3)]"> · </span>
                  {EXPERIENCE_LABELS[profile.experience]}
                </Row>
                {talentsLine ? (
                  <Row icon={<IconSpark size={14} />}>
                    <span className="text-[var(--text3)]">Talentos: </span>
                    {talentsLine}
                  </Row>
                ) : null}
                <Row icon={<IconClock size={14} />}>
                  {AVAILABILITY_LABELS[profile.availability]}
                </Row>
                <Row icon={<IconMapPin size={14} />}>
                  {profile.city}
                  {profile.cities && profile.cities.length > 0 && (
                    <span className="text-[var(--text3)]">
                      {" "}
                      · también {profile.cities.join(", ")}
                    </span>
                  )}
                </Row>
              </div>
            </Section>

            <Section title="Forma de trabajar">
              <div className="flex flex-wrap gap-1.5">
                {profile.workStyle.map((w) => (
                  <Tag key={w} variant="neutral">
                    {WORK_STYLE_LABELS[w]}
                  </Tag>
                ))}
              </div>
            </Section>

            <Section title="Industrias de afinidad">
              <div className="flex flex-wrap gap-1.5">
                {profile.industries.map((i) => (
                  <Tag key={i} variant="green">
                    {i}
                  </Tag>
                ))}
              </div>
            </Section>

            <Section title="Tipos de relación que busca">
              <div className="flex flex-wrap gap-1.5">
                {profile.relationsLooking.map((r) => (
                  <Tag key={r} variant="brand">
                    {RELATION_LABELS[r]}
                  </Tag>
                ))}
              </div>
            </Section>
          </div>

          <div
            className="border-t-[0.5px] border-[var(--border)] px-5 py-4 sticky bottom-0 bg-[var(--bg)] flex gap-2"
            style={{ paddingBottom: "calc(16px + var(--sab))" }}
          >
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 justify-center"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
            <Button
              size="lg"
              className="flex-1 justify-center"
              onClick={() => setConnectOpen(true)}
            >
              Conectar
            </Button>
          </div>
        </div>
      </SidePanel>

      <Drawer
        open={connectOpen}
        onOpenChange={setConnectOpen}
        ariaLabel="Enviar solicitud de conexión"
      >
        <DrawerHeader
          title={`Conectar con ${profile.name.split(" ")[0]}`}
          description="Edita el mensaje generado o envíalo tal cual."
        />

        <Textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-4"
        />

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            onClick={() => setConnectOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            onClick={() => {
              setConnectOpen(false)
              onOpenChange(false)
            }}
          >
            Enviar solicitud
          </Button>
        </div>
      </Drawer>
    </>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="ds-label-uppercase mb-2">{title}</h4>
      {children}
    </div>
  )
}

function Row({
  icon,
  children,
}: {
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-[var(--text)]">
      <span className="text-[var(--text2)]">{icon}</span>
      <span>{children}</span>
    </div>
  )
}

function generateMessage(profile: Profile) {
  return `Hola ${profile.name.split(" ")[0]}, vi tu perfil en Murmur y resuena mucho con lo que estoy buscando. Me gustaría platicar 20-30 min para entender mejor en qué estás y ver si tiene sentido construir juntos. ¿Tienes disponibilidad esta semana?`
}
