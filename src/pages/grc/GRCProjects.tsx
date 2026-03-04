import PageShell from "@/components/layout/PageShell";
import { Link } from "react-router-dom";

const projectLinks = [
  { label: "Risk Assessments", to: "/grc-projects/risk-assessments" },
  { label: "Audit Reports", to: "/grc-projects/audit-reports" },
  { label: "Compliance", to: "/grc-projects/compliance" },
];

const GRCProjects = () => {
  return (
    <PageShell
      title="GRC Projects"
      description="This hub will host detailed case studies across risk assessment programs, audit reporting, and compliance initiatives."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {projectLinks.map((item) => (
          <Link key={item.to} to={item.to} className="surface-card p-4 text-sm font-semibold hover:border-primary hover:text-primary">
            {item.label}
          </Link>
        ))}
      </div>
    </PageShell>
  );
};

export default GRCProjects;
