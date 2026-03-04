-- Tighten INSERT RLS policy to avoid permissive WITH CHECK (true)
DROP POLICY IF EXISTS "Anyone can insert contact submissions" ON public.contact_submissions;

CREATE POLICY "Anyone can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(btrim(name)) BETWEEN 1 AND 100
  AND char_length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
  AND subject IN ('General Inquiry', 'Job Opportunity', 'Collaboration', 'Other')
  AND char_length(btrim(message)) BETWEEN 1 AND 1500
);