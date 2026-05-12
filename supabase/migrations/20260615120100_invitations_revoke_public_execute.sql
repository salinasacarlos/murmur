-- Evitar EXECUTE público a funciones solo para triggers (consume / generación).
REVOKE ALL ON FUNCTION public.consume_invitation_for_user(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_inviter_codes(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.random_invite_suffix() FROM PUBLIC;
