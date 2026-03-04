import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/blog";
import { supabase } from "@/integrations/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
};

const supabaseAny = supabase as any;

const AdminCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [postCounts, setPostCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parent_id: "none",
    featured_image: "",
    meta_title: "",
    meta_description: "",
    is_active: true,
  });

  const loadData = async () => {
    const [categoriesRes, postsRes] = await Promise.all([
      supabaseAny
        .from("blog_categories")
        .select("id,name,slug,description,parent_id,featured_image,meta_title,meta_description,sort_order,is_active")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true }),
      supabaseAny.from("blog_posts").select("category_id").neq("status", "archived"),
    ]);

    const rows = (categoriesRes.data || []) as Category[];
    setCategories(rows);

    const counts: Record<string, number> = {};
    for (const row of postsRes.data || []) {
      const key = row.category_id as string | null;
      if (!key) continue;
      counts[key] = (counts[key] || 0) + 1;
    }
    setPostCounts(counts);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(
    () => categories.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) || item.slug.toLowerCase().includes(search.toLowerCase())),
    [categories, search],
  );

  const resetForm = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      parent_id: "none",
      featured_image: "",
      meta_title: "",
      meta_description: "",
      is_active: true,
    });
  };

  const onSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim() || null,
      parent_id: form.parent_id === "none" ? null : form.parent_id,
      featured_image: form.featured_image.trim() || null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      is_active: form.is_active,
      sort_order: editing?.sort_order ?? categories.length,
    };

    const query = editing
      ? supabaseAny.from("blog_categories").update(payload).eq("id", editing.id)
      : supabaseAny.from("blog_categories").insert(payload);

    const { error } = await query;
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editing ? "Category updated" : "Category created" });
    resetForm();
    void loadData();
  };

  const onDelete = async (category: Category) => {
    if ((postCounts[category.id] || 0) > 0) {
      toast({ title: "Cannot delete category", description: "Move posts out of this category first.", variant: "destructive" });
      return;
    }

    const { error } = await supabaseAny.from("blog_categories").delete().eq("id", category.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Category deleted" });
    void loadData();
  };

  const bulkDelete = async () => {
    const ids = Object.entries(selected).filter(([, value]) => value).map(([id]) => id);
    if (!ids.length) return;

    const blocked = ids.find((id) => (postCounts[id] || 0) > 0);
    if (blocked) {
      toast({ title: "Bulk delete blocked", description: "One or more selected categories still have posts.", variant: "destructive" });
      return;
    }

    const { error } = await supabaseAny.from("blog_categories").delete().in("id", ids);
    if (error) {
      toast({ title: "Bulk delete failed", description: error.message, variant: "destructive" });
      return;
    }

    setSelected({});
    toast({ title: "Categories deleted" });
    void loadData();
  };

  const setSort = async (category: Category, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((item) => item.id === category.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return;

    const current = sorted[idx];
    const target = sorted[swapIdx];

    await Promise.all([
      supabaseAny.from("blog_categories").update({ sort_order: target.sort_order }).eq("id", current.id),
      supabaseAny.from("blog_categories").update({ sort_order: current.sort_order }).eq("id", target.id),
    ]);

    void loadData();
  };

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Categories</h1>
        <p className="text-sm text-muted-foreground">Create, edit, reorder, and manage hierarchical categories.</p>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardContent className="space-y-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Input placeholder="Search categories" value={search} onChange={(event) => setSearch(event.target.value)} />
              <Button size="sm" variant="outline" onClick={() => void bulkDelete()}>
                <Trash2 className="h-4 w-4" /> Bulk Delete
              </Button>
            </div>

            <div className="data-table-wrap overflow-x-auto">
              <table className="data-table min-w-[860px]">
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
                    <th>Description</th>
                    <th>Post Count</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={Boolean(selected[category.id])}
                          onChange={(event) => setSelected((prev) => ({ ...prev, [category.id]: event.target.checked }))}
                        />
                      </td>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td className="max-w-[260px]">
                        <p className="line-clamp-2">{category.description || "-"}</p>
                      </td>
                      <td>{postCounts[category.id] || 0}</td>
                      <td>
                        <Badge variant={category.is_active ? "default" : "secondary"}>{category.is_active ? "Active" : "Inactive"}</Badge>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditing(category);
                              setForm({
                                name: category.name,
                                slug: category.slug,
                                description: category.description || "",
                                parent_id: category.parent_id || "none",
                                featured_image: category.featured_image || "",
                                meta_title: category.meta_title || "",
                                meta_description: category.meta_description || "",
                                is_active: category.is_active,
                              });
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => void onDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => void setSort(category, "up")}>↑</Button>
                          <Button size="sm" variant="ghost" onClick={() => void setSort(category, "down")}>↓</Button>
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
            <CardTitle>{editing ? "Edit Category" : "Add Category"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label>Name</Label>
            <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />

            <Label>Slug</Label>
            <Input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} placeholder="auto-generated if empty" />

            <Label>Description</Label>
            <Textarea value={form.description} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} rows={3} />

            <Label>Parent Category</Label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.parent_id}
              onChange={(event) => setForm((prev) => ({ ...prev, parent_id: event.target.value }))}
            >
              <option value="none">No parent</option>
              {categories.filter((item) => item.id !== editing?.id).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <Label>Featured Image URL</Label>
            <Input value={form.featured_image} onChange={(event) => setForm((prev) => ({ ...prev, featured_image: event.target.value }))} />

            <Label>SEO Meta Title</Label>
            <Input value={form.meta_title} onChange={(event) => setForm((prev) => ({ ...prev, meta_title: event.target.value }))} />

            <Label>SEO Meta Description</Label>
            <Textarea value={form.meta_description} onChange={(event) => setForm((prev) => ({ ...prev, meta_description: event.target.value }))} rows={3} />

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
              <Button onClick={() => void onSave()}>
                <Plus className="h-4 w-4" /> {editing ? "Update" : "Create"}
              </Button>
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

export default AdminCategories;
