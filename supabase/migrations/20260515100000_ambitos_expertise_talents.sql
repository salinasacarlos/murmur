-- Ámbito (1) + expertise dentro del ámbito (≤5) + talentos transversales (≤5).
-- Catálogo alineado con lib/profile-taxonomy.ts

CREATE TABLE public.ambitos (
  slug text PRIMARY KEY,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  maps_to public.functional_area NOT NULL
);

CREATE TABLE public.expertise_catalog (
  slug text PRIMARY KEY,
  ambito_slug text NOT NULL REFERENCES public.ambitos (slug) ON DELETE CASCADE,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  maps_to public.functional_area NOT NULL
);

CREATE INDEX expertise_catalog_ambito_slug_idx ON public.expertise_catalog (ambito_slug);

CREATE TABLE public.talent_catalog (
  slug text PRIMARY KEY,
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

-- Seed ámbitos
INSERT INTO public.ambitos (slug, label, sort_order, maps_to) VALUES
  ('tecnologia-digital', 'Tecnología, software e inteligencia aplicada', 10, 'tecnico'),
  ('producto-ux-diseno', 'Producto, UX y diseño', 20, 'producto'),
  ('negocio-mercado', 'Negocio, comercial y mercado', 30, 'negocio'),
  ('estrategia-finanzas-legal', 'Estrategia, finanzas y legal', 40, 'negocio'),
  ('operaciones-escala', 'Operaciones, personas e industria', 50, 'operaciones'),
  ('ciencia-bio-sostenibilidad', 'Ciencia, salud y sostenibilidad', 60, 'ciencia'),
  ('creativo-cultura-media', 'Creativo, cultura y medios', 70, 'producto');

-- Seed expertise (slug, ambito_slug, label, sort_order, maps_to)
INSERT INTO public.expertise_catalog (slug, ambito_slug, label, sort_order, maps_to) VALUES
  ('ingenieria-software', 'tecnologia-digital', 'Ingeniería de software', 10, 'tecnico'),
  ('data-ml', 'tecnologia-digital', 'Data, ML e inteligencia aplicada', 20, 'tecnico'),
  ('infra-seguridad', 'tecnologia-digital', 'Infra, cloud y ciberseguridad', 30, 'tecnico'),
  ('hardware-iot', 'tecnologia-digital', 'Hardware, IoT y sistemas embebidos', 40, 'tecnico'),
  ('qa-automation', 'tecnologia-digital', 'QA, calidad y automatización', 50, 'tecnico'),
  ('fintech-build', 'tecnologia-digital', 'Construcción de producto fintech / pagos', 60, 'tecnico'),
  ('healthtech-build', 'tecnologia-digital', 'Producto y plataformas healthtech', 70, 'tecnico'),
  ('saas-b2b', 'tecnologia-digital', 'SaaS B2B y herramientas empresariales', 80, 'tecnico'),
  ('ecommerce-tech', 'tecnologia-digital', 'Tecnología e-commerce y marketplaces', 90, 'tecnico'),
  ('govtech-civic', 'tecnologia-digital', 'GovTech y proyectos cívicos digitales', 100, 'tecnico'),
  ('generalista-tech-producto', 'tecnologia-digital', 'Generalista puente ingeniería–producto', 110, 'tecnico'),

  ('producto-ux', 'producto-ux-diseno', 'Producto y UX / research', 10, 'producto'),
  ('diseno-visual', 'producto-ux-diseno', 'Diseño visual, marca y motion', 20, 'producto'),
  ('insights-research-ops', 'producto-ux-diseno', 'Research ops e insights de usuario', 30, 'producto'),
  ('educacion-formacion', 'producto-ux-diseno', 'Educación, formación y facilitación', 40, 'producto'),
  ('wellness-sports', 'producto-ux-diseno', 'Wellness, deporte y consumidor', 50, 'producto'),
  ('generalista-producto-negocio', 'producto-ux-diseno', 'Generalista puente producto–negocio', 60, 'producto'),

  ('negocio-estrategia', 'negocio-mercado', 'Estrategia y modelo de negocio', 10, 'negocio'),
  ('ventas-revenue', 'negocio-mercado', 'Ventas, partnerships y revenue', 20, 'negocio'),
  ('marketing-brand', 'negocio-mercado', 'Marketing, contenido y comunidad', 30, 'negocio'),
  ('consultoria-advisory', 'negocio-mercado', 'Consultoría y advisory transversal', 40, 'negocio'),
  ('consumo-retail', 'negocio-mercado', 'Retail, consumo masivo y ecommerce', 50, 'negocio'),
  ('creator-media', 'negocio-mercado', 'Creator economy, medios y narrativa', 60, 'negocio'),
  ('impacto-social-ong', 'negocio-mercado', 'Impacto social, fundaciones y tercer sector', 70, 'negocio'),
  ('expansion-internacional', 'negocio-mercado', 'Internacionalización y expansión', 80, 'negocio'),
  ('cross-industria-estrategia', 'negocio-mercado', 'Estrategia cross-industria', 90, 'negocio'),
  ('generalista-founder', 'negocio-mercado', 'Generalista / founder multidisciplina', 100, 'negocio'),
  ('customer-success', 'negocio-mercado', 'Customer success e implementación', 110, 'negocio'),
  ('hospitality-travel', 'negocio-mercado', 'Hospitality, travel y turismo', 120, 'negocio'),

  ('finanzas-capital', 'estrategia-finanzas-legal', 'Finanzas, capital y operaciones financieras', 10, 'negocio'),
  ('legal-compliance', 'estrategia-finanzas-legal', 'Legal, contratos y compliance', 20, 'negocio'),
  ('sector-publico-policy', 'estrategia-finanzas-legal', 'Sector público, regulación y políticas', 30, 'negocio'),
  ('real-estate-proptech', 'estrategia-finanzas-legal', 'Real estate, urbanismo y proptech', 40, 'negocio'),
  ('riesgo-auditoria', 'estrategia-finanzas-legal', 'Riesgo, auditoría y controles', 50, 'negocio'),
  ('fintech-insurtech-ops', 'estrategia-finanzas-legal', 'Operaciones fintech, insurtech y pagos', 60, 'negocio'),

  ('people-talento', 'operaciones-escala', 'Personas, talento y cultura', 10, 'operaciones'),
  ('operaciones-procesos', 'operaciones-escala', 'Operaciones y mejora de procesos', 20, 'operaciones'),
  ('logistica-sourcing', 'operaciones-escala', 'Logística, compras y sourcing', 30, 'operaciones'),
  ('espacios-construccion', 'operaciones-escala', 'Arquitectura, espacios y construcción', 40, 'operaciones'),
  ('pmo-delivery', 'operaciones-escala', 'PMO, proyectos y delivery', 50, 'operaciones'),
  ('multisector-operaciones', 'operaciones-escala', 'Operaciones multisector', 60, 'operaciones'),
  ('energia-utilities', 'operaciones-escala', 'Energía, utilities y transición', 70, 'operaciones'),
  ('industria-manufactura', 'operaciones-escala', 'Industria, manufactura y calidad', 80, 'operaciones'),
  ('agrifood-cadena', 'operaciones-escala', 'Agro, alimentación y cadena de suministro', 90, 'operaciones'),

  ('ciencia-investigacion', 'ciencia-bio-sostenibilidad', 'Ciencia e investigación aplicada', 10, 'ciencia'),
  ('salud-bio', 'ciencia-bio-sostenibilidad', 'Salud, biotech y ciencias de la vida', 20, 'ciencia'),
  ('sostenibilidad-impacto', 'ciencia-bio-sostenibilidad', 'Sostenibilidad, impacto y ESG', 30, 'ciencia'),
  ('innovacion-laboratorio', 'ciencia-bio-sostenibilidad', 'Innovación, I+D y laboratorios', 40, 'ciencia'),
  ('quimica-materiales', 'ciencia-bio-sostenibilidad', 'Química, materiales y procesos', 50, 'ciencia'),
  ('multidisciplina-investigacion', 'ciencia-bio-sostenibilidad', 'Investigación multidisciplina', 60, 'ciencia'),

  ('arte-cultura', 'creativo-cultura-media', 'Arte, cultura y medios audiovisuales', 10, 'producto'),
  ('gaming-comunidades', 'creativo-cultura-media', 'Gaming, entretenimiento digital y comunidades', 20, 'producto');

-- Map slugs antiguos que ya no existen → equivalentes en catálogo (solo referencia; backfill las usa)
INSERT INTO public.expertise_catalog (slug, ambito_slug, label, sort_order, maps_to) VALUES
  ('fintech-producto', 'tecnologia-digital', 'Producto y plataformas fintech (leg.)', 115, 'tecnico')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.expertise_catalog (slug, ambito_slug, label, sort_order, maps_to) VALUES
  ('healthtech', 'tecnologia-digital', 'Healthtech (leg.)', 116, 'tecnico')
ON CONFLICT (slug) DO NOTHING;

-- Talentos
INSERT INTO public.talent_catalog (slug, label, sort_order) VALUES
  ('comunicacion-clara', 'Comunicación clara y storytelling', 10),
  ('liderazgo-equipos', 'Liderazgo de equipos', 20),
  ('gestion-stakeholders', 'Gestión de stakeholders', 30),
  ('pensamiento-estrategico', 'Pensamiento estratégico', 40),
  ('analitica-rigor', 'Analítica y rigor', 50),
  ('ejecucion-orientada', 'Ejecución y entrega', 60),
  ('aprendizaje-continuo', 'Aprendizaje continuo', 70),
  ('negociacion-influencia', 'Negociación e influencia', 80),
  ('facilitacion-talleres', 'Facilitación y talleres', 90),
  ('mentoria-coaching', 'Mentoría y coaching', 100),
  ('escritura-tecnica', 'Escritura técnica o de producto', 110),
  ('presentacion-publica', 'Presentación en público', 120),
  ('trabajo-remoto-async', 'Trabajo remoto y async', 130),
  ('entornos-multiculturales', 'Equipos multiculturales', 140),
  ('resiliencia-ambiguedad', 'Resiliencia ante la ambigüedad', 150),
  ('creatividad-ideas', 'Creatividad y generación de ideas', 160),
  ('detalle-calidad', 'Detalle y calidad', 170),
  ('vision-0-a-1', 'Visión 0→1', 180),
  ('escalar-procesos', 'Escala y procesos', 190),
  ('customer-empathy', 'Empatía con usuario/cliente', 200),
  ('colaboracion-cross', 'Colaboración cross-funcional', 210),
  ('integridad-confianza', 'Integridad y confianza', 220);

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS primary_ambit_slug text REFERENCES public.ambitos (slug),
  ADD COLUMN IF NOT EXISTS expertise_slugs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS talent_slugs text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.searches
  ADD COLUMN IF NOT EXISTS primary_ambit_slug text REFERENCES public.ambitos (slug),
  ADD COLUMN IF NOT EXISTS expertise_slugs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS talent_slugs text[] NOT NULL DEFAULT '{}';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_expertise_slugs_max5;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_expertise_slugs_max5
  CHECK (array_length(expertise_slugs, 1) IS NULL OR array_length(expertise_slugs, 1) <= 5);
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_talent_slugs_max5;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_talent_slugs_max5
  CHECK (array_length(talent_slugs, 1) IS NULL OR array_length(talent_slugs, 1) <= 5);

ALTER TABLE public.searches DROP CONSTRAINT IF EXISTS searches_expertise_slugs_max5;
ALTER TABLE public.searches ADD CONSTRAINT searches_expertise_slugs_max5
  CHECK (array_length(expertise_slugs, 1) IS NULL OR array_length(expertise_slugs, 1) <= 5);
ALTER TABLE public.searches DROP CONSTRAINT IF EXISTS searches_talent_slugs_max5;
ALTER TABLE public.searches ADD CONSTRAINT searches_talent_slugs_max5
  CHECK (array_length(talent_slugs, 1) IS NULL OR array_length(talent_slugs, 1) <= 5);

COMMENT ON COLUMN public.profiles.primary_ambit_slug IS 'Único ámbito principal; define el marco de expertise.';
COMMENT ON COLUMN public.profiles.expertise_slugs IS 'Hasta 5 slugs de expertise_catalog bajo primary_ambit_slug.';
COMMENT ON COLUMN public.profiles.talent_slugs IS 'Hasta 5 slugs de talent_catalog (talentos transversales).';

-- RLS lectura catálogos
ALTER TABLE public.ambitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expertise_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.talent_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ambitos_read_authenticated" ON public.ambitos;
CREATE POLICY "ambitos_read_authenticated" ON public.ambitos
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "ambitos_read_anon" ON public.ambitos;
CREATE POLICY "ambitos_read_anon" ON public.ambitos
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "expertise_catalog_read_authenticated" ON public.expertise_catalog;
CREATE POLICY "expertise_catalog_read_authenticated" ON public.expertise_catalog
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "expertise_catalog_read_anon" ON public.expertise_catalog;
CREATE POLICY "expertise_catalog_read_anon" ON public.expertise_catalog
  FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "talent_catalog_read_authenticated" ON public.talent_catalog;
CREATE POLICY "talent_catalog_read_authenticated" ON public.talent_catalog
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "talent_catalog_read_anon" ON public.talent_catalog;
CREATE POLICY "talent_catalog_read_anon" ON public.talent_catalog
  FOR SELECT TO anon USING (true);

-- Backfill desde functional_area_tags + area
UPDATE public.profiles p
SET primary_ambit_slug = e.ambito_slug
FROM public.expertise_catalog e
WHERE p.primary_ambit_slug IS NULL
  AND cardinality(p.functional_area_tags) >= 1
  AND e.slug = p.functional_area_tags[1];

UPDATE public.profiles
SET primary_ambit_slug = CASE area
  WHEN 'tecnico' THEN 'tecnologia-digital'
  WHEN 'producto' THEN 'producto-ux-diseno'
  WHEN 'negocio' THEN 'negocio-mercado'
  WHEN 'operaciones' THEN 'operaciones-escala'
  WHEN 'ciencia' THEN 'ciencia-bio-sostenibilidad'
  ELSE 'negocio-mercado'
END
WHERE primary_ambit_slug IS NULL;

UPDATE public.profiles p
SET expertise_slugs = COALESCE(sq.sl, '{}')
FROM (
  SELECT
    p2.id,
    ARRAY(
      SELECT u.tag
      FROM unnest(p2.functional_area_tags) WITH ORDINALITY AS u(tag, o)
      INNER JOIN public.expertise_catalog e ON e.slug = u.tag AND e.ambito_slug = p2.primary_ambit_slug
      ORDER BY u.o
      LIMIT 5
    ) AS sl
  FROM public.profiles p2
  WHERE p2.primary_ambit_slug IS NOT NULL
    AND cardinality(p2.functional_area_tags) > 0
) sq
WHERE p.id = sq.id
  AND array_length(p.expertise_slugs, 1) IS NULL
  AND sq.sl IS NOT NULL
  AND array_length(sq.sl, 1) > 0;

UPDATE public.profiles
SET area = COALESCE(
  (SELECT e.maps_to FROM public.expertise_catalog e WHERE e.slug = expertise_slugs[1] LIMIT 1),
  (SELECT a.maps_to FROM public.ambitos a WHERE a.slug = primary_ambit_slug LIMIT 1),
  area
)
WHERE primary_ambit_slug IS NOT NULL;

-- Búsquedas: mismo criterio desde functional_area_tags
UPDATE public.searches s
SET primary_ambit_slug = e.ambito_slug
FROM public.expertise_catalog e
WHERE s.primary_ambit_slug IS NULL
  AND cardinality(s.functional_area_tags) >= 1
  AND e.slug = s.functional_area_tags[1];

UPDATE public.searches
SET primary_ambit_slug = CASE area
  WHEN 'tecnico' THEN 'tecnologia-digital'
  WHEN 'producto' THEN 'producto-ux-diseno'
  WHEN 'negocio' THEN 'negocio-mercado'
  WHEN 'operaciones' THEN 'operaciones-escala'
  WHEN 'ciencia' THEN 'ciencia-bio-sostenibilidad'
  ELSE 'negocio-mercado'
END
WHERE primary_ambit_slug IS NULL;

UPDATE public.searches s
SET expertise_slugs = COALESCE(sq.sl, '{}')
FROM (
  SELECT
    s2.id,
    ARRAY(
      SELECT u.tag
      FROM unnest(s2.functional_area_tags) WITH ORDINALITY AS u(tag, o)
      INNER JOIN public.expertise_catalog e ON e.slug = u.tag AND e.ambito_slug = s2.primary_ambit_slug
      ORDER BY u.o
      LIMIT 5
    ) AS sl
  FROM public.searches s2
  WHERE s2.primary_ambit_slug IS NOT NULL
    AND cardinality(s2.functional_area_tags) > 0
) sq
WHERE s.id = sq.id
  AND array_length(s.expertise_slugs, 1) IS NULL
  AND sq.sl IS NOT NULL
  AND array_length(sq.sl, 1) > 0;

UPDATE public.searches
SET area = COALESCE(
  (SELECT e.maps_to FROM public.expertise_catalog e WHERE e.slug = expertise_slugs[1] LIMIT 1),
  (SELECT a.maps_to FROM public.ambitos a WHERE a.slug = primary_ambit_slug LIMIT 1),
  area
)
WHERE primary_ambit_slug IS NOT NULL;
