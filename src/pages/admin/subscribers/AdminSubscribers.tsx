import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Subscriber = {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  source: string;
  subscribed_at: string;
};

const supabaseAny = supabase as any;

const toCsv = (rows: Subscriber[]) => {
  const headers = ["email", "status", "source", "subscribed_at"];
  const body = rows.map((row) => [row.email, row.status, row.source, row.subscribed_at].map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","));
  return [headers.join(","), ...body].join("\n");
};

const AdminSubscribers = () => {
  const { toast } = useToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Subscriber["status"]>("all");

  const load = async () => {
    const { data } = await supabaseAny.from("blog_subscribers").select("id,email,status,source,subscribed_at").order("subscribed_at", { ascending: false });
    setSubscribers((data || []) as Subscriber[]);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      subscribers.filter((item) => {
        const byStatus = statusFilter === "all" || item.status === statusFilter;
        const bySearch = !search || item.email.toLowerCase().includes(search.toLowerCase()) || item.source.toLowerCase().includes(search.toLowerCase());
        return byStatus && bySearch;
      }),
    [subscribers, statusFilter, search],
  );

  const selectedIds = Object.entries(selected).filter(([, value]) => value).map(([id]) => id);

  const updateStatus = async (ids: string[], status: Subscriber["status"]) => {
    if (!ids.length) return;
    const { error } = await supabaseAny.from("blog_subscribers").update({ status }).in("id", ids);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setSelected({});
    void load();
  };

  const remove = async (ids: string[]) => {
    if (!ids.length) return;
    const { error } = await supabaseAny.from("blog_subscribers").delete().in("id", ids);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setSelected({});
    void load();
  };

  const exportCsv = () => {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importCsv = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const records = lines.slice(1).map((line) => {
      const [email, status, source] = line.split(",").map((part) => part.replace(/^"|"$/g, "").trim());
      return { email, status: status === "unsubscribed" ? "unsubscribed" : "active", source: source || "import" };
    });

    const valid = records.filter((row) => row.email.includes("@"));
    if (!valid.length) {
      toast({ title: "No valid rows found", variant: "destructive" });
      return;
    }

    const { error } = await supabaseAny.from("blog_subscribers").upsert(valid, { onConflict: "email" });
    if (error) {
      toast({ title: "Import failed", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Import complete", description: `${valid.length} subscriber(s) imported.` });
    void load();
    event.target.value = "";
  };

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Subscribers</h1>
        <p className="text-sm text-muted-foreground">Manage newsletter subscribers and export/import CSV lists.</p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="grid gap-2 md:grid-cols-[1fr_180px]">
            <Input placeholder="Search subscribers" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => void updateStatus(selectedIds, "active")}>Activate</Button>
            <Button size="sm" variant="outline" onClick={() => void updateStatus(selectedIds, "unsubscribed")}>Unsubscribe</Button>
            <Button size="sm" variant="outline" onClick={() => void remove(selectedIds)}>
              <Trash2 className="h-4 w-4" /> Remove
            </Button>
            <Button size="sm" variant="outline" onClick={exportCsv}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm">
              <Upload className="h-4 w-4" />
              Import CSV
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={(event) => void importCsv(event)} />
            </label>
          </div>

          <div className="data-table-wrap overflow-x-auto">
            <table className="data-table min-w-[760px]">
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
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Subscribed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={Boolean(selected[subscriber.id])}
                        onChange={(event) => setSelected((prev) => ({ ...prev, [subscriber.id]: event.target.checked }))}
                      />
                    </td>
                    <td>{subscriber.email}</td>
                    <td>{subscriber.status}</td>
                    <td>{subscriber.source}</td>
                    <td>{new Date(subscriber.subscribed_at).toLocaleString()}</td>
                    <td>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => void updateStatus([subscriber.id], subscriber.status === "active" ? "unsubscribed" : "active")}>Toggle</Button>
                        <Button size="sm" variant="ghost" onClick={() => void remove([subscriber.id])}>
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
    </section>
  );
};

export default AdminSubscribers;
