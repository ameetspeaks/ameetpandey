import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "archived";
  is_active: boolean;
  views_count: number;
  published_date: string | null;
  updated_at: string;
  category_id: string | null;
  blog_categories?: { name?: string | null } | null;
};

type Category = { id: string; name: string };

const supabaseAny = supabase as any;

const statuses: Array<PostRow["status"]> = ["draft", "published", "scheduled", "archived"];

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleDateString() : "-");

const AdminPostsList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [tab, setTab] = useState<"all" | PostRow["status"]>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"date" | "title" | "views" | "status">("date");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const loadData = async () => {
    const [postsRes, categoriesRes] = await Promise.all([
      supabaseAny
        .from("blog_posts")
        .select("id,title,slug,status,is_active,views_count,published_date,updated_at,category_id,blog_categories(name)")
        .order("updated_at", { ascending: false })
        .limit(1000),
      supabaseAny.from("blog_categories").select("id,name").order("name", { ascending: true }),
    ]);

    setPosts((postsRes.data || []) as PostRow[]);
    setCategories((categoriesRes.data || []) as Category[]);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(() => {
    let next = posts.filter((post) => {
      const byTab = tab === "all" || post.status === tab;
      const bySearch =
        !search ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.slug.toLowerCase().includes(search.toLowerCase());
      const byCategory = categoryFilter === "all" || post.category_id === categoryFilter;
      return byTab && bySearch && byCategory;
    });

    next = [...next].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "views") return b.views_count - a.views_count;
      if (sortBy === "status") return a.status.localeCompare(b.status);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return next;
  }, [posts, tab, search, categoryFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const selectedIds = Object.entries(selected)
    .filter(([, value]) => value)
    .map(([id]) => id);

  const setStatus = async (postId: string, status: PostRow["status"]) => {
    const payload: Record<string, unknown> = { status };
    if (status === "published") payload.published_date = new Date().toISOString();

    const { error } = await supabaseAny.from("blog_posts").update(payload).eq("id", postId);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }

    await supabaseAny.rpc("create_blog_post_revision", { _post_id: postId, _change_note: `Status changed to ${status}` });
    toast({ title: "Status updated", description: `Post moved to ${status}.` });
    void loadData();
  };

  const toggleActive = async (postId: string, next: boolean) => {
    const { error } = await supabaseAny.from("blog_posts").update({ is_active: next }).eq("id", postId);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }

    await supabaseAny.rpc("create_blog_post_revision", { _post_id: postId, _change_note: `Active set to ${next}` });
    void loadData();
  };

  const duplicatePost = async (postId: string) => {
    if (!user?.id) return;

    const { data: source, error: sourceError } = await supabaseAny
      .from("blog_posts")
      .select("title,slug,content,excerpt,category_id,featured_image_url,featured_image_alt")
      .eq("id", postId)
      .maybeSingle();

    if (sourceError || !source) {
      toast({ title: "Duplicate failed", description: sourceError?.message || "Post not found.", variant: "destructive" });
      return;
    }

    const { data, error } = await supabaseAny
      .from("blog_posts")
      .insert({
        title: `${source.title} (Copy)`,
        slug: `${source.slug}-copy-${Date.now().toString().slice(-5)}`,
        content: source.content || [],
        excerpt: source.excerpt || source.title,
        author_id: user.id,
        status: "draft",
        is_active: false,
        category_id: source.category_id,
        featured_image_url: source.featured_image_url,
        featured_image_alt: source.featured_image_alt,
      })
      .select("id")
      .maybeSingle();

    if (error || !data?.id) {
      toast({ title: "Duplicate failed", description: error?.message || "Unable to duplicate post.", variant: "destructive" });
      return;
    }

    toast({ title: "Post duplicated", description: "A draft copy was created." });
    void loadData();
  };

  const archivePosts = async (ids: string[]) => {
    if (!ids.length) return;
    const { error } = await supabaseAny.from("blog_posts").update({ status: "archived", is_active: false }).in("id", ids);
    if (error) {
      toast({ title: "Bulk action failed", description: error.message, variant: "destructive" });
      return;
    }

    await Promise.all(ids.map((id) => supabaseAny.rpc("create_blog_post_revision", { _post_id: id, _change_note: "Bulk archived" })));
    setSelected({});
    toast({ title: "Archived", description: `${ids.length} post(s) archived.` });
    void loadData();
  };

  const bulkStatus = async (status: PostRow["status"]) => {
    if (!selectedIds.length) return;
    const payload: Record<string, unknown> = { status };
    if (status === "published") payload.published_date = new Date().toISOString();

    const { error } = await supabaseAny.from("blog_posts").update(payload).in("id", selectedIds);
    if (error) {
      toast({ title: "Bulk action failed", description: error.message, variant: "destructive" });
      return;
    }

    await Promise.all(
      selectedIds.map((id) => supabaseAny.rpc("create_blog_post_revision", { _post_id: id, _change_note: `Bulk status set to ${status}` })),
    );
    setSelected({});
    void loadData();
  };

  return (
    <section className="space-y-4">
      <header className="surface-card flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h1 className="text-2xl">Posts Management</h1>
          <p className="text-sm text-muted-foreground">Manage published, draft, scheduled, and archived posts.</p>
        </div>
        <Button asChild>
          <Link to="/admin/posts/new">
            <Plus className="h-4 w-4" /> Create New Post
          </Link>
        </Button>
      </header>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex flex-wrap gap-2">
            {(["all", ...statuses] as const).map((item) => (
              <Button key={item} size="sm" variant={tab === item ? "default" : "secondary"} onClick={() => setTab(item)}>
                {item === "all" ? "All Posts" : item[0].toUpperCase() + item.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 lg:grid-cols-4">
            <Input placeholder="Search title or slug" value={search} onChange={(event) => setSearch(event.target.value)} />

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Sort by Date</SelectItem>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="views">Sort by Views</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
              </SelectContent>
            </Select>

            <Select value={String(itemsPerPage)} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => void bulkStatus("published")} disabled={!selectedIds.length}>
              Bulk Publish
            </Button>
            <Button size="sm" variant="outline" onClick={() => void bulkStatus("draft")} disabled={!selectedIds.length}>
              Bulk Draft
            </Button>
            <Button size="sm" variant="outline" onClick={() => void archivePosts(selectedIds)} disabled={!selectedIds.length}>
              Bulk Archive
            </Button>
          </div>

          <div className="data-table-wrap overflow-x-auto">
            <table className="data-table min-w-[1050px]">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={pageItems.length > 0 && pageItems.every((item) => selected[item.id])}
                      onChange={(event) => {
                        const checked = event.target.checked;
                        const next = { ...selected };
                        for (const item of pageItems) next[item.id] = checked;
                        setSelected(next);
                      }}
                    />
                  </th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Active</th>
                  <th>Views</th>
                  <th>Published</th>
                  <th>Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(selected[post.id])}
                        onChange={(event) => setSelected((prev) => ({ ...prev, [post.id]: event.target.checked }))}
                      />
                    </td>
                    <td>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{post.title}</p>
                        <p className="text-xs text-muted-foreground">/{post.slug}</p>
                      </div>
                    </td>
                    <td>{post.blog_categories?.name || "Uncategorized"}</td>
                    <td>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>{post.status}</Badge>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`rounded px-2 py-1 text-xs ${post.is_active ? "bg-secondary text-primary" : "bg-secondary text-muted-foreground"}`}
                        onClick={() => void toggleActive(post.id, !post.is_active)}
                      >
                        {post.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td>{post.views_count}</td>
                    <td>{formatDate(post.published_date)}</td>
                    <td>{formatDate(post.updated_at)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Button asChild size="icon" variant="ghost">
                          <Link to={`/admin/posts/edit/${post.id}`} aria-label="Edit post">
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button asChild size="icon" variant="ghost">
                          <Link to={`/blog/${post.slug}`} aria-label="View post" target="_blank" rel="noreferrer">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => void duplicatePost(post.id)} aria-label="Duplicate post">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => void archivePosts([post.id])} aria-label="Archive post">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <p className="text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                Prev
              </Button>
              <span>
                Page {currentPage} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Status Toggle</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pageItems.slice(0, 4).map((post) => (
            <div key={`${post.id}-quick`} className="rounded-lg border border-border p-3">
              <p className="line-clamp-1 font-medium">{post.title}</p>
              <Select value={post.status} onValueChange={(value) => void setStatus(post.id, value as PostRow["status"])}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminPostsList;
