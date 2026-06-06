"use client"

import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import { initialsFromName } from "@/lib/current-user-mapping"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type InviteeRow = {
  name: string
  photo_url: string | null
  role: string
}

type InvitationRow = {
  id: string
  code: string
  status: string
  used_at: string | null
  invitee: InviteeRow | null
}

export function MyInvitationsSection({
  userId,
  embedInPage = false,
}: {
  userId: string
  embedInPage?: boolean
}) {
  const [rows, setRows] = React.useState<InvitationRow[] | null>(null)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const reload = React.useCallback(async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error: qErr } = await supabase
      .from("invitations")
      .select(
        `
        id,
        code,
        status,
        used_at,
        invitee:profiles!invitations_invitee_id_fkey ( name, photo_url, role )
      `
      )
      .eq("inviter_id", userId)
      .order("created_at", { ascending: true })

    if (qErr) {
      setError(qErr.message)
      setRows([])
      return
    }
    const normalized: InvitationRow[] = (data ?? []).map((r) => {
      const raw = r as {
        id: string
        code: string
        status: string
        used_at: string | null
        invitee: InviteeRow | InviteeRow[] | null
      }
      const inv = raw.invitee
      const invitee =
        Array.isArray(inv) ? inv[0] ?? null : inv ?? null
      return {
        id: raw.id,
        code: raw.code,
        status: raw.status,
        used_at: raw.used_at,
        invitee,
      }
    })
    setRows(normalized)
    setError(null)
  }, [userId])

  React.useEffect(() => {
    void reload()
  }, [reload])

  async function copyLink(code: string, id: string) {
    const url = `${window.location.origin}/auth/signup?invite=${encodeURIComponent(code)}`
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      setError("No pudimos copiar al portapapeles.")
    }
  }

  if (rows === null) {
    return (
      <Card padding="default" className="ds-fade-up">
        <p className="text-[13px] text-[var(--text2)]">Cargando invitaciones…</p>
      </Card>
    )
  }

  if (rows.length === 0) {
    return (
      <Card padding="default" className="ds-fade-up">
        {!embedInPage ? (
          <h3 className="ds-label-uppercase mb-2">Mis invitaciones</h3>
        ) : null}
        <p className="text-[13px] text-[var(--text2)] leading-relaxed">
          {embedInPage
            ? "Aún no hay códigos en tu cuenta. Si ya completaste el onboarding, espera unos segundos y actualiza; si sigue igual, escríbenos."
            : "Cuando completes el onboarding recibirás 5 códigos para invitar a otras personas a Murmur."}
        </p>
      </Card>
    )
  }

  return (
    <Card padding="default" className="ds-fade-up flex flex-col gap-3">
      {!embedInPage ? (
        <div>
          <h3 className="ds-label-uppercase mb-1">Mis invitaciones</h3>
          <p className="text-[12px] text-[var(--text2)]">
            Comparte tu enlace. Cada código solo puede usarse una vez.
          </p>
        </div>
      ) : null}

      {error ? (
        <p className="text-[12px] text-[var(--red)]" role="alert">
          {error}
        </p>
      ) : null}

      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className={cn(
              "rounded-xl border-[0.5px] border-[var(--border)] p-3 flex flex-col gap-2",
              row.status === "used" ? "opacity-95" : ""
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <code className="text-[13px] font-mono font-semibold tracking-tight text-[var(--text)] break-all">
                  {row.code}
                </code>
                <div className="mt-1.5">
                  {row.status === "pending" ? (
                    <Tag variant="amber">Pendiente</Tag>
                  ) : (
                    <Tag variant="neutral">Usado</Tag>
                  )}
                </div>
              </div>
              {row.status === "pending" ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  className="shrink-0"
                  onClick={() => void copyLink(row.code, row.id)}
                >
                  {copiedId === row.id ? "¡Copiado!" : "Copiar enlace"}
                </Button>
              ) : null}
            </div>

            {row.status === "used" && row.invitee ? (
              <div className="flex items-center gap-2 pt-1 border-t border-[var(--border)]/60">
                <Avatar
                  initials={initialsFromName(row.invitee.name) || "?"}
                  imageUrl={row.invitee.photo_url ?? undefined}
                  size="sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="person-name">{row.invitee.name}</p>
                  {row.invitee.role ? (
                    <p className="person-subtitle">{row.invitee.role}</p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  )
}
