-- Verticales adicionales (2ª ampliación). Sincronizado con lib/leaf-catalog.ts (VERTICAL_ROWS).
-- Idempotente: INSERT industries_catalog + industry_verticals ON CONFLICT DO UPDATE.

INSERT INTO public.industries_catalog (slug, name, sort_order, parent_slug) VALUES
  ('neobanca-embed-banking', 'Neobanca y banking as a service', 245, 'finanzas-fintech'),
  ('tesoreria-liquidez-corporativa', 'Tesorería y liquidez corporativa', 250, 'finanzas-fintech'),
  ('cobranza-recuperacion-cartera', 'Cobranza y recuperación de cartera', 255, 'finanzas-fintech'),
  ('finanzas-sostenibles-esg', 'Finanzas sostenibles y reporting ESG', 260, 'finanzas-fintech'),
  ('ratings-analisis-credito', 'Ratings y análisis de crédito', 265, 'finanzas-fintech'),
  ('dispositivos-medicos-hardware', 'Dispositivos médicos y hardware clínico', 300, 'salud-biotech'),
  ('diagnostico-imagen-laboratorio', 'Diagnóstico por imagen y laboratorio clínico', 305, 'salud-biotech'),
  ('aseguradoras-planes-salud', 'Aseguradoras y planes de salud', 310, 'salud-biotech'),
  ('medicina-estetica-dermatologia', 'Medicina estética y dermatología clínica', 315, 'salud-biotech'),
  ('salud-ocupacional-seguridad-laboral', 'Salud ocupacional y seguridad laboral', 320, 'salud-biotech'),
  ('educacion-especial-inclusion', 'Educación especial e inclusión', 290, 'educacion'),
  ('evaluacion-certificaciones-internacionales', 'Evaluación y certificaciones internacionales', 295, 'educacion'),
  ('marketplace-cursos-digitales', 'Marketplace de cursos y microcredenciales', 300, 'educacion'),
  ('experiencia-campus-hibrido', 'Campus y experiencia educativa híbrida', 305, 'educacion'),
  ('martech-adtech-plataformas', 'MarTech, AdTech y medición de campañas', 880, 'tecnologia-ia'),
  ('plataforma-datos-gobernanza', 'Data platform y gobernanza de datos', 885, 'tecnologia-ia'),
  ('gemelos-digitales-industrial', 'Gemelos digitales e ingeniería de simulación', 890, 'tecnologia-ia'),
  ('vertical-saas-por-industria', 'SaaS vertical especializado por industria', 895, 'tecnologia-ia'),
  ('compras-publicas-digitales', 'Compras y licitaciones públicas digitales', 270, 'gobierno-sector-publico'),
  ('justicia-digital-judicial', 'Justicia digital y servicios judiciales en línea', 275, 'gobierno-sector-publico'),
  ('smart-cities-movilidad-urbana', 'Smart cities y movilidad urbana pública', 280, 'gobierno-sector-publico'),
  ('quick-commerce-dark-store', 'Quick commerce y dark stores', 910, 'retail-comercio'),
  ('cpg-fmcg-gran-consumo', 'CPG / FMCG y gran consumo', 915, 'retail-comercio'),
  ('travel-retail-duty-free', 'Travel retail y duty free', 920, 'retail-comercio'),
  ('retail-financiero-corresponsalia', 'Retail financiero y corresponsalía', 925, 'retail-comercio'),
  ('agencia-creativa-produccion', 'Agencia creativa y producción integral', 890, 'entretenimiento-medios'),
  ('parques-tematicos-atracciones', 'Parques temáticos y atracciones', 895, 'entretenimiento-medios'),
  ('editorial-suscriptores-memberships', 'Editorial, suscriptores y memberships', 900, 'entretenimiento-medios'),
  ('locacion-espacios-audiovisuales', 'Locación, renta de estudios y espacios', 905, 'entretenimiento-medios'),
  ('estudio-brand-identidad', 'Estudio de marca e identidad visual', 880, 'artes-diseno-creativo'),
  ('diseno-industrial-producto-fisico', 'Diseño industrial y producto físico', 885, 'artes-diseno-creativo'),
  ('arte-videojuegos-indie', 'Arte y visdev para videojuegos', 890, 'artes-diseno-creativo'),
  ('gestion-patrimonio-cultural', 'Gestión de patrimonio y proyectos culturales', 895, 'artes-diseno-creativo'),
  ('inversion-inmobiliaria-reits', 'Inversión inmobiliaria, REITs y patrimonio', 250, 'construccion-inmobiliario'),
  ('edificios-inteligentes-operacion', 'Edificios inteligentes y operación tecnológica', 255, 'construccion-inmobiliario'),
  ('due-diligence-tecnica-transacciones', 'Due diligence técnica y transacciones', 260, 'construccion-inmobiliario'),
  ('industria-farmaceutica-manufactura', 'Manufactura farmacéutica y bio', 910, 'manufactura-industria'),
  ('alimentos-procesados-industria', 'Alimentos procesados y planta industrial', 915, 'manufactura-industria'),
  ('cogeneracion-utilities-planta', 'Cogeneración y utilities de planta', 920, 'manufactura-industria'),
  ('maquila-export-manufactura', 'Maquila, export manufacturing y nearshoring', 925, 'manufactura-industria'),
  ('hidrogeno-almacenamiento-energetico', 'Hidrógeno, almacenamiento y flexibilidad', 290, 'energia-sustentabilidad'),
  ('consultoria-impacto-ambiental', 'Consultoría de impacto y estudios ambientales', 295, 'energia-sustentabilidad'),
  ('biodiversidad-naturaleza-soluciones', 'Biodiversidad y soluciones basadas en naturaleza', 300, 'energia-sustentabilidad'),
  ('export-agro-commodities', 'Exportación agro y trading de commodities', 290, 'agro-alimentacion'),
  ('organico-certificaciones-export', 'Orgánico, certificaciones y exportación', 295, 'agro-alimentacion'),
  ('cooperativas-asociaciones-rurales', 'Cooperativas y asociaciones rurales', 300, 'agro-alimentacion'),
  ('turismo-negocios-bleisure', 'Turismo de negocios y bleisure', 320, 'turismo-hospitalidad'),
  ('alquiler-vacacional-stays', 'Alquiler vacacional y stays de corta estadía', 325, 'turismo-hospitalidad'),
  ('turismo-deportivo-eventos-mayores', 'Turismo deportivo y megaeventos', 330, 'turismo-hospitalidad'),
  ('despacho-boutique-legal', 'Despacho boutique y práctica de nicho', 270, 'legal-consultoria'),
  ('legal-operations-outsourcing', 'Legal operations y outsourcing jurídico', 275, 'legal-consultoria'),
  ('ma-transacciones-corporativas', 'M&A y transacciones corporativas (advisory)', 280, 'legal-consultoria'),
  ('federaciones-organizadores-eventos', 'Federaciones y organización de eventos deportivos', 270, 'deporte-bienestar'),
  ('tecnologia-wearables-health-fitness', 'Wearables y tecnología aplicada al rendimiento', 275, 'deporte-bienestar'),
  ('centros-rehabilitacion-deportiva', 'Centros de rehabilitación y readaptación', 280, 'deporte-bienestar')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  sort_order = EXCLUDED.sort_order,
  parent_slug = EXCLUDED.parent_slug;

INSERT INTO public.industry_verticals (slug, industry_slug, label, sort_order, maps_to)
SELECT c.slug, c.parent_slug, c.name, COALESCE(c.sort_order, 0) + 100, i.maps_to
FROM public.industries_catalog c
INNER JOIN public.industries i ON i.slug = c.parent_slug
WHERE c.slug IN (
  'neobanca-embed-banking', 'tesoreria-liquidez-corporativa', 'cobranza-recuperacion-cartera', 'finanzas-sostenibles-esg', 'ratings-analisis-credito',
  'dispositivos-medicos-hardware', 'diagnostico-imagen-laboratorio', 'aseguradoras-planes-salud', 'medicina-estetica-dermatologia', 'salud-ocupacional-seguridad-laboral',
  'educacion-especial-inclusion', 'evaluacion-certificaciones-internacionales', 'marketplace-cursos-digitales', 'experiencia-campus-hibrido',
  'martech-adtech-plataformas', 'plataforma-datos-gobernanza', 'gemelos-digitales-industrial', 'vertical-saas-por-industria',
  'compras-publicas-digitales', 'justicia-digital-judicial', 'smart-cities-movilidad-urbana',
  'quick-commerce-dark-store', 'cpg-fmcg-gran-consumo', 'travel-retail-duty-free', 'retail-financiero-corresponsalia',
  'agencia-creativa-produccion', 'parques-tematicos-atracciones', 'editorial-suscriptores-memberships', 'locacion-espacios-audiovisuales',
  'estudio-brand-identidad', 'diseno-industrial-producto-fisico', 'arte-videojuegos-indie', 'gestion-patrimonio-cultural',
  'inversion-inmobiliaria-reits', 'edificios-inteligentes-operacion', 'due-diligence-tecnica-transacciones',
  'industria-farmaceutica-manufactura', 'alimentos-procesados-industria', 'cogeneracion-utilities-planta', 'maquila-export-manufactura',
  'hidrogeno-almacenamiento-energetico', 'consultoria-impacto-ambiental', 'biodiversidad-naturaleza-soluciones',
  'export-agro-commodities', 'organico-certificaciones-export', 'cooperativas-asociaciones-rurales',
  'turismo-negocios-bleisure', 'alquiler-vacacional-stays', 'turismo-deportivo-eventos-mayores',
  'despacho-boutique-legal', 'legal-operations-outsourcing', 'ma-transacciones-corporativas',
  'federaciones-organizadores-eventos', 'tecnologia-wearables-health-fitness', 'centros-rehabilitacion-deportiva'
)
  AND c.parent_slug IS NOT NULL
  AND c.slug NOT IN (SELECT slug FROM public.industries)
ON CONFLICT (slug) DO UPDATE SET
  industry_slug = EXCLUDED.industry_slug,
  label = EXCLUDED.label,
  sort_order = EXCLUDED.sort_order,
  maps_to = EXCLUDED.maps_to;
