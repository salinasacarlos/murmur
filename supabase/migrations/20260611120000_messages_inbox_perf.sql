-- Rendimiento lista de mensajes: un índice acorde a "último por chat" y RPC que evita N+1.
-- Aplicar en remoto: Supabase SQL editor o `supabase db push`.

CREATE INDEX IF NOT EXISTS messages_chat_id_sent_at_desc_idx
  ON public.messages (chat_id, sent_at DESC);

CREATE OR REPLACE FUNCTION public.last_messages_for_chats(p_chat_ids uuid[])
RETURNS SETOF public.messages
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT DISTINCT ON (m.chat_id) m.*
  FROM public.messages m
  WHERE m.chat_id = ANY(p_chat_ids)
  ORDER BY m.chat_id, m.sent_at DESC;
$$;

COMMENT ON FUNCTION public.last_messages_for_chats(uuid[]) IS
  'Último mensaje por chat (lista inbox). RLS de messages aplica como invoker.';

GRANT EXECUTE ON FUNCTION public.last_messages_for_chats(uuid[]) TO authenticated;
