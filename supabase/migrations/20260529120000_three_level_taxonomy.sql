-- Taxonomía 3 niveles: industria → vertical (≤3) → expertise (≤5).
-- Verticales: industry_verticals (generales {industria}-general + hojas industries_catalog).

CREATE TABLE public.industry_verticals (
  slug text PRIMARY KEY,
  industry_slug text NOT NULL REFERENCES public.industries (slug) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  maps_to public.functional_area NOT NULL
);

CREATE INDEX industry_verticals_industry_slug_idx
  ON public.industry_verticals (industry_slug);

COMMENT ON TABLE public.industry_verticals IS 'Verticales de foco bajo una industria principal (nivel 2).';
COMMENT ON COLUMN public.industry_verticals.slug IS 'Slug estable; p. ej. tecnologia-ia-general, saas, fintech.';

ALTER TABLE public.industry_verticals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "industry_verticals_read_authenticated"
  ON public.industry_verticals FOR SELECT TO authenticated USING (true);
CREATE POLICY "industry_verticals_read_anon"
  ON public.industry_verticals FOR SELECT TO anon USING (true);

-- Vertical “General” por industria (puente para expertise existente).
INSERT INTO public.industry_verticals (slug, industry_slug, label, sort_order, maps_to)
SELECT
  i.slug || '-general',
  i.slug,
  'General',
  0,
  i.maps_to
FROM public.industries i;

-- Hojas de industries_catalog bajo cada industria (nivel 2 real).
INSERT INTO public.industry_verticals (slug, industry_slug, label, sort_order, maps_to)
SELECT
  c.slug,
  c.parent_slug,
  c.name,
  COALESCE(c.sort_order, 0) + 100,
  i.maps_to
FROM public.industries_catalog c
INNER JOIN public.industries i ON i.slug = c.parent_slug
WHERE c.parent_slug IS NOT NULL
  AND c.slug NOT IN (SELECT slug FROM public.industries)
ON CONFLICT (slug) DO NOTHING;

-- expertise_catalog: columna vertical_slug
ALTER TABLE public.expertise_catalog
  ADD COLUMN IF NOT EXISTS vertical_slug text;

UPDATE public.expertise_catalog e
SET vertical_slug = e.industry_slug || '-general'
WHERE e.vertical_slug IS NULL;

ALTER TABLE public.expertise_catalog
  ALTER COLUMN vertical_slug SET NOT NULL;

ALTER TABLE public.expertise_catalog
  ADD CONSTRAINT expertise_catalog_vertical_slug_fkey
  FOREIGN KEY (vertical_slug) REFERENCES public.industry_verticals (slug) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS expertise_catalog_vertical_slug_idx
  ON public.expertise_catalog (vertical_slug);

COMMENT ON COLUMN public.expertise_catalog.vertical_slug IS 'Vertical (nivel 2) a la que pertenece este expertise; industry_slug sigue denormalizado.';
COMMENT ON COLUMN public.expertise_catalog.industry_slug IS 'Industria (denormalizada); derivable desde industry_verticals.industry_slug.';

-- profiles / searches: vertical_slugs
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vertical_slugs text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.searches
  ADD COLUMN IF NOT EXISTS vertical_slugs text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_vertical_slugs_max3;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_vertical_slugs_max3
  CHECK (
    array_length(vertical_slugs, 1) IS NULL
    OR array_length(vertical_slugs, 1) <= 3
  );

ALTER TABLE public.searches DROP CONSTRAINT IF EXISTS searches_vertical_slugs_max3;
ALTER TABLE public.searches ADD CONSTRAINT searches_vertical_slugs_max3
  CHECK (
    array_length(vertical_slugs, 1) IS NULL
    OR array_length(vertical_slugs, 1) <= 3
  );

COMMENT ON COLUMN public.profiles.vertical_slugs IS 'Hasta 3 verticales (industry_verticals.slug) bajo primary_industry_slug.';
COMMENT ON COLUMN public.searches.vertical_slugs IS 'Hasta 3 verticales buscadas bajo primary_industry_slug.';

-- Backfill: vertical general para filas con industria
UPDATE public.profiles p
SET vertical_slugs = ARRAY[p.primary_industry_slug || '-general']
WHERE p.primary_industry_slug IS NOT NULL
  AND COALESCE(cardinality(p.vertical_slugs), 0) = 0;

UPDATE public.searches s
SET vertical_slugs = ARRAY[s.primary_industry_slug || '-general']
WHERE s.primary_industry_slug IS NOT NULL
  AND COALESCE(cardinality(s.vertical_slugs), 0) = 0;

-- Alta compatibilidad (Premium): overlap de verticales si la búsqueda fija verticales.
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
        COALESCE(cardinality(s.vertical_slugs), 0) = 0
        OR EXISTS (
          SELECT 1
          FROM unnest(s.vertical_slugs) AS sv(v)
          WHERE sv.v = ANY (COALESCE(p.vertical_slugs, ARRAY[]::text[]))
        )
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
