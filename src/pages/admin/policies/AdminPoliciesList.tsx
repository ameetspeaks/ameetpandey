import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BarChart3, Copy, Download, Eye, MoreHorizontal, Pencil, Plus, Trash2, FolderTree, FileText } from "lucide-react";
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

type PolicyRow = {
    id: string;
    policy_name: string;
    slug: string;
    policy_type: string;
    status: "draft" | "under_review" | "published" | "archived";
    is_active: boolean;
    version: string;
    owner: string;
    next_review_date: string | null;
    updated_at: string;
};

const supabaseAny = supabase as any;

const statuses = ["draft", "under_review", "published", "archived"];
const policyTypes = [
    "access_control",
    "password",
    "data_classification",
    "incident_response",
    "acceptable_use",
    "byod",
    "backup",
    "encryption",
    "remote_access",
    "vendor_management",
];

const formatLabel = (val: string) =>
    val
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : "-");

export default function AdminPoliciesList() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const [policies, setPolicies] = useState<PolicyRow[]>([]);
    const [selected, setSelected] = useState<Record<string, boolean>>({});

    // Filters
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>(searchParams.get("type") || "all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [activeFilter, setActiveFilter] = useState("all");
    const [overdueFilter, setOverdueFilter] = useState("all");

    const [sortBy, setSortBy] = useState<"date" | "name" | "status" | "review_date">("date");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const typeFromUrl = searchParams.get("type");
        if (typeFromUrl) setTypeFilter(typeFromUrl);
    }, [searchParams]);

    const loadData = async () => {
        const { data, error } = await supabaseAny
            .from("security_policies")
            .select("id,policy_name,slug,policy_type,status,is_active,version,owner,next_review_date,updated_at")
            .order("updated_at", { ascending: false })
            .limit(1000);

        if (error) {
            toast({ title: "Failed to load policies", description: error.message, variant: "destructive" });
            return;
        }
        setPolicies((data || []) as PolicyRow[]);
    };

    useEffect(() => {
        void loadData();
    }, []);

    const isOverdue = (dateString: string | null) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    const stats = useMemo(() => {
        return {
            total: policies.length,
            active: policies.filter((p) => p.is_active).length,
            underReview: policies.filter((p) => p.status === "under_review").length,
            overdue: policies.filter((p) => isOverdue(p.next_review_date)).length,
        };
    }, [policies]);

    const filtered = useMemo(() => {
        let next = policies.filter((p) => {
            const byType = typeFilter === "all" || p.policy_type === typeFilter;
            const byStatus = statusFilter === "all" || p.status === statusFilter;
            const byActive = activeFilter === "all" || (activeFilter === "active" ? p.is_active : !p.is_active);
            const byOverdue = overdueFilter === "all" || (overdueFilter === "overdue" ? isOverdue(p.next_review_date) : !isOverdue(p.next_review_date));
            const bySearch =
                !search ||
                p.policy_name.toLowerCase().includes(search.toLowerCase()) ||
                p.slug.toLowerCase().includes(search.toLowerCase());

            return byType && byStatus && byActive && byOverdue && bySearch;
        });

        next = [...next].sort((a, b) => {
            if (sortBy === "name") return a.policy_name.localeCompare(b.policy_name);
            if (sortBy === "status") return a.status.localeCompare(b.status);
            if (sortBy === "review_date") return new Date(a.next_review_date || 0).getTime() - new Date(b.next_review_date || 0).getTime();
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        });

        return next;
    }, [policies, typeFilter, statusFilter, activeFilter, overdueFilter, search, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const currentPage = Math.min(page, totalPages);
    const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const selectedIds = Object.entries(selected)
        .filter(([, value]) => value)
        .map(([id]) => id);

    const toggleProperty = async (id: string, prop: "is_active", value: boolean) => {
        const { error } = await supabaseAny.from("security_policies").update({ [prop]: value }).eq("id", id);
        if (error) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Updated", description: `Policy ${prop.replace("is_", "")} status saved.` });
        void loadData();
    };

    const setStatus = async (id: string, status: PolicyRow["status"]) => {
        const payload: any = { status };
        if (status === "published") {
            payload.is_active = true;
            payload.approval_date = new Date().toISOString();
        }

        const { error } = await supabaseAny.from("security_policies").update(payload).eq("id", id);
        if (error) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Status updated", description: `Policy moved to ${formatLabel(status)}.` });
        void loadData();
    };

    const deletePolicy = async (id: string) => {
        if (!confirm("Are you sure you want to delete this policy?")) return;
        const { error } = await supabaseAny.from("security_policies").delete().eq("id", id);
        if (error) {
            toast({ title: "Delete failed", description: error.message, variant: "destructive" });
            return;
        }
        toast({ title: "Deleted", description: "Policy removed." });
        void loadData();
    };

    const bulkStatus = async (status: PolicyRow["status"]) => {
        if (!selectedIds.length) return;
        const payload: any = { status };
        if (status === "published") {
            payload.is_active = true;
            payload.approval_date = new Date().toISOString();
        }

        const { error } = await supabaseAny.from("security_policies").update(payload).in("id", selectedIds);
        if (error) {
            toast({ title: "Bulk action failed", description: error.message, variant: "destructive" });
            return;
        }
        setSelected({});
        toast({ title: "Bulk update successful", description: `${selectedIds.length} policies updated.` });
        void loadData();
    };

    return (
        <section className="space-y-4 p-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold">Policies Management</h1>
                    <p className="text-sm text-muted-foreground">Manage your information security policies and requirements.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export All
                    </Button>
                    <Button asChild>
                        <Link to="/admin/policies/new">
                            <Plus className="mr-2 h-4 w-4" /> Add New Policy
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 whitespace-nowrap">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                        <FolderTree className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.active}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.underReview}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-destructive">Overdue for Review</CardTitle>
                        <BarChart3 className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="space-y-4 p-5">
                    {/* Filters */}
                    <div className="grid gap-3 lg:grid-cols-6">
                        <Input className="lg:col-span-2" placeholder="Search policy name..." value={search} onChange={(event) => setSearch(event.target.value)} />

                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Policy Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {policyTypes.map((t) => (
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

                        <Select value={overdueFilter} onValueChange={setOverdueFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Review Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="overdue">Overdue Only</SelectItem>
                                <SelectItem value="on_track">On Track</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="date">Sort by Last Updated</SelectItem>
                                <SelectItem value="name">Sort by Name</SelectItem>
                                <SelectItem value="review_date">Sort by Review Date</SelectItem>
                                <SelectItem value="status">Sort by Status</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => void bulkStatus("published")} disabled={!selectedIds.length}>
                            Publish Selected
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => void bulkStatus("under_review")} disabled={!selectedIds.length}>
                            Review Selected
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
                                    <th className="p-3 w-10">
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
                                    <th className="p-3 font-medium">Policy Name</th>
                                    <th className="p-3 font-medium">Type</th>
                                    <th className="p-3 font-medium">Version</th>
                                    <th className="p-3 font-medium">Status</th>
                                    <th className="p-3 font-medium">Active</th>
                                    <th className="p-3 font-medium">Next Review</th>
                                    <th className="p-3 font-medium">Owner</th>
                                    <th className="p-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {pageItems.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center text-muted-foreground">
                                            No policies found.
                                        </td>
                                    </tr>
                                ) : (
                                    pageItems.map((policy) => (
                                        <tr key={policy.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(selected[policy.id])}
                                                    onChange={(event) => setSelected((prev) => ({ ...prev, [policy.id]: event.target.checked }))}
                                                    className="rounded border-border"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div>
                                                    <Link to={`/admin/policies/edit/${policy.id}`} className="font-medium text-foreground hover:underline line-clamp-1">
                                                        {policy.policy_name}
                                                    </Link>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">/{policy.slug}</p>
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                <Badge variant="outline" className="whitespace-nowrap bg-secondary/30">
                                                    {formatLabel(policy.policy_type)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                v{policy.version}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={policy.status === "published" ? "default" : policy.status === "draft" ? "secondary" : "outline"}
                                                >
                                                    {formatLabel(policy.status)}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <Switch
                                                    checked={policy.is_active}
                                                    onCheckedChange={(val) => void toggleProperty(policy.id, "is_active", val)}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <span className={isOverdue(policy.next_review_date) ? "text-destructive font-medium" : ""}>
                                                    {formatDate(policy.next_review_date)}
                                                </span>
                                            </td>
                                            <td className="p-3 text-muted-foreground">{policy.owner || "-"}</td>
                                            <td className="p-3 text-right">
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
                                                            <Link to={`/admin/policies/edit/${policy.id}`}>
                                                                <Pencil className="mr-2 h-4 w-4" /> Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/policies/${policy.slug}`} target="_blank">
                                                                <Eye className="mr-2 h-4 w-4" /> View Public
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => void setStatus(policy.id, policy.status === "published" ? "draft" : "published")}
                                                        >
                                                            {policy.status === "published" ? "Unpublish" : "Publish"}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => void setStatus(policy.id, "under_review")}>
                                                            Send for Review
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive" onClick={() => void deletePolicy(policy.id)}>
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
                                <p className="text-muted-foreground">Rows</p>
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
}
