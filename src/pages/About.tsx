import { Link } from "react-router-dom";

const skillCategories = [
  {
    title: "Governance & Risk Management",
    skills: [
      "Risk Assessment Methodologies",
      "Security Policy Development",
      "Vendor Risk Management",
      "Third-Party Risk Analysis",
      "Security Governance Programs",
      "Control Framework Design",
    ],
  },
  {
    title: "Compliance Frameworks",
    skills: [
      "ISO/IEC 27001",
      "NIST Cybersecurity Framework",
      "SOC 2 Trust Services Criteria",
      "CIS Critical Security Controls",
      "GDPR Compliance Basics",
      "PCI DSS Awareness",
    ],
  },
  {
    title: "Audit & Assessment",
    skills: [
      "IT Control Testing",
      "Audit Evidence Collection",
      "Gap Analysis",
      "Control Mapping",
      "Compliance Documentation",
      "Security Assessments",
    ],
  },
];

const About = () => {
  return (
    <>
      <section className="hero-gradient">
        <div className="site-container py-16 text-center text-primary-foreground sm:py-20">
          <h1 className="text-4xl font-extrabold text-primary-foreground sm:text-5xl">About Amit Pandey</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-primary-foreground/90 sm:text-lg">
            Cybersecurity GRC analyst focused on governance, measurable risk reduction, and practical compliance
            outcomes.
          </p>
        </div>
      </section>

      <section className="page-shell">
        <div className="site-container grid gap-6 lg:grid-cols-2">
          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl">Professional Summary</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                I am building a career in cybersecurity governance by focusing on policies, controls, and assurance
                practices that strengthen organizational resilience.
              </p>
              <p>
                My core interest is risk management and compliance—translating security requirements into structured
                action plans aligned with business priorities.
              </p>
              <p>
                I bring hands-on exposure to frameworks such as ISO/IEC 27001, NIST CSF, and SOC 2 for control mapping,
                documentation, and assessment support.
              </p>
              <p>
                My long-term objective is to contribute in GRC and IT audit roles where governance, control maturity,
                and continuous improvement are central.
              </p>
            </div>
          </article>

          <article className="surface-card p-6 sm:p-8">
            <h2 className="text-2xl">Background</h2>
            <div className="mt-5 space-y-5">
              <div>
                <h3 className="text-lg">Education Background</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                  Academic foundation in information security and technology disciplines supporting cybersecurity
                  governance and audit-oriented thinking.
                </p>
              </div>
              <div>
                <h3 className="text-lg">Certifications Pursued</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                  Actively pursuing role-relevant certifications in governance, risk, and compliance to deepen practical
                  implementation capability.
                </p>
              </div>
              <div>
                <h3 className="text-lg">Professional Interests</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
                  Strong interest in governance program design, risk analysis, and control assurance to support secure,
                  compliant business operations.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="page-shell bg-secondary/50">
        <div className="site-container space-y-8">
          <div className="text-center">
            <h2 className="text-3xl">Technical &amp; Framework Knowledge</h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {skillCategories.map((category) => (
              <article key={category.title} className="surface-card p-6">
                <h3 className="text-lg">{category.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="site-container">
          <div className="surface-card p-8 text-center sm:p-10">
            <h2 className="text-2xl">Interested in discussing GRC projects?</h2>
            <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/grc-projects"
                className="inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90"
              >
                View Portfolio
              </Link>
              <Link
                to="/contact"
                className="inline-flex rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary hover:text-primary"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;

