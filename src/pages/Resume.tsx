import { Link } from "react-router-dom";
import { Download, ExternalLink, FileText, GraduationCap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const coreCompetencies = [
  "Risk Assessment & Management",
  "Security Compliance",
  "IT Audit & Control Testing",
  "Framework Implementation (ISO 27001, NIST, SOC 2)",
  "Policy Development",
  "Vendor Risk Management",
];

const portfolioHighlights = [
  { label: "ISO 27001 Risk Assessment", href: "/projects/iso27001-risk-assessment" },
  { label: "IT Security Audit", href: "/projects/it-audit-report" },
  { label: "Vendor Security Assessment", href: "/projects/vendor-security-assessment" },
  { label: "Risk Management Framework Documentation", href: "/frameworks" },
  { label: "Security Policy Development", href: "/policies/access-control" },
];

const Resume = () => {
  return (
    <section className="page-shell">
      <div className="site-container">
        <article className="surface-card space-y-8 p-6 sm:p-8 print:space-y-6 print:rounded-none print:border-0 print:shadow-none">
          <header className="border-b border-border pb-6 print:pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl">Amit Pandey</h1>
                <p className="mt-2 text-lg text-muted-foreground">Cybersecurity GRC Analyst</p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <a href="mailto:hello@ameetpandey.in" className="hover:underline">hello@ameetpandey.in</a>
                  <a href="https://linkedin.com/in/ameetpandey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a href="https://github.com/ameetpandey" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
                    GitHub <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
              <Button asChild className="print:hidden">
                <a href="/resume.pdf" download>
                  <Download className="h-4 w-4" />
                  Download Resume PDF
                </a>
              </Button>
            </div>
          </header>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Professional Summary</h2>
            <p className="text-muted-foreground">
              Cybersecurity GRC professional focused on building practical, auditable, and risk-based security programs.
              Experienced in translating regulatory and framework requirements into actionable controls, policy standards,
              and measurable governance outcomes across modern technology environments.
            </p>
            <p className="text-muted-foreground">
              Career objective: to lead high-impact risk and compliance initiatives that strengthen resilience, reduce
              exposure, and improve trust through structured governance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Core Competencies</h2>
            <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {coreCompetencies.map((item) => (
                <li key={item} className="rounded-md border border-border bg-card p-3">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Portfolio Highlights</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {portfolioHighlights.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="inline-flex items-center gap-2 hover:underline">
                    <FileText className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ShieldCheck className="h-5 w-5" />
                  Frameworks & Standards
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>ISO/IEC 27001</li>
                  <li>NIST Cybersecurity Framework</li>
                  <li>SOC 2</li>
                  <li>CIS Controls</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <p className="font-medium text-foreground">Completed</p>
                  <p>Foundational cybersecurity and governance training certifications.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">In Progress</p>
                  <p>ISO 27001 implementation and advanced risk assessment pathways.</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Planned</p>
                  <p>CISA / ISO 27001 Lead Implementer / SOC-focused assurance certifications.</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <GraduationCap className="h-5 w-5" />
              Education
            </h2>
            <p className="text-sm text-muted-foreground">
              Degree and academic profile aligned with information security governance, audit readiness, risk analysis,
              and compliance operations.
            </p>
            <p className="text-sm text-muted-foreground">Relevant coursework includes security controls, IT governance, and policy design.</p>
          </section>

          <section className="flex flex-wrap gap-3 border-t border-border pt-6 print:hidden">
            <Button asChild>
              <a href="/resume.pdf" download>
                <Download className="h-4 w-4" />
                Download Resume PDF
              </a>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/">View Full Portfolio</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Me</Link>
            </Button>
          </section>
        </article>
      </div>
    </section>
  );
};

export default Resume;
