-- Single-admin bootstrap helper (first authenticated claimant becomes admin)
CREATE OR REPLACE FUNCTION public.claim_single_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID := auth.uid();
  v_any_admin BOOLEAN;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO v_any_admin;

  IF NOT v_any_admin THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (v_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN public.has_role(v_uid, 'admin');
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_single_admin() TO authenticated;