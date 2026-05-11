-- Permitir leer el perfil de la contraparte en conexiones pendientes o aceptadas
-- aunque tenga visible = false (Descubrir sigue filtrando por visible; chats/conexiones no se rompen).

DROP POLICY IF EXISTS "profiles_select_visible_or_own" ON public.profiles;
CREATE POLICY "profiles_select_visible_or_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    id = auth.uid()
    OR visible = true
    OR EXISTS (
      SELECT 1
      FROM public.connections c
      WHERE c.status IN ('accepted', 'pending')
        AND (
          (c.sender_id = auth.uid() AND c.receiver_id = profiles.id)
          OR (c.receiver_id = auth.uid() AND c.sender_id = profiles.id)
        )
    )
  );
