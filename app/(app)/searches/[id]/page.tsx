import { notFound } from "next/navigation"

import { SearchForm } from "@/components/searches/search-form"
import { mockSearches } from "@/lib/mock-data"

interface EditSearchPageProps {
  params: Promise<{ id: string }>
}

export default async function EditSearchPage({ params }: EditSearchPageProps) {
  const { id } = await params
  const search = mockSearches.find((s) => s.id === id)
  if (!search) notFound()

  return (
    <div className="px-4 md:px-6 py-5 md:py-6">
      <SearchForm mode="edit" initial={search} />
    </div>
  )
}
