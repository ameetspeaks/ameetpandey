import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Clock3, Plus, Save, Trash2, Eye, Layout, Settings, Link as LinkIcon } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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
import { RiskRegisterBuilder, type RiskEntry } from "@/components/admin/projects/RiskRegisterBuilder";

const supabaseAny = supabase as any;

type EditorState = {
    title: string;
    slug: string;
    project_type: string;
    short_description: string;
    objective: string;
    scope: string;
    timeline: string;
    methodology: string;
    status: "draft" | "under_review" | "published" | "archived";
    is_active: boolean;
    is_featured: boolean;
    featured_image_url: string;
    featured_image_alt: string;
    frameworks_used: string[];
    tools_used: string[];
    meta_title: string;
    meta_description: string;
    keywords: string;
    riskRegisters: RiskEntry[];
};

const defaultState: EditorState = {
    title: "",
    slug: "",
    project_type: "risk_assessment",
    short_description: "",
    objective: "",
    scope: "",
    timeline: "",
    methodology: "",
    status: "draft",
    is_active: false,
    is_featured: false,
    featured_image_url: "",
    featured_image_alt: "",
    frameworks_used: [],
    tools_used: [],
    meta_title: "",
    meta_description: "",
    keywords: "",
    riskRegisters: [],
};

const COMMON_FRAMEWORKS = [
    "ISO 27001", "ISO 27002", "NIST CSF", "NIST SP 800-53", "SOC 2", "CIS Controls", "PCI DSS", "GDPR", "HIPAA", "COBIT"
];

const AdminProjectEditor = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();

    const [state, setState] = useState<EditorState>(defaultState);
    const [projectId, setProjectId] = useState<string | null>(id || null);
    const [saving, setSaving] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [slugTouched, setSlugTouched] = useState(false);
    const saveInFlight = useRef(false);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            const { data, error } = await supabaseAny
                .from("projects")
                .select("*")
                .eq("id", id)
                .maybeSingle();

            if (error || !data) {
                toast({ title: "Error", description: "Failed to load project.", variant: "destructive" });
                return;
            }

            setState({
                title: data.title || "",
                slug: data.slug || "",
                project_type: data.project_type || "risk_assessment",
                short_description: data.short_description || "",
                objective: data.objective || "",
                scope: data.scope || "",
                timeline: data.timeline || "",
                methodology: data.methodology || "",
                status: data.status || "draft",
                is_active: Boolean(data.is_active),
                is_featured: Boolean(data.is_featured),
                featured_image_url: data.featured_image_url || "",
                featured_image_alt: data.featured_image_alt || "",
                frameworks_used: data.frameworks_used || [],
                tools_used: data.tools_used || [],
                meta_title: data.meta_title || "",
                meta_description: data.meta_description || "",
                keywords: (data.keywords || []).join(", "),
                riskRegisters: [], // Will load from related table later
            });
            setProjectId(data.id);
        };

        void load();
    }, [id, toast]);

    useEffect(() => {
        if (slugTouched) return;
        setState((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }, [state.title, slugTouched]);

    const setField = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
        setDirty(true);
        setState((prev) => ({ ...prev, [key]: value }));
    };

    const toggleFramework = (fw: string) => {
        setDirty(true);
        setState((prev) => {
            const isSelected = prev.frameworks_used.includes(fw);
            return {
                ...prev,
                frameworks_used: isSelected
                    ? prev.frameworks_used.filter((f) => f !== fw)
                    : [...prev.frameworks_used, fw],
            };
        });
    };

    const saveProject = async ({
        nextStatus,
        autosave,
    }: {
        nextStatus?: EditorState["status"];
        autosave?: boolean;
    } = {}) => {
        if (!user?.id || saveInFlight.current) return;

        // Basic validation
        if (!state.title || !state.slug || !state.project_type) {
            if (!autosave) toast({ title: "Validation failed", description: "Title, slug, and project type are required.", variant: "destructive" });
            return;
        }

        saveInFlight.current = true;
        setSaving(true);

        const status = nextStatus || state.status;
        const payload: Record<string, unknown> = {
            title: state.title.trim(),
            slug: slugify(state.slug),
            project_type: state.project_type,
            short_description: state.short_description.trim() || null,
            objective: state.objective.trim() || null,
            scope: state.scope.trim() || null,
            timeline: state.timeline.trim() || null,
            methodology: state.methodology.trim() || null,
            status,
            is_active: state.is_active,
            is_featured: state.is_featured,
            featured_image_url: state.featured_image_url.trim() || null,
            featured_image_alt: state.featured_image_alt.trim() || null,
            frameworks_used: state.frameworks_used,
            tools_used: state.tools_used.length ? state.tools_used : [], // Not fully implemented tools tagger yet
            meta_title: state.meta_title.trim() || null,
            meta_description: state.meta_description.trim() || null,
            keywords: state.keywords.split(",").map((k) => k.trim()).filter(Boolean),
            created_by: user.id
        };

        if (status === "published" && state.status !== "published") {
            payload.published_date = new Date().toISOString();
            payload.is_active = true;
        }
        payload.last_modified_date = new Date().toISOString();

        let currentId = projectId;

        if (currentId) {
            const { error } = await supabaseAny.from("projects").update(payload).eq("id", currentId);
            if (error) {
                toast({ title: "Save failed", description: error.message, variant: "destructive" });
                setSaving(false);
                saveInFlight.current = false;
                return;
            }
        } else {
            const { data, error } = await supabaseAny.from("projects").insert(payload).select("id").maybeSingle();
            if (error || !data?.id) {
                toast({ title: "Create failed", description: error?.message || "Could not create project.", variant: "destructive" });
                setSaving(false);
                saveInFlight.current = false;
                return;
            }
            currentId = data.id as string;
            setProjectId(currentId);
            navigate(`/admin/projects/edit/${currentId}`, { replace: true });
        }

        setDirty(false);
        setSaving(false);
        saveInFlight.current = false;

        const nowText = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        toast({
            title: autosave ? `Autosaved at ${nowText}` : "Saved",
            description: autosave ? "Draft updated." : `Project saved as ${status}.`,
        });
    };

    useEffect(() => {
        const timer = window.setInterval(() => {
            if (!dirty) return;
            void saveProject({ autosave: true });
        }, 60000);
        return () => window.clearInterval(timer);
    }, [dirty, state, projectId, user?.id]);


    return (
        <section className="space-y-6 p-6 pb-24">
            {/* Sticky Top Bar Actions */}
            <header className="surface-card sticky top-4 z-20 flex flex-wrap items-center justify-between gap-3 p-4 shadow-sm border rounded-lg bg-background">
                <div>
                    <h1 className="text-xl font-bold">{isEdit ? "Edit Project" : "Create New Project"}</h1>
                    <p className="text-sm text-muted-foreground">{dirty ? "Unsaved changes" : "All changes saved"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={() => void saveProject({ nextStatus: "draft" })} disabled={saving}>
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button variant="secondary" asChild disabled={!state.slug}>
                        <a href={`/projects/${state.slug}`} target="_blank" rel="noreferrer">
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </a>
                    </Button>
                    <Button onClick={() => void saveProject({ nextStatus: state.status === "draft" ? "published" : state.status })} disabled={saving}>
                        {isEdit ? "Update Project" : "Publish Project"}
                    </Button>
                    {isEdit && (
                        <Button variant="destructive" size="icon" onClick={() => { }}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </header>

            {/* 3-Column Layout */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-12">

                {/* LEFT COLUMN - MAIN CONTENT (60%) */}
                <div className="space-y-6 lg:col-span-8">

                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title *</Label>
                                    <Input id="title" value={state.title} onChange={(event) => setField("title", event.target.value)} placeholder="e.g. ISO 27001 Implementation for Acme Corp" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project_type">Project Type *</Label>
                                    <Select value={state.project_type} onValueChange={(value) => setField("project_type", value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="risk_assessment">Risk Assessment</SelectItem>
                                            <SelectItem value="it_audit">IT Security Audit</SelectItem>
                                            <SelectItem value="vendor_assessment">Vendor Security Assessment</SelectItem>
                                            <SelectItem value="compliance_mapping">Compliance Mapping</SelectItem>
                                            <SelectItem value="policy_development">Policy Development</SelectItem>
                                            <SelectItem value="framework_implementation">Framework Implementation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">URL Slug</Label>
                                <div className="flex bg-muted rounded-md relative text-muted-foreground">
                                    <span className="flex items-center px-3 border border-r-0 rounded-l-md text-sm whitespace-nowrap bg-secondary">
                                        /projects/
                                    </span>
                                    <Input
                                        id="slug"
                                        className="rounded-l-none"
                                        value={state.slug}
                                        onChange={(event) => {
                                            setSlugTouched(true);
                                            setField("slug", event.target.value);
                                        }}
                                        placeholder="project-slug"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="short_desc">Short Description</Label>
                                <Textarea id="short_desc" value={state.short_description} onChange={(event) => setField("short_description", event.target.value)} rows={3} placeholder="Brief summary for project cards..." />
                                <p className="text-xs text-muted-foreground text-right">{state.short_description.length}/300 characters</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="p-0 border-b">
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="w-full justify-start rounded-none bg-transparent border-b">
                                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Overview</TabsTrigger>
                                    <TabsTrigger value="methodology" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Methodology</TabsTrigger>
                                    <TabsTrigger value="findings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Analysis & Findings</TabsTrigger>
                                    <TabsTrigger value="recommendations" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Recommendations</TabsTrigger>
                                    <TabsTrigger value="conclusion" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none">Conclusion</TabsTrigger>
                                </TabsList>

                                <div className="p-5">
                                    <TabsContent value="overview" className="space-y-4 m-0">
                                        <div className="space-y-2">
                                            <Label>Objective</Label>
                                            <Textarea value={state.objective} onChange={(e) => setField("objective", e.target.value)} rows={4} placeholder="What was the purpose? What problem was solved?" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Scope</Label>
                                            <Textarea value={state.scope} onChange={(e) => setField("scope", e.target.value)} rows={4} placeholder="Systems/assets covered, boundaries, exclusions..." />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Timeline / Duration</Label>
                                            <Input value={state.timeline} onChange={(e) => setField("timeline", e.target.value)} placeholder="e.g. 6 weeks, Q3 2023" />
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="methodology" className="space-y-4 m-0">
                                        <div className="space-y-2">
                                            <Label>Methodology Summary</Label>
                                            <Textarea value={state.methodology} onChange={(e) => setField("methodology", e.target.value)} rows={6} placeholder="Describe the approach taken..." />
                                        </div>
                                        <div className="p-4 border border-dashed rounded-md bg-secondary/20 text-center">
                                            <p className="text-sm text-muted-foreground">Additional structured methodology steps will be saved in project_sections (Feature to be added).</p>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="findings" className="space-y-4 m-0">
                                        <div className="p-4 border border-dashed rounded-md bg-secondary/20 text-center">
                                            <p className="text-sm text-muted-foreground mb-4">Add structured findings to this project.</p>
                                            <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Finding Block</Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="recommendations" className="space-y-4 m-0">
                                        <div className="p-4 border border-dashed rounded-md bg-secondary/20 text-center">
                                            <p className="text-sm text-muted-foreground mb-4">Add structured recommendations with priorities.</p>
                                            <Button variant="outline" size="sm"><Plus className="mr-2 h-4 w-4" /> Add Recommendation</Button>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="conclusion" className="space-y-4 m-0">
                                        <div className="p-4 border border-dashed rounded-md bg-secondary/20 text-center">
                                            <p className="text-sm text-muted-foreground mb-4">Conclusion rich text editor placeholder.</p>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle>Data Tables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {state.project_type === "risk_assessment" || state.project_type === "it_audit" ? (
                                <RiskRegisterBuilder
                                    entries={state.riskRegisters}
                                    onChange={(entries) => setField("riskRegisters", entries)}
                                />
                            ) : (
                                <div className="p-8 border border-dashed rounded-md bg-secondary/20 text-center">
                                    <Layout className="mx-auto h-8 w-8 text-muted-foreground mb-3 opacity-50" />
                                    <h3 className="font-medium">No Data Tables Available</h3>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                                        Data tables like Risk Registers are available for specific project types (e.g. Risk Assessment).
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>


                {/* MIDDLE COLUMN - SETTINGS & META (30%) Approx col-span-4 based on 12-col grid */}
                <div className="space-y-6 lg:col-span-3">

                    <Card>
                        <CardHeader>
                            <CardTitle>Publish Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={state.status} onValueChange={(v) => setField("status", v as EditorState["status"])}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Active Project</Label>
                                    <p className="text-xs text-muted-foreground">Show on frontend</p>
                                </div>
                                <Switch checked={state.is_active} onCheckedChange={(v) => setField("is_active", v)} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Featured</Label>
                                    <p className="text-xs text-muted-foreground">Pin to homepage</p>
                                </div>
                                <Switch checked={state.is_featured} onCheckedChange={(v) => setField("is_featured", v)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Featured Image</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {state.featured_image_url ? (
                                <div className="relative rounded-md overflow-hidden aspect-video border group">
                                    <img src={state.featured_image_url} alt="" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => setField("featured_image_url", "")}>Remove</Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-md border border-dashed flex items-center justify-center bg-secondary/50">
                                    <span className="text-sm text-muted-foreground">No image selected</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Image URL</Label>
                                <div className="flex gap-2">
                                    <Input value={state.featured_image_url} onChange={(e) => setField("featured_image_url", e.target.value)} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Alt Text</Label>
                                <Input value={state.featured_image_alt} onChange={(e) => setField("featured_image_alt", e.target.value)} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Frameworks Used</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {COMMON_FRAMEWORKS.map((fw) => (
                                    <div key={fw} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`fw-${fw}`}
                                            className="rounded border-gray-300"
                                            checked={state.frameworks_used.includes(fw)}
                                            onChange={() => toggleFramework(fw)}
                                        />
                                        <label htmlFor={`fw-${fw}`} className="text-sm font-medium leading-none cursor-pointer">
                                            {fw}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT COLUMN - SEO & ADVANCED (10%) Approx col-span-1 based on layout but might just fold into bottom for now or make grid bigger */}
                <div className="space-y-6 lg:col-span-1 hidden xl:block">
                    {/* We can merge SEO into Middle column if screen is too small, currently just a placeholder here */}
                </div>

            </div>
        </section>
    );
};

export default AdminProjectEditor;
