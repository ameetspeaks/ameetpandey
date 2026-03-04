import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type Framework = Database["public"]["Tables"]["frameworks"]["Row"];
export type FrameworkInsert = Database["public"]["Tables"]["frameworks"]["Insert"];
export type FrameworkUpdate = Database["public"]["Tables"]["frameworks"]["Update"];

export type FrameworkDomain = Database["public"]["Tables"]["framework_domains"]["Row"];
export type FrameworkControl = Database["public"]["Tables"]["framework_controls"]["Row"];
export type ControlMapping = Database["public"]["Tables"]["control_mappings"]["Row"];

export const frameworkService = {
    async getAll() {
        const { data, error } = await supabase
            .from("frameworks")
            .select("*")
            .order("name");
        if (error) throw error;
        return data;
    },

    async getById(id: string) {
        const { data, error } = await supabase
            .from("frameworks")
            .select(`
        *,
        domains:framework_domains(*),
        controls:framework_controls(*)
      `)
            .eq("id", id)
            .single();
        if (error) throw error;
        return data;
    },

    async create(framework: FrameworkInsert) {
        const { data, error } = await supabase
            .from("frameworks")
            .insert(framework)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async update(id: string, framework: FrameworkUpdate) {
        const { data, error } = await supabase
            .from("frameworks")
            .update(framework)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async delete(id: string) {
        const { error } = await supabase
            .from("frameworks")
            .delete()
            .eq("id", id);
        if (error) throw error;
    },

    async getDomains(frameworkId: string) {
        const { data, error } = await supabase
            .from("framework_domains")
            .select("*")
            .eq("framework_id", frameworkId)
            .order("sort_order");
        if (error) throw error;
        return data;
    },

    async getControls(frameworkId: string) {
        const { data, error } = await supabase
            .from("framework_controls")
            .select("*")
            .eq("framework_id", frameworkId)
            .order("control_id");
        if (error) throw error;
        return data;
    },

    async getMappings(sourceFrameworkId: string) {
        const { data, error } = await supabase
            .from("control_mappings")
            .select(`
        *,
        source_control:framework_controls!control_mappings_source_control_id_fkey(*),
        target_control:framework_controls!control_mappings_target_control_id_fkey(*)
      `)
            .filter("source_control.framework_id", "eq", sourceFrameworkId);
        if (error) throw error;
        return data;
    }
};
