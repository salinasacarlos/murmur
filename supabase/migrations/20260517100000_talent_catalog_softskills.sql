-- Catálogo de talentos (soft skills). Reemplaza filas previas; vacía selecciones guardadas con slugs obsoletos.

UPDATE public.profiles SET talent_slugs = '{}';
UPDATE public.searches SET talent_slugs = '{}';

TRUNCATE public.talent_catalog;

INSERT INTO public.talent_catalog (slug, label, sort_order) VALUES
  ('comunicacion', 'Comunicación', 10),
  ('liderazgo', 'Liderazgo', 20),
  ('pensamiento-estrategico', 'Pensamiento estratégico', 30),
  ('creatividad', 'Creatividad', 40),
  ('resolucion-de-problemas', 'Resolución de problemas', 50),
  ('colaboracion', 'Colaboración', 60),
  ('adaptabilidad', 'Adaptabilidad', 70),
  ('gestion-de-proyectos', 'Gestión de proyectos', 80),
  ('negociacion', 'Negociación', 90),
  ('pensamiento-analitico', 'Pensamiento analítico', 100),
  ('facilitacion', 'Facilitación', 110),
  ('empatia', 'Empatía', 120),
  ('toma-de-decisiones', 'Toma de decisiones', 130),
  ('innovacion', 'Innovación', 140),
  ('gestion-del-tiempo', 'Gestión del tiempo', 150),
  ('vision-de-negocio', 'Visión de negocio', 160),
  ('investigacion', 'Investigación', 170),
  ('mentoria', 'Mentoría', 180),
  ('storytelling', 'Storytelling', 190),
  ('resiliencia', 'Resiliencia', 200),
  ('escucha-activa', 'Escucha activa', 210),
  ('pensamiento-critico', 'Pensamiento crítico', 220),
  ('gestion-del-cambio', 'Gestión del cambio', 230),
  ('inteligencia-emocional', 'Inteligencia emocional', 240),
  ('trabajo-bajo-presion', 'Trabajo bajo presión', 250),
  ('curiosidad', 'Curiosidad', 260),
  ('persuasion', 'Persuasión', 270),
  ('sintesis-de-informacion', 'Síntesis de información', 280),
  ('planificacion', 'Planificación', 290),
  ('autonomia', 'Autonomía', 300),
  ('networking', 'Networking', 310),
  ('mediacion-de-conflictos', 'Mediación de conflictos', 320),
  ('pensamiento-sistemico', 'Pensamiento sistémico', 330),
  ('orientacion-a-resultados', 'Orientación a resultados', 340),
  ('aprendizaje-continuo', 'Aprendizaje continuo', 350),
  ('proactividad', 'Proactividad', 360),
  ('gestion-de-equipos', 'Gestión de equipos', 370),
  ('atencion-al-detalle', 'Atención al detalle', 380),
  ('vision-de-usuario', 'Visión de usuario', 390),
  ('cocreacion', 'Cocreación', 400),
  ('priorizacion', 'Priorización', 410),
  ('gestion-de-la-incertidumbre', 'Gestión de la incertidumbre', 420),
  ('pensamiento-lateral', 'Pensamiento lateral', 430),
  ('construccion-de-comunidad', 'Construcción de comunidad', 440),
  ('influencia-sin-autoridad', 'Influencia sin autoridad', 450),
  ('gestion-de-stakeholders', 'Gestión de stakeholders', 460),
  ('conciencia-cultural', 'Conciencia cultural', 470),
  ('etica-profesional', 'Ética profesional', 480),
  ('generacion-de-ideas', 'Generación de ideas', 490),
  ('ejecucion', 'Ejecución', 500);

ALTER TABLE public.talent_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "talent_catalog_read_authenticated" ON public.talent_catalog;
CREATE POLICY "talent_catalog_read_authenticated" ON public.talent_catalog
  FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "talent_catalog_read_anon" ON public.talent_catalog;
CREATE POLICY "talent_catalog_read_anon" ON public.talent_catalog
  FOR SELECT TO anon USING (true);
