import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Eye, Search, Sparkles } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useSeo } from "@/hooks/use-seo";
import { supabase } from "@/integrations/supabase/client";

type BlogCategory = { id: string; name: string; slug: string };

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  published_date: string | null;
  read_time_minutes: number | null;
  views_count: number | null;
  is_featured: boolean;
  category_id: string | null;
  blog_categories?: { name?: string; slug?: string } | null;
};

const supabaseAny = supabase as any;
const PAGE_SIZE = 9;

const subscribeSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
});

const categoryTabs = [
  { key: "all", label: "All Posts" },
  { key: "grc-compliance", label: "GRC & Compliance" },
  { key: "risk-assessment", label: "Risk Assessment" },
  { key: "it-audit", label: "IT Audit" },
  { key: "security-frameworks", label: "Security Frameworks" },
  { key: "threat-analysis", label: "Threat Analysis" },
  { key: "tools-tutorials", label: "Tools & Tutorials" },
  { key: "case-studies", label: "Case Studies" },
];

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : "Unscheduled");

const BlogHome = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagsByPost, setTagsByPost] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useSeo({
    title: "Security Insights Blog | Amit Pandey",
    description:
      "Medium-style cybersecurity blog covering GRC, audits, risk assessments, frameworks, and technical security writeups.",
    canonicalPath: "/blog",
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [postsRes, categoriesRes, tagsRes] = await Promise.all([
        supabaseAny
          .from("blog_posts")
          .select(
            "id,slug,title,excerpt,featured_image_url,featured_image_alt,published_date,read_time_minutes,views_count,is_featured,category_id,blog_categories(name,slug)",
          )
          .eq("status", "published")
          .eq("is_active", true)
          .order("published_date", { ascending: false })
          .limit(120),
        supabaseAny.from("blog_categories").select("id,name,slug").eq("is_active", true).order("sort_order", { ascending: true }),
        supabaseAny.from("blog_post_tags").select("post_id, blog_tags(name)").limit(1000),
      ]);

      setPosts((postsRes.data || []) as BlogPost[]);
      setCategories((categoriesRes.data || []) as BlogCategory[]);

      const nextTags: Record<string, string[]> = {};
      for (const row of tagsRes.data || []) {
        const postId = row.post_id as string;
        const tagName = row.blog_tags?.name as string | undefined;
        if (!postId || !tagName) continue;
        nextTags[postId] = nextTags[postId] ? [...nextTags[postId], tagName] : [tagName];
      }
      setTagsByPost(nextTags);

      setLoading(false);
    };

    void load();
  }, []);

  const featuredPost = useMemo(() => posts.find((post) => post.is_featured) || posts[0], [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const inCategory =
        selectedCategory === "all" ||
        (post.blog_categories?.slug || "") === selectedCategory ||
        post.blog_categories?.name?.toLowerCase().includes(selectedCategory.replace(/-/g, " "));

      const inSearch =
        !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.excerpt || "").toLowerCase().includes(searchTerm.toLowerCase());

      return inCategory && inSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  const latestPosts = useMemo(() => {
    if (!featuredPost) return filteredPosts;
    return filteredPosts.filter((post) => post.id !== featuredPost.id);
  }, [filteredPosts, featuredPost]);

  const paginatedPosts = latestPosts.slice(0, page * PAGE_SIZE);
  const hasMore = paginatedPosts.length < latestPosts.length;

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      const key = post.blog_categories?.slug || "uncategorized";
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [posts]);

  const popularPosts = useMemo(
    () => [...posts].sort((a, b) => (b.views_count || 0) - (a.views_count || 0)).slice(0, 5),
    [posts],
  );

  const tagCloud = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tags of Object.values(tagsByPost)) {
      for (const tag of tags) counts[tag] = (counts[tag] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 18);
  }, [tagsByPost]);

  const onSubscribe = async () => {
    const parsed = subscribeSchema.safeParse({ email: newsletterEmail });
    if (!parsed.success) {
      toast({ title: "Invalid email", description: parsed.error.issues[0]?.message || "Please enter a valid email.", variant: "destructive" });
      return;
    }

    setIsSubscribing(true);
    const { error } = await supabaseAny.from("blog_subscribers").insert({ email: parsed.data.email, source: "blog_home" });
    setIsSubscribing(false);

    if (error) {
      const duplicate = String(error.message || "").toLowerCase().includes("duplicate") || String(error.code) === "23505";
      toast({
        title: duplicate ? "Already subscribed" : "Subscription failed",
        description: duplicate ? "This email is already on the list." : "Please try again.",
        variant: duplicate ? "default" : "destructive",
      });
      return;
    }

    setNewsletterEmail("");
    toast({ title: "Subscribed", description: "You are now on the newsletter list." });
  };

  return (
    <section className="page-shell">
      <div className="site-container grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <header className="surface-card p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Medium-style technical writing
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl">Security Insights &amp; Technical Writeups</h1>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              Deep dives into GRC, security frameworks, threat analysis, and compliance practices.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search technical writeups"
                  className="pl-9"
                  aria-label="Search blog posts"
                />
              </div>

              <div className="flex gap-2">
                <Input
                  value={newsletterEmail}
                  onChange={(event) => setNewsletterEmail(event.target.value)}
                  placeholder="Subscribe with email"
                  type="email"
                  aria-label="Newsletter email"
                />
                <Button onClick={() => void onSubscribe()} disabled={isSubscribing}>
                  {isSubscribing ? "Saving..." : "Subscribe"}
                </Button>
              </div>
            </div>
          </header>

          {featuredPost && (
            <article className="group relative overflow-hidden rounded-2xl border border-border">
              <img
                src={featuredPost.featured_image_url || "/placeholder.svg"}
                alt={featuredPost.featured_image_alt || featuredPost.title}
                className="h-[340px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <Badge>{featuredPost.blog_categories?.name || "Featured"}</Badge>
                <h2 className="mt-3 text-2xl text-foreground sm:text-3xl">{featuredPost.title}</h2>
                <p className="mt-2 max-w-3xl text-sm text-foreground/80">{featuredPost.excerpt}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>By Amit Pandey</span>
                  <span>{formatDate(featuredPost.published_date)}</span>
                  <span>{featuredPost.read_time_minutes || 1} min read</span>
                </div>
                <Button asChild className="mt-4">
                  <Link to={`/blog/${featuredPost.slug}`}>Read More</Link>
                </Button>
              </div>
            </article>
          )}

          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((category) => (
              <Button
                key={category.key}
                size="sm"
                variant={selectedCategory === category.key ? "default" : "secondary"}
                onClick={() => {
                  setSelectedCategory(category.key);
                  setPage(1);
                }}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {paginatedPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={post.featured_image_url || "/placeholder.svg"}
                        alt={post.featured_image_alt || post.title}
                        className="aspect-[16/9] w-full object-cover"
                        loading="lazy"
                      />
                      <Badge className="absolute left-3 top-3">{post.blog_categories?.name || "General"}</Badge>
                    </div>

                    <CardContent className="space-y-3 p-4">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <h3 className="line-clamp-2 text-lg leading-6 hover:text-primary">{post.title}</h3>
                      </Link>
                      <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt || "No excerpt available."}</p>

                      <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage src="/placeholder.svg" alt="Amit Pandey" />
                            <AvatarFallback>AP</AvatarFallback>
                          </Avatar>
                          <span>Amit Pandey</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          <span>{formatDate(post.published_date)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                        <span>{post.read_time_minutes || 1} min read</span>
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" /> {post.views_count || 0}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {(tagsByPost[post.id] || []).slice(0, 3).map((tag) => (
                          <Badge key={`${post.id}-${tag}`} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing 1-{paginatedPosts.length} of {latestPosts.length} posts
                </p>
                {hasMore && (
                  <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
                    Load more <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </>
          )}
        </div>

        <aside className="hidden space-y-4 lg:block">
          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-base">Popular Posts</h2>
              {popularPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 rounded-lg p-2 hover:bg-secondary">
                  <img src={post.featured_image_url || "/placeholder.svg"} alt={post.featured_image_alt || post.title} className="h-12 w-16 rounded object-cover" loading="lazy" />
                  <div className="space-y-1">
                    <p className="line-clamp-2 text-sm leading-5">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.views_count || 0} views</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-base">Categories</h2>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.slug)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-sm hover:bg-secondary"
                >
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">{categoryCounts[category.slug] || 0}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-base">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tagCloud.map(([tag, count]) => (
                  <Badge key={tag} variant="secondary" className={count > 4 ? "text-sm" : "text-xs"}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-3 p-5">
              <h2 className="text-base">About Author</h2>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="/placeholder.svg" alt="Amit Pandey" />
                  <AvatarFallback>AP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Amit Pandey</p>
                  <p className="text-xs text-muted-foreground">Cybersecurity GRC Analyst</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Sharing practical security governance, risk, compliance, and technical implementation insights.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </section>
  );
};

export default BlogHome;
