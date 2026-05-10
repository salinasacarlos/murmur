-- Optional multi-select functional area tags (onboarding) alongside single `area` enum for matching.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS functional_area_tags text[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.profiles.functional_area_tags IS
  'Up to 5 slugs from onboarding functional area catalog; profiles.area remains primary for matching.';
