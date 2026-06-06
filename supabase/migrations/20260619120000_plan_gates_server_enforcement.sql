-- Refuerzo server-side de límites Free (alineado con lib/plan-limits.ts).
-- accept_connection ya validaba conexiones aceptadas al aceptar; aquí: ciudades,
-- búsquedas activas y envío de solicitudes.

CREATE OR REPLACE FUNCTION public.count_accepted_connections(p_profile_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int
  FROM public.connections c
  WHERE c.status = 'accepted'::public.connection_status
    AND (c.sender_id = p_profile_id OR c.receiver_id = p_profile_id);
$$;

CREATE OR REPLACE FUNCTION public.enforce_free_profile_cities_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_plan public.user_plan;
  city_count integer;
BEGIN
  SELECT p.plan INTO owner_plan
  FROM public.profiles p
  WHERE p.id = NEW.profile_id;

  IF COALESCE(owner_plan, 'free'::public.user_plan) = 'premium'::public.user_plan THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*)::int INTO city_count
  FROM public.profile_cities pc
  WHERE pc.profile_id = NEW.profile_id;

  IF city_count >= 1 THEN
    RAISE EXCEPTION '%',
      'Límite Free: solo puedes tener una ciudad en tu radar. Actualiza a Premium para varias ciudades.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_free_active_search_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  owner_plan public.user_plan;
  active_others integer;
BEGIN
  IF NEW.status IS DISTINCT FROM 'active'::public.search_status THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE'
     AND OLD.status = 'active'::public.search_status
     AND NEW.status = 'active'::public.search_status THEN
    RETURN NEW;
  END IF;

  SELECT p.plan INTO owner_plan
  FROM public.profiles p
  WHERE p.id = NEW.owner_id;

  IF COALESCE(owner_plan, 'free'::public.user_plan) = 'premium'::public.user_plan THEN
    RETURN NEW;
  END IF;

  SELECT COUNT(*)::int INTO active_others
  FROM public.searches s
  WHERE s.owner_id = NEW.owner_id
    AND s.status = 'active'::public.search_status
    AND s.id IS DISTINCT FROM NEW.id;

  IF active_others >= 1 THEN
    RAISE EXCEPTION '%',
      'En el plan Free solo puedes tener una búsqueda activa. Pausa la otra o actualiza a Premium para varias activas.';
  END IF;

  RETURN NEW;
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

  IF accepted_count >= 10 THEN
    RAISE EXCEPTION '%',
      'En el plan Free tienes hasta 10 conexiones aceptadas. Actualiza a Premium para conectar sin límite.';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_cities_enforce_free_plan ON public.profile_cities;
CREATE TRIGGER profile_cities_enforce_free_plan
  BEFORE INSERT ON public.profile_cities
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_free_profile_cities_limit();

DROP TRIGGER IF EXISTS searches_enforce_free_active_limit ON public.searches;
CREATE TRIGGER searches_enforce_free_active_limit
  BEFORE INSERT OR UPDATE OF status ON public.searches
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_free_active_search_limit();

DROP TRIGGER IF EXISTS connections_enforce_free_send_limit ON public.connections;
CREATE TRIGGER connections_enforce_free_send_limit
  BEFORE INSERT ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_free_connection_send_limit();
