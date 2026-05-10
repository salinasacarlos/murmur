-- Industry hierarchy: parent domains + reparent existing slugs + creative verticals.
-- Idempotent: safe to re-run after adjusting seed lists.

ALTER TABLE public.industries_catalog
  ADD COLUMN IF NOT EXISTS parent_slug text;

-- Domain roots (parent_slug stays NULL for these rows)
INSERT INTO public.industries_catalog (slug, name, sort_order, parent_slug) VALUES
  ('producto-digital-tech', 'Producto digital y tecnología', 5, NULL),
  ('ciencia-ingenieria', 'Ciencia, ingeniería y ambiente', 10, NULL),
  ('artes-creativo', 'Artes, medios y entretenimiento', 15, NULL),
  ('espacio-urbano', 'Espacio, urbanismo e inmobiliario', 20, NULL),
  ('educacion-cultura', 'Educación y cultura', 25, NULL),
  ('salud-deporte', 'Salud, bienestar y deporte', 30, NULL),
  ('impacto-comunidad', 'Impacto social y comunidad', 35, NULL),
  ('negocio-servicios', 'Negocio, ventas y servicios', 40, NULL)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  parent_slug = NULL;

-- New creative / culture leaves
INSERT INTO public.industries_catalog (slug, name, sort_order, parent_slug) VALUES
  ('arquitectura', 'Arquitectura', 100, 'artes-creativo'),
  ('cine', 'Cine', 110, 'artes-creativo'),
  ('teatro', 'Teatro', 120, 'artes-creativo'),
  ('musica', 'Música', 130, 'artes-creativo'),
  ('danza', 'Danza', 140, 'artes-creativo'),
  ('diseno', 'Diseño', 150, 'artes-creativo'),
  ('moda', 'Moda', 160, 'artes-creativo'),
  ('fotografia', 'Fotografía', 170, 'artes-creativo'),
  ('periodismo', 'Periodismo', 180, 'artes-creativo'),
  ('radio-y-podcast', 'Radio y podcast', 190, 'artes-creativo'),
  ('museos-y-patrimonio', 'Museos y patrimonio', 200, 'artes-creativo'),
  ('literatura', 'Literatura', 210, 'artes-creativo'),
  ('artes-plasticas-y-visuales', 'Artes plásticas y visuales', 220, 'artes-creativo'),
  ('documental', 'Documental', 230, 'artes-creativo'),
  ('animacion', 'Animación', 240, 'artes-creativo'),
  ('video-y-produccion-audiovisual', 'Video y producción audiovisual', 250, 'artes-creativo'),
  ('escenografia-y-direccion-de-arte', 'Escenografía y dirección de arte', 260, 'artes-creativo'),
  ('videojuegos-y-narrativa-interactiva', 'Videojuegos y narrativa interactiva', 270, 'artes-creativo')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  parent_slug = EXCLUDED.parent_slug;

-- Reparent existing catalog rows (flat → under domain)
UPDATE public.industries_catalog SET parent_slug = 'producto-digital-tech' WHERE slug IN (
  'fintech', 'healthtech', 'edtech', 'saas', 'b2b-saas', 'devtools', 'ai', 'deeptech', 'crypto',
  'marketplace', 'infra', 'gaming', 'e-commerce', 'cybersecurity', 'data', 'analytics',
  'creator-economy', 'legaltech', 'insurtech', 'agtech', 'foodtech', 'traveltech',
  'productividad', 'finanzas-personales', 'pagos', 'lending', 'open-finance', 'govtech',
  'no-code', 'web3', 'iot', 'ar-vr', 'proptech', 'telecom', 'hrtech'
);

UPDATE public.industries_catalog SET parent_slug = 'ciencia-ingenieria' WHERE slug IN (
  'biotech', 'robotics', 'climate', 'hardware', 'energia', 'movilidad', 'transporte',
  'supply-chain', 'manufactura', 'sostenibilidad', 'aeroespacial', 'logistica'
);

UPDATE public.industries_catalog SET parent_slug = 'artes-creativo' WHERE slug IN (
  'media', 'entertainment'
);

UPDATE public.industries_catalog SET parent_slug = 'espacio-urbano' WHERE slug IN (
  'construccion', 'real-estate'
);

UPDATE public.industries_catalog SET parent_slug = 'educacion-cultura' WHERE slug IN (
  'educacion'
);

UPDATE public.industries_catalog SET parent_slug = 'salud-deporte' WHERE slug IN (
  'salud', 'wellness', 'sports'
);

UPDATE public.industries_catalog SET parent_slug = 'impacto-comunidad' WHERE slug IN (
  'impacto-social', 'comunidad'
);

UPDATE public.industries_catalog SET parent_slug = 'negocio-servicios' WHERE slug IN (
  'consumer', 'b2b', 'retail', 'ventas', 'marketing', 'recruiting', 'seguros'
);

ALTER TABLE public.industries_catalog DROP CONSTRAINT IF EXISTS industries_catalog_parent_slug_fkey;

ALTER TABLE public.industries_catalog
  ADD CONSTRAINT industries_catalog_parent_slug_fkey
  FOREIGN KEY (parent_slug)
  REFERENCES public.industries_catalog (slug)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS industries_catalog_parent_slug_idx
  ON public.industries_catalog (parent_slug);
