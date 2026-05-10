-- Notificaciones in-app: lectura, reglas de frecuencia, disparadores de conexión.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS notifications_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz NOT NULL DEFAULT now();

COMMENT ON COLUMN public.profiles.notifications_enabled IS 'Si es false, no se encolan notificaciones (salvo política futura).';
COMMENT ON COLUMN public.profiles.last_active_at IS 'Última actividad en app; para inactividad y no molestar si está activo.';

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS venue_city text NULL;

COMMENT ON COLUMN public.events.venue_city IS 'Ciudad del evento (texto libre) para avisos locales.';

DO $$
BEGIN
  CREATE TYPE public.notification_kind AS ENUM (
    'connection_request',
    'connection_accepted',
    'discovery_batch',
    'event_nearby',
    'project_invite',
    'profile_incomplete',
    'inactivity_nudge'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  kind public.notification_kind NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS notifications_user_unread_idx
  ON public.notifications (user_id)
  WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Inserción solo vía SECURITY DEFINER (triggers / RPC).

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

  -- Conexión: tiempo real, sin tope diario ni cooldown 7d.
  IF p_kind IN ('connection_request', 'connection_accepted') THEN
    INSERT INTO public.notifications (user_id, kind, title, body, metadata)
    VALUES (p_user_id, p_kind, p_title, p_body, COALESCE(p_metadata, '{}'::jsonb))
    RETURNING id INTO v_id;
    RETURN v_id;
  END IF;

  -- Máx. 3 / día (UTC) para tipos no-conexión
  SELECT COUNT(*) INTO v_day_count
  FROM public.notifications n
  WHERE n.user_id = p_user_id
    AND (n.created_at AT TIME ZONE 'utc')::date = (now() AT TIME ZONE 'utc')::date
    AND n.kind NOT IN ('connection_request', 'connection_accepted');

  IF v_day_count >= 3 THEN
    RETURN NULL;
  END IF;

  -- Cooldown: 7 días entre mismos tipos (digest / eventos / proyecto)
  IF p_kind IN (
    'discovery_batch',
    'event_nearby',
    'project_invite'
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

CREATE OR REPLACE FUNCTION public.trg_connections_notify_receiver()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s_name text;
  s_photo text;
BEGIN
  IF NEW.status IS DISTINCT FROM 'pending'::public.connection_status THEN
    RETURN NEW;
  END IF;
  SELECT p.name, p.photo_url INTO s_name, s_photo
  FROM public.profiles p WHERE p.id = NEW.sender_id;
  PERFORM public.enqueue_notification(
    NEW.receiver_id,
    'connection_request',
    COALESCE(s_name, 'Alguien') || ' quiere conectar contigo',
    'Toca para ir a Conexiones.',
    jsonb_build_object(
      'connection_id', NEW.id,
      'sender_id', NEW.sender_id,
      'sender_name', COALESCE(s_name, ''),
      'sender_photo_url', s_photo
    )
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS connections_after_insert_notify ON public.connections;
CREATE TRIGGER connections_after_insert_notify
  AFTER INSERT ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.trg_connections_notify_receiver();

-- Aceptación + aviso al remitente (con chat_id), en la misma transacción
DROP FUNCTION IF EXISTS public.accept_connection(uuid);

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

GRANT EXECUTE ON FUNCTION public.accept_connection(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.touch_profile_activity()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.profiles
  SET last_active_at = now()
  WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.touch_profile_activity() TO authenticated;

-- Digests: invocar al abrir /notificaciones (máx. una pasada por carga).
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

  -- 3) Descubrimiento agrupado (semana): ≥3 perfiles nuevos (7d), misma industria o ≥2 talentos en común
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

  -- 4) Evento en ciudad (placeholder: venue_city vs city del perfil)
  IF me.city IS NOT NULL AND length(trim(me.city)) > 0 THEN
    SELECT COUNT(*)::int INTO n
    FROM public.events e
    WHERE e.venue_city IS NOT NULL
      AND lower(trim(e.venue_city)) = lower(trim(me.city))
      AND e.created_at > now() - interval '7 days';
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

  -- 5) Invitación proyecto (manual / futuro RPC): sin auto-generación aquí

  -- 6) Perfil incompleto: 48h tras registro, < ~70% aproximado, no activo reciente
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

  -- 7) Inactividad: 14 días sin actividad
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

GRANT EXECUTE ON FUNCTION public.ensure_digest_notifications() TO authenticated;
