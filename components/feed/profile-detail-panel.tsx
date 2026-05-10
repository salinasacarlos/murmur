"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerHeader, SidePanel } from "@/components/ui/drawer"
import { Tag } from "@/components/ui/tag"
import { Textarea } from "@/components/ui/input"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  countAcceptedConnectionsForProfile,
  sendConnectionRequest,
  type PeerConnectionHint,
} from "@/lib/data/connections"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  FREE_MAX_ACCEPTED_CONNECTIONS,
  isPremiumPlan,
  MSG_FREE_CONNECTION_SEND_LIMIT,
} from "@/lib/plan-limits"
import {
  AVAILABILITY_LABELS,
  COMPATIBILITY_COLORS,
  COMPATIBILITY_LABELS,
  EXPERIENCE_LABELS,
  RELATION_LABELS,
  WORK_STYLE_LABELS,
  type Profile,
  type RelationType,
} from "@/lib/types"
import {
  defaultIndustryForFunctionalArea,
  inferIndustryFromExpertiseSlugs,
  labelIndustrySlug,
  labelExpertiseSlug,
  labelTalentSlug,
} from "@/lib/profile-taxonomy"
import { labelProfileVerticalSlug } from "@/lib/industry-tree"
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
  /** Desde Descubrir: evita ofrecer conectar de nuevo si ya hay vínculo. */
  connectionHint?: PeerConnectionHint
  onConnectionsChanged?: () => void
}

export function ProfileDetailPanel({
  profile,
  open,
  onOpenChange,
  connectionHint = { state: "none" },
  onConnectionsChanged,
}: ProfileDetailPanelProps) {
  const router = useRouter()
  const { user: authUser, profile: myProfile } = useCurrentUser()
  const [acceptedCount, setAcceptedCount] = React.useState<number | null>(null)
  const [connectOpen, setConnectOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [connectRelation, setConnectRelation] = React.useState<
    RelationType | null
  >(null)
  const [sending, setSending] = React.useState(false)
  const [sendError, setSendError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!authUser?.id || !open) {
      setAcceptedCount(null)
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = getSupabaseBrowserClient()
      const n = await countAcceptedConnectionsForProfile(supabase, authUser.id)
      if (!cancelled) setAcceptedCount(n)
    })()
    return () => {
      cancelled = true
    }
  }, [authUser?.id, open])

  React.useEffect(() => {
    if (!profile) return
    setMessage(generateMessage(profile))
    const opts =
      profile.relationsLooking.length > 0
        ? profile.relationsLooking
        : (["abierto"] as RelationType[])
    setConnectRelation(opts[0] ?? "abierto")
    setSendError(null)
  }, [profile])

  if (!profile) return null

  const isSelf = Boolean(authUser?.id && profile.id === authUser.id)

  const connectionCapReached =
    Boolean(myProfile) &&
    !isPremiumPlan(myProfile?.plan) &&
    acceptedCount !== null &&
    acceptedCount >= FREE_MAX_ACCEPTED_CONNECTIONS

  const heroIndustrySlug =
    profile.primaryIndustrySlug ??
    inferIndustryFromExpertiseSlugs(
      profile.expertiseSlugs?.length
        ? profile.expertiseSlugs
        : profile.functionalAreaTags
    ) ??
    defaultIndustryForFunctionalArea(profile.area)
  const verticalPart =
    profile.verticalSlugs && profile.verticalSlugs.length > 0
      ? profile.verticalSlugs.map((s) => labelProfileVerticalSlug(s)).join(" · ")
      : null
  const expertisePart =
    profile.expertiseSlugs && profile.expertiseSlugs.length > 0
      ? profile.expertiseSlugs.map((s) => labelExpertiseSlug(s)).join(" · ")
      : "Sin definir"
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

            <Section
              title="Éxito o descripción breve"
              hint="Algo que te llene de orgullo y sume razones para conectar; sin exagerar."
            >
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
                  {verticalPart ? (
                    <>
                      <span className="text-[var(--text3)]"> · </span>
                      <span>{verticalPart}</span>
                    </>
                  ) : null}
                  <span className="text-[var(--text3)]"> · </span>
                  <span>{expertisePart}</span>
                  <span className="text-[var(--text3)]"> · </span>
                  {EXPERIENCE_LABELS[profile.experience]}
                </Row>
                {talentsLine ? (
                  <Row icon={<IconSpark size={14} />}>
                    <span className="text-[var(--text3)]">Soft skills: </span>
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
            className="border-t-[0.5px] border-[var(--border)] px-5 py-4 sticky bottom-0 bg-[var(--bg)] flex flex-col gap-2"
            style={{ paddingBottom: "calc(16px + var(--sab))" }}
          >
            {connectionCapReached ? (
              <p className="text-[11px] text-[var(--text2)] leading-snug">
                {MSG_FREE_CONNECTION_SEND_LIMIT}
              </p>
            ) : null}
            <div className="flex gap-2">
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 justify-center"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
            {connectionHint.state === "none" ? (
              <Button
                size="lg"
                className="flex-1 justify-center"
                disabled={isSelf || !authUser?.id || connectionCapReached}
                onClick={() => {
                  setSendError(null)
                  setConnectOpen(true)
                }}
              >
                Conectar
              </Button>
            ) : connectionHint.state === "connected" ? (
              connectionHint.chatId ? (
                <Link
                  href={`/messages/${connectionHint.chatId}`}
                  className={cn(
                    buttonVariants({ variant: "primary", size: "lg" }),
                    "flex-1 justify-center no-underline"
                  )}
                  onClick={() => onOpenChange(false)}
                >
                  Ir al chat
                </Link>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  className="flex-1 justify-center"
                  disabled
                >
                  Conectado
                </Button>
              )
            ) : connectionHint.state === "request_sent" ? (
              <Button size="lg" className="flex-1 justify-center" disabled>
                Solicitud enviada
              </Button>
            ) : (
              <Link
                href="/connections?tab=received"
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "flex-1 justify-center no-underline"
                )}
                onClick={() => onOpenChange(false)}
              >
                Ver solicitud
              </Link>
            )}
            </div>
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
          description="Elige el tipo de relación que propones y revisa el mensaje antes de enviar."
        />

        <div className="mb-3">
          <p className="text-[11px] uppercase tracking-wide text-[var(--text3)] mb-1.5">
            Tipo de relación
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(profile.relationsLooking.length > 0
              ? profile.relationsLooking
              : (["abierto"] as RelationType[])
            ).map((r: RelationType) => (
              <button
                key={r}
                type="button"
                onClick={() => setConnectRelation(r)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[12px] border transition-colors",
                  connectRelation === r
                    ? "bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] border-[var(--primary-solid)]"
                    : "bg-[var(--bg)] text-[var(--text2)] border-[var(--border)] hover:border-[var(--border2)]"
                )}
              >
                {RELATION_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-3"
        />

        {sendError ? (
          <p className="text-[12px] text-red-600 dark:text-red-400 mb-3">
            {sendError}
          </p>
        ) : null}

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 justify-center"
            disabled={sending}
            onClick={() => {
              setConnectOpen(false)
              setSendError(null)
            }}
          >
            Cancelar
          </Button>
          <Button
            size="lg"
            className="flex-1 justify-center"
            disabled={
              sending ||
              !authUser?.id ||
              isSelf ||
              !connectRelation ||
              !message.trim()
            }
            onClick={() => {
              void (async () => {
                if (!authUser?.id || !connectRelation || isSelf) return
                setSending(true)
                setSendError(null)
                const supabase = getSupabaseBrowserClient()
                const res = await sendConnectionRequest(supabase, {
                  senderId: authUser.id,
                  receiverId: profile.id,
                  relation: connectRelation,
                  message: message.trim(),
                  searchId: null,
                })
                setSending(false)
                if (!res.ok) {
                  setSendError(res.error)
                  return
                }
                setConnectOpen(false)
                onOpenChange(false)
                onConnectionsChanged?.()
                router.push("/connections?tab=sent")
              })()
            }}
          >
            {sending ? "Enviando…" : "Enviar solicitud"}
          </Button>
        </div>
      </Drawer>
    </>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="ds-label-uppercase mb-2">{title}</h4>
      {hint ? (
        <p className="text-[11px] text-[var(--text3)] mb-2 leading-snug">
          {hint}
        </p>
      ) : null}
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
