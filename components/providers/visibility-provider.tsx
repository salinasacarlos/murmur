"use client"

import * as React from "react"

interface VisibilityContextValue {
  visible: boolean
  setVisible: (next: boolean) => void
  toggle: () => void
}

const VisibilityContext = React.createContext<VisibilityContextValue | null>(
  null
)

const STORAGE_KEY = "murmur:visibility"

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const handler = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback()
  }
  window.addEventListener("storage", handler)
  return () => window.removeEventListener("storage", handler)
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true"
  } catch {
    return false
  }
}

function getServerSnapshot(): boolean {
  return false
}

export function VisibilityProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const stored = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const [override, setOverride] = React.useState<boolean | null>(null)
  const visible = override ?? stored

  const setVisible = React.useCallback((next: boolean) => {
    setOverride(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "true" : "false")
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: next ? "true" : "false",
        })
      )
    } catch {
      // ignore
    }
  }, [])

  const toggle = React.useCallback(() => {
    setVisible(!visible)
  }, [visible, setVisible])

  const value = React.useMemo(
    () => ({ visible, setVisible, toggle }),
    [visible, setVisible, toggle]
  )

  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  )
}

export function useVisibility() {
  const ctx = React.useContext(VisibilityContext)
  if (!ctx) {
    throw new Error("useVisibility must be used inside VisibilityProvider")
  }
  return ctx
}
