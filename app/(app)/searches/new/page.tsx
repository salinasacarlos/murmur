import { SearchForm } from "@/components/searches/search-form"

export default function NewSearchPage() {
  return (
    <div className="px-4 md:px-6 py-5 md:py-6">
      <SearchForm mode="create" />
    </div>
  )
}
