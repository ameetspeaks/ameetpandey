import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { frameworkService } from "@/services/frameworks";
import { toast } from "sonner";

export const useFrameworks = () => {
    return useQuery({
        queryKey: ["frameworks"],
        queryFn: () => frameworkService.getAll(),
    });
};

export const useFramework = (id: string | null) => {
    return useQuery({
        queryKey: ["framework", id],
        queryFn: () => (id ? frameworkService.getById(id) : null),
        enabled: !!id,
    });
};

export const useCreateFramework = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: frameworkService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frameworks"] });
            toast.success("Framework created successfully");
        },
        onError: (error: Error) => {
            toast.error(`Error creating framework: ${error.message}`);
        },
    });
};

export const useUpdateFramework = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => frameworkService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["frameworks"] });
            queryClient.invalidateQueries({ queryKey: ["framework", variables.id] });
            toast.success("Framework updated successfully");
        },
        onError: (error: Error) => {
            toast.error(`Error updating framework: ${error.message}`);
        },
    });
};

export const useDeleteFramework = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => frameworkService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["frameworks"] });
            toast.success("Framework deleted successfully");
        },
        onError: (error: Error) => {
            toast.error(`Error deleting framework: ${error.message}`);
        },
    });
};
