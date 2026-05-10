-- Verticales adicionales por industria (nivel 2). Sincronizado con lib/leaf-catalog.ts (VERTICAL_ROWS).
-- Idempotente: ON CONFLICT actualiza nombre, padre y fila en industry_verticals.

-- El slug legacy "educacion" choca con public.industries.slug; unifica con la vertical explícita.
UPDATE public.profiles
SET vertical_slugs = ARRAY(
  SELECT CASE WHEN x = 'educacion' THEN 'educacion-instituciones-formales' ELSE x END
  FROM unnest(vertical_slugs) AS t(x)
)
WHERE primary_industry_slug = 'educacion'
  AND vertical_slugs @> ARRAY['educacion']::text[];

UPDATE public.searches
SET vertical_slugs = ARRAY(
  SELECT CASE WHEN x = 'educacion' THEN 'educacion-instituciones-formales' ELSE x END
  FROM unnest(vertical_slugs) AS t(x)
)
WHERE primary_industry_slug = 'educacion'
  AND vertical_slugs @> ARRAY['educacion']::text[];

INSERT INTO public.industries_catalog (slug, name, sort_order, parent_slug) VALUES
  ('educacion-instituciones-formales', 'Instituciones y educación formal', 200, 'educacion'),
  ('banca-tradicional-corporativa', 'Banca retail y corporativa', 210, 'finanzas-fintech'),
  ('wealth-private-banking', 'Private banking y family office', 220, 'finanzas-fintech'),
  ('contabilidad-cfo-outsourcing', 'Contabilidad, CFO externo y outsourcing financiero', 230, 'finanzas-fintech'),
  ('mercados-derivados-prime', 'Mercados, research y prime brokerage', 240, 'finanzas-fintech'),
  ('hospitales-clinicas', 'Hospitales y clínicas', 210, 'salud-biotech'),
  ('farmacia-distribucion-salud', 'Farmacia y distribución en salud', 220, 'salud-biotech'),
  ('salud-digital-clinica', 'Salud digital y servicios clínicos remotos', 230, 'salud-biotech'),
  ('dispositivos-wearables-salud', 'Wearables y monitoreo remoto', 240, 'salud-biotech'),
  ('salud-regulatoria-calidad', 'Regulatorio, calidad y compliance en salud', 250, 'salud-biotech'),
  ('investigacion-preclinica', 'Investigación preclínica y CRO', 260, 'salud-biotech'),
  ('odontologia-y-salud-bucal', 'Odontología y salud bucal', 270, 'salud-biotech'),
  ('salud-mental-digital', 'Salud mental y bienestar psicológico', 280, 'salud-biotech'),
  ('veterinaria-one-health', 'Medicina veterinaria y One Health', 290, 'salud-biotech'),
  ('k12-escuelas', 'Educación básica y media (K-12)', 210, 'educacion'),
  ('universidad-posgrado', 'Universidad, posgrado y doctorado', 220, 'educacion'),
  ('formacion-corporativa-lnd', 'Capacitación corporativa y L&D', 230, 'educacion'),
  ('educacion-tecnica-profesional', 'Educación técnica y profesional', 240, 'educacion'),
  ('idiomas-y-certificaciones', 'Idiomas y certificaciones profesionales', 250, 'educacion'),
  ('bibliotecas-y-gestion-conocimiento', 'Bibliotecas y gestión del conocimiento', 260, 'educacion'),
  ('educacion-artistica-cultural', 'Educación artística y cultural', 270, 'educacion'),
  ('investigacion-academica-vertical', 'Investigación y ciencia aplicada en academia', 280, 'educacion'),
  ('consultoria-implementacion-tech', 'Consultoría tecnológica e implementación', 850, 'tecnologia-ia'),
  ('nearshore-outsourcing-tech', 'Nearshore, outsourcing y equipos distribuidos', 860, 'tecnologia-ia'),
  ('quantum-computing', 'Computación cuántica y laboratorios avanzados', 870, 'tecnologia-ia'),
  ('defensa-seguridad-publica', 'Defensa y seguridad ciudadana', 210, 'gobierno-sector-publico'),
  ('educacion-publica-sector', 'Educación pública y políticas educativas', 220, 'gobierno-sector-publico'),
  ('salud-publica-sistema', 'Salud pública y sistemas de salud', 230, 'gobierno-sector-publico'),
  ('infraestructura-publica-obras', 'Infraestructura y obras públicas', 240, 'gobierno-sector-publico'),
  ('municipios-gobiernos-locales', 'Municipios y gobiernos locales', 250, 'gobierno-sector-publico'),
  ('ong-filantropia-desarrollo', 'ONG, filantropía y cooperación al desarrollo', 260, 'gobierno-sector-publico'),
  ('retail-alimentario-conveniencia', 'Retail alimentario y conveniencia', 850, 'retail-comercio'),
  ('moda-belleza-lujo', 'Moda, belleza y lujo', 860, 'retail-comercio'),
  ('electro-hogar-tecnologia-consumo', 'Electro, hogar y tecnología de consumo', 870, 'retail-comercio'),
  ('marcas-directas-d2c', 'Marcas directas (D2C) y suscripciones', 880, 'retail-comercio'),
  ('mayoreo-cash-carry', 'Mayoreo, cash & carry y distribución', 890, 'retail-comercio'),
  ('trade-marketing-retail-media', 'Trade marketing y retail media', 900, 'retail-comercio'),
  ('streaming-plataformas', 'Streaming y plataformas digitales', 850, 'entretenimiento-medios'),
  ('eventos-en-vivo-festivales', 'Eventos en vivo y festivales', 860, 'entretenimiento-medios'),
  ('talentos-influencers', 'Talento, agencias e influencia digital', 870, 'entretenimiento-medios'),
  ('esports-competitivo', 'Esports y competición profesional', 880, 'entretenimiento-medios'),
  ('artes-escenicas-teatro-musical', 'Artes escénicas y teatro musical', 850, 'artes-diseno-creativo'),
  ('artesania-oficios-creativos', 'Artesanía y oficios creativos', 860, 'artes-diseno-creativo'),
  ('contenido-comunidad-ugc', 'Contenido de comunidad (UGC) y co-creación', 870, 'artes-diseno-creativo'),
  ('urbanismo-ciudad', 'Urbanismo y planeación territorial', 210, 'construccion-inmobiliario'),
  ('facility-property-management', 'Facility y property management', 220, 'construccion-inmobiliario'),
  ('interiorismo-espacios', 'Interiorismo y diseño de espacios', 230, 'construccion-inmobiliario'),
  ('obra-civil-ingenieria', 'Obra civil e ingeniería de proyectos', 240, 'construccion-inmobiliario'),
  ('automotriz-y-movilidad-industrial', 'Automotriz y componentes', 850, 'manufactura-industria'),
  ('industria-naval-maritima', 'Naval, marítimo y astilleros', 860, 'manufactura-industria'),
  ('quimica-materiales-procesos', 'Química, materiales y procesos industriales', 870, 'manufactura-industria'),
  ('embalaje-packaging-industrial', 'Embalaje y packaging industrial', 880, 'manufactura-industria'),
  ('metalmecanica-industrial', 'Metalmecánica y maquinados', 890, 'manufactura-industria'),
  ('automatizacion-industria-4', 'Automatización, robótica industrial e Industria 4.0', 900, 'manufactura-industria'),
  ('energia-solar-y-renovable', 'Solar y energías renovables distribuidas', 210, 'energia-sustentabilidad'),
  ('eolica-offshore-utility-scale', 'Eólica, offshore y proyectos utility scale', 220, 'energia-sustentabilidad'),
  ('petroleo-gas-energeticos', 'Petróleo, gas y energéticos tradicionales', 230, 'energia-sustentabilidad'),
  ('utilities-redes-electricas', 'Utilities, redes y operación del sistema', 240, 'energia-sustentabilidad'),
  ('agua-saneamiento-hidrico', 'Agua, saneamiento e hidráulica', 250, 'energia-sustentabilidad'),
  ('residuos-reciclaje-valorizacion', 'Residuos, reciclaje y valorización', 260, 'energia-sustentabilidad'),
  ('carbono-mercados-ambientales', 'Carbono, biodiversidad y mercados ambientales', 270, 'energia-sustentabilidad'),
  ('economia-circular-industrial', 'Economía circular y reuse industrial', 280, 'energia-sustentabilidad'),
  ('cultivos-semillas-agricultura', 'Cultivos, semillas y agricultura de precisión', 210, 'agro-alimentacion'),
  ('ganaderia-lacteos-proteinas', 'Ganadería, lácteos y proteínas', 220, 'agro-alimentacion'),
  ('acuicultura-pesca', 'Acuicultura y pesca responsable', 230, 'agro-alimentacion'),
  ('bebidas-vinos-y-alcohol', 'Bebidas, vinos y licores', 240, 'agro-alimentacion'),
  ('restaurantes-food-service', 'Restaurantes, catering y food service', 250, 'agro-alimentacion'),
  ('distribucion-retail-alimentario', 'Distribución y retail alimentario (B2B/B2C)', 260, 'agro-alimentacion'),
  ('inocuidad-trazabilidad-alimentaria', 'Inocuidad, trazabilidad y normativa alimentaria', 270, 'agro-alimentacion'),
  ('nutricion-ingredientes-alimentarios', 'Ingredientes, nutrición y formulación', 280, 'agro-alimentacion'),
  ('hoteles-resorts', 'Hoteles, resorts y cadenas', 210, 'turismo-hospitalidad'),
  ('hostales-alojamiento-alternativo', 'Hostales, boutique y alojamiento alternativo', 220, 'turismo-hospitalidad'),
  ('gastronomia-restaurantes-bares', 'Gastronomía, restaurantes y bares', 230, 'turismo-hospitalidad'),
  ('turismo-cultural-patrimonio', 'Turismo cultural, museos y rutas patrimoniales', 240, 'turismo-hospitalidad'),
  ('ecoturismo-aventura-naturaleza', 'Ecoturismo, aventura y naturaleza', 250, 'turismo-hospitalidad'),
  ('aviacion-lineas-aereas', 'Aviación comercial y low cost', 260, 'turismo-hospitalidad'),
  ('cruceros-navegacion-recreativa', 'Cruceros y navegación recreativa', 270, 'turismo-hospitalidad'),
  ('agencias-viajes-ota', 'Agencias de viajes y OTA', 280, 'turismo-hospitalidad'),
  ('mice-congresos-convenciones', 'MICE, congresos y convenciones', 290, 'turismo-hospitalidad'),
  ('casinos-entretenimiento-turistico', 'Casinos y entretenimiento regulado', 300, 'turismo-hospitalidad'),
  ('spa-termal-wellness-turistico', 'Spa, termal y wellness turístico', 310, 'turismo-hospitalidad'),
  ('consultoria-estrategia-management', 'Consultoría de estrategia y management', 210, 'legal-consultoria'),
  ('consultoria-operaciones-transformacion', 'Operaciones y transformación organizacional', 220, 'legal-consultoria'),
  ('auditoria-risk-advisory', 'Auditoría y risk advisory', 230, 'legal-consultoria'),
  ('fiscal-contable-asuntos-corporativos', 'Fiscal, contable y asuntos societarios', 240, 'legal-consultoria'),
  ('people-advisory-y-rh-estrategico', 'People advisory, compensación y RH estratégico', 250, 'legal-consultoria'),
  ('marketing-brand-consultoria', 'Consultoría de marca, comunicación y growth', 260, 'legal-consultoria'),
  ('gimnasios-fitness-boutique', 'Gimnasios, boutique fitness y franquicias', 210, 'deporte-bienestar'),
  ('deporte-profesional-ligas', 'Deporte profesional y ligas', 220, 'deporte-bienestar'),
  ('deporte-amateur-comunidad', 'Deporte amateur, escuelas y comunidad', 230, 'deporte-bienestar'),
  ('nutricion-deportiva-rendimiento', 'Nutrición deportiva y alto rendimiento', 240, 'deporte-bienestar'),
  ('fisioterapia-recuperacion', 'Fisioterapia, rehabilitación y recuperación', 250, 'deporte-bienestar'),
  ('mindfulness-coaching-bienestar', 'Mindfulness, coaching y bienestar integral', 260, 'deporte-bienestar')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  parent_slug = EXCLUDED.parent_slug;

INSERT INTO public.industry_verticals (slug, industry_slug, label, sort_order, maps_to)
SELECT c.slug, c.parent_slug, c.name, COALESCE(c.sort_order, 0) + 100, i.maps_to
FROM public.industries_catalog c
INNER JOIN public.industries i ON i.slug = c.parent_slug
WHERE c.slug IN (
  'banca-tradicional-corporativa', 'wealth-private-banking', 'contabilidad-cfo-outsourcing', 'mercados-derivados-prime',
  'hospitales-clinicas', 'farmacia-distribucion-salud', 'salud-digital-clinica', 'dispositivos-wearables-salud', 'salud-regulatoria-calidad', 'investigacion-preclinica', 'odontologia-y-salud-bucal', 'salud-mental-digital', 'veterinaria-one-health',
  'educacion-instituciones-formales', 'k12-escuelas', 'universidad-posgrado', 'formacion-corporativa-lnd', 'educacion-tecnica-profesional', 'idiomas-y-certificaciones', 'bibliotecas-y-gestion-conocimiento', 'educacion-artistica-cultural', 'investigacion-academica-vertical',
  'consultoria-implementacion-tech', 'nearshore-outsourcing-tech', 'quantum-computing',
  'defensa-seguridad-publica', 'educacion-publica-sector', 'salud-publica-sistema', 'infraestructura-publica-obras', 'municipios-gobiernos-locales', 'ong-filantropia-desarrollo',
  'retail-alimentario-conveniencia', 'moda-belleza-lujo', 'electro-hogar-tecnologia-consumo', 'marcas-directas-d2c', 'mayoreo-cash-carry', 'trade-marketing-retail-media',
  'streaming-plataformas', 'eventos-en-vivo-festivales', 'talentos-influencers', 'esports-competitivo',
  'artes-escenicas-teatro-musical', 'artesania-oficios-creativos', 'contenido-comunidad-ugc',
  'urbanismo-ciudad', 'facility-property-management', 'interiorismo-espacios', 'obra-civil-ingenieria',
  'automotriz-y-movilidad-industrial', 'industria-naval-maritima', 'quimica-materiales-procesos', 'embalaje-packaging-industrial', 'metalmecanica-industrial', 'automatizacion-industria-4',
  'energia-solar-y-renovable', 'eolica-offshore-utility-scale', 'petroleo-gas-energeticos', 'utilities-redes-electricas', 'agua-saneamiento-hidrico', 'residuos-reciclaje-valorizacion', 'carbono-mercados-ambientales', 'economia-circular-industrial',
  'cultivos-semillas-agricultura', 'ganaderia-lacteos-proteinas', 'acuicultura-pesca', 'bebidas-vinos-y-alcohol', 'restaurantes-food-service', 'distribucion-retail-alimentario', 'inocuidad-trazabilidad-alimentaria', 'nutricion-ingredientes-alimentarios',
  'hoteles-resorts', 'hostales-alojamiento-alternativo', 'gastronomia-restaurantes-bares', 'turismo-cultural-patrimonio', 'ecoturismo-aventura-naturaleza', 'aviacion-lineas-aereas', 'cruceros-navegacion-recreativa', 'agencias-viajes-ota', 'mice-congresos-convenciones', 'casinos-entretenimiento-turistico', 'spa-termal-wellness-turistico',
  'consultoria-estrategia-management', 'consultoria-operaciones-transformacion', 'auditoria-risk-advisory', 'fiscal-contable-asuntos-corporativos', 'people-advisory-y-rh-estrategico', 'marketing-brand-consultoria',
  'gimnasios-fitness-boutique', 'deporte-profesional-ligas', 'deporte-amateur-comunidad', 'nutricion-deportiva-rendimiento', 'fisioterapia-recuperacion', 'mindfulness-coaching-bienestar'
)
  AND c.parent_slug IS NOT NULL
  AND c.slug NOT IN (SELECT slug FROM public.industries)
ON CONFLICT (slug) DO UPDATE SET
  industry_slug = EXCLUDED.industry_slug,
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order,
  maps_to = EXCLUDED.maps_to;
