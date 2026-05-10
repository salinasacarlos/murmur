-- Broader functional scope for saved searches (aligned with profiles.functional_area_tags).
ALTER TABLE public.searches
  ADD COLUMN IF NOT EXISTS functional_area_tags text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.searches.functional_area_tags IS
  'Slugs from shared onboarding/search catalog; coarse `area` remains for matching.';
