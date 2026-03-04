import { supabase } from "@/integrations/supabase/client";

const sb = supabase as any;

export type CmsProjectSummary = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  project_type: string;
  featured_image_url: string | null;
  featured_image_alt: string | null;
  is_featured: boolean;
  published_date: string | null;
  frameworks_used: string[];
  tools_used: string[];
};

export type CmsProjectDetail = {
  project: any;
  sections: any[];
  dataTables: any[];
  risks: any[];
  findings: any[];
  vendorAssessments: any[];
};

export type CmsPolicyDetail = {
  policy: any;
  sections: any[];
  requirements: any[];
};

export const fetchPublishedProjects = async (): Promise<CmsProjectSummary[]> => {
  const { data, error } = await sb
    .from("projects")
    .select(
      "id,title,slug,short_description,project_type,featured_image_url,featured_image_alt,is_featured,published_date,frameworks_used,tools_used",
    )
    .eq("status", "published")
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("published_date", { ascending: false, nullsFirst: false });

  if (error) throw error;
  return data ?? [];
};

export const fetchProjectBySlug = async (slug: string): Promise<CmsProjectDetail | null> => {
  const { data: project, error } = await sb
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!project) return null;

  const [sectionsRes, dataTablesRes, risksRes, findingsRes, vendorRes] = await Promise.all([
    sb
      .from("project_sections")
      .select("*")
      .eq("project_id", project.id)
      .eq("is_visible", true)
      .order("section_order", { ascending: true }),
    sb
      .from("project_data_tables")
      .select("*")
      .eq("project_id", project.id)
      .order("table_order", { ascending: true }),
    sb.from("risk_register_entries").select("*").eq("project_id", project.id).order("risk_score", { ascending: false }),
    sb.from("audit_findings").select("*").eq("project_id", project.id).order("created_at", { ascending: true }),
    sb.from("vendor_assessments").select("*").eq("project_id", project.id).order("created_at", { ascending: true }),
  ]);

  if (sectionsRes.error) throw sectionsRes.error;
  if (dataTablesRes.error) throw dataTablesRes.error;
  if (risksRes.error) throw risksRes.error;
  if (findingsRes.error) throw findingsRes.error;
  if (vendorRes.error) throw vendorRes.error;

  return {
    project,
    sections: sectionsRes.data ?? [],
    dataTables: dataTablesRes.data ?? [],
    risks: risksRes.data ?? [],
    findings: findingsRes.data ?? [],
    vendorAssessments: vendorRes.data ?? [],
  };
};

export const fetchFrameworks = async () => {
  const { data, error } = await sb
    .from("frameworks")
    .select("*")
    .eq("is_active", true)
    .order("framework_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export const fetchPublishedPolicies = async () => {
  const { data, error } = await sb
    .from("security_policies")
    .select("id,policy_name,slug,policy_type,version,effective_date,review_date")
    .eq("status", "published")
    .eq("is_active", true)
    .order("policy_name", { ascending: true });

  if (error) throw error;
  return data ?? [];
};

export const fetchPolicyBySlug = async (slug: string): Promise<CmsPolicyDetail | null> => {
  const { data: policy, error } = await sb
    .from("security_policies")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!policy) return null;

  const [sectionsRes, requirementsRes] = await Promise.all([
    sb.from("policy_sections").select("*").eq("policy_id", policy.id).order("section_order", { ascending: true }),
    sb.from("policy_requirements").select("*").eq("policy_id", policy.id).order("created_at", { ascending: true }),
  ]);

  if (sectionsRes.error) throw sectionsRes.error;
  if (requirementsRes.error) throw requirementsRes.error;

  return {
    policy,
    sections: sectionsRes.data ?? [],
    requirements: requirementsRes.data ?? [],
  };
};
