-- Create contact submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful index for newest-first admin review
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON public.contact_submissions (created_at DESC);

-- Server-side validation trigger function
CREATE OR REPLACE FUNCTION public.validate_contact_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.name := btrim(NEW.name);
  NEW.email := lower(btrim(NEW.email));
  NEW.subject := btrim(NEW.subject);
  NEW.message := btrim(NEW.message);

  IF NEW.name IS NULL OR NEW.name = '' OR char_length(NEW.name) > 100 THEN
    RAISE EXCEPTION 'Invalid name';
  END IF;

  IF NEW.email IS NULL OR NEW.email = '' OR char_length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Invalid email length';
  END IF;

  IF NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  IF NEW.subject NOT IN ('General Inquiry', 'Job Opportunity', 'Collaboration', 'Other') THEN
    RAISE EXCEPTION 'Invalid subject';
  END IF;

  IF NEW.message IS NULL OR NEW.message = '' OR char_length(NEW.message) > 1500 THEN
    RAISE EXCEPTION 'Invalid message';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger for insert/update validation
DROP TRIGGER IF EXISTS trg_validate_contact_submission ON public.contact_submissions;
CREATE TRIGGER trg_validate_contact_submission
BEFORE INSERT OR UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.validate_contact_submission();

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public form submissions (no public read access)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_submissions'
      AND policyname = 'Anyone can insert contact submissions'
  ) THEN
    CREATE POLICY "Anyone can insert contact submissions"
    ON public.contact_submissions
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);
  END IF;
END
$$;