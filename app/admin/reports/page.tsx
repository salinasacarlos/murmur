import Link from "next/link"
import { redirect } from "next/navigation"

import { Logo } from "@/components/brand/logo"
import { getMurmurAdminSession } from "@/lib/murmur-admin"

import { AdminReportsClient } from "./admin-reports-client"

export default async function AdminReportsPage() {
  const session = await getMurmurAdminSession()
  if (!session) {
    redirect("/feed")
  }

  return (
    <div className="min-h-svh flex flex-col bg-[var(--bg2)]">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--bg)]">
        <Link href="/feed">
          <Logo size="md" />
        </Link>
        <Link
          href="/feed"
          className="text-[13px] text-[var(--p)] font-semibold shrink-0"
        >
          Volver al feed
        </Link>
      </header>
      <main className="flex-1 px-4 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-[20px] font-extrabold tracking-[-0.4px] mb-6">
            Reportes de usuarios
          </h1>
          <AdminReportsClient />
        </div>
      </main>
    </div>
  )
}
