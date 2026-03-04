import { BarChart3, FileText, FolderTree, Home, Image, MessageSquare, Settings, Tags, Users } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

const adminLinks = [
  { to: "/admin", label: "Dashboard", icon: Home, end: true },
  { to: "/admin/posts", label: "Posts", icon: FileText },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/tags", label: "Tags", icon: Tags },
  { to: "/admin/media", label: "Media", icon: Image },
  { to: "/admin/comments", label: "Comments", icon: MessageSquare },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/40">
      <div className="site-container grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-lg">Admin</h1>
            <Button asChild size="sm" variant="ghost">
              <Link to="/">View Site</Link>
            </Button>
          </div>

          <nav className="space-y-1" aria-label="Admin navigation">
            {adminLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm",
                    isActive ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  ].join(" ")
                }
              >
                <link.icon className="h-4 w-4" aria-hidden="true" />
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <Button className="mt-4 w-full" variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
