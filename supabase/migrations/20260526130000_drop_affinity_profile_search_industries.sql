-- Elimina verticales de afinidad (profile_industries / search_industries).
-- La taxonomía única de foco queda en primary_industry_slug + expertise_slugs.

COMMENT ON COLUMN public.events.primary_industry_slug IS 'Industria del evento; el digest local exige la misma industria principal del perfil.';

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
      AND e.primary_industry_slug IS NOT DISTINCT FROM me.primary_industry_slug;
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

DROP TABLE IF EXISTS public.search_industries;
DROP TABLE IF EXISTS public.profile_industries;
