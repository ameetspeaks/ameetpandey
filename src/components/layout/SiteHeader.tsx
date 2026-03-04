import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const mainLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Frameworks", to: "/frameworks" },
  { label: "Resume", to: "/resume" },
  { label: "Contact", to: "/contact" },
];

const grcLinks = [
  { label: "Risk Assessments", to: "/grc-projects/risk-assessments" },
  { label: "Audit Reports", to: "/grc-projects/audit-reports" },
  { label: "Compliance", to: "/grc-projects/compliance" },
];

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${isActive ? "nav-link nav-link-active" : "nav-link"}`;

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [mobileProjectsOpen, setMobileProjectsOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="site-container">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 rounded-md px-2 py-1 hover:bg-secondary">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <span className="text-base font-bold text-foreground">Amit Pandey</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex rounded-md p-2 text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <NavLink to="/" end className={getLinkClass}>
              Home
            </NavLink>
            <NavLink to="/about" className={getLinkClass}>
              About
            </NavLink>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProjectsOpen((prev) => !prev)}
                onBlur={() => setTimeout(() => setProjectsOpen(false), 120)}
                className="nav-link"
                aria-expanded={projectsOpen}
                aria-haspopup="menu"
              >
                GRC Projects
                <ChevronDown className={`h-4 w-4 transition-transform ${projectsOpen ? "rotate-180" : ""}`} />
              </button>

              {projectsOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-popover p-2 shadow-elevated" role="menu">
                  <NavLink to="/grc-projects" className="nav-link w-full" role="menuitem">
                    Overview
                  </NavLink>
                  {grcLinks.map((link) => (
                    <NavLink key={link.to} to={link.to} className="nav-link w-full" role="menuitem">
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/frameworks" className={getLinkClass}>
              Frameworks
            </NavLink>
            <NavLink to="/resume" className={getLinkClass}>
              Resume
            </NavLink>
            <NavLink to="/contact" className={getLinkClass}>
              Contact
            </NavLink>
          </nav>
        </div>

        {mobileOpen && (
          <nav className="space-y-1 border-t border-border pb-4 pt-3 md:hidden" aria-label="Mobile navigation">
            <NavLink to="/" end className={getLinkClass} onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/about" className={getLinkClass} onClick={() => setMobileOpen(false)}>
              About
            </NavLink>

            <button
              type="button"
              onClick={() => setMobileProjectsOpen((prev) => !prev)}
              className="nav-link w-full justify-between"
              aria-expanded={mobileProjectsOpen}
            >
              <span>GRC Projects</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${mobileProjectsOpen ? "rotate-180" : ""}`} />
            </button>

            {mobileProjectsOpen && (
              <div className="space-y-1 pl-4">
                <NavLink to="/grc-projects" className={getLinkClass} onClick={() => setMobileOpen(false)}>
                  Overview
                </NavLink>
                {grcLinks.map((link) => (
                  <NavLink key={link.to} to={link.to} className={getLinkClass} onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}

            <NavLink to="/frameworks" className={getLinkClass} onClick={() => setMobileOpen(false)}>
              Frameworks
            </NavLink>
            <NavLink to="/resume" className={getLinkClass} onClick={() => setMobileOpen(false)}>
              Resume
            </NavLink>
            <NavLink to="/contact" className={getLinkClass} onClick={() => setMobileOpen(false)}>
              Contact
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default SiteHeader;
