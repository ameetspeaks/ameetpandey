import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BarChart3, Copy, Download, Eye, MoreHorizontal, Pencil, Plus, Trash2, FolderTree, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

type ProjectRow = {
    id: string;
    title: string;
    slug: string;
    project_type: string;
    status: "draft" | "under_review" | "published" | "archived";
    is_active: boolean;
    is_featured: boolean;
    view_count: number;
    published_date: string | null;
    last_modified_date: string;
    featured_image_url: string | null;
    frameworks_used: string[];
};

const supabaseAny = supabase as any;

const statuses = ["draft", "under_review", "published", "archived"];
const projectTypes = [
    "risk_assessment",
    "it_audit",
    "vendor_assessment",
    "compliance_mapping",
    "policy_development",
    "framework_implementation",
];

const formatLabel = (val: string) =>
    val
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : "-");

const AdminProjectsList = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    // Filters
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState("all");
    // const [frameworkFilter, setFrameworkFilter] = useState("all"); // Future enhancement

    const [sortBy, setSortBy] = useState<"date" | "title" | "views" | "status">("date");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const typeFromUrl = searchParams.get("type");
        if (typeFromUrl) setTypeFilter(typeFromUrl);
    }, [searchParams]);

    const loadData = async () => {
        const { data, error } = await supabaseAny
            .from("projects")
            .select("id,title,slug,project_type,status,is_active,is_featured,view_count,published_date,last_modified_date,featured_image_url,frameworks_used")
            .order("last_modified_date", { ascending: false })
            .limit(1000);

        if (error) {
            toast({ title: "Failed to load projects", description: error.message, variant: "destructive" });
            return;
        }
        setProjects((data || []) as ProjectRow[]);
    };

    useEffect(() => {
        void loadData();
    }, []);

    const stats = useMemo(() => {
        return {
            total: projects.length,
            published: projects.filter((p) => p.status === "published").length,
            drafts: projects.filter((p) => p.status === "draft").length,
            views: projects.reduce((acc, p) => acc + (p.view_count || 0), 0),
        };
    }, [projects]);

    const filtered = useMemo(() => {
        let next = projects.filter((p) => {
            const byType = typeFilter === "all" || p.project_type === typeFilter;
            const byStatus = statusFilter === "all" || p.status === statusFilter;
            const byActive = activeFilter === "all" || (activeFilter === "active" ? p.is_active : !p.is_active);
            const bySearch =
                !search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.slug.toLowerCase().includes(search.toLowerCase());

            return byType && byStatus && byActive && bySearch;
        });

        next = [...next].sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            if (sortBy === "views") return b.view_count - a.view_count;
            if (sortBy === "status") return a.status.localeCompare(b.status);
            return new Date(b.last_modified_date).getTime() - new Date(a.last_modified_date).getTime();
        });

        return next;
    }, [projects, typeFilter, statusFilter, activeFilter, search, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const selectedIds = Object.entries(selected)
        .filter(([, value]) => value)
        .map(([id]) => id);

    const toggleProperty = async (id: string, prop: "is_active" | "is_featured", value: boolean) => {
        const { error } = await supabaseAny.from("projects").update({ [prop]: value }).eq("id", id);
        if (error) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Updated", description: `Project ${prop.replace("is_", "")} status saved.` });
        void loadData();
    };

    const setStatus = async (id: string, status: ProjectRow["status"]) => {
        const payload: any = { status };
        if (status === "published") payload.published_date = new Date().toISOString();

        const { error } = await supabaseAny.from("projects").update(payload).eq("id", id);
        if (error) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Status updated", description: `Project moved to ${formatLabel(status)}.` });
        void loadData();
    };

    const duplicateProject = async (id: string) => {
        toast({ title: "Not implemented yet", description: "Deep copy requires copying sections and tables." });
        // Detailed duplication logic would be added later
    };

    const deleteProject = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        const { error } = await supabaseAny.from("projects").delete().eq("id", id);
        if (error) {
            toast({ title: "Delete failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Deleted", description: "Project removed." });
        void loadData();
    };

    const bulkStatus = async (status: ProjectRow["status"]) => {
        if (!selectedIds.length) return;
        const payload: any = { status };
        if (status === "published") payload.published_date = new Date().toISOString();

        const { error } = await supabaseAny.from("projects").update(payload).in("id", selectedIds);
        if (error) {
            toast({ title: "Bulk action failed", description: error.message, variant: "destructive" });
            return;
        }
        setSelected({});
        toast({ title: "Bulk update successful", description: `${selectedIds.length} projects updated.` });
        void loadData();
    };

    return (
        <section className="space-y-4 p-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Portfolio Projects Management</h1>
                    <p className="text-sm text-muted-foreground">Manage your Risk Assessments, Audits, and Compliance projects.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export All Projects
                    </Button>
                    <Button asChild>
                        <Link to="/admin/projects/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Project
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 whitespace-nowrap">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderTree className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.published}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.drafts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.views}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="space-y-4 p-5">
                    {/* Filters */}
                    <div className="grid gap-3 lg:grid-cols-5">
                        <Input placeholder="Search title or description" value={search} onChange={(event) => setSearch(event.target.value)} />

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Project Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {projectTypes.map((t) => (
                                    <SelectItem key={t} value={t}>
                                        {formatLabel(t)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {statuses.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {formatLabel(s)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={activeFilter} onValueChange={setActiveFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Active/Inactive" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All States</SelectItem>
                                <SelectItem value="active">Active Only</SelectItem>
                                <SelectItem value="inactive">Inactive Only</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Sort by Date</SelectItem>
                                <SelectItem value="title">Sort by Title</SelectItem>
                                <SelectItem value="views">Sort by Views</SelectItem>
                                <SelectItem value="status">Sort by Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => void bulkStatus("published")} disabled={!selectedIds.length}>
                            Publish Selected
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void bulkStatus("draft")} disabled={!selectedIds.length}>
                            Draft Selected
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void bulkStatus("archived")} disabled={!selectedIds.length}>
                            Archive Selected
                        </Button>
                    </div>

                    {/* Table */}
                    <div className="data-table-wrap overflow-x-auto rounded-md border">
                        <table className="data-table min-w-[1200px] w-full text-sm">
                            <thead className="bg-muted text-muted-foreground border-b border-border text-left">
                                <tr>
                                    <th className="p-3">
                                        <input
                                            type="checkbox"
                                            checked={pageItems.length > 0 && pageItems.every((item) => selected[item.id])}
                                            onChange={(event) => {
                                                const checked = event.target.checked;
                                                const next = { ...selected };
                                                for (const item of pageItems) next[item.id] = checked;
                                                setSelected(next);
                                            }}
                                            className="rounded border-border"
                                        />
                                    </th>
                                    <th className="p-3 font-medium">Project</th>
                                    <th className="p-3 font-medium">Type</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Active</th>
                                    <th className="p-3 font-medium">Featured</th>
                                    <th className="p-3 font-medium">Frameworks</th>
                                    <th className="p-3 font-medium">Views</th>
                                    <th className="p-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pageItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-muted-foreground">
                                            No projects found.
                                        </td>
                                    </tr>
                                ) : (
                                    pageItems.map((project) => (
                                        <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(selected[project.id])}
                                                    onChange={(event) => setSelected((prev) => ({ ...prev, [project.id]: event.target.checked }))}
                                                    className="rounded border-border"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-16 overflow-hidden rounded bg-secondary flex-shrink-0">
                                                        {project.featured_image_url ? (
                                                            <img src={project.featured_image_url} alt="" className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                                                                <Image className="h-4 w-4" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <Link to={`/admin/projects/edit/${project.id}`} className="font-medium text-foreground hover:underline line-clamp-1">
                                                            {project.title}
                                                        </Link>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">/{project.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="outline" className="whitespace-nowrap bg-secondary/30">
                                                    {formatLabel(project.project_type)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={project.status === "published" ? "default" : project.status === "draft" ? "secondary" : "outline"}
                                                >
                                                    {formatLabel(project.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Switch
                                                    checked={project.is_active}
                                                    onCheckedChange={(val) => void toggleProperty(project.id, "is_active", val)}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <Switch
                                                    checked={project.is_featured}
                                                    onCheckedChange={(val) => void toggleProperty(project.id, "is_featured", val)}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div className="flex flex-wrap gap-1 max-w-[150px]">
                                                    {project.frameworks_used?.slice(0, 2).map((fw) => (
                                                        <span key={fw} className="text-xs bg-secondary px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                                            {fw}
                                                        </span>
                                                    ))}
                                                    {(project.frameworks_used?.length || 0) > 2 && (
                                                        <span className="text-xs text-muted-foreground">+{project.frameworks_used.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">{project.view_count}</td>
                                            <td className="p-3">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/admin/projects/edit/${project.id}`}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/projects/${project.slug}`} target="_blank">
                                                                <Eye className="mr-2 h-4 w-4" /> Preview
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/admin/projects/analytics?id=${project.id}`}>
                                                                <BarChart3 className="mr-2 h-4 w-4" /> Analytics
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => void duplicateProject(project.id)}>
                                                            <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => void setStatus(project.id, project.status === "published" ? "draft" : "published")}
                                                        >
                                                            {project.status === "published" ? "Unpublish" : "Publish"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => void setStatus(project.id, "archived")}>
                                                            Archive
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => void deleteProject(project.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm pt-4">
                        <p className="text-muted-foreground">
                            Showing {(currentPage - 1) * itemsPerPage + (pageItems.length > 0 ? 1 : 0)}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground">Rows per page</p>
                                <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
                                    <SelectTrigger className="w-[70px] h-8">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 25, 50, 100].map((size) => (
                                            <SelectItem key={size} value={String(size)}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button size="sm" variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage <= 1}>
                                    Previous
                                </Button>
                                <div className="w-[80px] text-center font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage >= totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default AdminProjectsList;
