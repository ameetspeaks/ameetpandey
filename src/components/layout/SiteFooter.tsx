import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "GRC Projects", to: "/grc-projects" },
  { label: "Frameworks", to: "/frameworks" },
  { label: "Resume", to: "/resume" },
  { label: "Contact", to: "/contact" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Email", href: "mailto:hello@ameetpandey.in", icon: Mail },
];

const SiteFooter = () => {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="site-container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">Amit Pandey</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Cybersecurity GRC portfolio focused on governance, risk assessments, audits, and regulatory compliance.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Connect</h3>
              <ul className="space-y-2 text-sm">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary"
                    >
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Amit Pandey. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
