import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { PublicProfileView } from "@/app/p/[id]/public-profile-view"
import { fetchPublicProfile } from "@/lib/data/public-profiles"
import { getSupabaseServerClient } from "@/lib/supabase/server"

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const profile = await fetchPublicProfile(supabase, id)
  if (!profile) {
    return { title: "Perfil no disponible · Murmur" }
  }
  const title = `${profile.name} · ${profile.role}`
  const description =
    profile.bio.trim().slice(0, 160) ||
    `Perfil de ${profile.name} en Murmur — la red para builders & launchers.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.id === id) {
    redirect("/profile")
  }

  const profile = await fetchPublicProfile(supabase, id)
  if (!profile) {
    notFound()
  }

  return <PublicProfileView profile={profile} isPublicGuest={!user} />
}
