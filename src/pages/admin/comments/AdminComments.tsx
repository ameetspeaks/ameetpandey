import { useEffect, useMemo, useState } from "react";
import { Check, MessageSquare, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type CommentRow = {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  status: "pending" | "approved" | "spam" | "trash";
  parent_id: string | null;
  created_at: string;
  blog_posts?: { title?: string } | null;
};

const supabaseAny = supabase as any;

const AdminComments = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CommentRow["status"]>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabaseAny
      .from("blog_comments")
      .select("id,post_id,author_name,author_email,content,status,parent_id,created_at,blog_posts(title)")
      .order("created_at", { ascending: false })
      .limit(500);

    setComments((data || []) as CommentRow[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      comments.filter((comment) => {
        const byStatus = statusFilter === "all" || comment.status === statusFilter;
        const bySearch =
          !search ||
          comment.author_name.toLowerCase().includes(search.toLowerCase()) ||
          comment.author_email.toLowerCase().includes(search.toLowerCase()) ||
          comment.content.toLowerCase().includes(search.toLowerCase());
        return byStatus && bySearch;
      }),
    [comments, search, statusFilter],
  );

  const updateStatus = async (ids: string[], status: CommentRow["status"]) => {
    if (!ids.length) return;
    const { error } = await supabaseAny.from("blog_comments").update({ status }).in("id", ids);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setSelected({});
    void load();
  };

  const quickReply = async (comment: CommentRow) => {
    const content = (replyText[comment.id] || "").trim();
    if (!content) return;

    const { error } = await supabaseAny.from("blog_comments").insert({
      post_id: comment.post_id,
      parent_id: comment.id,
      author_name: "Admin",
      author_email: user?.email || "admin@example.com",
      content,
      status: "approved",
    });

    if (error) {
      toast({ title: "Reply failed", description: error.message, variant: "destructive" });
      return;
    }

    setReplyText((prev) => ({ ...prev, [comment.id]: "" }));
    await updateStatus([comment.id], "approved");
    toast({ title: "Reply posted" });
  };

  const selectedIds = Object.entries(selected).filter(([, value]) => value).map(([id]) => id);

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Comments</h1>
        <p className="text-sm text-muted-foreground">Moderate pending, approved, spam, and trashed comments.</p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-2 md:grid-cols-[1fr_180px]">
            <Input placeholder="Search comments" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="spam">Spam</option>
              <option value="trash">Trash</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => void updateStatus(selectedIds, "approved")}>
              <Check className="h-4 w-4" /> Bulk Approve
            </Button>
            <Button size="sm" variant="outline" onClick={() => void updateStatus(selectedIds, "spam")}>
              Mark Spam
            </Button>
            <Button size="sm" variant="outline" onClick={() => void updateStatus(selectedIds, "trash")}>
              <Trash2 className="h-4 w-4" /> Move Trash
            </Button>
          </div>

          <div className="space-y-3">
            {filtered.map((comment) => (
              <article key={comment.id} className="rounded-lg border border-border p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(selected[comment.id])}
                    onChange={(event) => setSelected((prev) => ({ ...prev, [comment.id]: event.target.checked }))}
                  />
                  <span>{comment.author_name}</span>
                  <span>{comment.author_email}</span>
                  <span>•</span>
                  <span>{new Date(comment.created_at).toLocaleString()}</span>
                  <span>•</span>
                  <span>{comment.blog_posts?.title || "Untitled post"}</span>
                  <Badge variant={comment.status === "approved" ? "default" : "secondary"}>{comment.status}</Badge>
                </div>

                <p className="text-sm leading-6">{comment.content}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => void updateStatus([comment.id], "approved")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void updateStatus([comment.id], "spam")}>
                    Spam
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => void updateStatus([comment.id], "trash")}>
                    Trash
                  </Button>
                </div>

                <div className="mt-3 grid gap-2 md:grid-cols-[1fr_auto]">
                  <Textarea
                    value={replyText[comment.id] || ""}
                    onChange={(event) => setReplyText((prev) => ({ ...prev, [comment.id]: event.target.value }))}
                    placeholder="Quick reply"
                    rows={2}
                  />
                  <Button onClick={() => void quickReply(comment)}>
                    <MessageSquare className="h-4 w-4" /> Reply
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AdminComments;
