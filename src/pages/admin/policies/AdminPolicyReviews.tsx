import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Filter, Search, Calendar, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data for the Review Schedule
const mockReviews = [
    {
        id: "1",
        policyName: "Access Control Policy",
        version: "1.2",
        status: "published",
        owner: "IT Operations",
        lastReviewed: "2022-10-15",
        nextReview: "2023-10-15", // Overdue
        reviewCycle: "annual",
    },
    {
        id: "2",
        policyName: "Data Classification Policy",
        version: "2.0",
        status: "published",
        owner: "Data Governance",
        lastReviewed: "2023-01-10",
        nextReview: "2024-01-10", // Upcoming
        reviewCycle: "annual",
    },
    {
        id: "3",
        policyName: "Incident Response Plan",
        version: "3.1",
        status: "under_review",
        owner: "SOC Team",
        lastReviewed: "2023-05-20",
        nextReview: "2023-11-20", // Review in progress
        reviewCycle: "biannual",
    },
    {
        id: "4",
        policyName: "Vendor Management",
        version: "1.0",
        status: "published",
        owner: "Procurement",
        lastReviewed: "2023-08-01",
        nextReview: "2024-08-01", // On Track
        reviewCycle: "annual",
    },
    {
        id: "5",
        policyName: "Acceptable Use Policy",
        version: "4.0",
        status: "published",
        owner: "HR",
        lastReviewed: "2021-06-01",
        nextReview: "2022-06-01", // Very Overdue
        reviewCycle: "annual",
    },
];

const getReviewStatus = (nextReview: string, status: string) => {
    if (status === "under_review") return "in_progress";

    const next = new Date(nextReview);
    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    if (next < today) return "overdue";
    if (next <= thirtyDays) return "upcoming";
    return "on_track";
};

const statusStyles = {
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    upcoming: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    in_progress: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    on_track: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

const statusLabels = {
    overdue: "Overdue",
    upcoming: "Due < 30 Days",
    in_progress: "Review in Progress",
    on_track: "On Track",
};

export default function AdminPolicyReviews() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const enrichedReviews = useMemo(() => {
        return mockReviews.map(r => ({
            ...r,
            computedStatus: getReviewStatus(r.nextReview, r.status)
        }));
    }, []);

    const filtered = useMemo(() => {
        return enrichedReviews.filter((review) => {
            const matchesSearch = review.policyName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || review.computedStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, enrichedReviews]);

    const stats = {
        total: enrichedReviews.length,
        overdue: enrichedReviews.filter(r => r.computedStatus === 'overdue').length,
        upcoming: enrichedReviews.filter(r => r.computedStatus === 'upcoming').length,
        inProgress: enrichedReviews.filter(r => r.computedStatus === 'in_progress').length,
    };

    return (
        <section className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Policy Review Schedule</h2>
                    <p className="text-muted-foreground">Manage periodic review cycles and overdue policies.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" /> Sync to Calendar
                    </Button>
                    <Button variant="default">
                        <Download className="mr-2 h-4 w-4" /> Export Schedule
                    </Button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 whitespace-nowrap">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-destructive">Overdue</h3>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-yellow-500">Due within 30 days</h3>
                        <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">{stats.upcoming}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-blue-500">Reviews in Progress</h3>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-blue-500">{stats.inProgress}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Tracked</h3>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{stats.total}</div>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="p-4 flex flex-wrap gap-4 border-b bg-muted/20">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search policies..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Review Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="upcoming">Due soon</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="on_track">On Track</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40 text-left">
                            <tr>
                                <th className="p-4 font-medium text-muted-foreground">Policy Name</th>
                                <th className="p-4 font-medium text-muted-foreground">Review Status</th>
                                <th className="p-4 font-medium text-muted-foreground">Next Review Date</th>
                                <th className="p-4 font-medium text-muted-foreground">Cycle</th>
                                <th className="p-4 font-medium text-muted-foreground">Owner</th>
                                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No reviews found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((review) => (
                                    <tr key={review.id} className="hover:bg-muted/30">
                                        <td className="p-4">
                                            <div>
                                                <Link to={`/admin/policies/edit/${review.id}`} className="font-medium text-primary hover:underline">
                                                    {review.policyName}
                                                </Link>
                                                <p className="text-xs text-muted-foreground">v{review.version}</p>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className={statusStyles[review.computedStatus as keyof typeof statusStyles]}>
                                                {statusLabels[review.computedStatus as keyof typeof statusLabels]}
                                            </Badge>
                                        </td>
                                        <td className="p-4 font-medium">
                                            <span className={review.computedStatus === 'overdue' ? 'text-destructive' : ''}>
                                                {review.nextReview}
                                            </span>
                                        </td>
                                        <td className="p-4 capitalize text-muted-foreground">
                                            {review.reviewCycle}
                                        </td>
                                        <td className="p-4 text-muted-foreground">{review.owner}</td>
                                        <td className="p-4 text-right">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/admin/policies/edit/${review.id}`}>
                                                    {review.computedStatus === 'in_progress' ? 'Continue Review' : 'Start Review'}
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
