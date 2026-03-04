import { ArrowLeft, ArrowRight, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

type RiskLevel = "High" | "Medium" | "Low";

type AssetInventoryRow = {
  asset: string;
  owner: string;
  criticality: string;
  dataClassification: string;
};

type RiskAnalysisRow = {
  asset: string;
  threat: string;
  vulnerability: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  riskScore: number;
};

type RiskRegisterRow = {
  riskId: string;
  description: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  score: number;
  priority: RiskLevel;
};

type ControlRecommendationRow = {
  riskArea: string;
  recommendedControl: string;
  isoControlReference: {
    label: string;
    url: string;
  };
  implementationPriority: string;
};

type CaseStudyPageProps = {
  title: string;
  publishedDate: string;
  readingTime: string;
  frameworks: string[];
  objective: string;
  scope: string;
  assessmentTimeline: string;
  keyDeliverables: string[];
  methodology: string[];
  assetInventory: AssetInventoryRow[];
  riskAnalysis: RiskAnalysisRow[];
  riskRegister: RiskRegisterRow[];
  controlRecommendations: ControlRecommendationRow[];
  keyFindings: string[];
  recommendations: {
    high: string[];
    medium: string[];
    low: string[];
  };
  conclusion: {
    summary: string;
    nextSteps: string;
    lessonsLearned: string;
  };
  previousCaseStudy?: {
    title: string;
    to: string;
  };
  nextCaseStudy?: {
    title: string;
    to: string;
  };
};

const levelClassMap: Record<RiskLevel, string> = {
  High: "risk-badge-high",
  Medium: "risk-badge-medium",
  Low: "risk-badge-low",
};

const CaseStudyPage = ({
  title,
  publishedDate,
  readingTime,
  frameworks,
  objective,
  scope,
  assessmentTimeline,
  keyDeliverables,
  methodology,
  assetInventory,
  riskAnalysis,
  riskRegister,
  controlRecommendations,
  keyFindings,
  recommendations,
  conclusion,
  previousCaseStudy,
  nextCaseStudy,
}: CaseStudyPageProps) => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
            <li className="text-foreground">{title}</li>
          </ol>
        </nav>

        <header className="surface-card p-6 sm:p-8">
          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-secondary px-3 py-1">Published: {publishedDate}</span>
            <span className="rounded-full bg-secondary px-3 py-1">{readingTime}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {frameworks.map((framework) => (
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
              <p className="mt-1">{objective}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Scope</h3>
              <p className="mt-1">{scope}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Assessment Timeline</h3>
              <p className="mt-1">{assessmentTimeline}</p>
            </div>
            <div>
              <h3 className="text-base text-foreground">Key Deliverables</h3>
              <ul className="mt-1 space-y-1">
                {keyDeliverables.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Methodology</h2>
          <ol className="mt-5 space-y-2 text-sm leading-7 text-muted-foreground">
            {methodology.map((step, index) => (
              <li key={step}>
                <span className="font-semibold text-foreground">{index + 1}. </span>
                {step}
              </li>
            ))}
          </ol>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Asset Inventory</h2>
          <div className="data-table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Owner</th>
                  <th>Criticality</th>
                  <th>Data Classification</th>
                </tr>
              </thead>
              <tbody>
                {assetInventory.map((row) => (
                  <tr key={`${row.asset}-${row.owner}`}>
                    <td>{row.asset}</td>
                    <td>{row.owner}</td>
                    <td>{row.criticality}</td>
                    <td>{row.dataClassification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Risk Analysis</h2>
          <div className="data-table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Threat</th>
                  <th>Vulnerability</th>
                  <th>Likelihood</th>
                  <th>Impact</th>
                  <th>Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {riskAnalysis.map((row) => (
                  <tr key={`${row.asset}-${row.threat}`}>
                    <td>{row.asset}</td>
                    <td>{row.threat}</td>
                    <td>{row.vulnerability}</td>
                    <td>
                      <span className={levelClassMap[row.likelihood]}>{row.likelihood}</span>
                    </td>
                    <td>
                      <span className={levelClassMap[row.impact]}>{row.impact}</span>
                    </td>
                    <td>{row.riskScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Risk Register</h2>
          <div className="data-table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Risk ID</th>
                  <th>Description</th>
                  <th>Likelihood</th>
                  <th>Impact</th>
                  <th>Score</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {[...riskRegister]
                  .sort((a, b) => b.score - a.score)
                  .map((row) => (
                    <tr key={row.riskId}>
                      <td>{row.riskId}</td>
                      <td>{row.description}</td>
                      <td>
                        <span className={levelClassMap[row.likelihood]}>{row.likelihood}</span>
                      </td>
                      <td>
                        <span className={levelClassMap[row.impact]}>{row.impact}</span>
                      </td>
                      <td>{row.score}</td>
                      <td>
                        <span className={levelClassMap[row.priority]}>{row.priority}</span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Control Recommendations</h2>
          <div className="data-table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Risk Area</th>
                  <th>Recommended Control</th>
                  <th>ISO Control Reference</th>
                  <th>Implementation Priority</th>
                </tr>
              </thead>
              <tbody>
                {controlRecommendations.map((row) => (
                  <tr key={`${row.riskArea}-${row.isoControlReference.label}`}>
                    <td>{row.riskArea}</td>
                    <td>{row.recommendedControl}</td>
                    <td>
                      <a
                        href={row.isoControlReference.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:text-accent"
                      >
                        {row.isoControlReference.label}
                      </a>
                    </td>
                    <td>{row.implementationPriority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Key Findings</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted-foreground">
            {keyFindings.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Recommendations</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <h3 className="text-base">High Priority</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {recommendations.high.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <h3 className="text-base">Medium Priority</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {recommendations.medium.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-secondary/60 p-4">
              <h3 className="text-base">Low Priority</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {recommendations.low.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Conclusion</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Summary: </span>
              {conclusion.summary}
            </p>
            <p>
              <span className="font-semibold text-foreground">Next Steps: </span>
              {conclusion.nextSteps}
            </p>
            <p>
              <span className="font-semibold text-foreground">Lessons Learned: </span>
              {conclusion.lessonsLearned}
            </p>
          </div>
        </article>

        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <Link
                to="/grc-projects"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Projects
              </Link>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
                Share on LinkedIn
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Share via Email
              </a>
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              {previousCaseStudy ? (
                <Link to={previousCaseStudy.to} className="rounded-md border border-border px-4 py-2 text-muted-foreground hover:border-primary hover:text-primary">
                  Previous: {previousCaseStudy.title}
                </Link>
              ) : (
                <span className="rounded-md border border-border px-4 py-2 text-muted-foreground/60">Previous: N/A</span>
              )}
              {nextCaseStudy ? (
                <Link to={nextCaseStudy.to} className="rounded-md border border-border px-4 py-2 text-muted-foreground hover:border-primary hover:text-primary">
                  Next: {nextCaseStudy.title}
                </Link>
              ) : (
                <span className="rounded-md border border-border px-4 py-2 text-muted-foreground/60">Next: N/A</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyPage;

