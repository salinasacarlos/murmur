-- Perfil público compartible: RPC con campos seguros (sin email ni datos internos).

CREATE OR REPLACE FUNCTION public.get_public_profile(p_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_row public.profiles%ROWTYPE;
  v_allowed boolean := false;
BEGIN
  SELECT * INTO v_row FROM public.profiles WHERE id = p_id;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF v_row.visible = true OR v_row.id = v_uid THEN
    v_allowed := true;
  ELSIF v_uid IS NOT NULL AND EXISTS (
    SELECT 1
    FROM public.connections c
    WHERE c.status IN ('accepted', 'pending')
      AND (
        (c.sender_id = v_uid AND c.receiver_id = p_id)
        OR (c.receiver_id = v_uid AND c.sender_id = p_id)
      )
  ) THEN
    v_allowed := true;
  END IF;

  IF NOT v_allowed THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'id', v_row.id,
    'name', v_row.name,
    'initials', v_row.initials,
    'photo_url', v_row.photo_url,
    'role', v_row.role,
    'bio', v_row.bio,
    'fun_fact', COALESCE(v_row.fun_fact, ''),
    'area', v_row.area,
    'functional_area_tags', COALESCE(v_row.functional_area_tags, ARRAY[]::text[]),
    'primary_industry_slug', v_row.primary_industry_slug,
    'vertical_slugs', COALESCE(v_row.vertical_slugs, ARRAY[]::text[]),
    'expertise_slugs', COALESCE(v_row.expertise_slugs, ARRAY[]::text[]),
    'talent_slugs', COALESCE(v_row.talent_slugs, ARRAY[]::text[]),
    'experience', v_row.experience,
    'achievement', v_row.achievement,
    'availability', v_row.availability,
    'city', v_row.city,
    'compatibility', v_row.compatibility,
    'online', v_row.online,
    'onboarding_intent', v_row.onboarding_intent,
    'project_stage', v_row.project_stage,
    'project_name', v_row.project_name,
    'project_seek_summary', v_row.project_seek_summary,
    'opportunity_seek_summary', v_row.opportunity_seek_summary,
    'contributor_pitch', v_row.contributor_pitch,
    'investor_activity', v_row.investor_activity,
    'recommendation_count', COALESCE(v_row.recommendation_count, 0),
    'show_recommendation_count', COALESCE(v_row.show_recommendation_count, true),
    'visible', v_row.visible,
    'relations_looking', COALESCE(
      (
        SELECT jsonb_agg(pr.relation ORDER BY pr.relation)
        FROM public.profile_relations_looking pr
        WHERE pr.profile_id = p_id
      ),
      '[]'::jsonb
    ),
    'work_styles', COALESCE(
      (
        SELECT jsonb_agg(pw.work_style ORDER BY pw.work_style)
        FROM public.profile_work_styles pw
        WHERE pw.profile_id = p_id
      ),
      '[]'::jsonb
    ),
    'event_codes', COALESCE(
      (
        SELECT jsonb_agg(pe.event_code ORDER BY pe.event_code)
        FROM public.profile_events pe
        WHERE pe.profile_id = p_id
      ),
      '[]'::jsonb
    ),
    'cities', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'city_slug', pc.city_slug,
            'is_primary', pc.is_primary
          )
          ORDER BY pc.is_primary DESC, pc.city_slug
        )
        FROM public.profile_cities pc
        WHERE pc.profile_id = p_id
      ),
      '[]'::jsonb
    )
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_profile(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon, authenticated;
