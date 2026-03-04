import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Clock3, Plus, Save, Trash2 } from "lucide-react";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { BlogBlock } from "@/components/blog/BlogContentRenderer";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { defaultBlocks, estimateReadTime, excerptFromBlocks, slugify } from "@/lib/blog";

type Category = { id: string; name: string };
type Revision = {
  id: string;
  title: string;
  slug: string;
  content: BlogBlock[];
  excerpt: string | null;
  status: string;
  scheduled_date: string | null;
  published_date: string | null;
  change_note: string | null;
  created_at: string;
};

type EditorState = {
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "published" | "scheduled" | "archived";
  is_active: boolean;
  scheduled_date: string;
  featured_image_url: string;
  featured_image_alt: string;
  category_id: string;
  tagsInput: string;
  seo_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  canonical_url: string;
  allow_comments: boolean;
  content: BlogBlock[];
};

const schema = z.object({
  title: z.string().trim().min(3).max(220),
  slug: z.string().trim().min(3).max(260),
  content: z.array(z.any()).min(1),
});

const statusOptions: Array<EditorState["status"]> = ["draft", "published", "scheduled", "archived"];
const supabaseAny = supabase as any;

const defaultState: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  status: "draft",
  is_active: true,
  scheduled_date: "",
  featured_image_url: "",
  featured_image_alt: "",
  category_id: "none",
  tagsInput: "",
  seo_title: "",
  meta_description: "",
  og_title: "",
  og_description: "",
  canonical_url: "",
  allow_comments: true,
  content: defaultBlocks,
};

const newBlockByType = (type: string): BlogBlock => {
  if (type === "heading") return { type: "heading", level: "h2", text: "Section heading" };
  if (type === "blockquote") return { type: "blockquote", text: "Highlighted quote" };
  if (type === "list") return { type: "list", ordered: false, items: ["First item", "Second item"] };
  if (type === "code") return { type: "code", language: "bash", title: "Code snippet", code: "echo 'hello'" };
  if (type === "terminal") return { type: "terminal", language: "bash", title: "Terminal", command: "$ ls -la", output: "total 0" };
  if (type === "callout") return { type: "callout", kind: "info", title: "Info", text: "Callout content" };
  if (type === "image") return { type: "image", url: "/placeholder.svg", alt: "Image", caption: "Caption" };
  if (type === "video") return { type: "video", url: "https://www.youtube.com/embed/dQw4w9WgXcQ", title: "Video" };
  if (type === "table") return { type: "table", headers: ["Column A", "Column B"], rows: [["Row 1", "Value 1"], ["Row 2", "Value 2"]] };
  return { type: "paragraph", text: "New paragraph" };
};

const AdminPostEditor = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [state, setState] = useState<EditorState>(defaultState);
  const [categories, setCategories] = useState<Category[]>([]);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [postId, setPostId] = useState<string | null>(id || null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const saveInFlight = useRef(false);

  const wordCount = useMemo(
    () =>
      state.content
        .map((block) => JSON.stringify(block))
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length,
    [state.content],
  );

  const readTime = useMemo(() => estimateReadTime(state.content), [state.content]);

  const loadRevisions = async (targetPostId: string) => {
    const { data } = await supabaseAny
      .from("blog_post_revisions")
      .select("id,title,slug,content,excerpt,status,scheduled_date,published_date,change_note,created_at")
      .eq("post_id", targetPostId)
      .order("created_at", { ascending: false })
      .limit(20);

    setRevisions((data || []) as Revision[]);
  };

  useEffect(() => {
    const load = async () => {
      const categoriesRes = await supabaseAny.from("blog_categories").select("id,name").eq("is_active", true).order("name");
      setCategories((categoriesRes.data || []) as Category[]);

      if (!id) return;

      const postRes = await supabaseAny
        .from("blog_posts")
        .select("id,title,slug,excerpt,status,is_active,scheduled_date,featured_image_url,featured_image_alt,category_id,seo_title,meta_description,og_title,og_description,canonical_url,allow_comments,content")
        .eq("id", id)
        .maybeSingle();

      const post = postRes.data;
      if (!post) return;

      const tagsRes = await supabaseAny
        .from("blog_post_tags")
        .select("blog_tags(name)")
        .eq("post_id", id);

      const tagNames = (tagsRes.data || []).map((row: any) => row.blog_tags?.name).filter(Boolean).join(", ");

      setState({
        title: post.title || "",
        slug: post.slug || "",
        excerpt: post.excerpt || "",
        status: post.status || "draft",
        is_active: Boolean(post.is_active),
        scheduled_date: post.scheduled_date ? String(post.scheduled_date).slice(0, 16) : "",
        featured_image_url: post.featured_image_url || "",
        featured_image_alt: post.featured_image_alt || "",
        category_id: post.category_id || "none",
        tagsInput: tagNames,
        seo_title: post.seo_title || "",
        meta_description: post.meta_description || "",
        og_title: post.og_title || "",
        og_description: post.og_description || "",
        canonical_url: post.canonical_url || "",
        allow_comments: Boolean(post.allow_comments),
        content: Array.isArray(post.content) ? post.content : defaultBlocks,
      });

      setPostId(post.id);
      await loadRevisions(post.id);
    };

    void load();
  }, [id]);

  useEffect(() => {
    if (slugTouched) return;
    setState((prev) => ({ ...prev, slug: slugify(prev.title) }));
  }, [state.title, slugTouched]);

  const setField = <K extends keyof EditorState>(key: K, value: EditorState[K]) => {
    setDirty(true);
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const updateBlock = (index: number, next: BlogBlock) => {
    setDirty(true);
    setState((prev) => ({ ...prev, content: prev.content.map((block, idx) => (idx === index ? next : block)) }));
  };

  const addBlock = (type: string) => {
    setDirty(true);
    setState((prev) => ({ ...prev, content: [...prev.content, newBlockByType(type)] }));
  };

  const removeBlock = (index: number) => {
    setDirty(true);
    setState((prev) => ({ ...prev, content: prev.content.filter((_, idx) => idx !== index) }));
  };

  const upsertTags = async (targetPostId: string, tagsInput: string) => {
    const names = Array.from(new Set(tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean)));
    const slugs = names.map((name) => slugify(name));

    await supabaseAny.from("blog_post_tags").delete().eq("post_id", targetPostId);
    if (!names.length) return;

    const existingRes = await supabaseAny.from("blog_tags").select("id,name,slug").in("slug", slugs);
    const existing = (existingRes.data || []) as Array<{ id: string; slug: string }>;
    const existingBySlug = new Map(existing.map((tag) => [tag.slug, tag.id]));

    const missing = names
      .map((name, idx) => ({ name, slug: slugs[idx] }))
      .filter((item) => !existingBySlug.has(item.slug));

    if (missing.length) {
      const insertRes = await supabaseAny.from("blog_tags").insert(missing).select("id,slug");
      for (const tag of insertRes.data || []) existingBySlug.set(tag.slug, tag.id);
    }

    const postTags = slugs
      .map((slug) => existingBySlug.get(slug))
      .filter(Boolean)
      .map((tagId) => ({ post_id: targetPostId, tag_id: tagId }));

    if (postTags.length) {
      await supabaseAny.from("blog_post_tags").insert(postTags);
    }
  };

  const savePost = async ({
    nextStatus,
    autosave,
    createRevision,
    changeNote,
  }: {
    nextStatus?: EditorState["status"];
    autosave?: boolean;
    createRevision?: boolean;
    changeNote?: string;
  } = {}) => {
    if (!user?.id || saveInFlight.current) return;

    const parsed = schema.safeParse({ title: state.title, slug: state.slug, content: state.content });
    if (!parsed.success) {
      if (!autosave) {
        toast({ title: "Validation failed", description: "Title, slug and at least one block are required.", variant: "destructive" });
      }
      return;
    }

    saveInFlight.current = true;
    setSaving(true);

    const status = nextStatus || state.status;
    const excerpt = state.excerpt.trim() || excerptFromBlocks(state.content);

    const payload: Record<string, unknown> = {
      title: state.title.trim(),
      slug: slugify(state.slug),
      excerpt,
      status,
      is_active: state.is_active,
      scheduled_date: state.scheduled_date ? new Date(state.scheduled_date).toISOString() : null,
      featured_image_url: state.featured_image_url.trim() || null,
      featured_image_alt: state.featured_image_alt.trim() || null,
      category_id: state.category_id === "none" ? null : state.category_id,
      seo_title: state.seo_title.trim() || null,
      meta_description: state.meta_description.trim() || null,
      og_title: state.og_title.trim() || null,
      og_description: state.og_description.trim() || null,
      canonical_url: state.canonical_url.trim() || null,
      allow_comments: state.allow_comments,
      content: state.content,
      read_time_minutes: readTime,
      author_id: user.id,
    };

    if (status === "published") {
      payload.published_date = new Date().toISOString();
      payload.is_active = true;
    }

    if (status === "scheduled" && !payload.scheduled_date) {
      payload.scheduled_date = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    }

    let currentPostId = postId;

    if (currentPostId) {
      const { error } = await supabaseAny.from("blog_posts").update(payload).eq("id", currentPostId);
      if (error) {
        toast({ title: "Save failed", description: error.message, variant: "destructive" });
        setSaving(false);
        saveInFlight.current = false;
        return;
      }
    } else {
      const { data, error } = await supabaseAny.from("blog_posts").insert(payload).select("id").maybeSingle();
      if (error || !data?.id) {
        toast({ title: "Create failed", description: error?.message || "Could not create post.", variant: "destructive" });
        setSaving(false);
        saveInFlight.current = false;
        return;
      }
      currentPostId = data.id as string;
      setPostId(currentPostId);
      navigate(`/admin/posts/edit/${currentPostId}`, { replace: true });
    }

    await upsertTags(currentPostId, state.tagsInput);

    if (createRevision || !autosave) {
      await supabaseAny.rpc("create_blog_post_revision", {
        _post_id: currentPostId,
        _change_note: changeNote || (autosave ? "Autosave" : `Manual save (${status})`),
      });
      await loadRevisions(currentPostId);
    }

    setDirty(false);
    setSaving(false);
    saveInFlight.current = false;

    const nowText = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    toast({
      title: autosave ? `Draft saved at ${nowText}` : "Saved",
      description: autosave ? "Autosave completed." : `Post saved as ${status}.`,
    });
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (!dirty) return;
      void savePost({ autosave: true });
    }, 30000);

    return () => window.clearInterval(timer);
  }, [dirty, state, postId, user?.id]);

  const restoreRevision = (revision: Revision) => {
    setState((prev) => ({
      ...prev,
      title: revision.title,
      slug: revision.slug,
      excerpt: revision.excerpt || "",
      status: (revision.status as EditorState["status"]) || "draft",
      scheduled_date: revision.scheduled_date ? String(revision.scheduled_date).slice(0, 16) : "",
      content: Array.isArray(revision.content) ? revision.content : defaultBlocks,
    }));
    setDirty(true);
    toast({ title: "Revision loaded", description: "Review and save to restore this version." });
  };

  const deletePost = async () => {
    if (!postId) return;
    await supabaseAny.from("blog_posts").update({ status: "archived", is_active: false }).eq("id", postId);
    await supabaseAny.rpc("create_blog_post_revision", { _post_id: postId, _change_note: "Post archived" });
    toast({ title: "Post archived", description: "The post was moved to archived status." });
    navigate("/admin/posts", { replace: true });
  };

  return (
    <section className="space-y-4 pb-12">
      <header className="surface-card sticky top-4 z-20 flex flex-wrap items-center justify-between gap-2 p-4">
        <div>
          <h1 className="text-xl">{isEdit ? "Edit Post" : "Create New Post"}</h1>
          <p className="text-sm text-muted-foreground">Word count: {wordCount} • Read time: {readTime} min</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => void savePost({ nextStatus: "draft", createRevision: true, changeNote: "Manual save draft" })} disabled={saving}>
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button variant="secondary" asChild disabled={!state.slug}>
            <a href={`/blog/${state.slug}`} target="_blank" rel="noreferrer">
              Preview
            </a>
          </Button>
          <Button onClick={() => void savePost({ nextStatus: state.status === "scheduled" ? "scheduled" : "published", createRevision: true, changeNote: "Published/updated" })} disabled={saving}>
            {isEdit ? "Update" : "Publish"}
          </Button>
          {isEdit && (
            <Button variant="outline" onClick={() => void deletePost()}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input id="title" value={state.title} onChange={(event) => setField("title", event.target.value)} placeholder="Enter post title" />
                <p className="text-xs text-muted-foreground">{state.title.length}/220 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={state.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    setField("slug", event.target.value);
                  }}
                  placeholder="post-slug"
                />
                <p className="text-xs text-muted-foreground">Preview: /blog/{slugify(state.slug || "your-post-slug")}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rich Block Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["paragraph", "heading", "blockquote", "list", "code", "terminal", "callout", "image", "video", "table"].map((type) => (
                  <Button key={type} type="button" size="sm" variant="secondary" onClick={() => addBlock(type)}>
                    <Plus className="h-3.5 w-3.5" /> {type}
                  </Button>
                ))}
              </div>

              {state.content.map((block, index) => (
                <div key={`block-${index}`} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="secondary">{block.type}</Badge>
                    <Button type="button" size="sm" variant="ghost" onClick={() => removeBlock(index)}>
                      Remove
                    </Button>
                  </div>

                  {block.type === "paragraph" && (
                    <Textarea value={block.text} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} rows={4} />
                  )}

                  {block.type === "heading" && (
                    <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
                      <Select
                        value={block.level}
                        onValueChange={(value) => updateBlock(index, { ...block, level: value as "h1" | "h2" | "h3" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input value={block.text} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} />
                    </div>
                  )}

                  {block.type === "blockquote" && (
                    <Textarea value={block.text} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} rows={3} />
                  )}

                  {block.type === "list" && (
                    <>
                      <Select
                        value={block.ordered ? "ordered" : "unordered"}
                        onValueChange={(value) => updateBlock(index, { ...block, ordered: value === "ordered" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unordered">Bullet list</SelectItem>
                          <SelectItem value="ordered">Numbered list</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={block.items.join("\n")}
                        onChange={(event) => updateBlock(index, { ...block, items: event.target.value.split("\n") })}
                        rows={4}
                        placeholder="One item per line"
                      />
                    </>
                  )}

                  {block.type === "code" && (
                    <div className="space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input value={block.title || ""} onChange={(event) => updateBlock(index, { ...block, title: event.target.value })} placeholder="Block title" />
                        <Input value={block.language || ""} onChange={(event) => updateBlock(index, { ...block, language: event.target.value })} placeholder="Language" />
                      </div>
                      <Textarea value={block.code} onChange={(event) => updateBlock(index, { ...block, code: event.target.value })} rows={6} />
                    </div>
                  )}

                  {block.type === "terminal" && (
                    <div className="space-y-2">
                      <div className="grid gap-2 sm:grid-cols-2">
                        <Input value={block.title || ""} onChange={(event) => updateBlock(index, { ...block, title: event.target.value })} placeholder="Terminal title" />
                        <Input value={block.language || "bash"} onChange={(event) => updateBlock(index, { ...block, language: event.target.value })} placeholder="Language" />
                      </div>
                      <Textarea value={block.command || ""} onChange={(event) => updateBlock(index, { ...block, command: event.target.value })} rows={4} placeholder="Command input" />
                      <Textarea value={block.output || ""} onChange={(event) => updateBlock(index, { ...block, output: event.target.value })} rows={4} placeholder="Command output" />
                    </div>
                  )}

                  {block.type === "callout" && (
                    <div className="space-y-2">
                      <Select
                        value={block.kind || "info"}
                        onValueChange={(value) => updateBlock(index, { ...block, kind: value as "info" | "warning" | "tip" | "danger" })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Info</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="tip">Tip</SelectItem>
                          <SelectItem value="danger">Danger</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input value={block.title || ""} onChange={(event) => updateBlock(index, { ...block, title: event.target.value })} placeholder="Callout title" />
                      <Textarea value={block.text} onChange={(event) => updateBlock(index, { ...block, text: event.target.value })} rows={3} />
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="space-y-2">
                      <Input value={block.url} onChange={(event) => updateBlock(index, { ...block, url: event.target.value })} placeholder="Image URL" />
                      <Input value={block.alt || ""} onChange={(event) => updateBlock(index, { ...block, alt: event.target.value })} placeholder="Alt text" />
                      <Input value={block.caption || ""} onChange={(event) => updateBlock(index, { ...block, caption: event.target.value })} placeholder="Caption" />
                    </div>
                  )}

                  {block.type === "video" && (
                    <div className="space-y-2">
                      <Input value={block.url} onChange={(event) => updateBlock(index, { ...block, url: event.target.value })} placeholder="Embed URL" />
                      <Input value={block.title || ""} onChange={(event) => updateBlock(index, { ...block, title: event.target.value })} placeholder="Video title" />
                    </div>
                  )}

                  {block.type === "table" && (
                    <div className="space-y-2">
                      <Textarea
                        value={block.headers.join(" | ")}
                        onChange={(event) => updateBlock(index, { ...block, headers: event.target.value.split("|").map((x) => x.trim()) })}
                        rows={2}
                        placeholder="Header A | Header B"
                      />
                      <Textarea
                        value={block.rows.map((row) => row.join(" | ")).join("\n")}
                        onChange={(event) =>
                          updateBlock(index, {
                            ...block,
                            rows: event.target.value.split("\n").map((row) => row.split("|").map((x) => x.trim())),
                          })
                        }
                        rows={4}
                        placeholder="Row 1 Col A | Row 1 Col B"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Status</Label>
              <Select value={state.status} onValueChange={(value) => setField("status", value as EditorState["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Scheduled Date</Label>
              <Input
                type="datetime-local"
                value={state.scheduled_date}
                onChange={(event) => setField("scheduled_date", event.target.value)}
              />

              <Label>Active</Label>
              <Select value={state.is_active ? "true" : "false"} onValueChange={(value) => setField("is_active", value === "true") }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <div className="rounded-md border border-border p-3 text-xs text-muted-foreground">
                <Clock3 className="mb-1 h-4 w-4" /> Autosave runs every 30 seconds while editing.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Media & Taxonomy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Featured Image URL</Label>
              <Input value={state.featured_image_url} onChange={(event) => setField("featured_image_url", event.target.value)} />

              <Label>Featured Image Alt</Label>
              <Input value={state.featured_image_alt} onChange={(event) => setField("featured_image_alt", event.target.value)} />

              <Label>Category</Label>
              <Select value={state.category_id} onValueChange={(value) => setField("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Uncategorized</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Tags (comma-separated)</Label>
              <Input value={state.tagsInput} onChange={(event) => setField("tagsInput", event.target.value)} placeholder="grc, audit, iso27001" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excerpt & SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Excerpt</Label>
              <Textarea value={state.excerpt} onChange={(event) => setField("excerpt", event.target.value)} rows={4} />
              <Button type="button" size="sm" variant="outline" onClick={() => setField("excerpt", excerptFromBlocks(state.content))}>
                Auto-generate excerpt
              </Button>

              <Label>SEO Title</Label>
              <Input value={state.seo_title} onChange={(event) => setField("seo_title", event.target.value)} />

              <Label>Meta Description</Label>
              <Textarea value={state.meta_description} onChange={(event) => setField("meta_description", event.target.value)} rows={3} />

              <Label>Canonical URL</Label>
              <Input value={state.canonical_url} onChange={(event) => setField("canonical_url", event.target.value)} />

              <Label>OG Title</Label>
              <Input value={state.og_title} onChange={(event) => setField("og_title", event.target.value)} />

              <Label>OG Description</Label>
              <Textarea value={state.og_description} onChange={(event) => setField("og_description", event.target.value)} rows={3} />

              <Label>Allow Comments</Label>
              <Select value={state.allow_comments ? "true" : "false"} onValueChange={(value) => setField("allow_comments", value === "true") }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revision History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {!postId && <p className="text-sm text-muted-foreground">Revisions appear after first save.</p>}
              {revisions.map((revision) => (
                <div key={revision.id} className="rounded-lg border border-border p-3">
                  <p className="line-clamp-1 text-sm font-medium">{revision.title}</p>
                  <p className="text-xs text-muted-foreground">{new Date(revision.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{revision.change_note || "Revision snapshot"}</p>
                  <Button type="button" size="sm" variant="outline" className="mt-2" onClick={() => restoreRevision(revision)}>
                    Restore
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Scheduled posts require date/time; publishing sets immediate publish date.
              </p>
              <p className="mt-2">
                <Link to="/admin/posts" className="text-primary hover:underline">
                  Back to posts list
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminPostEditor;
