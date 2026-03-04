import { BarChart3, Building2, ClipboardCheck, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const expertiseCards = [
  {
    title: "Risk Assessment",
    description: "Identifying and evaluating security risks using ISO 27001 and NIST frameworks",
    to: "/grc-projects/risk-assessments",
    icon: ShieldAlert,
  },
  {
    title: "Security Compliance",
    description: "Mapping controls to SOC 2, ISO 27001, and regulatory requirements",
    to: "/grc-projects/compliance",
    icon: ClipboardCheck,
  },
  {
    title: "IT Audit",
    description: "Conducting control testing and audit evidence collection",
    to: "/grc-projects/audit-reports",
    icon: BarChart3,
  },
  {
    title: "Vendor Risk Management",
    description: "Assessing third-party security posture and managing vendor risks",
    to: "/grc-projects/vendor-assessments",
    icon: Building2,
  },
];

const Index = () => {
  const { data: latestPosts, isLoading } = useQuery({
    queryKey: ["latest_blog_posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, published_date, featured_image_url")
        .eq("status", "published")
        .order("published_date", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching latest posts:", error);
        return [];
      }
      return data || [];
    },
  });

  return (
    <>
      <section className="hero-gradient">
        <div className="site-container py-20 sm:py-24">
          <div className="mx-auto max-w-3xl space-y-6 text-center text-primary-foreground">
            <h1 className="text-4xl font-extrabold leading-tight text-primary-foreground sm:text-5xl">
              Cybersecurity Governance, Risk &amp; Compliance Analyst
            </h1>
            <p className="text-base leading-7 text-primary-foreground/90 sm:text-lg">
              Focused on risk assessment, compliance frameworks, IT auditing, and security governance
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/grc-projects"
                className="inline-flex rounded-md bg-background px-5 py-2.5 text-sm font-semibold text-primary shadow-elevated hover:opacity-90"
              >
                View GRC Projects
              </Link>
              <a
                href="/resume.pdf"
                download
                className="inline-flex rounded-md border border-primary-foreground/40 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell bg-secondary/50">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-3xl">Core Expertise</h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {expertiseCards.map((card) => (
              <article
                key={card.title}
                className="surface-card h-full p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-accent"
              >
                <div className="mb-4 inline-flex rounded-lg bg-secondary p-3 text-accent">
                  <card.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="text-xl">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{card.description}</p>
                <Link to={card.to} className="mt-4 inline-flex text-sm font-semibold text-primary hover:text-accent">
                  View details →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="site-container space-y-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-3xl">Latest Security Insights</h2>
            <Link to="/blog" className="text-sm font-semibold text-primary hover:text-accent">
              View All Posts →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {isLoading ? (
              <p className="col-span-3 text-center text-sm text-muted-foreground">Loading latest insights...</p>
            ) : latestPosts && latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <article key={post.id} className="surface-card flex flex-col overflow-hidden">
                  <div className="aspect-[16/9] w-full bg-secondary">
                    {post.featured_image_url ? (
                      <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary/80 text-muted-foreground">No image available</div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col space-y-3 p-4">
                    {post.published_date && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.published_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    )}
                    <h3 className="line-clamp-2 text-lg font-semibold">{post.title}</h3>
                    <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                      {post.excerpt || "Read full article to learn more."}
                    </p>
                    <Link to={`/blog/${post.slug}`} className="inline-flex text-sm font-semibold text-primary hover:text-accent mt-2">
                      Read more →
                    </Link>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-3 text-center text-sm text-muted-foreground">No posts published yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;


