"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useCurrentUser } from "@/components/providers/current-user-provider"
import {
  formatPremiumAnnualLabel,
  formatPremiumWeeklyLabel,
} from "@/lib/product-config"
import { isPremiumPlan } from "@/lib/plan-limits"

export function UpgradeClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { profile, loading: profileLoading, refresh } = useCurrentUser()
  const [loading, setLoading] = React.useState<"week" | "year" | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const success = searchParams.get("success") === "1"
  const canceled = searchParams.get("canceled") === "1"

  React.useEffect(() => {
    if (!success) return
    void refresh()
  }, [success, refresh])

  async function startCheckout(interval: "week" | "year") {
    setError(null)
    setLoading(interval)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ interval }),
      })

      let data: { url?: string; error?: string }
      try {
        data = (await res.json()) as { url?: string; error?: string }
      } catch {
        setError("El servidor no devolvió JSON válido. Revisa tu conexión o inténtalo más tarde.")
        return
      }

      if (!res.ok) {
        setError(data.error ?? "No se pudo iniciar el pago.")
        return
      }
      if (data.url) {
        window.location.assign(data.url)
        return
      }
      setError("Respuesta inválida del servidor.")
    } catch {
      setError("Error de red. Intenta de nuevo.")
    } finally {
      setLoading(null)
    }
  }

  if (profileLoading && !profile) {
    return (
      <div className="px-4 md:px-6 py-10 max-w-lg mx-auto">
        <p className="text-[13px] text-[var(--text2)]">Cargando tu cuenta…</p>
      </div>
    )
  }

  if (profile && isPremiumPlan(profile.plan)) {
    return (
      <div className="px-4 md:px-6 py-10 max-w-lg mx-auto">
        <Card padding="page" className="border border-[var(--border)]">
          <h1 className="text-[18px] font-bold mb-2">Ya tienes Premium</h1>
          <p className="text-[13px] text-[var(--text2)] mb-6">
            Tu cuenta ya está en el plan Premium. Si necesitas ayuda con la
            facturación, escríbenos.
          </p>
          <Link
            href="/feed"
            className={buttonVariants({
              variant: "secondary",
              className: "w-full justify-center",
            })}
          >
            Volver al feed
          </Link>
        </Card>
      </div>
    )
  }

  const showCheckoutOptions = !success

  return (
    <div className="px-4 md:px-6 py-10 max-w-lg mx-auto">
      <h1 className="text-[20px] font-extrabold tracking-tight mb-1">
        Pasar a Premium
      </h1>
      <p className="text-[13px] text-[var(--text2)] mb-6">
        Desbloquea más ciudades, búsquedas activas, conexiones y filtros
        completos en Descubrir.
      </p>

      {success ? (
        <Card
          padding="page"
          className="mb-6 border border-[var(--g)] bg-[var(--gl)]/40"
        >
          <p className="text-[13px] font-semibold text-[var(--text)] mb-1">
            Pago recibido
          </p>
          <p className="text-[13px] text-[var(--text2)] mb-4">
            Stripe confirmó el checkout. Tu plan puede tardar unos segundos en
            actualizarse. Si sigues viendo Free, pulsa actualizar.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              disabled={profileLoading}
              onClick={() => {
                void refresh().then(() => router.refresh())
              }}
            >
              {profileLoading ? "Actualizando…" : "Actualizar mi plan"}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => router.replace("/feed")}
            >
              Ir al feed
            </Button>
            <button
              type="button"
              className="text-[11px] text-[var(--text3)] hover:text-[var(--text2)] underline-offset-2 hover:underline text-center pt-1"
              onClick={() => router.replace("/upgrade")}
            >
              Elegir plan de nuevo
            </button>
          </div>
        </Card>
      ) : null}

      {canceled ? (
        <Card
          padding="page"
          className="mb-6 border border-[var(--border)] bg-[var(--bg2)]"
        >
          <p className="text-[13px] text-[var(--text2)]">
            Cancelaste el checkout. Puedes elegir un plan cuando quieras.
          </p>
        </Card>
      ) : null}

      {error ? (
        <p className="text-[13px] text-[var(--red)] mb-4" role="alert">
          {error}
        </p>
      ) : null}

      {showCheckoutOptions ? (
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full justify-center"
            disabled={loading !== null}
            onClick={() => void startCheckout("week")}
          >
            {loading === "week"
              ? "Abriendo Stripe…"
              : `${formatPremiumWeeklyLabel()} / semana`}
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="w-full justify-center"
            disabled={loading !== null}
            onClick={() => void startCheckout("year")}
          >
            {loading === "year"
              ? "Abriendo Stripe…"
              : `${formatPremiumAnnualLabel()} / año`}
          </Button>
        </div>
      ) : null}

      {showCheckoutOptions ? (
        <p className="text-[11px] text-[var(--text3)] mt-6 leading-relaxed">
          Pagos procesados por Stripe. Al suscribirte aceptas las condiciones
          del proveedor de pago y los{" "}
          <Link href="/terms" className="text-[var(--p)] underline-offset-2 hover:underline">
            términos
          </Link>{" "}
          de Murmur.
        </p>
      ) : null}
    </div>
  )
}
