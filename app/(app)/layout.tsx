import * as React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Topbar } from "@/components/layout/topbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh bg-[var(--bg)]">
      <Sidebar />
      <div className="md:pl-[224px] flex flex-col min-h-svh">
        <Topbar />
        <main
          className="flex-1 pb-[calc(56px+var(--sab))] md:pb-0"
        >
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
