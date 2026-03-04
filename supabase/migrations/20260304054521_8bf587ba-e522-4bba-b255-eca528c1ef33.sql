-- Prompt 10: revisions history backend
CREATE TABLE IF NOT EXISTS public.blog_post_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  excerpt TEXT,
  status TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  changed_by UUID,
  change_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_post_revisions_post_id_created
ON public.blog_post_revisions(post_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.create_blog_post_revision(
  _post_id UUID,
  _change_note TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post public.blog_posts;
  v_revision_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin role required';
  END IF;

  SELECT * INTO v_post
  FROM public.blog_posts
  WHERE id = _post_id;

  IF v_post.id IS NULL THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  INSERT INTO public.blog_post_revisions (
    post_id,
    title,
    slug,
    content,
    excerpt,
    status,
    scheduled_date,
    published_date,
    changed_by,
    change_note
  )
  VALUES (
    v_post.id,
    v_post.title,
    v_post.slug,
    v_post.content,
    v_post.excerpt,
    v_post.status,
    v_post.scheduled_date,
    v_post.published_date,
    auth.uid(),
    NULLIF(btrim(_change_note), '')
  )
  RETURNING id INTO v_revision_id;

  RETURN v_revision_id;
END;
$$;

ALTER TABLE public.blog_post_revisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read revisions" ON public.blog_post_revisions;
CREATE POLICY "Admins can read revisions"
ON public.blog_post_revisions
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can insert revisions" ON public.blog_post_revisions;
CREATE POLICY "Admins can insert revisions"
ON public.blog_post_revisions
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

GRANT SELECT, INSERT ON public.blog_post_revisions TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_blog_post_revision(UUID, TEXT) TO authenticated;