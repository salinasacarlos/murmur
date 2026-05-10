-- Texto libre tipo "fun fact" / dato curioso (párrafo medio, opcional).
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS fun_fact text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.profiles.fun_fact IS 'Dato curioso o anécdota breve opcional para humanizar el perfil.';
