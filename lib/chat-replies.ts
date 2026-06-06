import type { Tables } from "@/lib/database.types"
import type { Message, MessageReplyPreview } from "@/lib/types"

export function buildReplyPreview(
  quoted: Pick<Message, "id" | "fromMe" | "text">,
  peerName: string
): MessageReplyPreview {
  return {
    id: quoted.id,
    fromMe: quoted.fromMe,
    authorLabel: quoted.fromMe ? "Tú" : peerName.split(" ")[0] ?? peerName,
    text: quoted.text,
  }
}

export function enrichMessagesWithReplies(
  rows: Tables<"messages">[],
  currentUserId: string,
  peerName: string
): Message[] {
  const byId = new Map(rows.map((r) => [r.id, r]))

  return rows.map((row) => {
    const message: Message = {
      id: row.id,
      fromMe: row.sender_id === currentUserId,
      text: row.body,
      sentAt: row.sent_at,
      replyToMessageId: row.reply_to_message_id ?? null,
    }
    const replyId = row.reply_to_message_id
    if (!replyId) return message

    const quoted = byId.get(replyId)
    if (!quoted) {
      message.replyTo = {
        id: replyId,
        fromMe: false,
        authorLabel: "Mensaje",
        text: "No disponible",
      }
      return message
    }

    message.replyTo = buildReplyPreview(
      {
        id: quoted.id,
        fromMe: quoted.sender_id === currentUserId,
        text: quoted.body,
      },
      peerName
    )
    return message
  })
}

export function attachReplyPreview(
  message: Message,
  replyTarget: Message | null,
  peerName: string
): Message {
  if (!replyTarget) return message
  return {
    ...message,
    replyTo: buildReplyPreview(replyTarget, peerName),
  }
}
