```
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    ChevronLeft, 
    Save, 
    Shield, 
    Link as LinkIcon, 
    Info, 
    Calendar, 
    CheckCircle2, 
    Layers, 
    Users, 
    Globe,
    BookOpen,
    Download,
    GraduationCap,
    Star
} from "lucide-react";
import { Link } from "react-router-dom";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFramework, useCreateFramework, useUpdateFramework } from "@/hooks/useFrameworks";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const frameworkSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    code: z.string().min(2, "Code must be at least 2 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters"),
    issuing_organization: z.string().min(2, "Issuing organization is required"),
    version: z.string().nullable().optional(),
    publication_date: z.string().nullable().optional(),
    framework_type: z.enum(["security_standard", "compliance_framework", "control_framework", "risk_framework", "audit_standard"]),
    primary_focus_areas: z.array(z.string()).nullable().optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    purpose_statement: z.string().nullable().optional(),
    scope: z.string().nullable().optional(),
    key_benefits: z.string().nullable().optional(),
    certification_available: z.boolean().default(false),
    certification_body: z.string().nullable().optional(),
    implementation_complexity: z.enum(["low", "medium", "high"]).nullable().optional(),
    typical_implementation_time: z.string().nullable().optional(),
    target_organization_sizes: z.array(z.string()).nullable().optional(),
    target_industries: z.array(z.string()).nullable().optional(),
    official_website_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")).optional(),
    documentation_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")).optional(),
    purchase_download_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")).optional(),
    training_resources_url: z.string().url("Must be a valid URL").nullable().or(z.literal("")).optional(),
    is_active: z.boolean().default(true),
    is_public: z.boolean().default(true),
    is_featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof frameworkSchema>;

const AdminFrameworkEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const { data: framework, isLoading } = useFramework(id || null);
    const createMutation = useCreateFramework();
    const updateMutation = useUpdateFramework();

    const form = useForm<FormValues>({
        resolver: zodResolver(frameworkSchema),
        defaultValues: {
            name: "",
            code: "",
            slug: "",
            issuing_organization: "",
            version: "",
            publication_date: "",
            framework_type: "security_standard",
            primary_focus_areas: [],
            description: "",
            purpose_statement: "",
            scope: "",
            key_benefits: "",
            certification_available: false,
            certification_body: "",
            implementation_complexity: "medium",
            typical_implementation_time: "",
            target_organization_sizes: [],
            target_industries: [],
            official_website_url: "",
            documentation_url: "",
            purchase_download_url: "",
            training_resources_url: "",
            is_active: true,
            is_public: true,
            is_featured: false,
        },
    });

    useEffect(() => {
        if (framework) {
            form.reset({
                ...framework,
                version: framework.version || "",
                publication_date: framework.publication_date || "",
                purpose_statement: framework.purpose_statement || "",
                scope: framework.scope || "",
                key_benefits: framework.key_benefits || "",
                certification_body: framework.certification_body || "",
                typical_implementation_time: framework.typical_implementation_time || "",
                official_website_url: framework.official_website_url || "",
                documentation_url: framework.documentation_url || "",
                purchase_download_url: framework.purchase_download_url || "",
                training_resources_url: framework.training_resources_url || "",
                is_active: !!framework.is_active,
                is_public: !!framework.is_public,
                is_featured: !!framework.is_featured,
                certification_available: !!framework.certification_available,
            });
        }
    }, [framework, form]);

    const onSubmit = (values: FormValues) => {
        // Clean up empty strings to null for optional fields
        const cleanedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => [
                key, 
                value === "" ? null : value
            ])
        ) as FormValues;

        if (isEditing) {
            updateMutation.mutate({ id: id as string, data: cleanedValues }, {
                onSuccess: () => navigate("/admin/frameworks"),
            });
        } else {
            createMutation.mutate(cleanedValues, {
                onSuccess: () => navigate("/admin/frameworks"),
            });
        }
    };

    // Auto-generate slug from name
    const watchName = form.watch("name");
    useEffect(() => {
        if (!isEditing && watchName) {
            const slug = watchName
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            form.setValue("slug", slug, { shouldValidate: true });
        }
    }, [watchName, isEditing, form]);

    if (isLoading && isEditing) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto mb-10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link to="/admin/frameworks">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {isEditing ? `Edit ${ framework?.code || "Framework" } ` : "Add New Framework"}
                        </h1>
                        <p className="text-muted-foreground">
                            {isEditing ? "Update framework details and metadata." : "Define a new cybersecurity framework standard."}
                        </p>
                    </div>
                </div>
                <Button onClick={form.handleSubmit(onSubmit)} className="hidden md:flex">
                    <Save className="mr-2 h-4 w-4" />
                    {isEditing ? "Update Framework" : "Save Framework"}
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Areas */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-primary" />
                                        Framework Identity
                                    </CardTitle>
                                    <CardDescription>Core identifying information for the framework.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Framework Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. ISO/IEC 27001:2022" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Framework Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. ISO-27001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="slug"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>URL Slug</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="iso-27001" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="issuing_organization"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Issuing Organization</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. ISO/IEC" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                        Description & Purpose
                                    </CardTitle>
                                    <CardDescription>Explain what this framework is and why it exists.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Short Description</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="Provide a concise overview of the framework..." 
                                                        className="min-h-[100px]"
                                                        {...field} 
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="purpose_statement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Purpose Statement</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="What is the primary objective of this framework?" 
                                                        {...field} 
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        Scope & Key Benefits
                                    </CardTitle>
                                    <CardDescription>Define the boundaries and value proposition.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="scope"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Applicability Scope</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="What organizations or systems is this intended for?" 
                                                        {...field} 
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="key_benefits"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Key Benefits</FormLabel>
                                                <FormControl>
                                                    <Textarea 
                                                        placeholder="List the main advantages of implementing this standard..." 
                                                        {...field} 
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-primary" />
                                        Implementation Details
                                    </CardTitle>
                                    <CardDescription>Practical guidance for adoption.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="implementation_complexity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Implementation Complexity</FormLabel>
                                                    <Select 
                                                        onValueChange={field.onChange} 
                                                        defaultValue={field.value || "medium"}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select complexity" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="low">Low</SelectItem>
                                                            <SelectItem value="medium">Medium</SelectItem>
                                                            <SelectItem value="high">High</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="typical_implementation_time"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Typical Implementation Time</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. 6-12 months" {...field} value={field.value || ""} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="certification_available"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Certification Available</FormLabel>
                                                        <FormDescription className="text-xs">
                                                            Does this framework offer formal certification?
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="certification_body"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Certification Body</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            placeholder="e.g. Accredited Registrars" 
                                                            {...field} 
                                                            disabled={!form.watch("certification_available")}
                                                            value={field.value || ""}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Sections */}
                        <div className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Framework Classification</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="framework_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="security_standard">Security Standard</SelectItem>
                                                        <SelectItem value="compliance_framework">Compliance Framework</SelectItem>
                                                        <SelectItem value="control_framework">Control Framework</SelectItem>
                                                        <SelectItem value="risk_framework">Risk Framework</SelectItem>
                                                        <SelectItem value="audit_standard">Audit Standard</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="version"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Version</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g. 2022" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="publication_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" /> Publication Date
                                                </FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                                        <LinkIcon className="h-4 w-4" />
                                        Resource Links
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="official_website_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <Globe className="h-3 w-3" /> Website
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="documentation_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <Info className="h-3 w-3" /> Documentation
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="purchase_download_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <Download className="h-3 w-3" /> Buy/Download
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="training_resources_url"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <GraduationCap className="h-3 w-3" /> Training
                                                </FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://..." {...field} value={field.value || ""} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm font-medium">Status & Visibility</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="is_active"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                <FormLabel className="text-xs">Active</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="is_public"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                <FormLabel className="text-xs">Public Visibility</FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="is_featured"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                                <FormLabel className="text-xs flex items-center gap-1">
                                                    <Star className="h-3 w-3 text-amber-500" /> Featured
                                                </FormLabel>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 md:hidden">
                        <Button type="button" variant="outline" onClick={() => navigate("/admin/frameworks")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                            <Save className="mr-2 h-4 w-4" />
                            {isEditing ? "Update Framework" : "Save Framework"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AdminFrameworkEditor;
```
