-- Reparent verticales (industries_catalog hojas) bajo las 15 industrias de producto
-- (public.industries). Misma agrupación que lib/industry-tree.ts → LEAF_SLUG_TO_PROFILE_INDUSTRY.
-- Elimina las 8 raíces antiguas ("ámbitos").

INSERT INTO public.industries_catalog (slug, name, sort_order, parent_slug)
SELECT i.slug, i.label, i.sort_order, NULL
FROM public.industries i
WHERE NOT EXISTS (SELECT 1 FROM public.industries_catalog c WHERE c.slug = i.slug);

UPDATE public.industries_catalog c
SET parent_slug = NULL
FROM public.industries i
WHERE c.slug = i.slug;

UPDATE public.industries_catalog v
SET parent_slug = 'finanzas-fintech'
WHERE v.slug IN (
  'fintech', 'insurtech', 'crypto', 'pagos', 'lending', 'open-finance',
  'finanzas-personales', 'seguros'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'salud-biotech'
WHERE v.slug IN ('healthtech', 'biotech', 'salud')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'educacion'
WHERE v.slug IN ('edtech')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'tecnologia-ia'
WHERE v.slug IN (
  'saas', 'b2b-saas', 'devtools', 'ai', 'deeptech', 'infra', 'cybersecurity',
  'data', 'analytics', 'productividad', 'no-code', 'web3', 'iot', 'ar-vr',
  'telecom', 'hardware', 'robotics'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'gobierno-sector-publico'
WHERE v.slug IN ('govtech', 'impacto-social', 'comunidad')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'retail-comercio'
WHERE v.slug IN (
  'marketplace', 'e-commerce',
  'consumer', 'b2b', 'retail', 'ventas', 'marketing'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'entretenimiento-medios'
WHERE v.slug IN (
  'gaming', 'media', 'entertainment', 'cine', 'teatro', 'musica',
  'radio-y-podcast', 'documental', 'animacion', 'video-y-produccion-audiovisual',
  'videojuegos-y-narrativa-interactiva', 'creator-economy'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'artes-diseno-creativo'
WHERE v.slug IN (
  'arquitectura', 'danza', 'diseno', 'moda', 'fotografia', 'periodismo',
  'museos-y-patrimonio', 'literatura', 'artes-plasticas-y-visuales',
  'escenografia-y-direccion-de-arte'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'construccion-inmobiliario'
WHERE v.slug IN ('construccion', 'real-estate', 'proptech')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'manufactura-industria'
WHERE v.slug IN (
  'manufactura', 'supply-chain', 'logistica', 'movilidad', 'transporte',
  'aeroespacial'
)
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'energia-sustentabilidad'
WHERE v.slug IN ('climate', 'sostenibilidad', 'energia')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'agro-alimentacion'
WHERE v.slug IN ('agtech', 'foodtech')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'turismo-hospitalidad'
WHERE v.slug IN ('traveltech')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'legal-consultoria'
WHERE v.slug IN ('legaltech', 'hrtech', 'recruiting')
AND v.slug NOT IN (SELECT slug FROM public.industries);

UPDATE public.industries_catalog v
SET parent_slug = 'deporte-bienestar'
WHERE v.slug IN ('wellness', 'sports')
AND v.slug NOT IN (SELECT slug FROM public.industries);

DELETE FROM public.industries_catalog
WHERE slug IN (
  'producto-digital-tech', 'ciencia-ingenieria', 'artes-creativo',
  'espacio-urbano', 'educacion-cultura', 'salud-deporte',
  'impacto-comunidad', 'negocio-servicios'
);
