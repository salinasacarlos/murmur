import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { CurrentUserProvider } from "@/components/providers/current-user-provider"
import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export default async function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()
    profile = data
  }

  return (
    <CurrentUserProvider initialUser={user} initialProfile={profile}>
      <div className="min-h-svh flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <header className="sticky top-0 z-20 border-b-[0.5px] border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md px-4 md:px-8 py-3.5">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              <Logo size="md" />
            </Link>
            <nav className="flex items-center gap-2">
              {user ? (
                <Link href="/feed">
                  <Button size="md">Ir a Murmur</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" size="md">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button size="md">Únete</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </CurrentUserProvider>
  )
}
