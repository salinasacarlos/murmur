-- Generar códigos de invitación para usuarios que ya tenían onboarding_completed
-- antes del trigger profiles_onboarding_completed_invite_codes (idempotente).

DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT p.id
    FROM public.profiles p
    WHERE p.onboarding_completed = true
      AND (
        SELECT COUNT(*)::int
        FROM public.invitations i
        WHERE i.inviter_id = p.id AND i.is_master = false
      ) < 5
  LOOP
    PERFORM public.ensure_inviter_codes(r.id);
  END LOOP;
END $$;
