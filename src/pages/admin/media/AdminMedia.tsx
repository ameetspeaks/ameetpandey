import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Copy, RefreshCw, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type MediaRow = {
  id: string;
  filename: string;
  file_path: string;
  public_url: string;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  caption: string | null;
  created_at: string;
};

type BlogPostAsset = { id: string; title: string; featured_image_url: string | null; content: unknown };

const supabaseAny = supabase as any;

const imageSize = async (file: File) => {
  if (!file.type.startsWith("image/")) return { width: null, height: null };

  const url = URL.createObjectURL(file);
  const img = new Image();
  const result = await new Promise<{ width: number | null; height: number | null }>((resolve) => {
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: null, height: null });
    img.src = url;
  });
  URL.revokeObjectURL(url);
  return result;
};

const formatBytes = (value: number | null) => {
  if (!value) return "-";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
};

const AdminMedia = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [posts, setPosts] = useState<BlogPostAsset[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMany, setSelectedMany] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [usageFilter, setUsageFilter] = useState<"all" | "used" | "unused">("all");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const [mediaRes, postsRes] = await Promise.all([
      supabaseAny.from("blog_media").select("id,filename,file_path,public_url,file_size,mime_type,width,height,alt_text,caption,created_at").order("created_at", { ascending: false }),
      supabaseAny.from("blog_posts").select("id,title,featured_image_url,content"),
    ]);

    setMedia((mediaRes.data || []) as MediaRow[]);
    setPosts((postsRes.data || []) as BlogPostAsset[]);
    if (!selectedId && mediaRes.data?.[0]?.id) setSelectedId(mediaRes.data[0].id);
  };

  useEffect(() => {
    void load();
  }, []);

  const usageCount = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const item of media) {
      const used = posts.filter((post) => {
        const inFeatured = post.featured_image_url?.includes(item.file_path) || post.featured_image_url === item.public_url;
        const inContent = JSON.stringify(post.content || "").includes(item.public_url);
        return Boolean(inFeatured || inContent);
      }).length;

      counts[item.id] = used;
    }

    return counts;
  }, [media, posts]);

  const filtered = useMemo(
    () =>
      media.filter((item) => {
        const bySearch =
          !search ||
          item.filename.toLowerCase().includes(search.toLowerCase()) ||
          (item.alt_text || "").toLowerCase().includes(search.toLowerCase());

        const used = (usageCount[item.id] || 0) > 0;
        const byUsage = usageFilter === "all" || (usageFilter === "used" ? used : !used);
        return bySearch && byUsage;
      }),
    [media, search, usageFilter, usageCount],
  );

  const selectedMedia = media.find((item) => item.id === selectedId) || null;

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !user?.id) return;

    setUploading(true);
    for (const file of files) {
      const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
      const path = `${user.id}/${safeName}`;
      const { error: uploadError } = await supabase.storage.from("blog-media").upload(path, file, { upsert: false });
      if (uploadError) {
        toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
        continue;
      }

      const { data } = supabase.storage.from("blog-media").getPublicUrl(path);
      const dimensions = await imageSize(file);

      const { error: insertError } = await supabaseAny.from("blog_media").insert({
        filename: file.name,
        file_path: path,
        public_url: data.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        uploaded_by: user.id,
      });

      if (insertError) {
        toast({ title: "Media record failed", description: insertError.message, variant: "destructive" });
      }
    }

    setUploading(false);
    event.target.value = "";
    void load();
  };

  const saveDetails = async () => {
    if (!selectedMedia) return;
    const { error } = await supabaseAny
      .from("blog_media")
      .update({
        filename: selectedMedia.filename,
        alt_text: selectedMedia.alt_text || null,
        caption: selectedMedia.caption || null,
      })
      .eq("id", selectedMedia.id);

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Details updated" });
    void load();
  };

  const removeMedia = async (ids: string[]) => {
    if (!ids.length) return;
    const rows = media.filter((item) => ids.includes(item.id));

    for (const row of rows) {
      await supabase.storage.from("blog-media").remove([row.file_path]);
    }

    await supabaseAny.from("blog_media").delete().in("id", ids);
    setSelectedMany({});
    setSelectedId(null);
    void load();
  };

  const replaceAsset = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedMedia || !user?.id) return;

    const safeName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const nextPath = `${user.id}/${safeName}`;
    const upload = await supabase.storage.from("blog-media").upload(nextPath, file, { upsert: false });
    if (upload.error) {
      toast({ title: "Replace failed", description: upload.error.message, variant: "destructive" });
      return;
    }

    const { data } = supabase.storage.from("blog-media").getPublicUrl(nextPath);
    const dimensions = await imageSize(file);

    await supabase.storage.from("blog-media").remove([selectedMedia.file_path]);

    await supabaseAny
      .from("blog_media")
      .update({
        filename: file.name,
        file_path: nextPath,
        public_url: data.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height,
      })
      .eq("id", selectedMedia.id);

    toast({ title: "Asset replaced" });
    event.target.value = "";
    void load();
  };

  const relatedPosts = useMemo(() => {
    if (!selectedMedia) return [];
    return posts.filter((post) => {
      const inFeatured = post.featured_image_url?.includes(selectedMedia.file_path) || post.featured_image_url === selectedMedia.public_url;
      const inContent = JSON.stringify(post.content || "").includes(selectedMedia.public_url);
      return Boolean(inFeatured || inContent);
    });
  }, [posts, selectedMedia]);

  const selectedManyIds = Object.entries(selectedMany).filter(([, value]) => value).map(([id]) => id);

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Media Library</h1>
        <p className="text-sm text-muted-foreground">Upload, organize, and maintain image assets used across blog posts.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap gap-2">
              <Input placeholder="Search by filename or alt text" value={search} onChange={(event) => setSearch(event.target.value)} />
              <select
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={usageFilter}
                onChange={(event) => setUsageFilter(event.target.value as typeof usageFilter)}
              >
                <option value="all">All assets</option>
                <option value="used">Used</option>
                <option value="unused">Unused</option>
              </select>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <Upload className="h-4 w-4" /> {uploading ? "Uploading..." : "Upload"}
                <input type="file" multiple accept="image/*" className="hidden" onChange={(event) => void uploadFiles(event)} />
              </label>
              <Button size="sm" variant="outline" onClick={() => void removeMedia(selectedManyIds)}>
                <Trash2 className="h-4 w-4" /> Bulk Delete
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`rounded-lg border p-2 text-left ${selectedId === item.id ? "border-primary" : "border-border"}`}
                  onClick={() => setSelectedId(item.id)}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedMany[item.id])}
                      onChange={(event) => {
                        event.stopPropagation();
                        setSelectedMany((prev) => ({ ...prev, [item.id]: event.target.checked }));
                      }}
                    />
                    <span className="text-xs text-muted-foreground">Used: {usageCount[item.id] || 0}</span>
                  </div>
                  <img src={item.public_url} alt={item.alt_text || item.filename} className="aspect-square w-full rounded-md border border-border object-cover" loading="lazy" />
                  <p className="mt-2 line-clamp-1 text-sm font-medium">{item.filename}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(item.file_size)}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!selectedMedia ? (
              <p className="text-sm text-muted-foreground">Select an image to inspect and edit metadata.</p>
            ) : (
              <>
                <img src={selectedMedia.public_url} alt={selectedMedia.alt_text || selectedMedia.filename} className="w-full rounded-lg border border-border object-cover" loading="lazy" />

                <Label>Filename</Label>
                <Input
                  value={selectedMedia.filename}
                  onChange={(event) =>
                    setMedia((prev) => prev.map((item) => (item.id === selectedMedia.id ? { ...item, filename: event.target.value } : item)))
                  }
                />

                <Label>Alt text</Label>
                <Input
                  value={selectedMedia.alt_text || ""}
                  onChange={(event) =>
                    setMedia((prev) => prev.map((item) => (item.id === selectedMedia.id ? { ...item, alt_text: event.target.value } : item)))
                  }
                />

                <Label>Caption</Label>
                <Textarea
                  rows={3}
                  value={selectedMedia.caption || ""}
                  onChange={(event) =>
                    setMedia((prev) => prev.map((item) => (item.id === selectedMedia.id ? { ...item, caption: event.target.value } : item)))
                  }
                />

                <p className="text-xs text-muted-foreground">
                  {selectedMedia.width || "?"} × {selectedMedia.height || "?"} • {selectedMedia.mime_type || "unknown"}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => void saveDetails()}>
                    Save Details
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedMedia.public_url);
                      toast({ title: "URL copied" });
                    }}
                  >
                    <Copy className="h-4 w-4" /> Copy URL
                  </Button>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <RefreshCw className="h-4 w-4" /> Replace
                    <input type="file" accept="image/*" className="hidden" onChange={(event) => void replaceAsset(event)} />
                  </label>
                  <Button size="sm" variant="outline" onClick={() => void removeMedia([selectedMedia.id])}>
                    <Trash2 className="h-4 w-4" /> Delete
                  </Button>
                </div>

                <div className="rounded-lg border border-border p-3">
                  <p className="mb-2 text-sm font-medium">Used in posts ({relatedPosts.length})</p>
                  {relatedPosts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No linked posts detected.</p>
                  ) : (
                    <ul className="space-y-1 text-xs">
                      {relatedPosts.map((post) => (
                        <li key={post.id}>{post.title}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminMedia;
