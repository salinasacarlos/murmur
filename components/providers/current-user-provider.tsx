"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import type { SupabaseClient, User } from "@supabase/supabase-js"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import type { Database } from "@/lib/database.types"

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"]

interface CurrentUserContextValue {
  user: User | null
  profile: ProfileRow | null
  loading: boolean
  refresh: () => Promise<void>
  /** Actualiza campos del perfil en cliente (p. ej. tras guardar visibilidad) sin esperar refetch. */
  mergeProfile: (partial: Partial<ProfileRow>) => void
  signOut: () => Promise<void>
}

const CurrentUserContext = React.createContext<CurrentUserContextValue | null>(
  null
)

interface CurrentUserProviderProps {
  initialUser: User | null
  initialProfile: ProfileRow | null
  children: React.ReactNode
}

export function CurrentUserProvider({
  initialUser,
  initialProfile,
  children,
}: CurrentUserProviderProps) {
  const router = useRouter()
  const supabase = React.useMemo<SupabaseClient<Database> | null>(() => {
    if (typeof window === "undefined") return null
    return getSupabaseBrowserClient()
  }, [])

  const [user, setUser] = React.useState<User | null>(initialUser)
  const [profile, setProfile] = React.useState<ProfileRow | null>(
    initialProfile
  )
  const [loading, setLoading] = React.useState(false)

  const loadProfile = React.useCallback(
    async (uid: string) => {
      if (!supabase) return null
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .maybeSingle()
      if (error) {
        console.error("Failed to load profile", error)
        return null
      }
      return data
    },
    [supabase]
  )

  const refresh = React.useCallback(async () => {
    if (!supabase) return
    setLoading(true)
    try {
      const {
        data: { user: nextUser },
      } = await supabase.auth.getUser()
      setUser(nextUser)
      if (nextUser) {
        const nextProfile = await loadProfile(nextUser.id)
        setProfile(nextProfile)
      } else {
        setProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }, [loadProfile, supabase])

  const mergeProfile = React.useCallback((partial: Partial<ProfileRow>) => {
    setProfile((p) => (p ? { ...p, ...partial } : null))
  }, [])

  React.useEffect(() => {
    if (!supabase) return
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null
      setUser(nextUser)
      if (nextUser) {
        loadProfile(nextUser.id).then((p) => setProfile(p))
      } else {
        setProfile(null)
      }
      router.refresh()
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [loadProfile, router, supabase])

  const signOut = React.useCallback(async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    router.replace("/auth/login")
    router.refresh()
  }, [router, supabase])

  const value = React.useMemo(
    () => ({ user, profile, loading, refresh, mergeProfile, signOut }),
    [user, profile, loading, refresh, mergeProfile, signOut]
  )

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export function useCurrentUser() {
  const ctx = React.useContext(CurrentUserContext)
  if (!ctx) {
    throw new Error("useCurrentUser must be used inside CurrentUserProvider")
  }
  return ctx
}

export function useOptionalCurrentUser() {
  return React.useContext(CurrentUserContext)
}
