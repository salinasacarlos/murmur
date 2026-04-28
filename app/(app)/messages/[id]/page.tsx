import { notFound } from "next/navigation"

import { ChatConversation } from "@/components/messages/chat-conversation"
import { mockChats } from "@/lib/mock-data"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const chat = mockChats.find((c) => c.id === id)
  if (!chat) notFound()

  return <ChatConversation chat={chat} />
}
