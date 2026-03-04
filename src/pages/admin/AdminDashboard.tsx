import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <section className="space-y-4">
      <header className="surface-card p-6">
        <h1 className="text-2xl">Blog Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Milestone A is ready: auth, roles, and protected admin shell are active.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">CRUD screens come in Milestone C.</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Moderation module comes in Milestone D.</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscribers</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Newsletter capture/integration module comes in Milestone D.</CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminDashboard;
