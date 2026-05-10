"use client"

import Link from "next/link"

import { Isotipo } from "@/components/brand/isotipo"
import {
  IconCompass,
  IconMessage,
  IconUser,
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const BENEFITS = [
  {
    icon: IconCompass,
    title: "Match con contexto",
    line: "Perfiles alineados con lo que buscas, no scroll sin rumbo.",
  },
  {
    icon: IconUser,
    title: "Tú controlas la visibilidad",
    line: "Empiezas discreto; decides cuándo mostrarte.",
  },
  {
    icon: IconMessage,
    title: "Conexiones con historia",
    line: "Cada solicitud lleva propósito, no mensajes en frío.",
  },
] as const

export default function OnboardingIntroPage() {
  return (
    <Card
      padding="none"
      className="overflow-hidden bg-[var(--bg)] border-[var(--border)]"
    >
      <div
        className="px-6 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8 text-center"
        style={{
          background:
            "linear-gradient(180deg, var(--pl) 0%, var(--bg) 72%)",
        }}
      >
        <div className="flex justify-center mb-4">
          <div
            className="rounded-[20px] p-4 border border-[var(--pm)] bg-[var(--bg)] shadow-sm"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
          >
            <Isotipo size={56} color="var(--p)" />
          </div>
        </div>
        <h1 className="text-[22px] md:text-[24px] font-extrabold tracking-[-0.45px] text-[var(--text)] mb-2">
          Conoce a tu próxima tribu
        </h1>
        <p className="text-[13px] text-[var(--text2)] leading-relaxed max-w-[340px] mx-auto">
          Murmur conecta founders, talento y builders con intención clara.
        </p>
      </div>

      <div className="px-6 md:px-8 pb-2 flex flex-col gap-3">
        {BENEFITS.map(({ icon: Icon, title, line }) => (
          <div
            key={title}
            className={cn(
              "flex gap-3.5 rounded-[14px] border border-[var(--border)] bg-[var(--bg2)] p-3.5",
              "text-left"
            )}
          >
            <div
              className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-[12px] border border-[var(--pm)] bg-[var(--pl)] text-[var(--p)]"
              aria-hidden
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[13px] font-semibold text-[var(--text)]">
                {title}
              </p>
              <p className="text-[12px] text-[var(--text2)] leading-snug mt-0.5">
                {line}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 md:p-8 pt-5">
        <Link href="/onboarding/event" className="block">
          <Button size="lg" className="w-full justify-center">
            Continuar
          </Button>
        </Link>
        <p className="text-[11px] text-[var(--text3)] text-center mt-3 leading-relaxed">
          En unos minutos tendrás un perfil listo para el feed. Podrás editar después.
        </p>
      </div>
    </Card>
  )
}
