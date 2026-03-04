import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Copy,
    Trash2,
    Globe,
    Shield,
    BookOpen,
    LayoutDashboard,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Info
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFrameworks, useUpdateFramework, useDeleteFramework } from "@/hooks/useFrameworks";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Framework } from "@/services/frameworks";

const AdminFrameworksList = () => {
    const { data: frameworks, isLoading, error } = useFrameworks();
    const updateFramework = useUpdateFramework();
    const deleteFramework = useDeleteFramework();

    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const filteredFrameworks = frameworks?.filter(fw => {
        const matchesSearch = fw.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fw.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fw.issuing_organization.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = typeFilter === "all" || fw.framework_type === typeFilter;
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" ? fw.is_active : !fw.is_active);

        return matchesSearch && matchesType && matchesStatus;
    });

    const handleToggleActive = (id: string, currentStatus: boolean | null) => {
        updateFramework.mutate({
            id,
            data: { is_active: !currentStatus }
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the ${name} framework? This will also delete all its domains and controls.`)) {
            deleteFramework.mutate(id);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "security_standard": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "compliance_framework": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "control_framework": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "risk_framework": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "audit_standard": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const formatType = (type: string) => {
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-lg border border-red-200">
                <h2 className="text-xl font-semibold text-red-800">Error loading frameworks</h2>
                <p className="text-red-600 mt-2">{(error as Error).message}</p>
                <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cybersecurity Frameworks</h1>
                    <p className="text-muted-foreground">
                        Manage and map industry-standard security frameworks.
                    </p>
                </div>
                <Button asChild className="md:w-auto w-full">
                    <Link to="/admin/frameworks/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Framework
                    </Link>
                </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-6 items-end">
                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, code, or organization..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Framework Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="security_standard">Security Standard</SelectItem>
                            <SelectItem value="compliance_framework">Compliance Framework</SelectItem>
                            <SelectItem value="control_framework">Control Framework</SelectItem>
                            <SelectItem value="risk_framework">Risk Framework</SelectItem>
                            <SelectItem value="audit_standard">Audit Standard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active Only</SelectItem>
                            <SelectItem value="inactive">Inactive Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden">
                            <CardHeader className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/3" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredFrameworks?.length === 0 ? (
                <div className="surface-card flex min-h-[300px] flex-col items-center justify-center p-8 text-center rounded-xl border-dashed border-2">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Plus className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-semibold">No frameworks found</h2>
                    <p className="mb-6 text-muted-foreground max-w-md">
                        {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                            ? "Try adjusting your filters to find what you're looking for."
                            : "Start by adding a new framework like ISO 27001, NIST CSF, or SOC 2."}
                    </p>
                    {(searchQuery || typeFilter !== "all" || statusFilter !== "all") ? (
                        <Button variant="outline" onClick={() => {
                            setSearchQuery("");
                            setTypeFilter("all");
                            setStatusFilter("all");
                        }}>
                            Clear Filters
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link to="/admin/frameworks/new">Add Framework</Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFrameworks?.map((fw) => (
                        <Card key={fw.id} className="group overflow-hidden hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <Badge variant="outline" className={getTypeColor(fw.framework_type)}>
                                        {fw.code}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={!!fw.is_active}
                                            onCheckedChange={() => handleToggleActive(fw.id, fw.is_active)}
                                        />
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/frameworks/edit/${fw.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit Details
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/frameworks/domains?framework_id=${fw.id}`}>
                                                        <Shield className="mr-2 h-4 w-4" /> Manage Domains
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link to={`/admin/frameworks/controls?framework_id=${fw.id}`}>
                                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Manage Controls
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => toast.info("Duplicate coming soon")}>
                                                    <Copy className="mr-2 h-4 w-4" /> Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                                    onClick={() => handleDelete(fw.id, fw.name)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Framework
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                <CardTitle className="mt-2 line-clamp-1">{fw.name}</CardTitle>
                                <CardDescription className="line-clamp-2 mt-1">
                                    {fw.issuing_organization} • Version {fw.version || "1.0"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <Badge variant="secondary" className="font-normal">
                                        {formatType(fw.framework_type)}
                                    </Badge>
                                    {fw.certification_available && (
                                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-normal">
                                            Certification Available
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {fw.description}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-3 border-t bg-muted/30 flex justify-between items-center">
                                <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        <span>Domains</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        <span>Controls</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs">
                                    <Link to={`/admin/frameworks/edit/${fw.id}`}>
                                        View Details <ExternalLink className="ml-1 h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFrameworksList;
