import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";

const AdminFrameworkEditor = () => {
    const { id } = useParams();
    const isEditing = !!id;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {isEditing ? "Edit Framework" : "Add New Framework"}
                </h1>
                <p className="text-muted-foreground">
                    Define framework identity, classification, and implementation details.
                </p>
            </div>

            <div className="surface-card p-8 text-center text-muted-foreground">
                Framework Editor form will be implemented here.
            </div>
        </div>
    );
};

export default AdminFrameworkEditor;
