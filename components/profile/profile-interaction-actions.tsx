"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Drawer, DrawerHeader } from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/input"
import { ReportUserDrawer } from "@/components/report/report-user-drawer"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  countAcceptedConnectionsForProfile,
  fetchPeerConnectionHints,
  sendConnectionRequest,
  type PeerConnectionHint,
} from "@/lib/data/connections"
import {
  clearProfileRecommendation,
  fetchMyRecommendationsForProfiles,
  setProfileRecommendation,
} from "@/lib/data/recommendations"
import { profilePublicPath, profilePublicUrl } from "@/lib/profile-path"
import { safeInternalPath } from "@/lib/safe-internal-path"
import type { ProfileRecommendationVote } from "@/lib/recommendation-types"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import {
  FREE_MAX_ACCEPTED_CONNECTIONS,
  isPremiumPlan,
  MSG_FREE_CONNECTION_SEND_LIMIT,
} from "@/lib/plan-limits"
import { RELATION_LABELS, type Profile, type RelationType } from "@/lib/types"
import { IconHeart, IconHeartOff } from "@/components/icons"

interface ProfileInteractionActionsProps {
  profile: Profile
  onClose?: () => void
  connectionHint?: PeerConnectionHint
  onConnectionsChanged?: () => void
  myRecommendationVote?: ProfileRecommendationVote | null
  onRecommendationChange?: (
    vote: ProfileRecommendationVote | null,
    recommendationCount: number
  ) => void
  loadConnectionHint?: boolean
}

function generateMessage(profile: Profile) {
  return `Hola ${profile.name.split(" ")[0]}, vi tu perfil en Murmur y resuena mucho con lo que estoy buscando. Me gustaría platicar 20-30 min para entender mejor en qué estás y ver si tiene sentido construir juntos. ¿Tienes disponibilidad esta semana?`
}

export function ProfileInteractionActions({
  profile,
  onClose,
  connectionHint: connectionHintProp,
  onConnectionsChanged,
  myRecommendationVote: myRecommendationVoteProp = null,
  onRecommendationChange,
  loadConnectionHint = false,
}: ProfileInteractionActionsProps) {
  const router = useRouter()
  const { user: authUser, profile: myProfile } = useCurrentUser()
  const [connectionHint, setConnectionHint] = React.useState<PeerConnectionHint>(
    connectionHintProp ?? { state: "none" }
  )
  const [acceptedCount, setAcceptedCount] = React.useState<number | null>(null)
  const [connectOpen, setConnectOpen] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [connectRelation, setConnectRelation] = React.useState<
    RelationType | null
  >(null)
  const [sending, setSending] = React.useState(false)
  const [sendError, setSendError] = React.useState<string | null>(null)
  const [reportOpen, setReportOpen] = React.useState(false)
  const [recommendationVote, setRecommendationVote] =
    React.useState<ProfileRecommendationVote | null>(myRecommendationVoteProp)
  const [recommendationSaving, setRecommendationSaving] = React.useState(false)
  const [recommendationError, setRecommendationError] = React.useState<
    string | null
  >(null)
  const [shareDone, setShareDone] = React.useState(false)

  React.useEffect(() => {
    if (connectionHintProp) setConnectionHint(connectionHintProp)
  }, [connectionHintProp])

  React.useEffect(() => {
    setRecommendationVote(myRecommendationVoteProp)
  }, [myRecommendationVoteProp, profile.id])

  React.useEffect(() => {
    if (!loadConnectionHint || !authUser?.id) return
    const supabase = getSupabaseBrowserClient()
    void fetchPeerConnectionHints(supabase, authUser.id).then((hints) => {
      setConnectionHint(hints.get(profile.id) ?? { state: "none" })
    })
    void fetchMyRecommendationsForProfiles(supabase, [profile.id]).then((map) => {
      setRecommendationVote(map.get(profile.id) ?? null)
    })
  }, [loadConnectionHint, authUser?.id, profile.id])

  React.useEffect(() => {
    if (!authUser?.id) {
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
  }, [authUser?.id])

  React.useEffect(() => {
    setMessage(generateMessage(profile))
    const opts =
      profile.relationsLooking.length > 0
        ? profile.relationsLooking
        : (["abierto"] as RelationType[])
    setConnectRelation(opts[0] ?? "abierto")
    setSendError(null)
  }, [profile])

  const isSelf = Boolean(authUser?.id && profile.id === authUser.id)
  const profilePath = profilePublicPath(profile.id)
  const loginNext = safeInternalPath(profilePath, profilePath)

  const connectionCapReached =
    Boolean(myProfile) &&
    !isPremiumPlan(myProfile?.plan) &&
    acceptedCount !== null &&
    acceptedCount >= FREE_MAX_ACCEPTED_CONNECTIONS

  const handleRecommendationClick = (vote: ProfileRecommendationVote) => {
    void (async () => {
      if (!authUser?.id) return
      const togglingOff = recommendationVote === vote
      setRecommendationSaving(true)
      setRecommendationError(null)
      const supabase = getSupabaseBrowserClient()
      const res = togglingOff
        ? await clearProfileRecommendation(supabase, authUser.id, profile.id)
        : await setProfileRecommendation(
            supabase,
            authUser.id,
            profile.id,
            vote
          )
      setRecommendationSaving(false)
      if (!res.ok) {
        setRecommendationError(res.error)
        return
      }
      const nextVote = togglingOff ? null : vote
      setRecommendationVote(nextVote)
      onRecommendationChange?.(nextVote, res.recommendationCount)
    })()
  }

  async function handleShare() {
    const url = profilePublicUrl(profile.id)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile.name} en Murmur`,
          text: profile.role,
          url,
        })
        return
      }
      await navigator.clipboard.writeText(url)
      setShareDone(true)
      window.setTimeout(() => setShareDone(false), 2000)
    } catch {
      /* usuario canceló share */
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {connectionCapReached && authUser?.id ? (
          <p className="text-[11px] text-[var(--text2)] leading-snug">
            {MSG_FREE_CONNECTION_SEND_LIMIT}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {onClose ? (
            <Button
              variant="secondary"
              size="lg"
              className="flex-1 min-w-[120px] justify-center"
              onClick={onClose}
            >
              Cerrar
            </Button>
          ) : null}

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className={cn(
              "justify-center",
              onClose ? "flex-1 min-w-[120px]" : "w-full sm:w-auto sm:flex-1"
            )}
            onClick={() => void handleShare()}
          >
            {shareDone ? "Enlace copiado" : "Compartir perfil"}
          </Button>

          {!authUser?.id ? (
            <>
              <Link
                href={`/auth/login?next=${encodeURIComponent(loginNext)}`}
                className={cn(
                  buttonVariants({ variant: "primary", size: "lg" }),
                  "flex-1 min-w-[120px] justify-center no-underline"
                )}
              >
                Iniciar sesión para conectar
              </Link>
              <Link
                href={`/auth/signup?next=${encodeURIComponent(loginNext)}`}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "flex-1 min-w-[120px] justify-center no-underline"
                )}
              >
                Crear cuenta
              </Link>
            </>
          ) : isSelf ? null : connectionHint.state === "none" ? (
            <Button
              size="lg"
              className="flex-1 min-w-[120px] justify-center"
              disabled={connectionCapReached}
              onClick={() => {
                setSendError(null)
                setConnectOpen(true)
              }}
            >
              Conectar
            </Button>
          ) : connectionHint.state === "connected" ? (
            <Link
              href={
                connectionHint.chatId
                  ? `/messages/${connectionHint.chatId}`
                  : "/messages"
              }
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "flex-1 min-w-[120px] justify-center no-underline"
              )}
              onClick={onClose}
            >
              Ir al chat
            </Link>
          ) : connectionHint.state === "request_sent" ? (
            <Button size="lg" className="flex-1 min-w-[120px] justify-center" disabled>
              Solicitud enviada
            </Button>
          ) : (
            <Link
              href="/connections?tab=received"
              className={cn(
                buttonVariants({ variant: "primary", size: "lg" }),
                "flex-1 min-w-[120px] justify-center no-underline"
              )}
              onClick={onClose}
            >
              Ver solicitud
            </Link>
          )}
        </div>

        {!isSelf && authUser?.id ? (
          <div className="flex flex-col gap-2">
            <p className="text-[11px] uppercase tracking-wide text-[var(--text3)]">
              Tu señal
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={
                  recommendationVote === "recommend" ? "primary" : "secondary"
                }
                size="sm"
                className="flex-1 min-h-[40px]"
                disabled={recommendationSaving}
                aria-pressed={recommendationVote === "recommend"}
                onClick={() => handleRecommendationClick("recommend")}
              >
                <IconHeart size={14} className="mr-1.5" />
                Recomendar
              </Button>
              <Button
                type="button"
                variant={
                  recommendationVote === "not_recommend"
                    ? "primary"
                    : "secondary"
                }
                size="sm"
                className="flex-1 min-h-[40px]"
                disabled={recommendationSaving}
                aria-pressed={recommendationVote === "not_recommend"}
                onClick={() => handleRecommendationClick("not_recommend")}
              >
                <IconHeartOff size={14} className="mr-1.5" />
                No recomendar
              </Button>
            </div>
            {recommendationError ? (
              <p className="text-[11px] text-red-600 dark:text-red-400">
                {recommendationError}
              </p>
            ) : null}
          </div>
        ) : null}

        {!isSelf && authUser?.id ? (
          <button
            type="button"
            onClick={() => setReportOpen(true)}
            className="text-[11px] text-[var(--text3)] hover:text-[var(--red)] transition-colors self-center"
          >
            Reportar perfil
          </button>
        ) : null}
      </div>

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
                onClose?.()
                onConnectionsChanged?.()
                const hints = await fetchPeerConnectionHints(supabase, authUser.id)
                setConnectionHint(
                  hints.get(profile.id) ?? {
                    state: "request_sent",
                    connectionId: "",
                  }
                )
                router.push("/connections?tab=sent")
              })()
            }}
          >
            {sending ? "Enviando…" : "Enviar solicitud"}
          </Button>
        </div>
      </Drawer>

      {!isSelf ? (
        <ReportUserDrawer
          open={reportOpen}
          onOpenChange={setReportOpen}
          reportedUserId={profile.id}
          reportedUserName={profile.name}
          contextType="profile"
        />
      ) : null}
    </>
  )
}
