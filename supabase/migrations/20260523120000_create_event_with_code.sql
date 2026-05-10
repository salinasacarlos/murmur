-- Alta de eventos ad-hoc por usuarios autenticados (código + nombre; el creador queda unido).

CREATE OR REPLACE FUNCTION public.create_event_with_code(
  p_code text,
  p_name text,
  p_description text DEFAULT NULL
) RETURNS public.events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
  v_name text;
  v_desc text;
  v_n int;
  e public.events%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Debes iniciar sesión.';
  END IF;

  v_code := upper(trim(p_code));
  IF length(v_code) <> 6 OR v_code !~ '^[A-Z0-9]+$' THEN
    RAISE EXCEPTION 'El código debe tener exactamente 6 letras o números.';
  END IF;

  v_name := trim(p_name);
  IF length(v_name) < 2 THEN
    RAISE EXCEPTION 'Añade un nombre de evento (al menos 2 caracteres).';
  END IF;

  v_desc := NULLIF(trim(COALESCE(p_description, '')), '');

  SELECT COUNT(*) INTO v_n FROM public.events WHERE upper(code) = v_code;
  IF v_n > 0 THEN
    RAISE EXCEPTION 'Este código ya está en uso. Prueba con otro.';
  END IF;

  INSERT INTO public.events (code, name, description, created_by)
  VALUES (v_code, v_name, v_desc, auth.uid())
  RETURNING * INTO e;

  INSERT INTO public.profile_events (profile_id, event_code, joined_at)
  VALUES (auth.uid(), e.code, now())
  ON CONFLICT (profile_id, event_code) DO NOTHING;

  RETURN e;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_event_with_code(text, text, text) TO authenticated;
