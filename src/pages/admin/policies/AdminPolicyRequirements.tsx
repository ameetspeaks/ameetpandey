import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Filter, Search, MoreHorizontal, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Mock Data for the Requirements Tracker
const mockRequirements = [
    {
        id: "REQ-001",
        policyName: "Access Control Policy",
        policyId: "1",
        statement: "All employee passwords must be a minimum of 14 characters.",
        status: "compliant",
        verificationMethod: "Automated (Active Directory)",
        lastVerified: "2023-10-15",
        owner: "IT Operations",
    },
    {
        id: "REQ-002",
        policyName: "Access Control Policy",
        policyId: "1",
        statement: "MFA is required for all remote access connections.",
        status: "compliant",
        verificationMethod: "Automated (Okta)",
        lastVerified: "2023-10-15",
        owner: "IT Security",
    },
    {
        id: "REQ-003",
        policyName: "Data Classification Policy",
        policyId: "2",
        statement: "Confidential data must be encrypted at rest using AES-256.",
        status: "partial",
        verificationMethod: "Manual Audit",
        lastVerified: "2023-09-01",
        owner: "Data Governance",
    },
    {
        id: "REQ-004",
        policyName: "Incident Response Plan",
        policyId: "3",
        statement: "IR team must acknowledge Critical severity incidents within 15 minutes.",
        status: "non_compliant",
        verificationMethod: "Monthly Metric Review",
        lastVerified: "2023-11-01",
        owner: "SOC Team",
    },
    {
        id: "REQ-005",
        policyName: "Vendor Management",
        policyId: "4",
        statement: "High-risk vendors require an annual SOC 2 Type II review.",
        status: "untested",
        verificationMethod: "Manual Review",
        lastVerified: null,
        owner: "Procurement",
    },
];

const statusStyles = {
    compliant: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    partial: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    non_compliant: "bg-red-500/10 text-red-500 border-red-500/20",
    untested: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
};

export default function AdminPolicyRequirements() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const filtered = useMemo(() => {
        return mockRequirements.filter((req) => {
            const matchesSearch = req.statement.toLowerCase().includes(search.toLowerCase()) || req.policyName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "all" || req.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter]);

    return (
        <section className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Policy Requirements Tracker</h2>
                    <p className="text-muted-foreground">Monitor compliance against individual policy statements.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4 whitespace-nowrap">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Tracked</h3>
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold">{mockRequirements.length}</div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Compliant</h3>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-bold text-emerald-500">
                        {mockRequirements.filter(r => r.status === 'compliant').length}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Partial / Non-Compliant</h3>
                        <ShieldAlert className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div className="text-2xl font-bold text-yellow-500">
                        {mockRequirements.filter(r => r.status === 'partial' || r.status === 'non_compliant').length}
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Untested</h3>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-2xl font-bold text-muted-foreground">
                        {mockRequirements.filter(r => r.status === 'untested').length}
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="p-4 flex flex-wrap gap-4 border-b bg-muted/20">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search requirements..."
                            className="pl-8"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="compliant">Compliant</SelectItem>
                            <SelectItem value="partial">Partial</SelectItem>
                            <SelectItem value="non_compliant">Non-Compliant</SelectItem>
                            <SelectItem value="untested">Untested</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40 text-left">
                            <tr>
                                <th className="p-4 font-medium text-muted-foreground w-24">ID</th>
                                <th className="p-4 font-medium text-muted-foreground min-w-[300px]">Requirement Statement</th>
                                <th className="p-4 font-medium text-muted-foreground">Source Policy</th>
                                <th className="p-4 font-medium text-muted-foreground">Status</th>
                                <th className="p-4 font-medium text-muted-foreground">Owner</th>
                                <th className="p-4 font-medium text-muted-foreground">Last Verified</th>
                                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No requirements found matching filters.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/30">
                                        <td className="p-4 font-medium">{req.id}</td>
                                        <td className="p-4 leading-snug">{req.statement}</td>
                                        <td className="p-4">
                                            <Link to={`/admin/policies/edit/${req.policyId}`} className="text-primary hover:underline">
                                                {req.policyName}
                                            </Link>
                                        </td>
                                        <td className="p-4">
                                            <Badge variant="outline" className={statusStyles[req.status as keyof typeof statusStyles]}>
                                                {req.status === 'non_compliant' ? 'Non-Compliant' :
                                                    req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{req.owner}</td>
                                        <td className="p-4 text-muted-foreground">{req.lastVerified || "Never"}</td>
                                        <td className="p-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                                                    <DropdownMenuItem>View Evidence</DropdownMenuItem>
                                                    <DropdownMenuItem>Assign Owner</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem asChild>
                                                        <Link to={`/admin/policies/edit/${req.policyId}`}>
                                                            Go to Policy
                                                        </Link>
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
            </div>
        </section>
    );
}
