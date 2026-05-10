import { notFound, redirect } from "next/navigation"

import { ChatConversation } from "@/components/messages/chat-conversation"
import { fetchChatConversation, markChatReadRpc } from "@/lib/data/chats"
import { getSupabaseServerClient } from "@/lib/supabase/server"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const chat = await fetchChatConversation(supabase, id, user.id)
  if (!chat) notFound()

  await markChatReadRpc(supabase, id)

  return (
    <ChatConversation chatId={id} currentUserId={user.id} initialChat={chat} />
  )
}
