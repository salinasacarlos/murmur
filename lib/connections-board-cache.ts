import type { IgnoredConnection, ReceivedConnection, SentConnection } from "@/lib/types"

export type ConnectionsBoardSnapshot = {
  received: ReceivedConnection[]
  sent: SentConnection[]
  ignored: IgnoredConnection[]
}

const store = new Map<string, ConnectionsBoardSnapshot>()

export function peekConnectionsBoard(userId: string): ConnectionsBoardSnapshot | undefined {
  return store.get(userId)
}

export function putConnectionsBoard(userId: string, board: ConnectionsBoardSnapshot) {
  store.set(userId, {
    received: board.received,
    sent: board.sent,
    ignored: board.ignored,
  })
}

export function clearConnectionsBoard(userId: string) {
  store.delete(userId)
}
