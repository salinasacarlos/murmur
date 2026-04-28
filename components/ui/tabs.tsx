"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>")
  return ctx
}

interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({
  defaultValue,
  value: controlled,
  onValueChange,
  children,
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const value = controlled ?? internal
  const setValue = (next: string) => {
    if (controlled === undefined) setInternal(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("flex flex-col gap-4", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex min-h-[44px] min-w-0 flex-nowrap items-stretch gap-1 overflow-x-auto overscroll-x-contain border-b border-[var(--border)] pb-px [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: active, setValue } = useTabs()
  const isActive = active === value
  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={cn(
        "relative z-[1] shrink-0 cursor-pointer whitespace-nowrap px-3 py-2 text-[13px] font-medium",
        "-mb-px border-b-2 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[var(--p)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
        isActive
          ? "border-[var(--p)] text-[var(--text)]"
          : "border-transparent text-[var(--text2)] hover:text-[var(--text)]",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const { value: active } = useTabs()
  if (active !== value) return null
  return (
    <div role="tabpanel" className={cn("flex flex-col gap-3", className)}>
      {children}
    </div>
  )
}
