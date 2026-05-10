-- Murmur: RLS, RPCs, auth profile hook, catalogs + events seed.
-- Apply with Supabase CLI (`supabase db push`) or SQL editor.
-- Idempotent where possible: drops named policies before recreate.

-- ── Helper: RLS ─────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_relations_looking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_work_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industries_catalog ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS "profiles_select_visible_or_own" ON public.profiles;
CREATE POLICY "profiles_select_visible_or_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR visible = true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- events (anon can validate onboarding codes)
DROP POLICY IF EXISTS "events_select_public" ON public.events;
CREATE POLICY "events_select_public" ON public.events
  FOR SELECT TO anon, authenticated
  USING (true);

-- catalogs (read-only reference data)
DROP POLICY IF EXISTS "cities_catalog_read" ON public.cities_catalog;
CREATE POLICY "cities_catalog_read" ON public.cities_catalog
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "industries_catalog_read" ON public.industries_catalog;
CREATE POLICY "industries_catalog_read" ON public.industries_catalog
  FOR SELECT TO authenticated
  USING (true);

-- profile junctions
DROP POLICY IF EXISTS "profile_relations_select" ON public.profile_relations_looking;
CREATE POLICY "profile_relations_select" ON public.profile_relations_looking
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_relations_looking.profile_id AND p.visible = true)
  );

DROP POLICY IF EXISTS "profile_relations_mutate_own" ON public.profile_relations_looking;
CREATE POLICY "profile_relations_mutate_own" ON public.profile_relations_looking
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "profile_industries_select" ON public.profile_industries;
CREATE POLICY "profile_industries_select" ON public.profile_industries
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_industries.profile_id AND p.visible = true)
  );

DROP POLICY IF EXISTS "profile_industries_mutate_own" ON public.profile_industries;
CREATE POLICY "profile_industries_mutate_own" ON public.profile_industries
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "profile_work_styles_select" ON public.profile_work_styles;
CREATE POLICY "profile_work_styles_select" ON public.profile_work_styles
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_work_styles.profile_id AND p.visible = true)
  );

DROP POLICY IF EXISTS "profile_work_styles_mutate_own" ON public.profile_work_styles;
CREATE POLICY "profile_work_styles_mutate_own" ON public.profile_work_styles
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "profile_events_select" ON public.profile_events;
CREATE POLICY "profile_events_select" ON public.profile_events
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS "profile_events_mutate_own" ON public.profile_events;
CREATE POLICY "profile_events_mutate_own" ON public.profile_events
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "profile_cities_select" ON public.profile_cities;
CREATE POLICY "profile_cities_select" ON public.profile_cities
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = profile_cities.profile_id AND p.visible = true)
  );

DROP POLICY IF EXISTS "profile_cities_mutate_own" ON public.profile_cities;
CREATE POLICY "profile_cities_mutate_own" ON public.profile_cities
  FOR ALL TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- searches
DROP POLICY IF EXISTS "searches_owner_all" ON public.searches;
CREATE POLICY "searches_owner_all" ON public.searches
  FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "search_relations_owner" ON public.search_relations;
CREATE POLICY "search_relations_owner" ON public.search_relations
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.searches s WHERE s.id = search_relations.search_id AND s.owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.searches s WHERE s.id = search_relations.search_id AND s.owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "search_industries_owner" ON public.search_industries;
CREATE POLICY "search_industries_owner" ON public.search_industries
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.searches s WHERE s.id = search_industries.search_id AND s.owner_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.searches s WHERE s.id = search_industries.search_id AND s.owner_id = auth.uid())
  );

-- connections
DROP POLICY IF EXISTS "connections_select_participant" ON public.connections;
CREATE POLICY "connections_select_participant" ON public.connections
  FOR SELECT TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "connections_insert_sender" ON public.connections;
CREATE POLICY "connections_insert_sender" ON public.connections
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "connections_update_participant" ON public.connections;
CREATE POLICY "connections_update_participant" ON public.connections
  FOR UPDATE TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

DROP POLICY IF EXISTS "connections_delete_sender_pending" ON public.connections;
CREATE POLICY "connections_delete_sender_pending" ON public.connections
  FOR DELETE TO authenticated
  USING (sender_id = auth.uid() AND status = 'pending');

-- chats + messages
DROP POLICY IF EXISTS "chats_select_participant" ON public.chats;
CREATE POLICY "chats_select_participant" ON public.chats
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.chat_participants cp WHERE cp.chat_id = chats.id AND cp.profile_id = auth.uid())
  );

DROP POLICY IF EXISTS "chat_participants_select" ON public.chat_participants;
CREATE POLICY "chat_participants_select" ON public.chat_participants
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants me
      WHERE me.chat_id = chat_participants.chat_id AND me.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "chat_participants_update_own" ON public.chat_participants;
CREATE POLICY "chat_participants_update_own" ON public.chat_participants
  FOR UPDATE TO authenticated
  USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "messages_select_participant" ON public.messages;
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.chat_id = messages.chat_id AND cp.profile_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert_participant" ON public.messages;
CREATE POLICY "messages_insert_participant" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_participants cp
      WHERE cp.chat_id = messages.chat_id AND cp.profile_id = auth.uid()
    )
  );

-- ── RPCs (SECURITY DEFINER; bypass RLS for controlled writes) ─────────────

CREATE OR REPLACE FUNCTION public.find_event_by_code(p_code text)
RETURNS public.events
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  e public.events%ROWTYPE;
BEGIN
  SELECT * INTO e FROM public.events
  WHERE upper(code) = upper(trim(p_code))
  LIMIT 1;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  RETURN e;
END;
$$;

CREATE OR REPLACE FUNCTION public.profiles_by_event_code(p_code text)
RETURNS SETOF public.profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.*
  FROM public.profiles p
  INNER JOIN public.profile_events pe
    ON pe.profile_id = p.id AND upper(pe.event_code) = upper(trim(p_code))
  WHERE p.visible = true;
$$;

CREATE OR REPLACE FUNCTION public.join_event(p_code text)
RETURNS public.events
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  e public.events%ROWTYPE;
BEGIN
  SELECT * INTO e FROM public.events
  WHERE upper(code) = upper(trim(p_code))
  LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;
  INSERT INTO public.profile_events (profile_id, event_code, joined_at)
  VALUES (auth.uid(), e.code, now())
  ON CONFLICT (profile_id, event_code) DO NOTHING;
  RETURN e;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_connection(p_connection_id uuid)
RETURNS TABLE (chat_id uuid, connection_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.connections%ROWTYPE;
  new_chat uuid;
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

  RETURN QUERY SELECT new_chat, c.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.ignore_connection(p_connection_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.connections%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.connections WHERE id = p_connection_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN;
  END IF;
  IF c.receiver_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not allowed';
  END IF;
  UPDATE public.connections
  SET status = 'ignored', responded_at = now(), updated_at = now()
  WHERE id = c.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_connection(p_connection_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  c public.connections%ROWTYPE;
BEGIN
  SELECT * INTO c FROM public.connections WHERE id = p_connection_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN;
  END IF;
  IF c.receiver_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'not allowed';
  END IF;
  UPDATE public.connections
  SET status = 'rejected', responded_at = now(), updated_at = now()
  WHERE id = c.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_chat_read(p_chat_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chat_participants
  SET unread_count = 0, last_seen_at = now()
  WHERE chat_id = p_chat_id AND profile_id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.find_event_by_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.profiles_by_event_code(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_event(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_connection(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ignore_connection(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_connection(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.mark_chat_read(uuid) TO authenticated;

-- ── profile_events unique (join_event ON CONFLICT) ─────────────────────────

DO $$
BEGIN
  ALTER TABLE public.profile_events
    ADD CONSTRAINT profile_events_profile_id_event_code_key
    UNIQUE (profile_id, event_code);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ── Auth: ensure profiles row exists ───────────────────────────────────────

CREATE OR REPLACE FUNCTION public.sync_profile_from_auth()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  display_name text;
  inits text;
BEGIN
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
    stats_messages
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
    0
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profiles ON auth.users;
CREATE TRIGGER on_auth_user_created_profiles
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_from_auth();

-- ── Seed: industries (for search_industries / profile_industries FK) ────────

INSERT INTO public.industries_catalog (slug, name, sort_order) VALUES
  ('fintech', 'Fintech', 10),
  ('healthtech', 'Healthtech', 20),
  ('edtech', 'Edtech', 30),
  ('logistica', 'Logística', 40),
  ('consumer', 'Consumer', 50),
  ('b2b', 'B2B', 60),
  ('b2b-saas', 'B2B SaaS', 70),
  ('saas', 'SaaS', 80),
  ('devtools', 'DevTools', 90),
  ('ai', 'AI', 100),
  ('climate', 'Climate', 110),
  ('deeptech', 'DeepTech', 120),
  ('crypto', 'Crypto', 130),
  ('marketplace', 'Marketplace', 140),
  ('infra', 'Infra', 150),
  ('gaming', 'Gaming', 160),
  ('hardware', 'Hardware', 170),
  ('e-commerce', 'E-commerce', 180),
  ('retail', 'Retail', 190),
  ('real-estate', 'Real Estate', 200),
  ('proptech', 'Proptech', 210),
  ('legaltech', 'Legaltech', 220),
  ('insurtech', 'Insurtech', 230),
  ('agtech', 'Agtech', 240),
  ('foodtech', 'Foodtech', 250),
  ('traveltech', 'Traveltech', 260),
  ('cybersecurity', 'Cybersecurity', 270),
  ('data', 'Data', 280),
  ('analytics', 'Analytics', 290),
  ('hrtech', 'HRTech', 300),
  ('creator-economy', 'Creator Economy', 310),
  ('media', 'Media', 320),
  ('entertainment', 'Entertainment', 330),
  ('biotech', 'Biotech', 340),
  ('robotics', 'Robotics', 350),
  ('energia', 'Energía', 360),
  ('movilidad', 'Movilidad', 370),
  ('transporte', 'Transporte', 380),
  ('supply-chain', 'Supply Chain', 390),
  ('manufactura', 'Manufactura', 400),
  ('construccion', 'Construcción', 410),
  ('educacion', 'Educación', 420),
  ('salud', 'Salud', 430),
  ('wellness', 'Wellness', 440),
  ('sports', 'Sports', 450),
  ('comunidad', 'Comunidad', 460),
  ('productividad', 'Productividad', 470),
  ('finanzas-personales', 'Finanzas personales', 480),
  ('pagos', 'Pagos', 490),
  ('lending', 'Lending', 500),
  ('open-finance', 'Open Finance', 510),
  ('govtech', 'GovTech', 520),
  ('impacto-social', 'Impacto social', 530),
  ('sostenibilidad', 'Sostenibilidad', 540),
  ('aeroespacial', 'Aeroespacial', 550),
  ('telecom', 'Telecom', 560),
  ('seguros', 'Seguros', 570),
  ('recruiting', 'Recruiting', 580),
  ('ventas', 'Ventas', 590),
  ('marketing', 'Marketing', 600),
  ('no-code', 'No-code', 610),
  ('web3', 'Web3', 620),
  ('iot', 'IoT', 630),
  ('ar-vr', 'AR/VR', 640)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;

-- ── Seed: sample events (codes used in onboarding / production) ───────────

INSERT INTO public.events (code, name, description) VALUES
  ('BLDR26', 'BuilderConf 2026', 'Conferencia anual de builders en LatAm.'),
  ('LATAM7', 'LatAm Founders Mixer', 'Mixer de founders LatAm conectando 7 ciudades.'),
  ('MTYDEV', 'MTY Dev Night', 'Encuentro de ingeniería en Monterrey.')
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- ── Optional: a few cities (profile_cities FK) ─────────────────────────────

INSERT INTO public.cities_catalog (slug, name, sort_order, country) VALUES
  ('ciudad-de-mexico', 'Ciudad de México', 1, 'MX'),
  ('guadalajara', 'Guadalajara', 2, 'MX'),
  ('monterrey', 'Monterrey', 3, 'MX'),
  ('bogota', 'Bogotá', 4, 'CO'),
  ('miami', 'Miami', 5, 'US')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, sort_order = EXCLUDED.sort_order;
