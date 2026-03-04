import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const AdminFrameworksList = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cybersecurity Frameworks</h1>
                    <p className="text-muted-foreground">
                        Manage and map industry-standard security frameworks.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/admin/frameworks/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Framework
                    </Link>
                </Button>
            </div>

            <div className="surface-card flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Plus className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold">No frameworks yet</h2>
                <p className="mb-6 text-muted-foreground max-w-md">
                    Start by adding a new framework like ISO 27001, NIST CSF, or SOC 2 to manage domains and controls.
                </p>
                <Button asChild>
                    <Link to="/admin/frameworks/new">Add Framework</Link>
                </Button>
            </div>
        </div>
    );
};

export default AdminFrameworksList;
