import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchFrameworks, fetchPublishedPolicies } from "@/lib/cms";

const Frameworks = () => {
  const { data: frameworks = [], isLoading: frameworksLoading } = useQuery({
    queryKey: ["cms-frameworks"],
    queryFn: fetchFrameworks,
  });

  const { data: policies = [], isLoading: policiesLoading } = useQuery({
    queryKey: ["cms-policies-summary"],
    queryFn: fetchPublishedPolicies,
  });

  return (
    <section className="page-shell">
      <div className="site-container space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl">Cybersecurity Frameworks &amp; Standards</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Framework and policy content is now database-driven and managed through the CMS workflow.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {frameworksLoading ? <div className="surface-card p-6 text-sm text-muted-foreground">Loading frameworks...</div> : null}
          {!frameworksLoading && frameworks.length === 0 ? (
            <div className="surface-card p-6 text-sm text-muted-foreground">No active frameworks published yet.</div>
          ) : null}
          {frameworks.map((item: any) => (
            <article key={item.id} className="surface-card p-6 sm:p-7">
              <h2 className="text-2xl">{item.framework_name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Issuing Body: {item.issuing_organization}</p>

              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Purpose &amp; Scope: </span>
                  {item.description}
                </p>
                {item.purpose ? (
                  <p>
                    <span className="font-semibold text-foreground">When to Use: </span>
                    {item.purpose}
                  </p>
                ) : null}
                {item.scope ? (
                  <p>
                    <span className="font-semibold text-foreground">Implementation Notes: </span>
                    {item.scope}
                  </p>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(item.target_industries || []).slice(0, 5).map((industry: string) => (
                  <span key={industry} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {industry}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="surface-card p-6 sm:p-8">
          <h2 className="text-2xl">Framework Comparison</h2>
          <div className="data-table-wrap mt-5">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Framework</th>
                  <th>Type</th>
                  <th>Issuing Body</th>
                  <th>Certification Available</th>
                  <th>Complexity</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((row: any) => (
                  <tr key={row.id}>
                    <td>{row.framework_name}</td>
                    <td>{String(row.framework_type || "-").replace(/_/g, " ")}</td>
                    <td>{row.issuing_organization}</td>
                    <td>{row.certification_available ? "Yes" : "No"}</td>
                    <td>{String(row.implementation_complexity || "-")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl">Security Policies</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {policiesLoading ? <div className="surface-card p-5 text-sm text-muted-foreground">Loading policies...</div> : null}
            {!policiesLoading && policies.length === 0 ? (
              <div className="surface-card p-5 text-sm text-muted-foreground">No published policies available yet.</div>
            ) : null}
            {policies.map((policy: any) => (
              <article key={policy.id} className="surface-card p-5">
                <h3 className="text-lg">{policy.policy_name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Version {policy.version} • {String(policy.policy_type).replace(/_/g, " ")}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={`/policies/${policy.slug}`}
                    className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    View Policy
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
};

export default Frameworks;
