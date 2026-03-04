import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Governance",
    description: "Cybersecurity strategy, policy alignment, and leadership-ready reporting.",
  },
  {
    title: "Risk",
    description: "Structured risk assessments with prioritized treatment plans and measurable outcomes.",
  },
  {
    title: "Compliance",
    description: "Audit-ready control mapping across ISO 27001, NIST, and SOC-aligned programs.",
  },
];

const Index = () => {
  return (
    <section className="page-shell">
      <div className="site-container space-y-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">AmeetPandey.in</p>
          <h1 className="text-4xl leading-tight sm:text-5xl">Cybersecurity GRC Portfolio</h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            A professional portfolio showcasing governance, risk, and compliance work focused on resilient security
            programs and business-aligned outcomes.
          </p>
          <div>
            <Link
              to="/grc-projects"
              className="inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
            >
              Explore GRC Projects
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="surface-card p-6">
              <h2 className="text-lg">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Index;

