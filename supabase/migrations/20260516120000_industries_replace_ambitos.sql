-- Catálogo: industrias (15) + expertise por industria. Sustituye ámbitos en producto.
-- Renombra tabla public.ambitos → industries, primary_ambit_slug → primary_industry_slug.

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_primary_ambit_slug_fkey;
ALTER TABLE public.searches DROP CONSTRAINT IF EXISTS searches_primary_ambit_slug_fkey;

ALTER TABLE public.expertise_catalog DROP CONSTRAINT IF EXISTS expertise_catalog_ambito_slug_fkey;

ALTER TABLE public.expertise_catalog RENAME COLUMN ambito_slug TO industry_slug;

ALTER INDEX IF EXISTS expertise_catalog_ambito_slug_idx RENAME TO expertise_catalog_industry_slug_idx;

ALTER TABLE public.ambitos RENAME TO industries;

ALTER TABLE public.expertise_catalog ADD CONSTRAINT expertise_catalog_industry_slug_fkey
  FOREIGN KEY (industry_slug) REFERENCES public.industries (slug) ON DELETE CASCADE;

ALTER TABLE public.profiles RENAME COLUMN primary_ambit_slug TO primary_industry_slug;
ALTER TABLE public.searches RENAME COLUMN primary_ambit_slug TO primary_industry_slug;

UPDATE public.profiles SET
  primary_industry_slug = NULL,
  expertise_slugs = '{}',
  functional_area_tags = '{}';

UPDATE public.searches SET
  primary_industry_slug = NULL,
  expertise_slugs = '{}',
  functional_area_tags = '{}';

TRUNCATE public.industries CASCADE;

DROP POLICY IF EXISTS "ambitos_read_authenticated" ON public.industries;
DROP POLICY IF EXISTS "ambitos_read_anon" ON public.industries;
CREATE POLICY "industries_read_authenticated" ON public.industries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "industries_read_anon" ON public.industries
  FOR SELECT TO anon USING (true);

COMMENT ON COLUMN public.profiles.primary_industry_slug IS 'Única industria principal; define el marco de expertise.';
COMMENT ON COLUMN public.profiles.expertise_slugs IS 'Hasta 5 slugs de expertise_catalog bajo primary_industry_slug.';
COMMENT ON COLUMN public.searches.primary_industry_slug IS 'Industria buscada (opcional); mismo catálogo que perfiles.';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_primary_industry_slug_fkey;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_primary_industry_slug_fkey
  FOREIGN KEY (primary_industry_slug) REFERENCES public.industries (slug);

ALTER TABLE public.searches DROP CONSTRAINT IF EXISTS searches_primary_industry_slug_fkey;
ALTER TABLE public.searches ADD CONSTRAINT searches_primary_industry_slug_fkey
  FOREIGN KEY (primary_industry_slug) REFERENCES public.industries (slug);

-- Seed generado desde scripts/dump-catalog-sql.ts (debe coincidir con lib/profile-taxonomy.ts)

INSERT INTO public.industries (slug, label, sort_order, maps_to) VALUES
  ('tecnologia-ia', 'Tecnología e IA', 10, 'tecnico'),
  ('salud-biotech', 'Salud y biotech', 20, 'ciencia'),
  ('educacion', 'Educación', 30, 'producto'),
  ('finanzas-fintech', 'Finanzas y fintech', 40, 'negocio'),
  ('entretenimiento-medios', 'Entretenimiento y medios', 50, 'producto'),
  ('artes-diseno-creativo', 'Artes y diseño creativo', 60, 'producto'),
  ('construccion-inmobiliario', 'Construcción e inmobiliario', 70, 'operaciones'),
  ('manufactura-industria', 'Manufactura e industria', 80, 'operaciones'),
  ('agro-alimentacion', 'Agro y alimentación', 90, 'operaciones'),
  ('gobierno-sector-publico', 'Gobierno y sector público', 100, 'negocio'),
  ('turismo-hospitalidad', 'Turismo y hospitalidad', 110, 'negocio'),
  ('energia-sustentabilidad', 'Energía y sustentabilidad', 120, 'ciencia'),
  ('retail-comercio', 'Retail y comercio', 130, 'negocio'),
  ('legal-consultoria', 'Legal y consultoría', 140, 'negocio'),
  ('deporte-bienestar', 'Deporte y bienestar', 150, 'producto');

INSERT INTO public.expertise_catalog (slug, industry_slug, label, sort_order, maps_to) VALUES
  ('tecnologia-ia-software', 'tecnologia-ia', 'Software', 10, 'tecnico'),
  ('tecnologia-ia-hardware', 'tecnologia-ia', 'Hardware', 20, 'tecnico'),
  ('tecnologia-ia-ciberseguridad', 'tecnologia-ia', 'Ciberseguridad', 30, 'tecnico'),
  ('tecnologia-ia-datos', 'tecnologia-ia', 'Datos', 40, 'tecnico'),
  ('tecnologia-ia-nube', 'tecnologia-ia', 'Nube', 50, 'tecnico'),
  ('tecnologia-ia-robotica', 'tecnologia-ia', 'Robótica', 60, 'tecnico'),
  ('tecnologia-ia-ia-generativa', 'tecnologia-ia', 'IA generativa', 70, 'tecnico'),
  ('tecnologia-ia-iot', 'tecnologia-ia', 'IoT', 80, 'tecnico'),
  ('tecnologia-ia-blockchain', 'tecnologia-ia', 'Blockchain', 90, 'tecnico'),
  ('tecnologia-ia-realidad-virtual-aumentada', 'tecnologia-ia', 'Realidad virtual/aumentada', 100, 'tecnico'),
  ('tecnologia-ia-semiconductores', 'tecnologia-ia', 'Semiconductores', 110, 'tecnico'),
  ('tecnologia-ia-telecomunicaciones', 'tecnologia-ia', 'Telecomunicaciones', 120, 'tecnico'),
  ('tecnologia-ia-automatizacion', 'tecnologia-ia', 'Automatización', 130, 'tecnico'),
  ('tecnologia-ia-desarrollo-web-movil', 'tecnologia-ia', 'Desarrollo web/móvil', 140, 'tecnico'),
  ('tecnologia-ia-open-source', 'tecnologia-ia', 'Open source', 150, 'tecnico'),
  ('salud-biotech-medicina-clinica', 'salud-biotech', 'Medicina clínica', 10, 'ciencia'),
  ('salud-biotech-farmaceutica', 'salud-biotech', 'Farmacéutica', 20, 'ciencia'),
  ('salud-biotech-genomica', 'salud-biotech', 'Genómica', 30, 'ciencia'),
  ('salud-biotech-salud-mental', 'salud-biotech', 'Salud mental', 40, 'ciencia'),
  ('salud-biotech-dispositivos-medicos', 'salud-biotech', 'Dispositivos médicos', 50, 'ciencia'),
  ('salud-biotech-telemedicina', 'salud-biotech', 'Telemedicina', 60, 'ciencia'),
  ('salud-biotech-neurociencia', 'salud-biotech', 'Neurociencia', 70, 'ciencia'),
  ('salud-biotech-oncologia', 'salud-biotech', 'Oncología', 80, 'ciencia'),
  ('salud-biotech-salud-preventiva', 'salud-biotech', 'Salud preventiva', 90, 'ciencia'),
  ('salud-biotech-nutricion-clinica', 'salud-biotech', 'Nutrición clínica', 100, 'ciencia'),
  ('salud-biotech-rehabilitacion', 'salud-biotech', 'Rehabilitación', 110, 'ciencia'),
  ('salud-biotech-salud-publica', 'salud-biotech', 'Salud pública', 120, 'ciencia'),
  ('salud-biotech-bioingenieria', 'salud-biotech', 'Bioingeniería', 130, 'ciencia'),
  ('salud-biotech-laboratorios', 'salud-biotech', 'Laboratorios', 140, 'ciencia'),
  ('salud-biotech-medicina-tradicional-alternativa', 'salud-biotech', 'Medicina tradicional/alternativa', 150, 'ciencia'),
  ('educacion-educacion-basica-media', 'educacion', 'Educación básica/media', 10, 'producto'),
  ('educacion-universitaria', 'educacion', 'Universitaria', 20, 'producto'),
  ('educacion-formacion-corporativa', 'educacion', 'Formación corporativa', 30, 'producto'),
  ('educacion-edtech', 'educacion', 'Edtech', 40, 'producto'),
  ('educacion-educacion-alternativa', 'educacion', 'Educación alternativa', 50, 'producto'),
  ('educacion-pedagogia', 'educacion', 'Pedagogía', 60, 'producto'),
  ('educacion-orientacion-vocacional', 'educacion', 'Orientación vocacional', 70, 'producto'),
  ('educacion-educacion-especial', 'educacion', 'Educación especial', 80, 'producto'),
  ('educacion-idiomas', 'educacion', 'Idiomas', 90, 'producto'),
  ('educacion-tutorias', 'educacion', 'Tutorías', 100, 'producto'),
  ('educacion-certificaciones-profesionales', 'educacion', 'Certificaciones profesionales', 110, 'producto'),
  ('educacion-educacion-a-distancia', 'educacion', 'Educación a distancia', 120, 'producto'),
  ('educacion-bibliotecologia', 'educacion', 'Bibliotecología', 130, 'producto'),
  ('finanzas-fintech-banca', 'finanzas-fintech', 'Banca', 10, 'negocio'),
  ('finanzas-fintech-inversion', 'finanzas-fintech', 'Inversión', 20, 'negocio'),
  ('finanzas-fintech-seguros', 'finanzas-fintech', 'Seguros', 30, 'negocio'),
  ('finanzas-fintech-cripto', 'finanzas-fintech', 'Cripto', 40, 'negocio'),
  ('finanzas-fintech-pagos-digitales', 'finanzas-fintech', 'Pagos digitales', 50, 'negocio'),
  ('finanzas-fintech-finanzas-personales', 'finanzas-fintech', 'Finanzas personales', 60, 'negocio'),
  ('finanzas-fintech-capital-de-riesgo', 'finanzas-fintech', 'Capital de riesgo', 70, 'negocio'),
  ('finanzas-fintech-fondos-de-inversion', 'finanzas-fintech', 'Fondos de inversión', 80, 'negocio'),
  ('finanzas-fintech-contabilidad', 'finanzas-fintech', 'Contabilidad', 90, 'negocio'),
  ('finanzas-fintech-auditoria-financiera', 'finanzas-fintech', 'Auditoría financiera', 100, 'negocio'),
  ('finanzas-fintech-microfinanzas', 'finanzas-fintech', 'Microfinanzas', 110, 'negocio'),
  ('finanzas-fintech-mercados-de-capitales', 'finanzas-fintech', 'Mercados de capitales', 120, 'negocio'),
  ('finanzas-fintech-economia-conductual', 'finanzas-fintech', 'Economía conductual', 130, 'negocio'),
  ('finanzas-fintech-planeacion-fiscal', 'finanzas-fintech', 'Planeación fiscal', 140, 'negocio'),
  ('entretenimiento-medios-cine', 'entretenimiento-medios', 'Cine', 10, 'producto'),
  ('entretenimiento-medios-musica', 'entretenimiento-medios', 'Música', 20, 'producto'),
  ('entretenimiento-medios-videojuegos', 'entretenimiento-medios', 'Videojuegos', 30, 'producto'),
  ('entretenimiento-medios-streaming', 'entretenimiento-medios', 'Streaming', 40, 'producto'),
  ('entretenimiento-medios-podcasting', 'entretenimiento-medios', 'Podcasting', 50, 'producto'),
  ('entretenimiento-medios-prensa-digital', 'entretenimiento-medios', 'Prensa digital', 60, 'producto'),
  ('entretenimiento-medios-teatro', 'entretenimiento-medios', 'Teatro', 70, 'producto'),
  ('entretenimiento-medios-television', 'entretenimiento-medios', 'Televisión', 80, 'producto'),
  ('entretenimiento-medios-animacion', 'entretenimiento-medios', 'Animación', 90, 'producto'),
  ('entretenimiento-medios-comics-novela-grafica', 'entretenimiento-medios', 'Cómics/novela gráfica', 100, 'producto'),
  ('entretenimiento-medios-eventos-en-vivo', 'entretenimiento-medios', 'Eventos en vivo', 110, 'producto'),
  ('entretenimiento-medios-realidad-virtual-inmersiva', 'entretenimiento-medios', 'Realidad virtual inmersiva', 120, 'producto'),
  ('entretenimiento-medios-produccion-audiovisual', 'entretenimiento-medios', 'Producción audiovisual', 130, 'producto'),
  ('entretenimiento-medios-relaciones-publicas', 'entretenimiento-medios', 'Relaciones públicas', 140, 'producto'),
  ('artes-diseno-creativo-diseno-grafico', 'artes-diseno-creativo', 'Diseño gráfico', 10, 'producto'),
  ('artes-diseno-creativo-arquitectura', 'artes-diseno-creativo', 'Arquitectura', 20, 'producto'),
  ('artes-diseno-creativo-moda', 'artes-diseno-creativo', 'Moda', 30, 'producto'),
  ('artes-diseno-creativo-fotografia', 'artes-diseno-creativo', 'Fotografía', 40, 'producto'),
  ('artes-diseno-creativo-arte-contemporaneo', 'artes-diseno-creativo', 'Arte contemporáneo', 50, 'producto'),
  ('artes-diseno-creativo-artesania', 'artes-diseno-creativo', 'Artesanía', 60, 'producto'),
  ('artes-diseno-creativo-ilustracion', 'artes-diseno-creativo', 'Ilustración', 70, 'producto'),
  ('artes-diseno-creativo-diseno-industrial', 'artes-diseno-creativo', 'Diseño industrial', 80, 'producto'),
  ('artes-diseno-creativo-diseno-ux-ui', 'artes-diseno-creativo', 'Diseño UX/UI', 90, 'producto'),
  ('artes-diseno-creativo-escultura', 'artes-diseno-creativo', 'Escultura', 100, 'producto'),
  ('artes-diseno-creativo-muralismo', 'artes-diseno-creativo', 'Muralismo', 110, 'producto'),
  ('artes-diseno-creativo-joyeria', 'artes-diseno-creativo', 'Joyería', 120, 'producto'),
  ('artes-diseno-creativo-ceramica', 'artes-diseno-creativo', 'Cerámica', 130, 'producto'),
  ('artes-diseno-creativo-direccion-de-arte', 'artes-diseno-creativo', 'Dirección de arte', 140, 'producto'),
  ('artes-diseno-creativo-diseno-editorial', 'artes-diseno-creativo', 'Diseño editorial', 150, 'producto'),
  ('construccion-inmobiliario-desarrollo-urbano', 'construccion-inmobiliario', 'Desarrollo urbano', 10, 'operaciones'),
  ('construccion-inmobiliario-infraestructura', 'construccion-inmobiliario', 'Infraestructura', 20, 'operaciones'),
  ('construccion-inmobiliario-proptech', 'construccion-inmobiliario', 'Proptech', 30, 'operaciones'),
  ('construccion-inmobiliario-diseno-de-interiores', 'construccion-inmobiliario', 'Diseño de interiores', 40, 'operaciones'),
  ('construccion-inmobiliario-ingenieria-civil', 'construccion-inmobiliario', 'Ingeniería civil', 50, 'operaciones'),
  ('construccion-inmobiliario-gestion-de-obra', 'construccion-inmobiliario', 'Gestión de obra', 60, 'operaciones'),
  ('construccion-inmobiliario-valuacion', 'construccion-inmobiliario', 'Valuación', 70, 'operaciones'),
  ('construccion-inmobiliario-urbanismo', 'construccion-inmobiliario', 'Urbanismo', 80, 'operaciones'),
  ('construccion-inmobiliario-paisajismo', 'construccion-inmobiliario', 'Paisajismo', 90, 'operaciones'),
  ('construccion-inmobiliario-arquitectura-sustentable', 'construccion-inmobiliario', 'Arquitectura sustentable', 100, 'operaciones'),
  ('construccion-inmobiliario-facility-management', 'construccion-inmobiliario', 'Facility management', 110, 'operaciones'),
  ('construccion-inmobiliario-vivienda-social', 'construccion-inmobiliario', 'Vivienda social', 120, 'operaciones'),
  ('manufactura-industria-automotriz', 'manufactura-industria', 'Automotriz', 10, 'operaciones'),
  ('manufactura-industria-electronica', 'manufactura-industria', 'Electrónica', 20, 'operaciones'),
  ('manufactura-industria-textil', 'manufactura-industria', 'Textil', 30, 'operaciones'),
  ('manufactura-industria-quimica', 'manufactura-industria', 'Química', 40, 'operaciones'),
  ('manufactura-industria-logistica', 'manufactura-industria', 'Logística', 50, 'operaciones'),
  ('manufactura-industria-aeroespacial', 'manufactura-industria', 'Aeroespacial', 60, 'operaciones'),
  ('manufactura-industria-impresion-3d', 'manufactura-industria', 'Impresión 3D', 70, 'operaciones'),
  ('manufactura-industria-control-de-calidad', 'manufactura-industria', 'Control de calidad', 80, 'operaciones'),
  ('manufactura-industria-cadena-de-suministro', 'manufactura-industria', 'Cadena de suministro', 90, 'operaciones'),
  ('manufactura-industria-empaque', 'manufactura-industria', 'Empaque', 100, 'operaciones'),
  ('manufactura-industria-metalmecanica', 'manufactura-industria', 'Metalmecánica', 110, 'operaciones'),
  ('manufactura-industria-industria-naval', 'manufactura-industria', 'Industria naval', 120, 'operaciones'),
  ('manufactura-industria-maquinaria-pesada', 'manufactura-industria', 'Maquinaria pesada', 130, 'operaciones'),
  ('manufactura-industria-industria-del-plastico', 'manufactura-industria', 'Industria del plástico', 140, 'operaciones'),
  ('agro-alimentacion-agricultura', 'agro-alimentacion', 'Agricultura', 10, 'operaciones'),
  ('agro-alimentacion-ganaderia', 'agro-alimentacion', 'Ganadería', 20, 'operaciones'),
  ('agro-alimentacion-procesamiento-de-alimentos', 'agro-alimentacion', 'Procesamiento de alimentos', 30, 'operaciones'),
  ('agro-alimentacion-agritech', 'agro-alimentacion', 'Agritech', 40, 'operaciones'),
  ('agro-alimentacion-restauracion', 'agro-alimentacion', 'Restauración', 50, 'operaciones'),
  ('agro-alimentacion-acuacultura', 'agro-alimentacion', 'Acuacultura', 60, 'operaciones'),
  ('agro-alimentacion-viticultura', 'agro-alimentacion', 'Viticultura', 70, 'operaciones'),
  ('agro-alimentacion-industria-organica', 'agro-alimentacion', 'Industria orgánica', 80, 'operaciones'),
  ('agro-alimentacion-agroexportacion', 'agro-alimentacion', 'Agroexportación', 90, 'operaciones'),
  ('agro-alimentacion-packaging-alimentario', 'agro-alimentacion', 'Packaging alimentario', 100, 'operaciones'),
  ('agro-alimentacion-investigacion-agricola', 'agro-alimentacion', 'Investigación agrícola', 110, 'operaciones'),
  ('agro-alimentacion-silvicultura', 'agro-alimentacion', 'Silvicultura', 120, 'operaciones'),
  ('agro-alimentacion-food-design', 'agro-alimentacion', 'Food design', 130, 'operaciones'),
  ('gobierno-sector-publico-politica-publica', 'gobierno-sector-publico', 'Política pública', 10, 'negocio'),
  ('gobierno-sector-publico-administracion', 'gobierno-sector-publico', 'Administración', 20, 'negocio'),
  ('gobierno-sector-publico-seguridad', 'gobierno-sector-publico', 'Seguridad', 30, 'negocio'),
  ('gobierno-sector-publico-justicia', 'gobierno-sector-publico', 'Justicia', 40, 'negocio'),
  ('gobierno-sector-publico-diplomacia', 'gobierno-sector-publico', 'Diplomacia', 50, 'negocio'),
  ('gobierno-sector-publico-gestion-municipal', 'gobierno-sector-publico', 'Gestión municipal', 60, 'negocio'),
  ('gobierno-sector-publico-planeacion-urbana', 'gobierno-sector-publico', 'Planeación urbana', 70, 'negocio'),
  ('gobierno-sector-publico-transparencia', 'gobierno-sector-publico', 'Transparencia', 80, 'negocio'),
  ('gobierno-sector-publico-relaciones-internacionales', 'gobierno-sector-publico', 'Relaciones internacionales', 90, 'negocio'),
  ('gobierno-sector-publico-defensa', 'gobierno-sector-publico', 'Defensa', 100, 'negocio'),
  ('gobierno-sector-publico-servicios-sociales', 'gobierno-sector-publico', 'Servicios sociales', 110, 'negocio'),
  ('gobierno-sector-publico-salud-publica', 'gobierno-sector-publico', 'Salud pública', 120, 'negocio'),
  ('gobierno-sector-publico-migracion', 'gobierno-sector-publico', 'Migración', 130, 'negocio'),
  ('gobierno-sector-publico-regulacion', 'gobierno-sector-publico', 'Regulación', 140, 'negocio'),
  ('turismo-hospitalidad-hoteleria', 'turismo-hospitalidad', 'Hotelería', 10, 'negocio'),
  ('turismo-hospitalidad-viajes', 'turismo-hospitalidad', 'Viajes', 20, 'negocio'),
  ('turismo-hospitalidad-gastronomia', 'turismo-hospitalidad', 'Gastronomía', 30, 'negocio'),
  ('turismo-hospitalidad-experiencias', 'turismo-hospitalidad', 'Experiencias', 40, 'negocio'),
  ('turismo-hospitalidad-turismo-de-aventura', 'turismo-hospitalidad', 'Turismo de aventura', 50, 'negocio'),
  ('turismo-hospitalidad-turismo-cultural', 'turismo-hospitalidad', 'Turismo cultural', 60, 'negocio'),
  ('turismo-hospitalidad-agencias-de-viaje', 'turismo-hospitalidad', 'Agencias de viaje', 70, 'negocio'),
  ('turismo-hospitalidad-guias-turisticos', 'turismo-hospitalidad', 'Guías turísticos', 80, 'negocio'),
  ('turismo-hospitalidad-turismo-medico', 'turismo-hospitalidad', 'Turismo médico', 90, 'negocio'),
  ('turismo-hospitalidad-turismo-sustentable', 'turismo-hospitalidad', 'Turismo sustentable', 100, 'negocio'),
  ('turismo-hospitalidad-cruceros', 'turismo-hospitalidad', 'Cruceros', 110, 'negocio'),
  ('turismo-hospitalidad-aerolineas', 'turismo-hospitalidad', 'Aerolíneas', 120, 'negocio'),
  ('turismo-hospitalidad-concierge', 'turismo-hospitalidad', 'Concierge', 130, 'negocio'),
  ('energia-sustentabilidad-energias-renovables', 'energia-sustentabilidad', 'Energías renovables', 10, 'ciencia'),
  ('energia-sustentabilidad-oil-gas', 'energia-sustentabilidad', 'Oil & gas', 20, 'ciencia'),
  ('energia-sustentabilidad-gestion-ambiental', 'energia-sustentabilidad', 'Gestión ambiental', 30, 'ciencia'),
  ('energia-sustentabilidad-economia-circular', 'energia-sustentabilidad', 'Economía circular', 40, 'ciencia'),
  ('energia-sustentabilidad-eficiencia-energetica', 'energia-sustentabilidad', 'Eficiencia energética', 50, 'ciencia'),
  ('energia-sustentabilidad-energia-solar', 'energia-sustentabilidad', 'Energía solar', 60, 'ciencia'),
  ('energia-sustentabilidad-eolica', 'energia-sustentabilidad', 'Eólica', 70, 'ciencia'),
  ('energia-sustentabilidad-hidrogeno-verde', 'energia-sustentabilidad', 'Hidrógeno verde', 80, 'ciencia'),
  ('energia-sustentabilidad-gestion-de-residuos', 'energia-sustentabilidad', 'Gestión de residuos', 90, 'ciencia'),
  ('energia-sustentabilidad-movilidad-electrica', 'energia-sustentabilidad', 'Movilidad eléctrica', 100, 'ciencia'),
  ('energia-sustentabilidad-carbono-neutro', 'energia-sustentabilidad', 'Carbono neutro', 110, 'ciencia'),
  ('energia-sustentabilidad-consultoria-ambiental', 'energia-sustentabilidad', 'Consultoría ambiental', 120, 'ciencia'),
  ('retail-comercio-e-commerce', 'retail-comercio', 'E-commerce', 10, 'negocio'),
  ('retail-comercio-retail-fisico', 'retail-comercio', 'Retail físico', 20, 'negocio'),
  ('retail-comercio-supply-chain', 'retail-comercio', 'Supply chain', 30, 'negocio'),
  ('retail-comercio-marcas', 'retail-comercio', 'Marcas', 40, 'negocio'),
  ('retail-comercio-merchandising', 'retail-comercio', 'Merchandising', 50, 'negocio'),
  ('retail-comercio-experiencia-del-cliente', 'retail-comercio', 'Experiencia del cliente', 60, 'negocio'),
  ('retail-comercio-marketplaces', 'retail-comercio', 'Marketplaces', 70, 'negocio'),
  ('retail-comercio-franquicias', 'retail-comercio', 'Franquicias', 80, 'negocio'),
  ('retail-comercio-comercio-justo', 'retail-comercio', 'Comercio justo', 90, 'negocio'),
  ('retail-comercio-retail-media', 'retail-comercio', 'Retail media', 100, 'negocio'),
  ('retail-comercio-distribucion', 'retail-comercio', 'Distribución', 110, 'negocio'),
  ('retail-comercio-importacion-exportacion', 'retail-comercio', 'Importación/exportación', 120, 'negocio'),
  ('legal-consultoria-derecho-corporativo', 'legal-consultoria', 'Derecho corporativo', 10, 'negocio'),
  ('legal-consultoria-consultoria-estrategica', 'legal-consultoria', 'Consultoría estratégica', 20, 'negocio'),
  ('legal-consultoria-rr-hh', 'legal-consultoria', 'RR.HH.', 30, 'negocio'),
  ('legal-consultoria-auditoria', 'legal-consultoria', 'Auditoría', 40, 'negocio'),
  ('legal-consultoria-propiedad-intelectual', 'legal-consultoria', 'Propiedad intelectual', 50, 'negocio'),
  ('legal-consultoria-derecho-laboral', 'legal-consultoria', 'Derecho laboral', 60, 'negocio'),
  ('legal-consultoria-notariado', 'legal-consultoria', 'Notariado', 70, 'negocio'),
  ('legal-consultoria-mediacion', 'legal-consultoria', 'Mediación', 80, 'negocio'),
  ('legal-consultoria-compliance', 'legal-consultoria', 'Compliance', 90, 'negocio'),
  ('legal-consultoria-derecho-internacional', 'legal-consultoria', 'Derecho internacional', 100, 'negocio'),
  ('legal-consultoria-consultoria-de-innovacion', 'legal-consultoria', 'Consultoría de innovación', 110, 'negocio'),
  ('legal-consultoria-gestion-del-cambio', 'legal-consultoria', 'Gestión del cambio', 120, 'negocio'),
  ('deporte-bienestar-fitness', 'deporte-bienestar', 'Fitness', 10, 'producto'),
  ('deporte-bienestar-nutricion', 'deporte-bienestar', 'Nutrición', 20, 'producto'),
  ('deporte-bienestar-deportes-profesionales', 'deporte-bienestar', 'Deportes profesionales', 30, 'producto'),
  ('deporte-bienestar-medicina-deportiva', 'deporte-bienestar', 'Medicina deportiva', 40, 'producto'),
  ('deporte-bienestar-yoga-meditacion', 'deporte-bienestar', 'Yoga/meditación', 50, 'producto'),
  ('deporte-bienestar-coaching', 'deporte-bienestar', 'Coaching', 60, 'producto'),
  ('deporte-bienestar-deportes-electronicos', 'deporte-bienestar', 'Deportes electrónicos', 70, 'producto'),
  ('deporte-bienestar-gestion-deportiva', 'deporte-bienestar', 'Gestión deportiva', 80, 'producto'),
  ('deporte-bienestar-psicologia-del-deporte', 'deporte-bienestar', 'Psicología del deporte', 90, 'producto'),
  ('deporte-bienestar-biohacking', 'deporte-bienestar', 'Biohacking', 100, 'producto'),
  ('deporte-bienestar-spas-y-wellness', 'deporte-bienestar', 'Spas y wellness', 110, 'producto'),
  ('deporte-bienestar-deporte-adaptado', 'deporte-bienestar', 'Deporte adaptado', 120, 'producto');
