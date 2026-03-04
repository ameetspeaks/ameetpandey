import { Briefcase, FolderTree, FileText, AlertCircle, Shield, CheckSquare, BarChart3, Home, Image, MessageSquare, Settings, Tags, Users, Library, PlusCircle, Network, ShieldCheck, Link as LinkIcon, Activity } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const adminGroups = [
  {
    title: "Overview",
    links: [
      { to: "/admin", label: "Dashboard", icon: Home, end: true },
    ]
  },
  {
    title: "Projects",
    links: [
      { to: "/admin/projects", label: "All Projects", icon: FolderTree, end: true },
      { to: "/admin/projects/new", label: "Add New Project", icon: Briefcase },
      { to: "/admin/projects?type=risk_assessment", label: "Risk Assessments", icon: AlertCircle },
      { to: "/admin/projects?type=it_audit", label: "IT Audits", icon: Shield },
      { to: "/admin/projects?type=vendor_assessment", label: "Vendor Assessments", icon: Users },
      { to: "/admin/projects?type=compliance_mapping", label: "Compliance Projects", icon: CheckSquare },
      { to: "/admin/projects/analytics", label: "Project Analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Policies",
    links: [
      { to: "/admin/policies", label: "All Policies", icon: FolderTree },
      { to: "/admin/policies/requirements", label: "Requirements", icon: FileText },
      { to: "/admin/policies/reviews", label: "Reviews", icon: Users },
    ]
  },
  {
    title: "Blog",
    links: [
      { to: "/admin/posts", label: "All Posts", icon: FileText, end: true },
      { to: "/admin/posts/new", label: "Add New Post", icon: FileText },
      { to: "/admin/tags", label: "Tags", icon: Tags },
      { to: "/admin/comments", label: "Comments", icon: MessageSquare },
      { to: "/admin/subscribers", label: "Subscribers", icon: Users },
    ]
  },
  {
    title: "Frameworks",
    links: [
      { to: "/admin/frameworks", label: "All Frameworks", icon: Library, end: true },
      { to: "/admin/frameworks/new", label: "Add New Framework", icon: PlusCircle },
      { to: "/admin/frameworks/domains", label: "Framework Domains", icon: Network },
      { to: "/admin/frameworks/controls", label: "Framework Controls", icon: ShieldCheck },
      { to: "/admin/frameworks/mappings", label: "Control Mappings", icon: LinkIcon },
      { to: "/admin/frameworks/tracker", label: "Implementation Tracker", icon: Activity },
    ]
  },
  {
    title: "System",
    links: [
      { to: "/admin/media", label: "Media", icon: Image },
      { to: "/admin/analytics", label: "Blog Analytics", icon: BarChart3 },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ]
  }
];

const AdminLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="site-container grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit p-4 font-mono">
          <div className="mb-4 flex items-center justify-between border-b pb-4">
            <h1 className="text-lg font-bold">Admin</h1>
            <Button asChild size="sm" variant="ghost">
              <Link to="/">View Site</Link>
            </Button>
          </div>

          <nav className="space-y-6" aria-label="Admin navigation">
            {adminGroups.map((group, i) => (
              <div key={i}>
                <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </h2>
                <div className="space-y-1">
                  {group.links.map((link) => {
                    // For links with URL queries, react-router NavLink matching is based on pathname.
                    // We'll use simple Link or customize active state, but NavLink works fine for pathname matching
                    const isQueryLink = link.to.includes("?");

                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                            isActive && !isQueryLink
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                          ].join(" ")
                        }
                      >
                        <link.icon className="h-4 w-4" aria-hidden="true" />
                        <span>{link.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-6 border-t pt-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
          </div>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
