import type { Message } from "@/lib/types"

export type MessageDaySection = {
  dayKey: string
  label: string
  groups: Message[][]
}

function startOfDayMs(iso: string): number {
  const d = new Date(iso)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function formatChatDayLabel(iso: string, now = new Date()): string {
  try {
    const d = new Date(iso)
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const target = new Date(d)
    target.setHours(0, 0, 0, 0)
    const diffDays = Math.round(
      (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (diffDays === 0) return "Hoy"
    if (diffDays === 1) return "Ayer"
    if (d.getFullYear() === now.getFullYear()) {
      return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" })
    }
    return d.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  } catch {
    return iso
  }
}

export function formatChatMessageTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

function groupMessagesByAuthor(messages: Message[]): Message[][] {
  const groups: Message[][] = []
  let current: Message[] = []
  let lastFromMe: boolean | null = null
  let lastTime = 0

  for (const m of messages) {
    const t = new Date(m.sentAt).getTime()
    const sameAuthor = lastFromMe === m.fromMe
    const closeInTime = t - lastTime < 1000 * 60 * 5
    if (sameAuthor && closeInTime && current.length > 0) {
      current.push(m)
    } else {
      if (current.length > 0) groups.push(current)
      current = [m]
    }
    lastFromMe = m.fromMe
    lastTime = t
  }
  if (current.length > 0) groups.push(current)
  return groups
}

/** Agrupa por día (separador) y luego por autor + ventana de 5 min. */
export function layoutChatMessages(messages: Message[]): MessageDaySection[] {
  if (!messages.length) return []

  const byDay = new Map<string, Message[]>()
  for (const m of messages) {
    const key = String(startOfDayMs(m.sentAt))
    const list = byDay.get(key) ?? []
    list.push(m)
    byDay.set(key, list)
  }

  const sections: MessageDaySection[] = []
  for (const [dayKey, dayMessages] of [...byDay.entries()].sort(
    (a, b) => Number(a[0]) - Number(b[0])
  )) {
    sections.push({
      dayKey,
      label: formatChatDayLabel(dayMessages[0]!.sentAt),
      groups: groupMessagesByAuthor(dayMessages),
    })
  }
  return sections
}
