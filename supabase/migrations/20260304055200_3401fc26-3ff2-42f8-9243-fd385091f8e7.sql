-- Prompt 11 advanced modules backend

-- Extend categories for full CRUD metadata
ALTER TABLE public.blog_categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS featured_image TEXT,
  ADD COLUMN IF NOT EXISTS meta_title TEXT,
  ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- Ensure tags have active/update fields for management workflows
ALTER TABLE public.blog_tags
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Media library table
CREATE TABLE IF NOT EXISTS public.blog_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL UNIQUE,
  public_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_media_created_at ON public.blog_media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_media_uploaded_by ON public.blog_media(uploaded_by);

-- Comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
  parent_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON public.blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON public.blog_comments(created_at DESC);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.blog_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('view', 'share', 'click', 'newsletter_subscribe')),
  user_session_id TEXT,
  referrer TEXT,
  device_type TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_analytics_events_created_at ON public.blog_analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_events_post_id ON public.blog_analytics_events(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_events_event_type ON public.blog_analytics_events(event_type);

-- Site settings
CREATE TABLE IF NOT EXISTS public.blog_settings (
  id BOOLEAN PRIMARY KEY DEFAULT true,
  blog_title TEXT NOT NULL DEFAULT 'Security Insights & Technical Writeups',
  blog_tagline TEXT NOT NULL DEFAULT 'Deep dives into GRC, security frameworks, threat analysis, and compliance practices',
  posts_per_page INTEGER NOT NULL DEFAULT 9,
  date_format TEXT NOT NULL DEFAULT 'PPP',
  timezone TEXT NOT NULL DEFAULT 'UTC',
  default_meta_description TEXT,
  default_og_image TEXT,
  google_verification_code TEXT,
  bing_verification_code TEXT,
  google_analytics_id TEXT,
  robots_txt TEXT,
  sitemap_enabled BOOLEAN NOT NULL DEFAULT true,
  linkedin_url TEXT,
  github_url TEXT,
  twitter_handle TEXT,
  contact_email TEXT,
  comments_enabled BOOLEAN NOT NULL DEFAULT true,
  comments_require_approval BOOLEAN NOT NULL DEFAULT true,
  spam_words TEXT[] NOT NULL DEFAULT '{}',
  show_author_bio BOOLEAN NOT NULL DEFAULT true,
  show_related_posts BOOLEAN NOT NULL DEFAULT true,
  toc_enabled BOOLEAN NOT NULL DEFAULT true,
  share_buttons_position TEXT NOT NULL DEFAULT 'top' CHECK (share_buttons_position IN ('top', 'bottom', 'both')),
  newsletter_provider TEXT,
  newsletter_api_key_hint TEXT,
  custom_css TEXT,
  header_injection TEXT,
  footer_injection TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.blog_settings (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

-- Validation / housekeeping functions
CREATE OR REPLACE FUNCTION public.update_row_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_blog_comment()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.author_name := btrim(NEW.author_name);
  NEW.author_email := lower(btrim(NEW.author_email));
  NEW.content := btrim(NEW.content);

  IF NEW.author_name IS NULL OR NEW.author_name = '' OR char_length(NEW.author_name) > 120 THEN
    RAISE EXCEPTION 'Invalid comment author name';
  END IF;

  IF NEW.author_email IS NULL OR NEW.author_email = '' OR char_length(NEW.author_email) > 255 THEN
    RAISE EXCEPTION 'Invalid comment author email length';
  END IF;

  IF NEW.author_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid comment email format';
  END IF;

  IF NEW.content IS NULL OR NEW.content = '' OR char_length(NEW.content) > 3000 THEN
    RAISE EXCEPTION 'Invalid comment content';
  END IF;

  RETURN NEW;
END;
$$;

-- Triggers
DROP TRIGGER IF EXISTS trg_blog_media_updated_at ON public.blog_media;
CREATE TRIGGER trg_blog_media_updated_at
BEFORE UPDATE ON public.blog_media
FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();

DROP TRIGGER IF EXISTS trg_blog_comments_updated_at ON public.blog_comments;
CREATE TRIGGER trg_blog_comments_updated_at
BEFORE UPDATE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();

DROP TRIGGER IF EXISTS trg_blog_tags_updated_at ON public.blog_tags;
CREATE TRIGGER trg_blog_tags_updated_at
BEFORE UPDATE ON public.blog_tags
FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();

DROP TRIGGER IF EXISTS trg_blog_settings_updated_at ON public.blog_settings;
CREATE TRIGGER trg_blog_settings_updated_at
BEFORE UPDATE ON public.blog_settings
FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();

DROP TRIGGER IF EXISTS trg_blog_comments_validate ON public.blog_comments;
CREATE TRIGGER trg_blog_comments_validate
BEFORE INSERT OR UPDATE ON public.blog_comments
FOR EACH ROW EXECUTE FUNCTION public.validate_blog_comment();

-- Storage bucket for media library
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-media', 'blog-media', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, public = EXCLUDED.public;

-- RLS setup
ALTER TABLE public.blog_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_settings ENABLE ROW LEVEL SECURITY;

-- blog_media policies
DROP POLICY IF EXISTS "Public can read media records" ON public.blog_media;
CREATE POLICY "Public can read media records"
ON public.blog_media
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Admins manage media records" ON public.blog_media;
CREATE POLICY "Admins manage media records"
ON public.blog_media
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blog_comments policies
DROP POLICY IF EXISTS "Public can read approved comments" ON public.blog_comments;
CREATE POLICY "Public can read approved comments"
ON public.blog_comments
FOR SELECT
TO anon, authenticated
USING (status = 'approved');

DROP POLICY IF EXISTS "Public can create comments" ON public.blog_comments;
CREATE POLICY "Public can create comments"
ON public.blog_comments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND EXISTS (
    SELECT 1
    FROM public.blog_posts p
    WHERE p.id = blog_comments.post_id
      AND p.is_active = true
      AND p.status = 'published'
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);

DROP POLICY IF EXISTS "Admins manage comments" ON public.blog_comments;
CREATE POLICY "Admins manage comments"
ON public.blog_comments
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blog_subscribers additional policies for CRUD admin module
DROP POLICY IF EXISTS "Admins insert subscribers" ON public.blog_subscribers;
CREATE POLICY "Admins insert subscribers"
ON public.blog_subscribers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete subscribers" ON public.blog_subscribers;
CREATE POLICY "Admins delete subscribers"
ON public.blog_subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- analytics policies
DROP POLICY IF EXISTS "Admins read analytics events" ON public.blog_analytics_events;
CREATE POLICY "Admins read analytics events"
ON public.blog_analytics_events
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Public can insert analytics events" ON public.blog_analytics_events;
CREATE POLICY "Public can insert analytics events"
ON public.blog_analytics_events
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (event_type IN ('view', 'share', 'click', 'newsletter_subscribe'))
  AND (user_session_id IS NULL OR char_length(user_session_id) <= 120)
);

DROP POLICY IF EXISTS "Admins delete analytics events" ON public.blog_analytics_events;
CREATE POLICY "Admins delete analytics events"
ON public.blog_analytics_events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- settings policies
DROP POLICY IF EXISTS "Admins manage settings" ON public.blog_settings;
CREATE POLICY "Admins manage settings"
ON public.blog_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- storage.objects policies for blog-media bucket
DROP POLICY IF EXISTS "Public read blog media objects" ON storage.objects;
CREATE POLICY "Public read blog media objects"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-media');

DROP POLICY IF EXISTS "Admins insert blog media objects" ON storage.objects;
CREATE POLICY "Admins insert blog media objects"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update blog media objects" ON storage.objects;
CREATE POLICY "Admins update blog media objects"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete blog media objects" ON storage.objects;
CREATE POLICY "Admins delete blog media objects"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-media' AND public.has_role(auth.uid(), 'admin'));

-- Grants
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_media TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_comments TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_analytics_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_settings TO authenticated;
GRANT INSERT, SELECT ON public.blog_comments TO anon;
GRANT INSERT ON public.blog_analytics_events TO anon;