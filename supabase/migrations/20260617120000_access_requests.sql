-- Solicitudes de acceso (lista de espera) + flag admin en perfiles.
-- RLS sin políticas públicas: solo service_role en rutas servidor.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_murmur_admin boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.is_murmur_admin IS
  'Equipo interno: puede revisar access_requests en la consola admin.';

CREATE TABLE public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  building_description text NOT NULL,
  project_stage public.project_stage NOT NULL,
  proof_url text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  CONSTRAINT access_requests_status_chk
    CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz NULL,
  issued_invitation_id uuid NULL REFERENCES public.invitations (id) ON DELETE SET NULL
);

CREATE INDEX access_requests_status_submitted_at_idx
  ON public.access_requests (status, submitted_at ASC, id ASC);

CREATE UNIQUE INDEX access_requests_one_pending_per_email_idx
  ON public.access_requests (lower(email))
  WHERE status = 'pending';

COMMENT ON TABLE public.access_requests IS
  'Solicitudes de ingreso sin invitación; revisión manual y emisión de código.';

ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- ── Posición en cola (1-based), solo solicitudes pending ────────────────────

CREATE OR REPLACE FUNCTION public.access_request_queue_position(p_request_id uuid)
RETURNS int
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r1_submitted timestamptz;
  r1_id uuid;
  n int;
BEGIN
  SELECT submitted_at, id
    INTO r1_submitted, r1_id
  FROM public.access_requests
  WHERE id = p_request_id AND status = 'pending';

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COUNT(*)::int INTO n
  FROM public.access_requests r2
  WHERE r2.status = 'pending'
    AND (
      r2.submitted_at < r1_submitted
      OR (r2.submitted_at = r1_submitted AND r2.id < r1_id)
    );

  RETURN n + 1;
END;
$$;

REVOKE ALL ON FUNCTION public.access_request_queue_position(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.access_request_queue_position(uuid) TO service_role;

-- ── Aprobar: crea invitación y marca solicitud (atómico, bloqueo por fila) ───

CREATE OR REPLACE FUNCTION public.approve_access_request(
  p_request_id uuid,
  p_inviter_id uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req public.access_requests%ROWTYPE;
  inv_id uuid;
  new_code text;
  attempts int;
BEGIN
  IF p_inviter_id IS NULL THEN
    RAISE EXCEPTION 'ACCESS_APPROVE_INVITER_REQUIRED';
  END IF;

  SELECT * INTO req
  FROM public.access_requests
  WHERE id = p_request_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'ACCESS_REQUEST_NOT_FOUND';
  END IF;

  IF req.status <> 'pending' THEN
    RAISE EXCEPTION 'ACCESS_REQUEST_NOT_PENDING';
  END IF;

  attempts := 0;
  LOOP
    attempts := attempts + 1;
    IF attempts > 80 THEN
      RAISE EXCEPTION 'INVITE_GENERATION_FAILED';
    END IF;
    new_code := 'MRM-' || public.random_invite_suffix();
    BEGIN
      INSERT INTO public.invitations (code, inviter_id, status, is_master)
      VALUES (new_code, p_inviter_id, 'pending', false)
      RETURNING id INTO inv_id;

      UPDATE public.access_requests
      SET status = 'approved',
          reviewed_at = now(),
          issued_invitation_id = inv_id
      WHERE id = p_request_id;

      RETURN new_code;
    EXCEPTION
      WHEN unique_violation THEN
        NULL;
    END;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.approve_access_request(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_access_request(uuid, uuid) TO service_role;
