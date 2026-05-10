-- Eventos: industria para avisos locales (ciudad + industria en común).
-- Invitaciones a colaborar: registro + RPC que encola project_invite.

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS primary_industry_slug text NULL
  REFERENCES public.industries (slug);

COMMENT ON COLUMN public.events.primary_industry_slug IS 'Industria del evento; el digest local exige la misma industria que el perfil (principal o en profile_industries).';

DO $$
BEGIN
  CREATE TYPE public.project_invite_status AS ENUM ('pending', 'declined');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.project_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  invitee_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  title text NOT NULL,
  context_path text NOT NULL DEFAULT '/searches',
  status public.project_invite_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_invites_no_self CHECK (inviter_id <> invitee_id)
);

CREATE INDEX IF NOT EXISTS project_invites_invitee_idx
  ON public.project_invites (invitee_id, created_at DESC);

ALTER TABLE public.project_invites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "project_invites_select_parties" ON public.project_invites;
CREATE POLICY "project_invites_select_parties" ON public.project_invites
  FOR SELECT TO authenticated
  USING (inviter_id = auth.uid() OR invitee_id = auth.uid());

CREATE OR REPLACE FUNCTION public.send_project_invite(
  p_invitee_id uuid,
  p_title text,
  p_context_path text DEFAULT '/searches'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_name text;
  v_photo text;
  v_path text;
BEGIN
  IF p_invitee_id IS NULL OR p_invitee_id = auth.uid() THEN
    RAISE EXCEPTION 'invalid invitee';
  END IF;
  IF p_title IS NULL OR length(trim(p_title)) = 0 THEN
    RAISE EXCEPTION 'title required';
  END IF;

  v_path := COALESCE(NULLIF(TRIM(p_context_path), ''), '/searches');
  IF v_path !~ '^/' THEN
    v_path := '/' || v_path;
  END IF;

  INSERT INTO public.project_invites (inviter_id, invitee_id, title, context_path)
  VALUES (auth.uid(), p_invitee_id, TRIM(p_title), v_path)
  RETURNING id INTO v_id;

  SELECT p.name, p.photo_url INTO v_name, v_photo
  FROM public.profiles p
  WHERE p.id = auth.uid();

  PERFORM public.enqueue_notification(
    p_invitee_id,
    'project_invite',
    COALESCE(v_name, 'Alguien') || ' te invitó a colaborar en un proyecto.',
    TRIM(p_title),
    jsonb_build_object(
      'project_invite_id', v_id,
      'inviter_id', auth.uid(),
      'inviter_name', COALESCE(v_name, ''),
      'inviter_photo_url', v_photo,
      'context_path', v_path
    )
  );

  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.decline_project_invite(p_invite_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.project_invites%ROWTYPE;
BEGIN
  SELECT * INTO r FROM public.project_invites WHERE id = p_invite_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;
  IF r.invitee_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not allowed';
  END IF;
  IF r.status IS DISTINCT FROM 'pending'::public.project_invite_status THEN
    RETURN;
  END IF;
  UPDATE public.project_invites
  SET status = 'declined', updated_at = now()
  WHERE id = r.id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.send_project_invite(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.decline_project_invite(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.ensure_digest_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  me public.profiles%ROWTYPE;
  n int;
  v_title text;
  v_body text;
  active_recent boolean;
  hours_reg numeric;
  approx_ok int;
  approx_total int := 8;
BEGIN
  SELECT * INTO me FROM public.profiles WHERE id = auth.uid();
  IF NOT FOUND THEN
    RETURN;
  END IF;

  active_recent := me.last_active_at > now() - interval '24 hours';

  SELECT COUNT(DISTINCT o.id) INTO n
  FROM public.profiles o
  WHERE o.visible = true
    AND o.id <> me.id
    AND o.created_at > now() - interval '7 days'
    AND (
      (me.primary_industry_slug IS NOT NULL AND o.primary_industry_slug IS NOT DISTINCT FROM me.primary_industry_slug)
      OR (
        cardinality(o.talent_slugs) > 0
        AND cardinality(me.talent_slugs) > 0
        AND (
          SELECT COUNT(*)::int
          FROM unnest(o.talent_slugs) AS tal
          WHERE tal = ANY (me.talent_slugs)
        ) >= 2
      )
    );

  IF n >= 3 THEN
    v_title := 'Nuevos perfiles que te armonizan';
    v_body := format(
      'Hay %s personas nuevas en Murmur que encajan con lo que haces.',
      n
    );
    PERFORM public.enqueue_notification(
      me.id,
      'discovery_batch',
      v_title,
      v_body,
      jsonb_build_object('count', n)
    );
  END IF;

  IF me.city IS NOT NULL AND length(trim(me.city)) > 0 THEN
    SELECT COUNT(*)::int INTO n
    FROM public.events e
    WHERE e.venue_city IS NOT NULL
      AND e.primary_industry_slug IS NOT NULL
      AND lower(trim(e.venue_city)) = lower(trim(me.city))
      AND e.created_at > now() - interval '7 days'
      AND (
        e.primary_industry_slug IS NOT DISTINCT FROM me.primary_industry_slug
        OR EXISTS (
          SELECT 1
          FROM public.profile_industries pi
          WHERE pi.profile_id = me.id
            AND pi.industry_slug = e.primary_industry_slug
        )
      );
    IF n >= 1 THEN
      PERFORM public.enqueue_notification(
        me.id,
        'event_nearby',
        'Un evento cerca de ti',
        format(
          'Hay un evento en %s que podría interesarte.',
          trim(me.city)
        ),
        jsonb_build_object('city', trim(me.city))
      );
    END IF;
  END IF;

  hours_reg := extract(epoch from (now() - me.created_at)) / 3600.0;
  approx_ok := 0;
  IF length(trim(me.name)) > 0 THEN approx_ok := approx_ok + 1; END IF;
  IF length(trim(me.role)) > 0 THEN approx_ok := approx_ok + 1; END IF;
  IF length(trim(me.bio)) > 0 THEN approx_ok := approx_ok + 1; END IF;
  IF me.photo_url IS NOT NULL THEN approx_ok := approx_ok + 1; END IF;
  IF me.primary_industry_slug IS NOT NULL THEN approx_ok := approx_ok + 1; END IF;
  IF cardinality(me.expertise_slugs) >= 1 THEN approx_ok := approx_ok + 1; END IF;
  IF cardinality(me.talent_slugs) >= 1 THEN approx_ok := approx_ok + 1; END IF;
  IF length(trim(me.city)) > 0 THEN approx_ok := approx_ok + 1; END IF;

  IF hours_reg >= 48
     AND (approx_ok::numeric / approx_total) < 0.7
     AND NOT active_recent THEN
    PERFORM public.enqueue_notification(
      me.id,
      'profile_incomplete',
      'Tu perfil aún vuela bajo',
      format(
        'Tu perfil está al %s%%. Complétalo para aparecer en más búsquedas.',
        round((approx_ok::numeric / approx_total) * 100)
      ),
      jsonb_build_object('approx_percent', round((approx_ok::numeric / approx_total) * 100))
    );
  END IF;

  IF me.last_active_at < now() - interval '14 days' THEN
    PERFORM public.enqueue_notification(
      me.id,
      'inactivity_nudge',
      'Te extrañamos en el radar',
      'Llevas un tiempo fuera. Hay gente nueva esperando conectar.',
      '{}'::jsonb
    );
  END IF;
END;
$$;

-- Datos de ejemplo: ciudad + industria para probar avisos locales
UPDATE public.events
SET
  venue_city = COALESCE(venue_city, 'Monterrey'),
  primary_industry_slug = COALESCE(primary_industry_slug, 'tecnologia-ia')
WHERE code = 'MTYDEV';

UPDATE public.events
SET
  venue_city = COALESCE(venue_city, 'Ciudad de México'),
  primary_industry_slug = COALESCE(primary_industry_slug, 'tecnologia-ia')
WHERE code = 'BLDR26';

UPDATE public.events
SET
  venue_city = COALESCE(venue_city, 'Ciudad de México'),
  primary_industry_slug = COALESCE(primary_industry_slug, 'finanzas-fintech')
WHERE code = 'LATAM7';
