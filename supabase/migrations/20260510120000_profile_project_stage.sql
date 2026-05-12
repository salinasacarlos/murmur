-- Onboarding intent (rol inicial) y etapa estructurada del proyecto para founders.

DO $$
BEGIN
  CREATE TYPE public.onboarding_intent AS ENUM ('founder', 'contributor', 'both');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE public.project_stage AS ENUM (
    'idea',
    'validando',
    'construyendo',
    'en_manos_de_personas',
    'generando_ingresos',
    'creciendo'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_intent public.onboarding_intent NULL,
  ADD COLUMN IF NOT EXISTS project_name text NULL,
  ADD COLUMN IF NOT EXISTS project_stage public.project_stage NULL,
  ADD COLUMN IF NOT EXISTS project_seek_summary text NULL,
  ADD COLUMN IF NOT EXISTS opportunity_seek_summary text NULL,
  ADD COLUMN IF NOT EXISTS contributor_pitch text NULL;

COMMENT ON COLUMN public.profiles.onboarding_intent IS 'Rol declarado al entrar: tiene proyecto, busca contribuir, o ambos.';
COMMENT ON COLUMN public.profiles.project_stage IS 'Etapa del proyecto; aplica si onboarding_intent es founder o both.';
COMMENT ON COLUMN public.profiles.project_seek_summary IS 'Qué busca quien tiene proyecto (texto libre).';
COMMENT ON COLUMN public.profiles.opportunity_seek_summary IS 'Tipo de oportunidad buscada (contribuidores).';
COMMENT ON COLUMN public.profiles.contributor_pitch IS 'Qué puede aportar (contribuidores).';
