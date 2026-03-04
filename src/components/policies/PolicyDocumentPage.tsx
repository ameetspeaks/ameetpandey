import { Link } from "react-router-dom";

type PolicySection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

type PolicyDocumentPageProps = {
  policyTitle: string;
  version: string;
  effectiveDate: string;
  lastReviewDate: string;
  sections: PolicySection[];
  downloadPath: string;
};

const PolicyDocumentPage = ({
  policyTitle,
  version,
  effectiveDate,
  lastReviewDate,
  sections,
  downloadPath,
}: PolicyDocumentPageProps) => {
  return (
    <section className="page-shell">
      <div className="site-container space-y-6">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/frameworks" className="hover:text-primary">
                Frameworks
              </Link>
            </li>
            <li>/</li>
            <li className="text-foreground">{policyTitle}</li>
          </ol>
        </nav>

        <article className="surface-card p-7 sm:p-10">
          <header className="border-b border-border pb-5">
            <h1 className="text-3xl sm:text-4xl">{policyTitle}</h1>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-secondary px-3 py-1">Version: {version}</span>
              <span className="rounded-full bg-secondary px-3 py-1">Effective: {effectiveDate}</span>
              <span className="rounded-full bg-secondary px-3 py-1">Last Review: {lastReviewDate}</span>
            </div>
          </header>

          <div className="mt-8 space-y-8">
            {sections.map((section, index) => (
              <section key={section.title} className="space-y-3">
                <h2 className="text-xl">
                  {index + 1}. {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.items ? (
                  <ol className="space-y-1.5 text-sm leading-7 text-muted-foreground sm:text-base">
                    {section.items.map((item, itemIndex) => (
                      <li key={item}>
                        {index + 1}.{itemIndex + 1} {item}
                      </li>
                    ))}
                  </ol>
                ) : null}
              </section>
            ))}
          </div>

          <footer className="mt-10 border-t border-border pt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Document Control: {policyTitle} • Version {version} • Last Reviewed {lastReviewDate}
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href={downloadPath}
                  download
                  className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Download as PDF
                </a>
                <Link
                  to="/frameworks"
                  className="inline-flex rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
                >
                  Back to Frameworks
                </Link>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </section>
  );
};

export default PolicyDocumentPage;
