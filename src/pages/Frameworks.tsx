import { BookOpenCheck, ClipboardList, FileCheck2, Shield, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const frameworks = [
  {
    title: "ISO/IEC 27001",
    issuingBody: "ISO & IEC",
    purposeScope:
      "A certifiable information security management framework used to build, operate, monitor, and continuously improve an ISMS.",
    keyComponents: ["ISMS", "Risk Assessment", "Annex A Controls"],
    whenToUse:
      "Best used when an organization needs a formal governance model and certification pathway for information security management.",
    notes:
      "Implemented through risk registers, control mapping, and documented treatment plans tied to audit evidence.",
    icon: Shield,
  },
  {
    title: "NIST Cybersecurity Framework",
    issuingBody: "NIST",
    purposeScope:
      "A risk-based cybersecurity management framework that helps organizations prioritize and improve security outcomes.",
    keyComponents: ["Identify", "Protect", "Detect", "Respond", "Recover"],
    whenToUse:
      "Ideal for structuring cybersecurity maturity programs and communicating risk posture to leadership and stakeholders.",
    notes:
      "Used for control baselining, capability assessments, and phased improvements by implementation tier.",
    icon: ShieldAlert,
  },
  {
    title: "SOC 2",
    issuingBody: "AICPA",
    purposeScope:
      "An assurance framework focused on service organization controls related to trust and customer data protection.",
    keyComponents: [
      "Security",
      "Availability",
      "Processing Integrity",
      "Confidentiality",
      "Privacy",
    ],
    whenToUse:
      "Best for SaaS and service providers demonstrating control effectiveness to customers and external auditors.",
    notes:
      "Applied via trust criteria mapping, evidence readiness planning, and remediation tracking for audit cycles.",
    icon: FileCheck2,
  },
  {
    title: "CIS Critical Security Controls",
    issuingBody: "Center for Internet Security",
    purposeScope:
      "A practical prioritized control set that helps organizations address the highest-impact security risks quickly.",
    keyComponents: ["Implementation Group 1", "Implementation Group 2", "Implementation Group 3"],
    whenToUse:
      "Strong choice for operational hardening programs where teams need clear, high-priority security actions.",
    notes:
      "Used to define foundational controls and align risk reduction activities to available resources.",
    icon: ClipboardList,
  },
];

const comparisonRows = [
  {
    framework: "ISO/IEC 27001",
    focus: "ISMS & governance",
    bestFor: "Formal security management and certification",
    certification: "Yes",
    complexity: "High",
  },
  {
    framework: "NIST CSF",
    focus: "Risk-based program management",
    bestFor: "Maturity improvement and risk communication",
    certification: "No",
    complexity: "Medium",
  },
  {
    framework: "SOC 2",
    focus: "Service control assurance",
    bestFor: "Customer trust and external attestation",
    certification: "Attestation",
    complexity: "High",
  },
  {
    framework: "CIS Controls",
    focus: "Prioritized technical controls",
    bestFor: "Practical baseline hardening",
    certification: "No",
    complexity: "Medium",
  },
];

const policies = [
  {
    title: "Access Control Policy",
    description: "Defines access governance requirements for users, systems, and privileged operations.",
    to: "/policies/access-control",
    pdf: "/policies/access-control-policy.pdf",
  },
  {
    title: "Password Policy",
    description: "Establishes password, MFA, and account credential governance requirements.",
    to: "/policies/password",
    pdf: "/policies/password-policy.pdf",
  },
  {
    title: "Data Classification Policy",
    description: "Defines data classification levels and handling controls across the organization.",
    to: "/policies/data-classification",
    pdf: "/policies/data-classification-policy.pdf",
  },
  {
    title: "Incident Response Policy",
    description: "Sets incident roles, escalation procedures, and post-incident governance standards.",
    to: "/policies/incident-response",
    pdf: "/policies/incident-response-policy.pdf",
  },
];

const Frameworks = () => {
  return (
    <section className="page-shell">
      <div className="site-container space-y-10">
        <header className="space-y-4">
          <h1 className="text-3xl sm:text-4xl">Cybersecurity Frameworks &amp; Standards</h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground">
            Frameworks are essential in GRC because they provide structured guidance for governing security controls,
            managing risk, and demonstrating compliance outcomes. They align security programs with business priorities
            and create repeatable, auditable processes.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {frameworks.map((item) => (
            <article key={item.title} className="surface-card p-6 sm:p-7">
              <div className="mb-4 inline-flex rounded-lg bg-secondary p-3 text-accent">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Issuing Body: {item.issuingBody}</p>

              <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground">
                <p>
                  <span className="font-semibold text-foreground">Purpose &amp; Scope: </span>
                  {item.purposeScope}
                </p>
                <p>
                  <span className="font-semibold text-foreground">When to Use: </span>
                  {item.whenToUse}
                </p>
                <p>
                  <span className="font-semibold text-foreground">Implementation Notes: </span>
                  {item.notes}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.keyComponents.map((component) => (
                  <span
                    key={component}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                  >
                    {component}
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
                  <th>Focus Area</th>
                  <th>Best Used For</th>
                  <th>Certification Available</th>
                  <th>Complexity Level</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.framework}>
                    <td>{row.framework}</td>
                    <td>{row.focus}</td>
                    <td>{row.bestFor}</td>
                    <td>{row.certification}</td>
                    <td>{row.complexity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl">Security Policies</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {policies.map((policy) => (
              <article key={policy.title} className="surface-card p-5">
                <h3 className="text-lg">{policy.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{policy.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to={policy.to}
                    className="inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    View Policy
                  </Link>
                  <a
                    href={policy.pdf}
                    download
                    className="inline-flex rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
                  >
                    Download PDF
                  </a>
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

