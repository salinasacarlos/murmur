-- Inversionistas: nuevo valor en onboarding_intent + campo obligatorio en ese rol.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'onboarding_intent'
      AND e.enumlabel = 'investor'
  ) THEN
    ALTER TYPE public.onboarding_intent ADD VALUE 'investor';
  END IF;
END $$;

DO $$
BEGIN
  CREATE TYPE public.investor_activity AS ENUM (
    'actively_investing',
    'can_help_source',
    'not_investing_now'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS investor_activity public.investor_activity NULL;

COMMENT ON COLUMN public.profiles.investor_activity IS
  'Si onboarding_intent es investor: invirtiendo activo, facilita capital/conexiones, o no invirtiendo por ahora.';
