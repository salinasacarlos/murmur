-- Permitir que el usuario borre sus propias notificaciones in-app.

DROP POLICY IF EXISTS "notifications_delete_own" ON public.notifications;
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
