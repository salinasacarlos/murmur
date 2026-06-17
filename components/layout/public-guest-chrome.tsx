import { PublicGuestHeader } from "@/components/layout/public-guest-header"

/** Layout para visitantes sin sesión en rutas públicas (p. ej. /p/[id]). */
export function PublicGuestChrome({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <PublicGuestHeader />
      <main className="flex-1">{children}</main>
    </div>
  )
}
