import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Eye, Shield, Tag, Clock, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/blog";

const supabaseAny = supabase as any;

type EditorState = {
    policy_name: string;
    slug: string;
    description: string;
    policy_type: string;
    purpose: string;
    scope: string;
    owner: string;
    version: string;
    status: "draft" | "under_review" | "published" | "archived";
    is_active: boolean;
    effective_date: string;
    next_review_date: string;
    review_cycle: string;
    tags: string[];
};

const defaultState: EditorState = {
    policy_name: "",
    slug: "",
    description: "",
    policy_type: "access_control",
    purpose: "",
    scope: "",
    owner: "",
    version: "1.0",
    status: "draft",
    is_active: false,
    effective_date: "",
    next_review_date: "",
    review_cycle: "annual",
    tags: [],
};

const policyTypes = [
    { value: "access_control", label: "Access Control" },
    { value: "password", label: "Password Policy" },
    { value: "data_classification", label: "Data Classification" },
    { value: "incident_response", label: "Incident Response" },
    { value: "acceptable_use", label: "Acceptable Use" },
    { value: "byod", label: "BYOD" },
    { value: "backup", label: "Backup & Recovery" },
    { value: "encryption", label: "Cryptography/Encryption" },
    { value: "remote_access", label: "Remote Access" },
    { value: "vendor_management", label: "Vendor Management" },
];

export default function AdminPolicyEditor() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [state, setState] = useState<EditorState>(defaultState);
    const [policyId, setPolicyId] = useState<string | null>(id || null);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);
    const saveInFlight = useRef(false);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            const { data, error } = await supabaseAny
                .from("security_policies")
                .select("*")
                .eq("id", id)
                .maybeSingle();

            if (error || !data) {
                toast({ title: "Error", description: "Failed to load policy.", variant: "destructive" });
                return;
            }

            setState({
                policy_name: data.policy_name || "",
                slug: data.slug || "",
                description: data.description || "",
                policy_type: data.policy_type || "access_control",
                purpose: data.purpose || "",
                scope: data.scope || "",
                owner: data.owner || "",
                version: data.version || "1.0",
                status: data.status || "draft",
                is_active: Boolean(data.is_active),
                effective_date: data.effective_date ? new Date(data.effective_date).toISOString().split('T')[0] : "",
                next_review_date: data.next_review_date ? new Date(data.next_review_date).toISOString().split('T')[0] : "",
                review_cycle: data.review_cycle || "annual",
                tags: data.tags || [],
            });
            setPolicyId(data.id);
        };

        void load();
    }, [id, toast]);

    useEffect(() => {
        if (slugTouched || isEdit) return;
        setState((prev) => ({ ...prev, slug: slugify(prev.policy_name) }));
    }, [state.policy_name, slugTouched, isEdit]);

    const setField = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
        setDirty(true);
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const savePolicy = async ({
        nextStatus,
        autosave,
    }: {
        nextStatus?: EditorState["status"];
        autosave?: boolean;
    } = {}) => {
        if (!user?.id || saveInFlight.current) return;

        if (!state.policy_name || !state.slug || !state.policy_type) {
            if (!autosave) toast({ title: "Validation failed", description: "Policy Name, slug, and type are required.", variant: "destructive" });
            return;
        }

        saveInFlight.current = true;
        setSaving(true);

        const status = nextStatus || state.status;
        const payload: Record<string, unknown> = {
            policy_name: state.policy_name.trim(),
            slug: slugify(state.slug),
            description: state.description.trim() || null,
            policy_type: state.policy_type,
            purpose: state.purpose.trim() || null,
            scope: state.scope.trim() || null,
            owner: state.owner.trim() || null,
            version: state.version.trim() || "1.0",
            status,
            is_active: state.is_active,
            review_cycle: state.review_cycle,
            tags: state.tags,
        };

        if (state.effective_date) payload.effective_date = new Date(state.effective_date).toISOString();
        if (state.next_review_date) payload.next_review_date = new Date(state.next_review_date).toISOString();

        if (status === "published" && state.status !== "published") {
            payload.approval_date = new Date().toISOString();
            payload.is_active = true;
        }

        let currentId = policyId;

        if (currentId) {
            const { error } = await supabaseAny.from("security_policies").update(payload).eq("id", currentId);
            if (error) {
                toast({ title: "Save failed", description: error.message, variant: "destructive" });
                setSaving(false);
                saveInFlight.current = false;
                return;
            }
        } else {
            const { data, error } = await supabaseAny.from("security_policies").insert([payload]).select("id").maybeSingle();
            if (error || !data?.id) {
                toast({ title: "Create failed", description: error?.message || "Could not create policy.", variant: "destructive" });
                setSaving(false);
                saveInFlight.current = false;
                return;
            }
            currentId = data.id as string;
            setPolicyId(currentId);
            navigate(`/admin/policies/edit/${currentId}`, { replace: true });
        }

        setDirty(false);
        setSaving(false);
        saveInFlight.current = false;

        const nowText = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        toast({
            title: autosave ? `Autosaved at ${nowText}` : "Saved",
            description: autosave ? "Draft updated." : `Policy saved as ${status}.`,
        });
    };

    useEffect(() => {
        const timer = window.setInterval(() => {
            if (!dirty) return;
            void savePolicy({ autosave: true });
        }, 60000); // 1-minute autosave
        return () => window.clearInterval(timer);
    }, [dirty, state, policyId, user?.id]);

    return (
        <section className="space-y-6 p-4 md:p-8 pb-24 max-w-7xl mx-auto">
            {/* Sticky Top Bar Actions */}
            <header className="surface-card sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 p-4 shadow-sm border rounded-lg bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                        <Link to="/admin/policies">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold">{isEdit ? "Edit Policy" : "Create New Policy"}</h1>
                        <p className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={() => void savePolicy({ nextStatus: "draft" })} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button variant="secondary" asChild disabled={!state.slug}>
                        <a href={`/policies/${state.slug}`} target="_blank" rel="noreferrer">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </a>
                    </Button>
                    <Button onClick={() => void savePolicy({ nextStatus: state.status === "draft" ? "published" : state.status })} disabled={saving}>
                        {isEdit ? "Update Policy" : "Publish Policy"}
                    </Button>
                </div>
            </header>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">
                {/* LEFT COLUMN - MAIN CONTENT (70%) */}
                <div className="space-y-6 lg:col-span-8">

                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Policy Header
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="policy_name">Policy Name *</Label>
                                    <Input id="policy_name" value={state.policy_name} onChange={(event) => setField("policy_name", event.target.value)} placeholder="e.g. Identity and Access Management Policy" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="policy_type">Policy Type *</Label>
                                    <Select value={state.policy_type} onValueChange={(value) => setField("policy_type", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {policyTypes.map((pt) => (
                                                <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <div className="flex bg-muted rounded-md relative text-muted-foreground">
                                    <span className="flex items-center px-3 border border-r-0 rounded-l-md text-sm whitespace-nowrap bg-secondary">
                                        /policies/
                                    </span>
                                    <Input
                                        id="slug"
                                        className="rounded-l-none"
                                        value={state.slug}
                                        onChange={(event) => {
                                            setSlugTouched(true);
                                            setField("slug", event.target.value);
                                        }}
                                        placeholder="policy-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description / Abstract</Label>
                                <Textarea id="description" value={state.description} onChange={(event) => setField("description", event.target.value)} rows={2} placeholder="Brief summary of this policy..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Purpose & Scope */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                Purpose, Scope & Fundamentals
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="purpose" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="purpose">Purpose</TabsTrigger>
                                    <TabsTrigger value="scope">Scope & Applicability</TabsTrigger>
                                </TabsList>
                                <TabsContent value="purpose" className="mt-4 space-y-2">
                                    <Label className="sr-only">Purpose</Label>
                                    <Textarea value={state.purpose} onChange={(e) => setField("purpose", e.target.value)} rows={6} placeholder="Why does this policy exist? What is the objective?" />
                                </TabsContent>
                                <TabsContent value="scope" className="mt-4 space-y-2">
                                    <Label className="sr-only">Scope</Label>
                                    <Textarea value={state.scope} onChange={(e) => setField("scope", e.target.value)} rows={6} placeholder="Who and what does this policy apply to? Are there any exceptions?" />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Policy Sections (Placeholder for upcoming builder) */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Policy Sections Builder</CardTitle>
                            <CardDescription>Define the hierarchical sections and requirements of this policy.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border p-8 text-center bg-muted/50 border-dashed">
                                <p className="text-muted-foreground mb-4">Section builder and requirement tracker are coming soon.</p>
                                <p className="text-sm max-w-md mx-auto">This tool will allow you to drag-and-drop sections, add rich text content, and tag specific statements as compliance "Requirements" to be tracked across the organization.</p>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT COLUMN - SETTINGS (30%) */}
                <div className="space-y-6 lg:col-span-4">

                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Workflow</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Document Status</Label>
                                <Select value={state.status} onValueChange={(v) => setField("status", v as EditorState["status"])}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="published">Published / Approved</SelectItem>
                                        <SelectItem value="archived">Archived / Deprecated</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="space-y-0.5">
                                    <Label>Active & Enforced</Label>
                                    <p className="text-xs text-muted-foreground">Is this policy currently in effect?</p>
                                </div>
                                <Switch checked={state.is_active} onCheckedChange={(v) => setField("is_active", v)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ownership & Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Policy Owner / Author</Label>
                                <Input value={state.owner} onChange={(e) => setField("owner", e.target.value)} placeholder="e.g. CISO, IT Director" />
                            </div>
                            <div className="space-y-2">
                                <Label>Version</Label>
                                <Input value={state.version} onChange={(e) => setField("version", e.target.value)} placeholder="1.0" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Tag className="h-3 w-3" /> Tags</Label>
                                <Input
                                    value={state.tags.join(", ")}
                                    onChange={(e) => setField("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                                    placeholder="ISO27001, Access, HR..."
                                />
                                <p className="text-xs text-muted-foreground">Comma separated</p>
                            </div>

                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Effective Date</Label>
                                <Input type="date" value={state.effective_date} onChange={(e) => setField("effective_date", e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Clock className="h-3 w-3" /> Review Cycle</Label>
                                <Select value={state.review_cycle} onValueChange={(v) => setField("review_cycle", v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="monthly">Monthly</SelectItem>
                                        <SelectItem value="quarterly">Quarterly</SelectItem>
                                        <SelectItem value="biannual">Bi-Annually</SelectItem>
                                        <SelectItem value="annual">Annually</SelectItem>
                                        <SelectItem value="biennial">Every 2 Years</SelectItem>
                                        <SelectItem value="ad_hoc">Ad Hoc / As Needed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-primary">Next Review Date</Label>
                                <Input type="date" value={state.next_review_date} onChange={(e) => setField("next_review_date", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    );
}
