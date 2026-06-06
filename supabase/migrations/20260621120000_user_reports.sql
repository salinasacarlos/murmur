-- Reportes de usuarios: cola de moderación (service_role / admin).

CREATE TABLE public.user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  reason text NOT NULL
    CONSTRAINT user_reports_reason_chk
    CHECK (reason IN ('spam', 'harassment', 'fake_profile', 'inappropriate', 'other')),
  details text NOT NULL DEFAULT '',
  context_type text NULL
    CONSTRAINT user_reports_context_type_chk
    CHECK (context_type IS NULL OR context_type IN ('profile', 'chat', 'connection')),
  context_id uuid NULL,
  status text NOT NULL DEFAULT 'pending'
    CONSTRAINT user_reports_status_chk
    CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz NULL,
  CONSTRAINT user_reports_no_self CHECK (reporter_id <> reported_id)
);

CREATE UNIQUE INDEX user_reports_one_pending_per_pair
  ON public.user_reports (reporter_id, reported_id)
  WHERE status = 'pending';

CREATE INDEX user_reports_status_created_idx
  ON public.user_reports (status, created_at DESC);

COMMENT ON TABLE public.user_reports IS
  'Reportes de perfiles; revisión manual vía admin.';

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
