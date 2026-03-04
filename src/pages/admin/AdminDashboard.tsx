import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <section className="space-y-4">
      <header className="surface-card p-6">
        <h1 className="text-2xl">Blog Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Milestone A is ready: auth, roles, and protected admin shell are active.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Posts Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end text-sm text-muted-foreground">
            <p className="mb-4">Create, edit, and publish blog articles.</p>
            <a href="/admin/posts" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Manage Posts
            </a>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Comment Moderation</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end text-sm text-muted-foreground">
            <p className="mb-4">Review and moderate user comments.</p>
             <a href="/admin/comments" className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
               Manage Comments
            </a>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Newsletter Subscribers</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-end text-sm text-muted-foreground">
             <p className="mb-4">Manage your email newsletter list.</p>
             <a href="/admin/subscribers" className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
               View Subscribers
            </a>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboard;
