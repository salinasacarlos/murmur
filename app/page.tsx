import type { Metadata } from "next"
import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tag } from "@/components/ui/tag"
import {
  FREE_MAX_ACCEPTED_CONNECTIONS,
  FREE_MAX_ACTIVE_SEARCHES,
  FREE_MAX_PROFILE_CITY_SLUGS,
} from "@/lib/plan-limits"
import {
  formatPremiumAnnualLabel,
  formatPremiumWeeklyLabel,
  getSupportEmail,
} from "@/lib/product-config"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Murmur — La red para builders",
  description:
    "La red donde los builders encuentran co-founders, talento, mentores e inversionistas.",
}

const footerLink = "text-[12px] text-[var(--text2)] hover:text-[var(--p)] transition-colors"

export default function LandingPage() {
  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-50 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-md px-4 md:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo size="md" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[var(--text2)]">
            <a href="#como-funciona" className="hover:text-[var(--text)] transition-colors">
              Cómo funciona
            </a>
            <a href="#funcionalidades" className="hover:text-[var(--text)] transition-colors">
              Funcionalidades
            </a>
            <a href="#precios" className="hover:text-[var(--text)] transition-colors">
              Precios
            </a>
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/auth/login">
              <Button variant="ghost" size="md">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="md">Únete gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 md:px-8 pt-10 md:pt-16 pb-16 md:pb-24 border-b-[0.5px] border-[var(--border)]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-10 items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-4">
                La red para builders
              </p>
              <h1
                className="font-extrabold tracking-[-2px] mb-5"
                style={{ fontSize: "clamp(36px, 7vw, 64px)", lineHeight: 1.05 }}
              >
                Construye con las{" "}
                <em className="not-italic" style={{ color: "var(--p)" }}>
                  personas
                </em>{" "}
                correctas.
              </h1>
              <p className="text-[15px] md:text-[16px] text-[var(--text2)] leading-relaxed max-w-lg mb-8">
                La red donde los builders encuentran co-founders, talento, mentores e
                inversionistas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Empezar gratis
                  </Button>
                </Link>
                <a href="#como-funciona">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    Ver cómo funciona
                  </Button>
                </a>
              </div>
            </div>
            <HeroMockup />
          </div>
          <p className="max-w-6xl mx-auto text-center text-[13px] text-[var(--text2)] mt-12 md:mt-16">
            Únete a{" "}
            <strong className="text-[var(--text)] font-semibold">+400 builders</strong> que
            ya encontraron a su partna en México
          </p>
        </section>

        {/* Cómo funciona */}
        <section
          id="como-funciona"
          className="px-4 md:px-8 py-16 md:py-24 scroll-mt-[72px] bg-[var(--bg2)]"
        >
          <div className="max-w-6xl mx-auto">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-2">
              Cómo funciona
            </p>
            <h2
              className="font-extrabold tracking-[-1px] mb-4 max-w-xl"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.15 }}
            >
              Sin swipes. Sin ruido. Sin azar.
            </h2>
            <p className="text-[15px] text-[var(--text2)] max-w-2xl mb-12 md:mb-16">
              Cada conexión en Murmur tiene un por qué. Así funciona.
            </p>
            <div className="grid md:grid-cols-3 gap-8 md:gap-6">
              <StepCard
                n="01"
                title="Define qué buscas"
                body="¿Tienes un proyecto y necesitas equipo? ¿Quieres unirte a algo? ¿Estás explorando? Tu intención le da forma a quién te mostramos."
              />
              <StepCard
                n="02"
                title="Te sugerimos buenos matches"
                body="No es solo por industria o ciudad. Murmur cruza lo que sabes hacer, lo que te falta y lo que estás construyendo para acercarte a quien te complementa."
              />
              <StepCard
                n="03"
                title="Conecta con intención"
                body='Ves el perfil, entiendes por qué hay compatibilidad y mandas una solicitud con un mensaje que resume el contexto. Nada de "hey" al vacío.'
              />
            </div>
          </div>
        </section>

        {/* Match con IA */}
        <section className="px-4 md:px-8 py-16 md:py-24 border-b-[0.5px] border-[var(--border)]">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-2">
                Matches con contexto
              </p>
              <h2
                className="font-extrabold tracking-[-1px] mb-4"
                style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.15 }}
              >
                Dices lo que buscas. Descubres a quien encaja.
              </h2>
              <p className="text-[15px] text-[var(--text2)] leading-relaxed">
                Tu perfil y tus búsquedas definen un radar: Murmur prioriza perfiles
                alineados con tu intención, sin ruido de networking genérico.
              </p>
            </div>
            <IaMatchVisual />
          </div>
        </section>

        {/* Funcionalidades */}
        <section
          id="funcionalidades"
          className="px-4 md:px-8 py-16 md:py-24 scroll-mt-[72px] bg-[var(--bg2)]"
        >
          <div className="max-w-6xl mx-auto">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-2">
              Funcionalidades
            </p>
            <h2
              className="font-extrabold tracking-[-1px] mb-12 md:mb-14 max-w-xl"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.15 }}
            >
              Todo lo que necesitas para encontrar a quien construye contigo
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <FeatureCard
                kicker="Eventos"
                title="Modo evento"
                body="En contextos de evento puedes activar tu visibilidad para que otros builders alineados te encuentren. Ideal cuando estás presente y abierto a conversar."
                bullets={["Compatible con meetups y conferencias", "Tú controlas cuándo apareces"]}
              />
              <FeatureCard
                kicker="Privacidad"
                title="Tú decides cuándo aparecer"
                body="Fuera de eventos eres invisible por defecto. Sin mensajes en frío de desconocidos. Te activas cuando quieres — en eventos, cuando estás buscando, cuando tiene sentido."
                stats={[
                  { label: "Mensajes no solicitados", value: "0" },
                  { label: "Conexiones con intención", value: "100%" },
                ]}
              />
              <FeatureCard
                kicker="Chat"
                title="Todo dentro de Murmur"
                body="Cuando alguien acepta tu solicitud, el chat se abre directamente en la app. Sin intercambiar WhatsApps antes de saber si la conexión vale. La conversación empieza donde debe: con contexto."
              />
              <FeatureCard
                kicker="México"
                title="Donde está el ecosistema"
                body="CDMX, GDL, MTY, QRO y creciendo. Filtra por ciudad o abre tu radar a toda la república — el talento no siempre está en tu colonia."
              />
            </div>
          </div>
        </section>

        {/* Historias */}
        <section className="px-4 md:px-8 py-16 md:py-24 border-b-[0.5px] border-[var(--border)]">
          <div className="max-w-6xl mx-auto">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-2">
              Historias
            </p>
            <h2
              className="font-extrabold tracking-[-1px] mb-12"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.15 }}
            >
              Builders que ya encontraron a quien necesitaban
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <TestimonialCard
                quote="Llevaba 6 meses buscando un co-founder técnico. En Murmur encontré a alguien en 3 semanas que no solo tenía las skills, sino la misma visión."
                initials="LM"
                name="Luis Mendoza"
                role="Builder · SaaS B2B · CDMX"
              />
              <TestimonialCard
                quote="Lo usé en Talent Land. Activé el modo evento y en una tarde conecté con 4 personas que realmente tenían sentido para mi proyecto. Imposible en networking tradicional."
                initials="VR"
                name="Valentina Ríos"
                role="CPO · Edtech · GDL"
              />
              <TestimonialCard
                quote="No tenía un proyecto propio pero quería construir algo. Murmur me conectó con personas que buscaban exactamente mi perfil — sin mandar mensajes en frío a nadie."
                initials="CA"
                name="Carlos Álvarez"
                role="Diseñador · Builder · MTY"
              />
            </div>
          </div>
        </section>

        {/* Precios */}
        <section id="precios" className="px-4 md:px-8 py-16 md:py-24 scroll-mt-[72px] bg-[var(--bg2)]">
          <div className="max-w-5xl mx-auto">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--p)] mb-2 text-center">
              Precios
            </p>
            <h2
              className="font-extrabold tracking-[-1px] mb-4 text-center"
              style={{ fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.15 }}
            >
              Empieza gratis. Escala cuando lo necesites.
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
              <Card padding="page" className="flex flex-col border border-[var(--border)]">
                <h3 className="text-[18px] font-bold mb-1">Free</h3>
                <p className="text-[24px] font-extrabold text-[var(--p)] mb-1">$0 / mes</p>
                <p className="text-[13px] text-[var(--text2)] mb-6">
                  Para explorar el ecosistema y hacer tus primeras conexiones.
                </p>
                <ul className="space-y-2.5 text-[13px] text-[var(--text2)] mb-8 flex-1">
                  <PricingLi>
                    {FREE_MAX_PROFILE_CITY_SLUGS === 1
                      ? "Una ciudad en tu radar"
                      : `Hasta ${FREE_MAX_PROFILE_CITY_SLUGS} ciudades en tu radar`}
                  </PricingLi>
                  <PricingLi>
                    {FREE_MAX_ACTIVE_SEARCHES === 1
                      ? "Una búsqueda activa a la vez"
                      : `Hasta ${FREE_MAX_ACTIVE_SEARCHES} búsquedas activas`}
                  </PricingLi>
                  <PricingLi>
                    Hasta {FREE_MAX_ACCEPTED_CONNECTIONS} conexiones aceptadas
                  </PricingLi>
                  <PricingLi>
                    Feed Descubrir con filtros básicos (sin filtro por soft skills)
                  </PricingLi>
                  <PricingLi>Chat con tus conexiones</PricingLi>
                  <PricingLi>Sin alertas de alta compatibilidad</PricingLi>
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button variant="secondary" size="lg" className="w-full justify-center">
                    Empezar gratis
                  </Button>
                </Link>
              </Card>
              <Card
                padding="page"
                className="flex flex-col border-2 border-[var(--p)] relative bg-[var(--pl)]/30"
              >
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.08em] bg-[var(--primary-solid)] text-[var(--primary-solid-foreground)] px-2.5 py-1 rounded-full">
                  Más popular
                </span>
                <h3 className="text-[18px] font-bold mb-1">Premium</h3>
                <div className="space-y-2 mb-1">
                  <p className="text-[24px] font-extrabold text-[var(--p)] leading-tight">
                    {formatPremiumWeeklyLabel()}{" "}
                    <span className="text-[15px] font-bold text-[var(--text2)]">
                      / semana
                    </span>
                  </p>
                  <p className="text-[15px] font-semibold text-[var(--text)]">
                    o{" "}
                    <span className="text-[var(--p)]">
                      {formatPremiumAnnualLabel()}
                    </span>
                    <span className="text-[var(--text2)] font-medium"> / año</span>
                  </p>
                </div>
                <p className="text-[12px] text-[var(--text3)] mb-2">
                  Paga con tarjeta vía Stripe (checkout seguro). Tras el pago,
                  tu cuenta pasa a Premium automáticamente. También puedes
                  gestionar la suscripción desde tu cuenta.
                </p>
                <p className="text-[13px] text-[var(--text2)] mb-6">
                  Para quien conecta en serio y necesita más alcance.
                </p>
                <ul className="space-y-2.5 text-[13px] text-[var(--text2)] mb-8 flex-1">
                  <PricingLi>Varias ciudades / radar amplio</PricingLi>
                  <PricingLi>Búsquedas activas ilimitadas</PricingLi>
                  <PricingLi>Conexiones aceptadas ilimitadas</PricingLi>
                  <PricingLi>Filtros completos en Descubrir (incl. soft skills)</PricingLi>
                  <PricingLi>Alertas de alta compatibilidad con tu búsqueda</PricingLi>
                  <PricingLi>Solicitudes de conexión sin tope por el plan</PricingLi>
                </ul>
                <Link href="/upgrade" className="block">
                  <Button size="lg" className="w-full justify-center">
                    Empezar Premium
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Cierre */}
        <section className="px-4 md:px-8 py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#050508] px-8 py-10 md:px-12 md:py-12 lg:py-14 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-24 -left-28 h-[min(320px,70vw)] w-[min(320px,70vw)] rounded-full bg-[var(--g)] opacity-[0.28] blur-[90px]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -top-28 -right-20 h-[min(300px,65vw)] w-[min(300px,65vw)] rounded-full bg-[var(--p)] opacity-[0.22] blur-[85px]"
              />
              <svg
                aria-hidden
                className="pointer-events-none absolute right-6 top-6 w-24 opacity-[0.12] text-white md:right-10 md:top-8 md:w-28"
                viewBox="0 0 120 80"
                fill="none"
              >
                <path
                  d="M85 38c-8-12-22-18-35-12 12-6 26-2 35 8 4-8 12-14 22-16-10 2-17 8-22 16zM92 52c-10-8-24-10-36-4 14-4 28 0 36 10 3-6 9-10 16-12-7 2-12 6-16 12zM98 22c-6-9-16-14-26-10 9-5 20-2 26 6 3-6 8-10 14-11-6 1-11 5-14 11z"
                  fill="currentColor"
                />
              </svg>
              <div className="relative z-[1] flex flex-col items-center gap-8 text-center md:gap-10">
                <div className="max-w-xl mx-auto">
                  <h2
                    className="font-extrabold tracking-[-1px] text-white mb-3"
                    style={{
                      fontSize: "clamp(26px, 4.5vw, 40px)",
                      lineHeight: 1.12,
                    }}
                  >
                    Encuentra a los tuyos.
                  </h2>
                  <p className="text-[15px] leading-relaxed text-white/60">
                    Co-founders, talento, mentores e inversionistas. Murmur los une.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                  <Link
                    href="/auth/signup"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "lg" }),
                      "w-full justify-center rounded-full border-0 bg-white text-[#0a0a0f] px-8 py-3 text-[14px] font-semibold shadow-lg shadow-black/30 hover:bg-neutral-100 hover:text-[#0a0a0f] focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508] sm:w-auto"
                    )}
                  >
                    Encontrar a los mios
                  </Link>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/45 text-center">
                    Gratis · sin tarjeta · 3 minutos de onboarding
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer
        className="border-t-[0.5px] border-[var(--border)] px-4 md:px-8 py-10 bg-[var(--bg)]"
        style={{ paddingBottom: "calc(40px + var(--sab))" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <Logo size="sm" />
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#como-funciona" className={footerLink}>
              Cómo funciona
            </a>
            <a href="#precios" className={footerLink}>
              Precios
            </a>
            <Link href="/privacy" className={footerLink}>
              Privacidad
            </Link>
            <Link href="/terms" className={footerLink}>
              Términos
            </Link>
            <a href={`mailto:${getSupportEmail()}`} className={footerLink}>
              Contacto
            </a>
          </nav>
        </div>
        <p className="max-w-6xl mx-auto text-[11px] text-[var(--text3)] mt-8">
          © {new Date().getFullYear()} Murmur · Para los que construyen algo 🌎
        </p>
      </footer>
    </div>
  )
}

function StepCard({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <span
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-[14px] font-extrabold text-[var(--p)] mb-4"
        style={{ background: "var(--pl)", border: "1px solid var(--pm)" }}
      >
        {n}
      </span>
      <h3 className="text-[16px] font-bold mb-2">{title}</h3>
      <p className="text-[14px] text-[var(--text2)] leading-relaxed">{body}</p>
    </div>
  )
}

function FeatureCard({
  kicker,
  title,
  body,
  bullets,
  stats,
}: {
  kicker: string
  title: string
  body: string
  bullets?: string[]
  stats?: { label: string; value: string }[]
}) {
  return (
    <Card padding="page" className="h-full border border-[var(--border)] bg-[var(--bg)]">
      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--p)] mb-2">
        {kicker}
      </p>
      <h3 className="text-[17px] font-bold mb-2">{title}</h3>
      <p className="text-[14px] text-[var(--text2)] leading-relaxed mb-4">{body}</p>
      {bullets ? (
        <ul className="space-y-1.5 text-[13px] text-[var(--text)]">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[var(--p)]">·</span>
              {b}
            </li>
          ))}
        </ul>
      ) : null}
      {stats ? (
        <div className="flex gap-8 pt-2">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-[22px] font-extrabold text-[var(--p)]">{s.value}</p>
              <p className="text-[11px] text-[var(--text3)] max-w-[120px] leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}

function TestimonialCard({
  quote,
  initials,
  name,
  role,
}: {
  quote: string
  initials: string
  name: string
  role: string
}) {
  return (
    <Card padding="page" className="border border-[var(--border)] h-full flex flex-col">
      <p className="text-[14px] text-[var(--text)] leading-relaxed mb-6 flex-1">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold text-[var(--p)]"
          style={{ background: "var(--pl)" }}
        >
          {initials}
        </div>
        <div>
          <p className="text-[13px] font-semibold">{name}</p>
          <p className="text-[12px] text-[var(--text3)]">{role}</p>
        </div>
      </div>
    </Card>
  )
}

function PricingLi({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="text-[var(--g)] shrink-0">✓</span>
      <span>{children}</span>
    </li>
  )
}

function HeroMockup() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto">
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <Card
          padding="tight"
          className="rounded-2xl shadow-lg border-[var(--border)] overflow-hidden"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text3)] mb-3">
            Mensajes
          </p>
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <span className="w-7 h-7 rounded-full bg-[var(--pl)] text-[10px] font-bold flex items-center justify-center text-[var(--p)] shrink-0">
                AP
              </span>
              <div className="rounded-xl bg-[var(--bg2)] px-2.5 py-2 text-[11px] leading-snug max-w-[85%]">
                <span className="font-semibold text-[var(--text)]">Ana Pérez</span>
                <p className="text-[var(--text2)] mt-0.5">Hola! Vi que buscas co-founder…</p>
              </div>
            </div>
            <div className="flex gap-2 items-start flex-row-reverse">
              <span className="w-7 h-7 rounded-full bg-[var(--pm)] text-[10px] font-bold flex items-center justify-center text-[var(--p)] shrink-0">
                MR
              </span>
              <div
                className="rounded-xl px-2.5 py-2 text-[11px] leading-snug max-w-[85%] ml-auto text-right"
                style={{ background: "var(--pl)" }}
              >
                <span className="font-semibold">Miguel Ríos</span>
                <p className="text-[var(--text2)] mt-0.5">
                  Justo estaba pensando en algo así
                </p>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text3)] text-center pt-1">9:41</p>
          </div>
        </Card>
        <Card
          padding="tight"
          className="rounded-2xl shadow-lg border-[var(--border)]"
          style={{ background: "linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-bold">Murmur</span>
            <Tag variant="success" className="!text-[10px]">
              Visible
            </Tag>
          </div>
          <p className="text-[11px] font-bold text-[var(--text)] mb-1">Descubrir</p>
          <p className="text-[10px] text-[var(--text3)] mb-3">
            14 sugeridos por IA · CDMX y GDL
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {["Todos", "Co-founders", "Talento", "Eventos"].map((t) => (
              <button
                key={t}
                type="button"
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] border",
                  t === "Todos"
                    ? "bg-[var(--primary-solid)] text-white border-[var(--primary-solid)]"
                    : "border-[var(--border)] text-[var(--text2)]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <MiniProfile
              initials="AP"
              line="Ana Pérez"
              sub="CTO · ex-Rappi · CDMX"
              tags={["Co-founder", "Backend", "IA/ML"]}
              compat="Alta"
            />
            <MiniProfile
              initials="MR"
              line="Miguel Ríos"
              sub="Diseñador · GDL"
              tags={["UX/UI", "Producto"]}
              compat="Media"
            />
            <MiniProfile
              initials="LC"
              line="Laura Castro"
              sub="CMO · MTY"
              tags={["Marketing", "Ventas"]}
              compat="Baja"
            />
          </div>
        </Card>
      </div>
      <Card
        padding="tight"
        className="mt-3 rounded-xl border-[var(--border)] bg-[var(--pl)]/50 flex items-center gap-2"
      >
        <span className="w-8 h-8 rounded-lg bg-[var(--primary-solid)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
          AP
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-[var(--p)]">¡Nuevo match!</p>
          <p className="text-[10px] text-[var(--text2)] truncate">
            Ana Pérez · CTO · CDMX — Alta compatibilidad con tu perfil
          </p>
        </div>
      </Card>
      <div className="flex justify-center gap-1.5 mt-3">
        {["JR", "MG", "SL", "AR"].map((x) => (
          <span
            key={x}
            className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[9px] font-bold flex items-center justify-center text-[var(--text3)]"
          >
            {x}
          </span>
        ))}
        <span className="w-8 h-8 rounded-full border border-dashed border-[var(--border2)] text-[11px] font-bold flex items-center justify-center text-[var(--text3)]">
          +
        </span>
      </div>
    </div>
  )
}

function MiniProfile({
  initials,
  line,
  sub,
  tags,
  compat,
}: {
  initials: string
  line: string
  sub: string
  tags: string[]
  compat: string
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-2 flex gap-2">
      <span className="w-9 h-9 rounded-full bg-[var(--bg2)] text-[10px] font-bold flex items-center justify-center shrink-0">
        {initials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-bold truncate">{line}</p>
        <p className="text-[10px] text-[var(--text3)] truncate">{sub}</p>
        <div className="flex flex-wrap gap-0.5 mt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[9px] px-1.5 py-0 rounded bg-[var(--bg2)] text-[var(--text2)]"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[9px] text-[var(--g)] font-semibold">{compat}</p>
        <p className="text-[9px] text-[var(--p)] font-medium">Conectar</p>
      </div>
    </div>
  )
}

function IaMatchVisual() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg2)] p-4 md:p-6 space-y-4">
      <div className="rounded-xl bg-[var(--bg)] border border-[var(--border)] p-3">
        <p className="text-[10px] uppercase tracking-[0.08em] text-[var(--text3)] mb-1">
          Tu búsqueda activa
        </p>
        <p className="text-[13px] font-medium">CTO · experiencia B2B · etapa temprana</p>
      </div>
      <div className="flex flex-wrap gap-2 justify-center py-2">
        {[
          ["AP", "Ana Pérez · CTO"],
          ["JG", "Jorge G. · CTO"],
          ["SR", "Sofía R. · Eng Lead"],
          ["MV", "Marco V."],
          ["PL", "Paula L."],
        ].map(([a, b]) => (
          <div
            key={a}
            className="flex items-center gap-1.5 px-2 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] text-[11px]"
          >
            <span className="w-5 h-5 rounded-full bg-[var(--pl)] text-[8px] font-bold flex items-center justify-center text-[var(--p)]">
              {a}
            </span>
            {b}
          </div>
        ))}
      </div>
      <p className="text-[11px] font-bold text-[var(--text2)]">Mejores matches encontrados</p>
      <div className="space-y-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 flex gap-3">
          <span className="w-10 h-10 rounded-full bg-[var(--pl)] text-[11px] font-bold flex items-center justify-center text-[var(--p)]">
            AP
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold">Ana Pérez</p>
            <p className="text-[11px] text-[var(--text3)]">
              CTO · ex-Rappi · Healthtech · CDMX
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {["Co-founder", "Backend", "B2B SaaS"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg2)] text-[var(--text2)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[var(--g)] font-semibold">Alta</p>
            <p className="text-[10px] text-[var(--p)] font-medium">Conectar</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 flex gap-3 opacity-95">
          <span className="w-10 h-10 rounded-full bg-[var(--bg2)] text-[11px] font-bold flex items-center justify-center">
            JG
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold">Jorge González</p>
            <p className="text-[11px] text-[var(--text3)]">CTO · ex-Konfio · Fintech · GDL</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {["Arquitectura", "Equipos", "B2B"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg2)] text-[var(--text2)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[var(--g)] font-semibold">Alta</p>
            <p className="text-[10px] text-[var(--p)] font-medium">Conectar</p>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 flex gap-3 opacity-90">
          <span className="w-10 h-10 rounded-full bg-[var(--bg2)] text-[11px] font-bold flex items-center justify-center">
            SR
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold">Sofía Ramírez</p>
            <p className="text-[11px] text-[var(--text3)]">Engineering Lead · EdTech · MTY</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {["Full-stack", "Producto"].map((t) => (
                <span
                  key={t}
                  className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--bg2)] text-[var(--text2)]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-[var(--amber-text)] font-semibold">Media</p>
            <p className="text-[10px] text-[var(--p)] font-medium">Conectar</p>
          </div>
        </div>
      </div>
    </div>
  )
}
