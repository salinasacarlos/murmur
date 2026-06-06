-- Ajuste tope Free: conexiones aceptadas (11 por usuario en plan free).

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

  IF COALESCE(s_plan, 'free'::public.user_plan) = 'free'::public.user_plan AND s_cnt >= 11 THEN
    RAISE EXCEPTION '%', 'Límite Free: la otra persona ya tiene 11 conexiones aceptadas.';
  END IF;
  IF COALESCE(r_plan, 'free'::public.user_plan) = 'free'::public.user_plan AND r_cnt >= 11 THEN
    RAISE EXCEPTION '%', 'Límite Free: ya tienes 11 conexiones. Actualiza a Premium o desvincula una conexión.';
  END IF;

  UPDATE public.connections
  SET status = 'accepted', responded_at = now(), updated_at = now()
  WHERE id = c.id;

  INSERT INTO public.chats (connection_id, last_message_at)
  VALUES (c.id, now())
  RETURNING id INTO new_chat;

  SELECT name INTO r_name FROM public.profiles WHERE id = c.receiver_id;

  RETURN QUERY SELECT new_chat, c.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_free_connection_send_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sender_plan public.user_plan;
  accepted_count integer;
BEGIN
  SELECT p.plan INTO sender_plan
  FROM public.profiles p
  WHERE p.id = NEW.sender_id;

  IF COALESCE(sender_plan, 'free'::public.user_plan) = 'premium'::public.user_plan THEN
    RETURN NEW;
  END IF;

  accepted_count := public.count_accepted_connections(NEW.sender_id);

  IF accepted_count >= 11 THEN
    RAISE EXCEPTION '%',
      'En el plan Free tienes hasta 11 conexiones aceptadas. Actualiza a Premium para conectar sin límite.';
  END IF;

  RETURN NEW;
END;
$$;
