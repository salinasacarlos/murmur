import type { Search } from "@/lib/types"

const store = new Map<string, Search[]>()

export function peekSearchesList(userId: string): Search[] | undefined {
  return store.get(userId)
}

export function putSearchesList(userId: string, rows: Search[]) {
  store.set(userId, rows)
}
