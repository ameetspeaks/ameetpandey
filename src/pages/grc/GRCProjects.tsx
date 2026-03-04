import { ArrowRight, BookOpenCheck, FolderKanban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchPublishedProjects } from "@/lib/cms";

const frameworkFilters = ["ISO 27001", "NIST", "SOC 2", "ISACA", "CIS Controls"];

const GRCProjects = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["cms-projects"],
    queryFn: fetchPublishedProjects,
  });

  const featuredProjects = projects.filter((project) => project.is_featured);
  const additionalProjects = projects.filter((project) => !project.is_featured);

  return (
    <section className="page-shell">
      <div className="site-container grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card hidden h-fit p-5 lg:sticky lg:top-24 lg:block">
          <h2 className="text-base">Project Navigator</h2>
          <nav className="mt-4 space-y-2 text-sm" aria-label="Project categories">
            <a href="#featured-projects" className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
              Featured Case Studies
            </a>
            <a href="#additional-projects" className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
              Additional Portfolio Work
            </a>
          </nav>

          <div className="mt-6">
            <h3 className="text-sm font-semibold">Filter by Framework</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {frameworkFilters.map((item) => (
                <span key={item} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl sm:text-4xl">Governance, Risk &amp; Compliance Projects</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              This portfolio now loads from the CMS database and reflects only published project content.
            </p>
          </header>

          {isLoading ? (
            <div className="surface-card p-6 text-sm text-muted-foreground">Loading projects...</div>
          ) : null}

          {!isLoading && projects.length === 0 ? (
            <div className="surface-card p-6 text-sm text-muted-foreground">No published projects yet. Add and publish projects from Admin.</div>
          ) : null}

          <section id="featured-projects" className="space-y-5">
            <h2 className="text-2xl">Featured Case Studies</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <article key={project.id} className="surface-card flex h-full flex-col p-6">
                  <div className="mb-4 inline-flex w-fit rounded-lg bg-secondary p-3 text-accent">
                    <BookOpenCheck className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {project.short_description || "No summary provided."}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.frameworks_used || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent">
                    View Full Case Study
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section id="additional-projects" className="space-y-5">
            <h2 className="text-2xl">Additional Portfolio Work</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {additionalProjects.map((project) => (
                <article key={project.id} className="surface-card p-5">
                  <div className="mb-3 inline-flex rounded-md bg-secondary p-2 text-accent">
                    <FolderKanban className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {project.short_description || "No summary provided."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(project.frameworks_used || []).slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/projects/${project.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
                    View Project <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};

export default GRCProjects;
