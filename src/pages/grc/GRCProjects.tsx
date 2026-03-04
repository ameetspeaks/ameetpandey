import { ArrowRight, BookOpenCheck, Building2, FileText, FolderKanban, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const featuredProjects = [
  {
    title: "ISO 27001 Risk Assessment Case Study",
    brief:
      "Comprehensive risk assessment following ISO 27001 methodology with asset inventory, threat analysis, and control recommendations",
    tags: ["ISO 27001", "Risk Assessment", "Control Mapping"],
    to: "/projects/iso27001-risk-assessment",
    icon: ShieldCheck,
  },
  {
    title: "IT Security Audit Report",
    brief:
      "Security control audit following ISACA standards with findings, evidence collection, and remediation recommendations",
    tags: ["IT Audit", "ISACA", "Control Testing"],
    to: "/projects/it-audit-report",
    icon: FileText,
  },
  {
    title: "Vendor Security Assessment",
    brief: "Third-party risk evaluation using security questionnaires and compliance verification",
    tags: ["Vendor Risk", "Third-Party Assessment", "Due Diligence"],
    to: "/projects/vendor-security-assessment",
    icon: Building2,
  },
];

const additionalProjects = [
  {
    title: "Risk Management Framework Implementation",
    description: "Structured rollout of risk registers, scoring criteria, and governance workflows.",
    tags: ["NIST", "Risk Governance"],
    to: "/grc-projects/risk-assessments",
  },
  {
    title: "SOC 2 Control Mapping Exercise",
    description: "Mapped operational controls to SOC 2 trust service criteria for readiness tracking.",
    tags: ["SOC 2", "Control Mapping"],
    to: "/grc-projects/compliance",
  },
  {
    title: "Security Policy Documentation",
    description: "Policy and standard documentation aligned to governance and compliance obligations.",
    tags: ["Policy", "Governance"],
    to: "/frameworks",
  },
  {
    title: "Compliance Gap Analysis",
    description: "Baseline assessment identifying control maturity gaps and remediation priorities.",
    tags: ["Gap Analysis", "Remediation"],
    to: "/grc-projects/compliance",
  },
];

const frameworkFilters = ["ISO 27001", "NIST", "SOC 2", "ISACA", "CIS Controls"];

const GRCProjects = () => {
  return (
    <section className="page-shell">
      <div className="site-container grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card hidden h-fit p-5 lg:block lg:sticky lg:top-24">
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

          <a
            href="/projects-portfolio.pdf"
            download
            className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Download All Projects as PDF
          </a>
        </aside>

        <div className="space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl sm:text-4xl">Governance, Risk &amp; Compliance Projects</h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              This portfolio demonstrates practical GRC knowledge through project-led case studies built on real-world
              methodologies and frameworks, with a focus on control effectiveness, risk visibility, and compliance
              readiness.
            </p>
          </header>

          <section id="featured-projects" className="space-y-5">
            <h2 className="text-2xl">Featured Case Studies</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredProjects.map((project) => (
                <article key={project.title} className="surface-card flex h-full flex-col p-6">
                  <div className="mb-4 inline-flex w-fit rounded-lg bg-secondary p-3 text-accent">
                    <project.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{project.brief}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={project.to}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
                  >
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
                <article key={project.title} className="surface-card p-5">
                  <div className="mb-3 inline-flex rounded-md bg-secondary p-2 text-accent">
                    <FolderKanban className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base">{project.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={project.to} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent">
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

