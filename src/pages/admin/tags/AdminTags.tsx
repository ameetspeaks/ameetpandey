import { useEffect, useMemo, useState } from "react";
import { ArrowRightLeft, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/blog";
import { supabase } from "@/integrations/supabase/client";

type Tag = { id: string; name: string; slug: string; description: string | null; is_active: boolean };
const supabaseAny = supabase as any;

const AdminTags = () => {
  const { toast } = useToast();
  const [tags, setTags] = useState<Tag[]>([]);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Tag | null>(null);
  const [mergeTargets, setMergeTargets] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", slug: "", description: "", is_active: true });

  const load = async () => {
    const [tagsRes, ptRes] = await Promise.all([
      supabaseAny.from("blog_tags").select("id,name,slug,description,is_active").order("name"),
      supabaseAny.from("blog_post_tags").select("tag_id"),
    ]);

    const rows = (tagsRes.data || []) as Tag[];
    setTags(rows);

    const counts: Record<string, number> = {};
    for (const row of ptRes.data || []) {
      const key = row.tag_id as string;
      counts[key] = (counts[key] || 0) + 1;
    }
    setUsage(counts);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () => tags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()) || tag.slug.toLowerCase().includes(search.toLowerCase())),
    [tags, search],
  );

  const resetForm = () => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", is_active: true });
  };

  const saveTag = async () => {
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim() || null,
      is_active: form.is_active,
    };

    const query = editing ? supabaseAny.from("blog_tags").update(payload).eq("id", editing.id) : supabaseAny.from("blog_tags").insert(payload);
    const { error } = await query;
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editing ? "Tag updated" : "Tag created" });
    resetForm();
    void load();
  };

  const deleteTag = async (id: string) => {
    if ((usage[id] || 0) > 0) {
      toast({ title: "Tag in use", description: "Use merge or remove post relations first.", variant: "destructive" });
      return;
    }

    const { error } = await supabaseAny.from("blog_tags").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    void load();
  };

  const mergeTag = async (sourceId: string) => {
    const targetId = mergeTargets[sourceId];
    if (!targetId || targetId === sourceId) {
      toast({ title: "Choose target tag", variant: "destructive" });
      return;
    }

    const relations = await supabaseAny.from("blog_post_tags").select("post_id").eq("tag_id", sourceId);
    const inserts = (relations.data || []).map((row: any) => ({ post_id: row.post_id, tag_id: targetId }));

    if (inserts.length) {
      await supabaseAny.from("blog_post_tags").upsert(inserts, { onConflict: "post_id,tag_id" });
    }

    await supabaseAny.from("blog_post_tags").delete().eq("tag_id", sourceId);
    await supabaseAny.from("blog_tags").delete().eq("id", sourceId);
    toast({ title: "Tag merged" });
    void load();
  };

  const bulkDeleteUnused = async () => {
    const ids = Object.entries(selected)
      .filter(([, value]) => value)
      .map(([id]) => id)
      .filter((id) => (usage[id] || 0) === 0);

    if (!ids.length) {
      toast({ title: "No unused tags selected" });
      return;
    }

    await supabaseAny.from("blog_tags").delete().in("id", ids);
    setSelected({});
    void load();
  };

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Tags</h1>
        <p className="text-sm text-muted-foreground">Manage tags, usage, merge duplicates, and cleanup unused labels.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Search tags" value={search} onChange={(event) => setSearch(event.target.value)} />
              <Button variant="outline" size="sm" onClick={() => void bulkDeleteUnused()}>
                <Trash2 className="h-4 w-4" /> Bulk Delete Unused
              </Button>
            </div>

            <div className="data-table-wrap overflow-x-auto">
              <table className="data-table min-w-[820px]">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={filtered.length > 0 && filtered.every((item) => selected[item.id])}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          const next = { ...selected };
                          for (const item of filtered) next[item.id] = checked;
                          setSelected(next);
                        }}
                      />
                    </th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Post Count</th>
                    <th>Status</th>
                    <th>Merge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((tag) => (
                    <tr key={tag.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(selected[tag.id])}
                          onChange={(event) => setSelected((prev) => ({ ...prev, [tag.id]: event.target.checked }))}
                        />
                      </td>
                      <td>{tag.name}</td>
                      <td>{tag.slug}</td>
                      <td>{usage[tag.id] || 0}</td>
                      <td>
                        <Badge variant={tag.is_active ? "default" : "secondary"}>{tag.is_active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                            value={mergeTargets[tag.id] || ""}
                            onChange={(event) => setMergeTargets((prev) => ({ ...prev, [tag.id]: event.target.value }))}
                          >
                            <option value="">Select target</option>
                            {tags
                              .filter((item) => item.id !== tag.id)
                              .map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                          <Button size="sm" variant="outline" onClick={() => void mergeTag(tag.id)}>
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditing(tag);
                              setForm({ name: tag.name, slug: tag.slug, description: tag.description || "", is_active: tag.is_active });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => void deleteTag(tag.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{editing ? "Edit Tag" : "Add Tag"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Name</Label>
            <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <Label>Slug</Label>
            <Input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="auto-generated if empty" />
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={3} />
            <Label>Status</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.is_active ? "active" : "inactive"}
              onChange={(event) => setForm((prev) => ({ ...prev, is_active: event.target.value === "active" }))}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex gap-2">
              <Button onClick={() => void saveTag()}>{editing ? "Update" : "Create"}</Button>
              {editing && (
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminTags;
