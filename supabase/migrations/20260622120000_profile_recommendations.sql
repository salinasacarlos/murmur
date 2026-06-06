-- Recomendaciones entre perfiles (fidelidad / señal social).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS recommendation_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS show_recommendation_count boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.recommendation_count IS
  'Total de votos recommend (mantenido por trigger).';
COMMENT ON COLUMN public.profiles.show_recommendation_count IS
  'Si true, otros ven el contador en cards cuando es > 0.';

CREATE TABLE public.profile_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommender_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  vote text NOT NULL
    CONSTRAINT profile_recommendations_vote_chk
    CHECK (vote IN ('recommend', 'not_recommend')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profile_recommendations_no_self CHECK (recommender_id <> profile_id),
  CONSTRAINT profile_recommendations_pair_key UNIQUE (recommender_id, profile_id)
);

CREATE INDEX profile_recommendations_profile_idx
  ON public.profile_recommendations (profile_id);

CREATE INDEX profile_recommendations_recommender_idx
  ON public.profile_recommendations (recommender_id);

COMMENT ON TABLE public.profile_recommendations IS
  'Voto recommend / not_recommend de un usuario sobre otro perfil.';

ALTER TABLE public.profile_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_recommendations_select_own
  ON public.profile_recommendations FOR SELECT TO authenticated
  USING (recommender_id = auth.uid());

CREATE POLICY profile_recommendations_insert_own
  ON public.profile_recommendations FOR INSERT TO authenticated
  WITH CHECK (recommender_id = auth.uid());

CREATE POLICY profile_recommendations_update_own
  ON public.profile_recommendations FOR UPDATE TO authenticated
  USING (recommender_id = auth.uid())
  WITH CHECK (recommender_id = auth.uid());

CREATE POLICY profile_recommendations_delete_own
  ON public.profile_recommendations FOR DELETE TO authenticated
  USING (recommender_id = auth.uid());

CREATE OR REPLACE FUNCTION public.refresh_profile_recommendation_count(p_profile_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.profiles p
  SET recommendation_count = (
    SELECT COUNT(*)::integer
    FROM public.profile_recommendations r
    WHERE r.profile_id = p_profile_id
      AND r.vote = 'recommend'
  )
  WHERE p.id = p_profile_id;
$$;

CREATE OR REPLACE FUNCTION public.profile_recommendations_sync_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM public.refresh_profile_recommendation_count(OLD.profile_id);
    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' AND OLD.profile_id IS DISTINCT FROM NEW.profile_id THEN
    PERFORM public.refresh_profile_recommendation_count(OLD.profile_id);
  END IF;

  PERFORM public.refresh_profile_recommendation_count(NEW.profile_id);
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profile_recommendations_sync_count ON public.profile_recommendations;
CREATE TRIGGER profile_recommendations_sync_count
  AFTER INSERT OR UPDATE OR DELETE ON public.profile_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.profile_recommendations_sync_count();

REVOKE ALL ON FUNCTION public.refresh_profile_recommendation_count(uuid) FROM PUBLIC;
