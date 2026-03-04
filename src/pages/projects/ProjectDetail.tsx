import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useParams } from "react-router-dom";
import { useSeo } from "@/hooks/use-seo";
import { fetchProjectBySlug } from "@/lib/cms";

const toTitleCase = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const renderSectionContent = (content: unknown) => {
  if (typeof content === "string") {
    return <p className="text-sm leading-7 text-muted-foreground sm:text-base">{content}</p>;
  }

  if (Array.isArray(content)) {
    return (
      <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground sm:text-base">
        {content.map((item, index) => (
          <li key={`${String(item)}-${index}`}>• {String(item)}</li>
        ))}
      </ul>
    );
  }

  if (content && typeof content === "object") {
    const obj = content as Record<string, unknown>;
    const paragraphs = Array.isArray(obj.paragraphs) ? obj.paragraphs : [];
    const items = Array.isArray(obj.items) ? obj.items : [];

    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={`${String(paragraph)}-${index}`} className="text-sm leading-7 text-muted-foreground sm:text-base">
            {String(paragraph)}
          </p>
        ))}
        {items.length > 0 ? (
          <ul className="space-y-1.5 text-sm leading-7 text-muted-foreground sm:text-base">
            {items.map((item, index) => (
              <li key={`${String(item)}-${index}`}>• {String(item)}</li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  }

  return null;
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cms-project", slug],
    queryFn: () => fetchProjectBySlug(slug),
    enabled: Boolean(slug),
  });

  const project = data?.project;

  const seoDescription = useMemo(
    () => project?.meta_description || project?.short_description || "GRC case study and implementation details.",
    [project],
  );

  useSeo({
    title: (project?.meta_title || project?.title || "Project") as string,
    description: seoDescription,
    canonicalPath: `/projects/${slug}`,
    jsonLd: project
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: project.title,
          description: seoDescription,
          datePublished: project.published_date,
        }
      : undefined,
  });

  if (isLoading) {
    return (
      <section className="page-shell">
        <div className="site-container">
          <div className="surface-card p-8 text-sm text-muted-foreground">Loading case study...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-shell">
        <div className="site-container">
          <div className="surface-card p-8 text-sm text-muted-foreground">Could not load this project.</div>
        </div>
      </section>
    );
  }

  if (!project) return <Navigate to="/404" replace />;

  return (
    <section className="page-shell">
      <div className="site-container space-y-8">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/grc-projects" className="hover:text-primary">
                GRC Projects
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{project.title}</li>
          </ol>
        </nav>

        <header className="surface-card p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl">{project.title}</h1>
          {project.short_description ? <p className="mt-3 text-muted-foreground">{project.short_description}</p> : null}
          <div className="mt-4 flex flex-wrap gap-2">
            {(project.frameworks_used || []).map((framework: string) => (
              <span key={framework} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {framework}
              </span>
            ))}
          </div>
        </header>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Project Overview</h2>
          <div className="mt-5 grid gap-5 text-sm leading-7 text-muted-foreground md:grid-cols-2">
            <div>
              <h3 className="text-base text-foreground">Objective</h3>
              <p className="mt-1">{project.objective || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Scope</h3>
              <p className="mt-1">{project.scope || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Methodology</h3>
              <p className="mt-1">{project.methodology || "Not specified"}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Timeline</h3>
              <p className="mt-1">{project.timeline || "Not specified"}</p>
            </div>
          </div>
        </article>

        {data.sections.length > 0 ? (
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl">Detailed Sections</h2>
            <div className="mt-6 space-y-7">
              {data.sections.map((section: any, index: number) => (
                <section key={section.id} className="space-y-2">
                  <h3 className="text-xl">{index + 1}. {section.section_title}</h3>
                  {renderSectionContent(section.content)}
                </section>
              ))}
            </div>
          </article>
        ) : null}

        {data.risks.length > 0 ? (
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl">Risk Register</h2>
            <div className="data-table-wrap mt-5">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Risk ID</th>
                    <th>Threat</th>
                    <th>Vulnerability</th>
                    <th>Score</th>
                    <th>Level</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.risks.map((risk: any) => (
                    <tr key={risk.id}>
                      <td>{risk.risk_id}</td>
                      <td>{risk.threat_description}</td>
                      <td>{risk.vulnerability_description}</td>
                      <td>{risk.risk_score}</td>
                      <td>{toTitleCase(risk.risk_level)}</td>
                      <td>{toTitleCase(risk.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {data.findings.length > 0 ? (
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl">Audit Findings</h2>
            <div className="data-table-wrap mt-5">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Finding ID</th>
                    <th>Title</th>
                    <th>Control Area</th>
                    <th>Risk Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.findings.map((finding: any) => (
                    <tr key={finding.id}>
                      <td>{finding.finding_id}</td>
                      <td>{finding.finding_title}</td>
                      <td>{finding.control_area}</td>
                      <td>{toTitleCase(finding.risk_rating)}</td>
                      <td>{toTitleCase(finding.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ) : null}

        {data.dataTables.map((tbl: any) => {
          const columns = Array.isArray(tbl.column_definitions) ? tbl.column_definitions : [];
          const rows = Array.isArray(tbl.table_data) ? tbl.table_data : [];

          if (columns.length === 0 || rows.length === 0) return null;

          return (
            <article key={tbl.id} className="surface-card p-6 sm:p-8">
              <h2 className="text-2xl">{tbl.table_title}</h2>
              <div className="data-table-wrap mt-5">
                <table className="data-table">
                  <thead>
                    <tr>
                      {columns.map((col: any, index: number) => (
                        <th key={`${col.name || col.key || index}`}>{col.name || col.key || `Column ${index + 1}`}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row: Record<string, unknown>, rowIndex: number) => (
                      <tr key={`${tbl.id}-row-${rowIndex}`}>
                        {columns.map((col: any, colIndex: number) => {
                          const key = col.key || col.name;
                          return <td key={`${tbl.id}-${rowIndex}-${colIndex}`}>{String(row?.[key] ?? "-")}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          );
        })}

        <div className="surface-card p-6 sm:p-8">
          <Link
            to="/grc-projects"
            className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectDetail;
