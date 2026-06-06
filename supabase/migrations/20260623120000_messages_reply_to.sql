-- Respuestas citadas en chat (estilo WhatsApp).

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS reply_to_message_id uuid
    REFERENCES public.messages (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS messages_reply_to_message_id_idx
  ON public.messages (reply_to_message_id);

COMMENT ON COLUMN public.messages.reply_to_message_id IS
  'Mensaje al que responde esta burbuja, si aplica.';
