-- Notificaciones: compatibilidad alta vs búsquedas activas (recomendación de match).

DO $$
BEGIN
  ALTER TYPE public.notification_kind ADD VALUE 'high_compatibility_suggestion';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION public.enqueue_notification(
  p_user_id uuid,
  p_kind public.notification_kind,
  p_title text,
  p_body text,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_day_count int;
  v_last_same timestamptz;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  IF NOT COALESCE(
    (SELECT notifications_enabled FROM public.profiles WHERE id = p_user_id),
    true
  ) THEN
    RETURN NULL;
  END IF;

  IF p_kind IN ('connection_request', 'connection_accepted') THEN
    INSERT INTO public.notifications (user_id, kind, title, body, metadata)
    VALUES (p_user_id, p_kind, p_title, p_body, COALESCE(p_metadata, '{}'::jsonb))
    RETURNING id INTO v_id;
    RETURN v_id;
  END IF;

  SELECT COUNT(*) INTO v_day_count
  FROM public.notifications n
  WHERE n.user_id = p_user_id
    AND (n.created_at AT TIME ZONE 'utc')::date = (now() AT TIME ZONE 'utc')::date
    AND n.kind NOT IN ('connection_request', 'connection_accepted');

  IF v_day_count >= 3 THEN
    RETURN NULL;
  END IF;

  IF p_kind IN (
    'discovery_batch',
    'event_nearby',
    'project_invite',
    'high_compatibility_suggestion'
  ) THEN
    SELECT MAX(created_at) INTO v_last_same
    FROM public.notifications
    WHERE user_id = p_user_id AND kind = p_kind;
    IF v_last_same IS NOT NULL AND v_last_same > now() - interval '7 days' THEN
      RETURN NULL;
    END IF;
  END IF;

  IF p_kind IN ('profile_incomplete', 'inactivity_nudge') THEN
    SELECT MAX(created_at) INTO v_last_same
    FROM public.notifications
    WHERE user_id = p_user_id AND kind = p_kind;
    IF v_last_same IS NOT NULL AND v_last_same > now() - interval '30 days' THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.notifications (user_id, kind, title, body, metadata)
  VALUES (p_user_id, p_kind, p_title, p_body, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.try_enqueue_high_compatibility_suggestion(
  p_user_id uuid,
  p_title text,
  p_body text,
  p_metadata jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pid text;
  v_id uuid;
BEGIN
  IF p_user_id IS NULL THEN
    RETURN NULL;
  END IF;

  v_pid := p_metadata->>'suggested_profile_id';
  IF v_pid IS NULL OR length(trim(v_pid)) = 0 THEN
    RETURN NULL;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.notifications n
    WHERE n.user_id = p_user_id
      AND n.kind = 'high_compatibility_suggestion'::public.notification_kind
      AND n.metadata->>'suggested_profile_id' = v_pid
      AND n.created_at > now() - interval '14 days'
  ) THEN
    RETURN NULL;
  END IF;

  v_id :=
    public.enqueue_notification(
      p_user_id,
      'high_compatibility_suggestion'::public.notification_kind,
      p_title,
      p_body,
      p_metadata
    );
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_high_compatibility_suggestions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  me uuid;
  r RECORD;
  v_title text;
  v_body text;
  v_meta jsonb;
  v_out uuid;
BEGIN
  me := auth.uid();
  IF me IS NULL THEN
    RETURN;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.searches s
    WHERE s.owner_id = me AND s.status = 'active'::public.search_status
  ) THEN
    RETURN;
  END IF;

  FOR r IN
    SELECT
      p.id AS profile_id,
      p.name,
      p.photo_url,
      s.id AS search_id,
      s.title AS search_title
    FROM public.profiles p
    INNER JOIN public.searches s
      ON s.owner_id = me
      AND s.status = 'active'::public.search_status
    WHERE p.visible = true
      AND p.id <> me
      AND (
        s.primary_industry_slug IS NULL
        OR p.primary_industry_slug IS NOT DISTINCT FROM s.primary_industry_slug
      )
      AND (
        COALESCE(cardinality(s.expertise_slugs), 0) = 0
        OR EXISTS (
          SELECT 1
          FROM unnest(s.expertise_slugs) AS ex(slug)
          WHERE ex.slug = ANY (
            COALESCE(p.expertise_slugs, p.functional_area_tags, ARRAY[]::text[])
          )
        )
      )
      AND (
        COALESCE(cardinality(s.talent_slugs), 0) = 0
        OR EXISTS (
          SELECT 1
          FROM unnest(s.talent_slugs) AS tal(slug)
          WHERE tal.slug = ANY (COALESCE(p.talent_slugs, ARRAY[]::text[]))
        )
      )
      AND (
        NOT EXISTS (
          SELECT 1 FROM public.search_relations sr WHERE sr.search_id = s.id
        )
        OR EXISTS (
          SELECT 1
          FROM public.search_relations sr
          INNER JOIN public.profile_relations_looking pr
            ON pr.profile_id = p.id
            AND pr.relation = sr.relation
          WHERE sr.search_id = s.id
        )
      )
      AND NOT EXISTS (
        SELECT 1
        FROM public.connections c
        WHERE (c.sender_id = me AND c.receiver_id = p.id)
           OR (c.sender_id = p.id AND c.receiver_id = me)
      )
    ORDER BY p.updated_at DESC NULLS LAST
    LIMIT 25
  LOOP
    v_title :=
      COALESCE(r.name, 'Alguien') || ' armoniza con tu búsqueda.';
    v_body :=
      format(
        'Encaja con «%s». Quizá sea buen momento para tender un puente.',
        r.search_title
      );
    v_meta :=
      jsonb_build_object(
        'suggested_profile_id', r.profile_id,
        'search_id', r.search_id,
        'search_title', r.search_title,
        'sender_name', COALESCE(r.name, ''),
        'sender_photo_url', r.photo_url
      );

    v_out :=
      public.try_enqueue_high_compatibility_suggestion(me, v_title, v_body, v_meta);
    EXIT WHEN v_out IS NOT NULL;
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ensure_high_compatibility_suggestions() TO authenticated;
