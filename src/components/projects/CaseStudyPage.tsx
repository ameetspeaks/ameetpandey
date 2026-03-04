import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type CaseStudyPageProps = {
  title: string;
  summary: string;
  frameworks: string[];
  methodology: string[];
  outcomes: string[];
};

const CaseStudyPage = ({ title, summary, frameworks, methodology, outcomes }: CaseStudyPageProps) => {
  return (
    <section className="page-shell">
      <div className="site-container space-y-8">
        <header className="surface-card p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {frameworks.map((framework) => (
              <span key={framework} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {framework}
              </span>
            ))}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-6">
            <h2 className="text-xl">Methodology</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {methodology.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>

          <article className="surface-card p-6">
            <h2 className="text-xl">Key Outcomes</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
              {outcomes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </article>
        </div>

        <div className="surface-card p-6 text-center sm:p-8">
          <h2 className="text-xl">Continue Exploring</h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/grc-projects"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Back to GRC Hub
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
            >
              Discuss Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyPage;
