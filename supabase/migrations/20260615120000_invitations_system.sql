-- Invitaciones Murmur: tabla, RLS, consumo al confirmar email, 5 códigos al completar onboarding.
-- Master: is_master=true, inviter_id NULL, código reutilizable (no pasa a used).

-- ── Perfil: guardar código usado en alta (consumo diferido si email sin confirmar) ──
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS signup_invite_code text NULL;

COMMENT ON COLUMN public.profiles.signup_invite_code IS
  'Código de invitación normalizado (MRM-XXXXXXXX) al registrarse; consumo al confirmar email.';

-- ── Tabla invitations ───────────────────────────────────────────────────────────
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  inviter_id uuid NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  invitee_id uuid NULL REFERENCES public.profiles (id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending',
      CONSTRAINT invitations_status_chk
        CHECK (status IN ('pending', 'used')),
  is_master boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz NULL,
  CONSTRAINT invitations_inviter_master_chk CHECK (
    (is_master = true AND inviter_id IS NULL)
    OR (is_master = false AND inviter_id IS NOT NULL)
  )
);

CREATE UNIQUE INDEX invitations_code_key ON public.invitations (code);
CREATE INDEX invitations_inviter_id_created_at_idx
  ON public.invitations (inviter_id, created_at DESC);

COMMENT ON TABLE public.invitations IS
  'Códigos de invitación; master reutilizable, resto pending/used una sola vez.';

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Solo el invitador ve sus filas (no-master)
CREATE POLICY "invitations_select_inviter_own"
  ON public.invitations FOR SELECT TO authenticated
  USING (inviter_id = auth.uid());

-- ── Política: leer perfil de quien usó tu código (aunque visible = false) ───────
CREATE POLICY "profiles_select_if_my_invitee"
  ON public.profiles FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i
      WHERE i.invitee_id = profiles.id
        AND i.inviter_id = auth.uid()
    )
  );

-- ── Utilidades ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.normalize_invite_code(p_raw text)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  s text;
BEGIN
  IF p_raw IS NULL OR btrim(p_raw) = '' THEN
    RETURN NULL;
  END IF;
  s := upper(regexp_replace(btrim(p_raw), '[^A-Z0-9]', '', 'g'));
  IF length(s) = 11 AND left(s, 3) = 'MRM' THEN
    RETURN 'MRM-' || substring(s from 4 for 8);
  END IF;
  IF length(s) = 8 THEN
    RETURN 'MRM-' || s;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.random_invite_suffix()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(alphabet, 1 + floor(random() * 36)::int, 1);
  END LOOP;
  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.preview_invitation(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ncode text;
  invitation_row public.invitations%ROWTYPE;
  inv_name text;
  inv_photo text;
  inv_role text;
BEGIN
  ncode := public.normalize_invite_code(p_code);
  IF ncode IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'format');
  END IF;

  SELECT * INTO invitation_row FROM public.invitations WHERE code = ncode;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_found');
  END IF;

  IF invitation_row.is_master THEN
    RETURN jsonb_build_object(
      'ok', true,
      'master', true,
      'inviter', null
    );
  END IF;

  IF invitation_row.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'used');
  END IF;

  SELECT p.name, p.photo_url, p.role
    INTO inv_name, inv_photo, inv_role
  FROM public.profiles p
  WHERE p.id = invitation_row.inviter_id;

  RETURN jsonb_build_object(
    'ok', true,
    'master', false,
    'inviter', jsonb_build_object(
      'name', inv_name,
      'photoUrl', inv_photo,
      'role', inv_role
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.preview_invitation(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.consume_invitation_for_user(
  p_user_id uuid,
  p_code text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ncode text;
  invitation_row public.invitations%ROWTYPE;
BEGIN
  ncode := public.normalize_invite_code(p_code);
  IF ncode IS NULL THEN
    RAISE EXCEPTION 'INVITE_MISSING';
  END IF;

  SELECT * INTO invitation_row
  FROM public.invitations
  WHERE code = ncode
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVITE_NOT_FOUND';
  END IF;

  IF invitation_row.is_master THEN
    RETURN;
  END IF;

  IF invitation_row.status = 'used'
     AND invitation_row.invitee_id IS NOT DISTINCT FROM p_user_id THEN
    RETURN;
  END IF;

  IF invitation_row.status = 'used' THEN
    RAISE EXCEPTION 'INVITE_ALREADY_USED';
  END IF;

  UPDATE public.invitations
  SET status = 'used',
      invitee_id = p_user_id,
      used_at = now()
  WHERE id = invitation_row.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_inviter_codes(p_inviter_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cnt int;
  need int;
  attempts int;
  new_code text;
  i int;
BEGIN
  SELECT COUNT(*)::int INTO cnt
  FROM public.invitations
  WHERE inviter_id = p_inviter_id
    AND is_master = false;

  IF cnt >= 5 THEN
    RETURN;
  END IF;

  need := 5 - cnt;

  FOR i IN 1..need LOOP
    attempts := 0;
    LOOP
      attempts := attempts + 1;
      IF attempts > 80 THEN
        RAISE EXCEPTION 'INVITE_GENERATION_FAILED';
      END IF;
      new_code := 'MRM-' || public.random_invite_suffix();
      BEGIN
        INSERT INTO public.invitations (code, inviter_id, status, is_master)
        VALUES (new_code, p_inviter_id, 'pending', false);
        EXIT;
      EXCEPTION
        WHEN unique_violation THEN
          NULL; -- reintentar
      END;
    END LOOP;
  END LOOP;
END;
$$;

-- ── Auth: perfil + validación de invitación ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_profile_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name text;
  inits text;
  invite_raw text;
  ncode text;
  invitation_row public.invitations%ROWTYPE;
BEGIN
  invite_raw := COALESCE(NEW.raw_user_meta_data->>'invite_code', '');
  ncode := public.normalize_invite_code(invite_raw);
  IF ncode IS NULL THEN
    RAISE EXCEPTION 'INVITE_REQUIRED' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO invitation_row FROM public.invitations WHERE code = ncode;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVITE_INVALID' USING ERRCODE = '23514';
  END IF;
  IF NOT invitation_row.is_master AND invitation_row.status <> 'pending' THEN
    RAISE EXCEPTION 'INVITE_USED' USING ERRCODE = '23514';
  END IF;

  display_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(COALESCE(NEW.email, 'user'), '@', 1)
  );
  inits := upper(left(trim(display_name), 2));
  IF inits = '' THEN
    inits := 'U';
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    name,
    initials,
    role,
    bio,
    achievement,
    onboarding_completed,
    online,
    visible,
    plan,
    search_radius_km,
    stats_connections,
    stats_matches,
    stats_messages,
    signup_invite_code
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    display_name,
    inits,
    '',
    '',
    '',
    false,
    false,
    false,
    'free',
    50,
    0,
    0,
    0,
    ncode
  )
  ON CONFLICT (id) DO NOTHING;

  IF NEW.email_confirmed_at IS NOT NULL THEN
    PERFORM public.consume_invitation_for_user(NEW.id, ncode);
  END IF;

  RETURN NEW;
END;
$$;

-- ── Consumo al confirmar email ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.auth_user_email_confirmed_consume_invite()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ncode text;
BEGIN
  IF OLD.email_confirmed_at IS NOT NULL OR NEW.email_confirmed_at IS NULL THEN
    RETURN NEW;
  END IF;

  ncode := public.normalize_invite_code(NEW.raw_user_meta_data->>'invite_code');
  IF ncode IS NULL THEN
    SELECT signup_invite_code INTO ncode FROM public.profiles WHERE id = NEW.id;
  END IF;

  IF ncode IS NULL THEN
    RETURN NEW;
  END IF;

  PERFORM public.consume_invitation_for_user(NEW.id, ncode);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- No bloquear confirmación de email por carrera/uso duplicado raro
    RAISE WARNING 'consume_invitation_for_user failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed_invite ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed_invite
  AFTER UPDATE OF email_confirmed_at ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auth_user_email_confirmed_consume_invite();

-- ── 5 códigos al completar onboarding ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.profiles_onboarding_completed_invite_codes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.onboarding_completed IS NOT TRUE THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'UPDATE' AND COALESCE(OLD.onboarding_completed, false) = true THEN
    RETURN NEW;
  END IF;
  PERFORM public.ensure_inviter_codes(NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_onboarding_completed_invite_codes ON public.profiles;
CREATE TRIGGER profiles_onboarding_completed_invite_codes
  AFTER INSERT OR UPDATE OF onboarding_completed ON public.profiles
  FOR EACH ROW
  WHEN (NEW.onboarding_completed = true)
  EXECUTE FUNCTION public.profiles_onboarding_completed_invite_codes();

-- ── Código master desarrollo (rotar en producción vía SQL) ───────────────────
INSERT INTO public.invitations (code, inviter_id, status, is_master)
VALUES ('MRM-BETA2026', NULL, 'pending', true)
ON CONFLICT (code) DO NOTHING;
