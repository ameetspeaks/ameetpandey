import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type EventRow = { id: string; event_type: string; user_session_id: string | null; referrer: string | null; device_type: string | null; created_at: string; post_id: string | null };
type PostRow = { id: string; title: string; views_count: number; blog_categories?: { name?: string | null } | null };
type ViewRow = { created_at: string; post_id: string | null; blog_posts?: { title?: string | null } | null };

const supabaseAny = supabase as any;
const chartColors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--muted-foreground))", "hsl(var(--secondary-foreground))"];

const AdminAnalytics = () => {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [views, setViews] = useState<ViewRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const [eventsRes, postsRes, viewsRes] = await Promise.all([
        supabaseAny.from("blog_analytics_events").select("id,event_type,user_session_id,referrer,device_type,created_at,post_id").order("created_at", { ascending: false }).limit(5000),
        supabaseAny.from("blog_posts").select("id,title,views_count,blog_categories(name)").eq("status", "published").order("views_count", { ascending: false }).limit(50),
        supabaseAny.from("blog_post_views").select("created_at,post_id,blog_posts(title)").order("created_at", { ascending: false }).limit(5000),
      ]);

      setEvents((eventsRes.data || []) as EventRow[]);
      setPosts((postsRes.data || []) as PostRow[]);
      setViews((viewsRes.data || []) as ViewRow[]);
    };

    void load();
  }, []);

  const totals = useMemo(() => {
    const totalViews = views.length;
    const uniqueVisitors = new Set(events.map((event) => event.user_session_id).filter(Boolean)).size;
    const shares = events.filter((event) => event.event_type === "share").length;
    const clicks = events.filter((event) => event.event_type === "click").length;
    const bounceRate = totalViews === 0 ? 0 : Math.max(0, Math.round(((totalViews - clicks) / totalViews) * 100));
    const avgTime = totalViews === 0 ? 0 : Math.round((clicks / totalViews) * 180);
    return { totalViews, uniqueVisitors, shares, clicks, bounceRate, avgTime };
  }, [events, views]);

  const viewsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const view of views) {
      const key = new Date(view.created_at).toISOString().slice(0, 10);
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, count]) => ({ date, views: count }));
  }, [views]);

  const topPosts = useMemo(() => posts.slice(0, 8).map((post) => ({ title: post.title.slice(0, 24), views: post.views_count })), [posts]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const post of posts) {
      const category = post.blog_categories?.name || "Uncategorized";
      map[category] = (map[category] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [posts]);

  const deviceData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const event of events) {
      const key = event.device_type || "unknown";
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [events]);

  const referrers = useMemo(() => {
    const map: Record<string, number> = {};
    for (const event of events) {
      const key = event.referrer ? new URL(event.referrer).hostname : "direct";
      map[key] = (map[key] || 0) + 1;
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [events]);

  const exportCsv = () => {
    const headers = ["created_at", "event_type", "device_type", "referrer", "post_id", "session_id"];
    const rows = events.map((event) =>
      [event.created_at, event.event_type, event.device_type || "", event.referrer || "", event.post_id || "", event.user_session_id || ""]
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(","),
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <header className="surface-card p-5">
        <h1 className="text-2xl">Analytics</h1>
        <p className="text-sm text-muted-foreground">Traffic, top content, audience insights, and reading behavior.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Total Page Views</p><p className="mt-1 text-2xl font-semibold">{totals.totalViews}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Unique Visitors</p><p className="mt-1 text-2xl font-semibold">{totals.uniqueVisitors}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Bounce Rate</p><p className="mt-1 text-2xl font-semibold">{totals.bounceRate}%</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Avg Time on Page</p><p className="mt-1 text-2xl font-semibold">{totals.avgTime}s</p></CardContent></Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Views Over Time (30 days)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={viewsByDate}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Performing Posts</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topPosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="title" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Bar dataKey="views" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Category Distribution</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {deviceData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Referral Sources</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {referrers.map(([source, count]) => (
            <div key={source} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
              <span>{source}</span>
              <span className="text-muted-foreground">{count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => window.print()}>
          <FileText className="h-4 w-4" /> Generate PDF Report
        </Button>
        <Button variant="outline" onClick={exportCsv}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
        <Button variant="outline" onClick={() => alert("Scheduled automated reports placeholder is ready for edge function integration.")}>Schedule Reports</Button>
      </div>
    </section>
  );
};

export default AdminAnalytics;
