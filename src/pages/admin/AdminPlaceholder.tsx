import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminPlaceholder = ({ title, description }: { title: string; description: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{description}</CardContent>
    </Card>
  );
};

export default AdminPlaceholder;
