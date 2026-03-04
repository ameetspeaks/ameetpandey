import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Copy, Eye, Link2, Mail, Share2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BlogContentRenderer, { extractHeadings, type BlogBlock } from "@/components/blog/BlogContentRenderer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/use-seo";
import { supabase } from "@/integrations/supabase/client";

type BlogPostData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: BlogBlock[] | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  image_caption: string | null;
  image_credit: string | null;
  published_date: string | null;
  updated_at: string;
  read_time_minutes: number | null;
  views_count: number | null;
  category_id: string | null;
  blog_categories?: { name?: string; slug?: string } | null;
  seo_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
};

const supabaseAny = supabase as any;

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : "Unscheduled");

const getSessionId = () => {
  const key = "blog_session_id";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const created = crypto.randomUUID();
  localStorage.setItem(key, created);
  return created;
};

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<Array<Pick<BlogPostData, "id" | "slug" | "title" | "excerpt" | "featured_image_url" | "published_date">>>([]);
  const [prevPost, setPrevPost] = useState<Pick<BlogPostData, "slug" | "title"> | null>(null);
  const [nextPost, setNextPost] = useState<Pick<BlogPostData, "slug" | "title"> | null>(null);
  const [activeHeading, setActiveHeading] = useState<string>("");

  const blocks = useMemo(() => (Array.isArray(post?.content) ? post?.content : []), [post?.content]);
  const headings = useMemo(() => extractHeadings(blocks), [blocks]);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;

      setLoading(true);
      const { data } = await supabaseAny
        .from("blog_posts")
        .select(
          "id,slug,title,excerpt,content,featured_image_url,featured_image_alt,image_caption,image_credit,published_date,updated_at,read_time_minutes,views_count,category_id,seo_title,meta_description,canonical_url,og_image,blog_categories(name,slug)",
        )
        .eq("slug", slug)
        .maybeSingle();

      if (!data) {
        setPost(null);
        setLoading(false);
        return;
      }

      setPost(data as BlogPostData);

      const [tagsRes, relatedRes, prevRes, nextRes] = await Promise.all([
        supabaseAny.from("blog_post_tags").select("blog_tags(name)").eq("post_id", data.id),
        (() => {
          let query = supabaseAny
            .from("blog_posts")
            .select("id,slug,title,excerpt,featured_image_url,published_date")
            .eq("status", "published")
            .eq("is_active", true)
            .neq("id", data.id)
            .order("published_date", { ascending: false })
            .limit(3);

          if (data.category_id) query = query.eq("category_id", data.category_id);
          return query;
        })(),
        data.published_date
          ? supabaseAny
              .from("blog_posts")
              .select("slug,title")
              .eq("status", "published")
              .eq("is_active", true)
              .lt("published_date", data.published_date)
              .order("published_date", { ascending: false })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null }),
        data.published_date
          ? supabaseAny
              .from("blog_posts")
              .select("slug,title")
              .eq("status", "published")
              .eq("is_active", true)
              .gt("published_date", data.published_date)
              .order("published_date", { ascending: true })
              .limit(1)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      setTags((tagsRes.data || []).map((row: any) => row.blog_tags?.name).filter(Boolean));
      setRelatedPosts((relatedRes.data || []) as any);
      setPrevPost((prevRes.data || null) as any);
      setNextPost((nextRes.data || null) as any);

      await supabaseAny.from("blog_post_views").insert({
        post_id: data.id,
        user_session_id: getSessionId(),
        referrer: document.referrer || null,
        device_type: window.innerWidth < 768 ? "mobile" : "desktop",
        user_agent: navigator.userAgent,
      });

      setLoading(false);
    };

    void load();
  }, [slug]);

  useEffect(() => {
    if (!headings.length) return;

    const onScroll = () => {
      const current = headings
        .map((heading) => ({
          id: heading.id,
          top: document.getElementById(heading.id)?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
        }))
        .filter((entry) => entry.top <= 160)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActiveHeading(current.id);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]);

  const canonicalPath = post?.canonical_url || `/blog/${slug || ""}`;
  const seoTitle = post?.seo_title || post?.title || "Security Insight";
  const seoDescription = post?.meta_description || post?.excerpt || "Technical cybersecurity writeup.";

  useSeo({
    title: `${seoTitle} | Amit Pandey`,
    description: seoDescription,
    canonicalPath,
    ogImage: post?.og_image || post?.featured_image_url || undefined,
    jsonLd: post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: seoDescription,
          datePublished: post.published_date,
          dateModified: post.updated_at,
          author: {
            "@type": "Person",
            name: "Amit Pandey",
          },
          image: post.featured_image_url ? [post.featured_image_url] : undefined,
          mainEntityOfPage: `${window.location.origin}/blog/${post.slug}`,
        }
      : undefined,
  });

  const onCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied", description: "Article URL copied to clipboard." });
  };

  if (loading) {
    return (
      <section className="page-shell">
        <div className="site-container">
          <p className="text-sm text-muted-foreground">Loading article...</p>
        </div>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="page-shell">
        <div className="site-container space-y-3">
          <h1 className="text-3xl">Post not found</h1>
          <p className="text-muted-foreground">This article is not published yet or does not exist.</p>
          <Button asChild>
            <Link to="/blog">Back to blog</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <ReadingProgress />

      <section className="page-shell pb-24">
        <div className="site-container space-y-8">
          <header className="space-y-4">
            <Badge>{post.blog_categories?.name || "Security"}</Badge>
            <h1 className="max-w-4xl text-4xl sm:text-5xl">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Amit Pandey" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <span>By Amit Pandey</span>
              </div>
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {formatDate(post.published_date)}
              </span>
              <span>Updated {formatDate(post.updated_at)}</span>
              <span>{post.read_time_minutes || 1} min read</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-4 w-4" /> {post.views_count || 0}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary">
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">
                  <Share2 className="h-4 w-4" /> LinkedIn
                </a>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noreferrer">
                  <Share2 className="h-4 w-4" /> Twitter
                </a>
              </Button>
              <Button asChild size="sm" variant="secondary">
                <a href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(window.location.href)}`}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
              <Button size="sm" variant="secondary" onClick={() => void onCopyLink()}>
                <Copy className="h-4 w-4" /> Copy Link
              </Button>
            </div>
          </header>

          <figure className="space-y-2 overflow-hidden rounded-2xl border border-border">
            <img
              src={post.featured_image_url || "/placeholder.svg"}
              alt={post.featured_image_alt || post.title}
              className="h-[420px] w-full object-cover"
              loading="lazy"
            />
            {(post.image_caption || post.image_credit) && (
              <figcaption className="px-4 pb-4 text-sm text-muted-foreground">
                {post.image_caption} {post.image_credit ? `• Credit: ${post.image_credit}` : ""}
              </figcaption>
            )}
          </figure>

          <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
            <article className="mx-auto w-full max-w-[680px]">
              <BlogContentRenderer blocks={blocks} />

              <div className="mt-10 space-y-6 border-t border-border pt-6">
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Card>
                  <CardContent className="space-y-3 p-5">
                    <h2 className="text-xl">About the author</h2>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg" alt="Amit Pandey" />
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Amit Pandey</p>
                        <p className="text-sm text-muted-foreground">Cybersecurity GRC Analyst</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Practical guidance across governance, risk, compliance, audit readiness, and secure implementation.
                    </p>
                    <Link to="/blog" className="inline-flex text-sm font-semibold text-primary hover:text-accent">
                      View recent posts
                    </Link>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="space-y-3 p-5">
                    <h2 className="text-xl">Discussion</h2>
                    <p className="text-sm text-muted-foreground">
                      Comments are enabled in the platform roadmap; for now you can continue the discussion on LinkedIn.
                    </p>
                    <Button asChild variant="outline">
                      <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                        Discuss on LinkedIn
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </article>

            {headings.length > 1 && (
              <aside className="hidden lg:block">
                <Card className="sticky top-24">
                  <CardContent className="space-y-2 p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Table of contents</h2>
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className={`block rounded px-2 py-1 text-sm ${
                          activeHeading === heading.id ? "bg-secondary text-primary" : "text-muted-foreground hover:text-foreground"
                        } ${heading.level === "h3" ? "ml-3" : ""}`}
                      >
                        {heading.text}
                      </a>
                    ))}
                  </CardContent>
                </Card>
              </aside>
            )}
          </div>

          <section className="space-y-4 border-t border-border pt-6">
            <h2 className="text-2xl">Related Posts</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <img src={item.featured_image_url || "/placeholder.svg"} alt={item.title} className="aspect-[16/9] w-full object-cover" loading="lazy" />
                  <CardContent className="space-y-2 p-4">
                    <h3 className="line-clamp-2 text-lg">{item.title}</h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.excerpt}</p>
                    <Link to={`/blog/${item.slug}`} className="inline-flex text-sm font-semibold text-primary hover:text-accent">
                      Read Article
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <nav className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
            {prevPost ? (
              <Button asChild variant="outline">
                <Link to={`/blog/${prevPost.slug}`}>
                  <ChevronLeft className="h-4 w-4" /> {prevPost.title}
                </Link>
              </Button>
            ) : (
              <span />
            )}

            <Button asChild variant="secondary">
              <Link to="/blog">Back to blog</Link>
            </Button>

            {nextPost ? (
              <Button asChild variant="outline">
                <Link to={`/blog/${nextPost.slug}`}>
                  {nextPost.title} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <span />
            )}
          </nav>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <div className="site-container flex items-center justify-between gap-2">
          <Button asChild size="sm" variant="secondary">
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noreferrer">
              <Share2 className="h-4 w-4" /> Share
            </a>
          </Button>
          <Button size="sm" variant="secondary" onClick={() => void onCopyLink()}>
            <Link2 className="h-4 w-4" /> Copy Link
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/blog">Back</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
