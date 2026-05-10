-- Gates plan Free: aceptar conexión solo si ambos tienen <10 conexiones aceptadas cuando plan es free.
-- Alta compatibilidad: solo usuarios premium.

CREATE OR REPLACE FUNCTION public.accept_connection(p_connection_id uuid)
RETURNS TABLE (chat_id uuid, connection_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.connections%ROWTYPE;
  new_chat uuid;
  r_name text;
  s_plan public.user_plan;
  r_plan public.user_plan;
  s_cnt int;
  r_cnt int;
BEGIN
  SELECT * INTO c FROM public.connections WHERE id = p_connection_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'connection not found';
  END IF;
  IF c.receiver_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not allowed';
  END IF;
  IF c.status IS DISTINCT FROM 'pending'::public.connection_status THEN
    RAISE EXCEPTION 'invalid status';
  END IF;

  SELECT p.plan INTO s_plan FROM public.profiles p WHERE p.id = c.sender_id;
  SELECT p.plan INTO r_plan FROM public.profiles p WHERE p.id = c.receiver_id;

  SELECT COUNT(*)::int INTO s_cnt
  FROM public.connections x
  WHERE x.status = 'accepted'::public.connection_status
    AND (x.sender_id = c.sender_id OR x.receiver_id = c.sender_id);

  SELECT COUNT(*)::int INTO r_cnt
  FROM public.connections x
  WHERE x.status = 'accepted'::public.connection_status
    AND (x.sender_id = c.receiver_id OR x.receiver_id = c.receiver_id);

  IF COALESCE(s_plan, 'free'::public.user_plan) = 'free'::public.user_plan AND s_cnt >= 10 THEN
    RAISE EXCEPTION '%', 'Límite Free: la otra persona ya tiene 10 conexiones aceptadas.';
  END IF;
  IF COALESCE(r_plan, 'free'::public.user_plan) = 'free'::public.user_plan AND r_cnt >= 10 THEN
    RAISE EXCEPTION '%', 'Límite Free: ya tienes 10 conexiones. Actualiza a Premium o desvincula una conexión.';
  END IF;

  UPDATE public.connections
  SET status = 'accepted', responded_at = now(), updated_at = now()
  WHERE id = c.id;

  INSERT INTO public.chats (connection_id, last_message_at)
  VALUES (c.id, now())
  RETURNING id INTO new_chat;

  INSERT INTO public.chat_participants (chat_id, profile_id, unread_count, joined_at)
  VALUES
    (new_chat, c.sender_id, 0, now()),
    (new_chat, c.receiver_id, 0, now());

  SELECT p.name INTO r_name FROM public.profiles p WHERE p.id = c.receiver_id;
  PERFORM public.enqueue_notification(
    c.sender_id,
    'connection_accepted',
    COALESCE(r_name, 'Alguien') || ' aceptó tu solicitud.',
    'Ya son parte del mismo vuelo.',
    jsonb_build_object(
      'connection_id', c.id,
      'chat_id', new_chat,
      'acceptor_id', c.receiver_id
    )
  );

  RETURN QUERY SELECT new_chat, c.id;
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
  me_plan public.user_plan;
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

  SELECT p.plan INTO me_plan FROM public.profiles p WHERE p.id = me;
  IF COALESCE(me_plan, 'free'::public.user_plan) IS DISTINCT FROM 'premium'::public.user_plan THEN
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
