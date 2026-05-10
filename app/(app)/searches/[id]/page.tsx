import { notFound, redirect } from "next/navigation"

import { SearchForm } from "@/components/searches/search-form"
import { fetchSearchByIdForOwner } from "@/lib/data/searches"
import { getSupabaseServerClient } from "@/lib/supabase/server"

interface EditSearchPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSearchPage({ params }: EditSearchPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const search = await fetchSearchByIdForOwner(supabase, id, user.id)
  if (!search) notFound()

  return (
    <div className="px-4 md:px-6 py-5 md:py-6">
      <SearchForm mode="edit" initial={search} searchId={id} />
    </div>
  )
}
