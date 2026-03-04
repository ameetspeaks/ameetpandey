-- Prompt 9 blog foundation schema + secure RLS

-- Categories
CREATE TABLE IF NOT EXISTS public.blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags
CREATE TABLE IF NOT EXISTS public.blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  excerpt TEXT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  image_caption TEXT,
  image_credit TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  last_modified_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  views_count INTEGER NOT NULL DEFAULT 0,
  read_time_minutes INTEGER NOT NULL DEFAULT 1,
  seo_title TEXT,
  meta_description TEXT,
  focus_keyphrase TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  canonical_url TEXT,
  allow_comments BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Junction
CREATE TABLE IF NOT EXISTS public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (post_id, tag_id)
);

-- Subscribers
CREATE TABLE IF NOT EXISTS public.blog_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT NOT NULL DEFAULT 'blog_home',
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Post views/events (lightweight for Prompt 9)
CREATE TABLE IF NOT EXISTS public.blog_post_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  user_session_id TEXT,
  referrer TEXT,
  device_type TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_date ON public.blog_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_id ON public.blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured, published_date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_search_title ON public.blog_posts USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(excerpt, '')));

CREATE INDEX IF NOT EXISTS idx_blog_categories_sort_order ON public.blog_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_blog_tags_slug ON public.blog_tags(slug);
CREATE INDEX IF NOT EXISTS idx_blog_post_tags_tag_id ON public.blog_post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_blog_subscribers_email ON public.blog_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_blog_post_views_post_created ON public.blog_post_views(post_id, created_at DESC);

-- Validation + normalization helpers
CREATE OR REPLACE FUNCTION public.slugify_text(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(BOTH '-' FROM regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.normalize_blog_category_or_tag()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.name := btrim(NEW.name);
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.name));
  NEW.description := NULLIF(btrim(NEW.description), '');
  NEW.updated_at := now();

  IF NEW.name IS NULL OR NEW.name = '' OR char_length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Invalid taxonomy name';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' OR char_length(NEW.slug) > 160 THEN
    RAISE EXCEPTION 'Invalid taxonomy slug';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.prepare_blog_post()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  plain_text TEXT;
  word_count INTEGER;
BEGIN
  NEW.title := btrim(NEW.title);
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.title));
  NEW.featured_image_alt := NULLIF(btrim(NEW.featured_image_alt), '');
  NEW.image_caption := NULLIF(btrim(NEW.image_caption), '');
  NEW.image_credit := NULLIF(btrim(NEW.image_credit), '');
  NEW.seo_title := NULLIF(btrim(NEW.seo_title), '');
  NEW.meta_description := NULLIF(btrim(NEW.meta_description), '');
  NEW.og_title := NULLIF(btrim(NEW.og_title), '');
  NEW.og_description := NULLIF(btrim(NEW.og_description), '');
  NEW.canonical_url := NULLIF(btrim(NEW.canonical_url), '');
  NEW.updated_at := now();
  NEW.last_modified_date := now();

  IF NEW.title IS NULL OR NEW.title = '' OR char_length(NEW.title) > 220 THEN
    RAISE EXCEPTION 'Invalid post title';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' OR char_length(NEW.slug) > 260 THEN
    RAISE EXCEPTION 'Invalid post slug';
  END IF;

  IF jsonb_typeof(NEW.content) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Post content must be a JSON array';
  END IF;

  plain_text := regexp_replace(NEW.content::text, '[\{\}\[\]"\,:]', ' ', 'g');
  word_count := COALESCE(array_length(regexp_split_to_array(trim(plain_text), '\s+'), 1), 0);
  NEW.read_time_minutes := GREATEST(1, CEIL(word_count / 200.0));

  IF NEW.excerpt IS NULL OR btrim(NEW.excerpt) = '' THEN
    NEW.excerpt := LEFT(trim(regexp_replace(plain_text, '\s+', ' ', 'g')), 220);
  ELSE
    NEW.excerpt := LEFT(trim(regexp_replace(NEW.excerpt, '\s+', ' ', 'g')), 320);
  END IF;

  IF NEW.status = 'published' AND NEW.published_date IS NULL THEN
    NEW.published_date := now();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_blog_subscriber()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.email := lower(btrim(NEW.email));
  NEW.source := COALESCE(NULLIF(btrim(NEW.source), ''), 'blog_home');

  IF NEW.email IS NULL OR NEW.email = '' OR char_length(NEW.email) > 255 THEN
    RAISE EXCEPTION 'Invalid subscriber email length';
  END IF;

  IF NEW.email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid subscriber email format';
  END IF;

  IF char_length(NEW.source) > 80 THEN
    RAISE EXCEPTION 'Invalid subscriber source';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.track_blog_post_view_counter()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.blog_posts
  SET views_count = views_count + 1,
      updated_at = now()
  WHERE id = NEW.post_id;

  RETURN NEW;
END;
$$;

-- Triggers
DROP TRIGGER IF EXISTS trg_blog_categories_normalize ON public.blog_categories;
CREATE TRIGGER trg_blog_categories_normalize
BEFORE INSERT OR UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION public.normalize_blog_category_or_tag();

DROP TRIGGER IF EXISTS trg_blog_tags_normalize ON public.blog_tags;
CREATE TRIGGER trg_blog_tags_normalize
BEFORE INSERT OR UPDATE ON public.blog_tags
FOR EACH ROW
EXECUTE FUNCTION public.normalize_blog_category_or_tag();

DROP TRIGGER IF EXISTS trg_blog_posts_prepare ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_prepare
BEFORE INSERT OR UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.prepare_blog_post();

DROP TRIGGER IF EXISTS trg_blog_subscribers_validate ON public.blog_subscribers;
CREATE TRIGGER trg_blog_subscribers_validate
BEFORE INSERT OR UPDATE ON public.blog_subscribers
FOR EACH ROW
EXECUTE FUNCTION public.validate_blog_subscriber();

DROP TRIGGER IF EXISTS trg_blog_post_views_counter ON public.blog_post_views;
CREATE TRIGGER trg_blog_post_views_counter
AFTER INSERT ON public.blog_post_views
FOR EACH ROW
EXECUTE FUNCTION public.track_blog_post_view_counter();

-- RLS
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_views ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "Public can read active categories" ON public.blog_categories;
CREATE POLICY "Public can read active categories"
ON public.blog_categories
FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active tags" ON public.blog_tags;
CREATE POLICY "Public can read active tags"
ON public.blog_tags
FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Public can read published active posts" ON public.blog_posts;
CREATE POLICY "Public can read published active posts"
ON public.blog_posts
FOR SELECT
TO anon, authenticated
USING (
  is_active = true
  AND status = 'published'
  AND (published_date IS NULL OR published_date <= now())
);

DROP POLICY IF EXISTS "Public can read post tags for published posts" ON public.blog_post_tags;
CREATE POLICY "Public can read post tags for published posts"
ON public.blog_post_tags
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.blog_posts p
    WHERE p.id = blog_post_tags.post_id
      AND p.is_active = true
      AND p.status = 'published'
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
  AND EXISTS (
    SELECT 1
    FROM public.blog_tags t
    WHERE t.id = blog_post_tags.tag_id
      AND t.is_active = true
  )
);

DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.blog_subscribers;
CREATE POLICY "Public can subscribe to newsletter"
ON public.blog_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'active'
  AND char_length(btrim(email)) BETWEEN 3 AND 255
  AND email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'
);

DROP POLICY IF EXISTS "Public can insert post views" ON public.blog_post_views;
CREATE POLICY "Public can insert post views"
ON public.blog_post_views
FOR INSERT
TO anon, authenticated
WITH CHECK (
  (user_session_id IS NULL OR char_length(user_session_id) <= 120)
  AND EXISTS (
    SELECT 1
    FROM public.blog_posts p
    WHERE p.id = blog_post_views.post_id
      AND p.is_active = true
      AND p.status = 'published'
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);

-- Admin management policies
DROP POLICY IF EXISTS "Admins manage categories" ON public.blog_categories;
CREATE POLICY "Admins manage categories"
ON public.blog_categories
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage tags" ON public.blog_tags;
CREATE POLICY "Admins manage tags"
ON public.blog_tags
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage posts" ON public.blog_posts;
CREATE POLICY "Admins manage posts"
ON public.blog_posts
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins manage post tags" ON public.blog_post_tags;
CREATE POLICY "Admins manage post tags"
ON public.blog_post_tags
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read subscribers" ON public.blog_subscribers;
CREATE POLICY "Admins read subscribers"
ON public.blog_subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update subscribers" ON public.blog_subscribers;
CREATE POLICY "Admins update subscribers"
ON public.blog_subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins read post views" ON public.blog_post_views;
CREATE POLICY "Admins read post views"
ON public.blog_post_views
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Helpful grants for public read paths
GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT SELECT ON public.blog_tags TO anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.blog_post_tags TO anon, authenticated;
GRANT INSERT ON public.blog_subscribers TO anon, authenticated;
GRANT INSERT ON public.blog_post_views TO anon, authenticated;