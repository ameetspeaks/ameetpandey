-- Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_publication_status') THEN
    CREATE TYPE public.cms_publication_status AS ENUM ('draft','under_review','published','archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type_enum') THEN
    CREATE TYPE public.project_type_enum AS ENUM ('risk_assessment','it_audit','vendor_assessment','compliance_mapping','policy_development','framework_implementation');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_risk_level') THEN
    CREATE TYPE public.project_risk_level AS ENUM ('low','medium','high','critical');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_section_type_enum') THEN
    CREATE TYPE public.project_section_type_enum AS ENUM ('overview','methodology','findings','analysis','recommendations','conclusion','custom');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_data_table_type_enum') THEN
    CREATE TYPE public.project_data_table_type_enum AS ENUM ('risk_register','asset_inventory','threat_analysis','control_mapping','audit_findings','gap_analysis','vendor_scorecard');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_likelihood_level') THEN
    CREATE TYPE public.risk_likelihood_level AS ENUM ('low','medium','high');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_impact_level') THEN
    CREATE TYPE public.risk_impact_level AS ENUM ('low','medium','high');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_effectiveness_level') THEN
    CREATE TYPE public.control_effectiveness_level AS ENUM ('ineffective','partially_effective','effective');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_entry_status_enum') THEN
    CREATE TYPE public.risk_entry_status_enum AS ENUM ('identified','in_progress','mitigated','accepted','transferred');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level_enum') THEN
    CREATE TYPE public.priority_level_enum AS ENUM ('low','medium','high','critical');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_finding_status_enum') THEN
    CREATE TYPE public.audit_finding_status_enum AS ENUM ('open','in_progress','resolved','accepted','deferred');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_data_access_level_enum') THEN
    CREATE TYPE public.vendor_data_access_level_enum AS ENUM ('none','public','internal','confidential','restricted');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_criteria_category_enum') THEN
    CREATE TYPE public.vendor_criteria_category_enum AS ENUM ('data_protection','access_control','incident_response','compliance','business_continuity','physical_security');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vendor_criteria_rating_enum') THEN
    CREATE TYPE public.vendor_criteria_rating_enum AS ENUM ('compliant','partially_compliant','non_compliant','not_applicable');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'policy_type_enum') THEN
    CREATE TYPE public.policy_type_enum AS ENUM ('access_control','password','data_classification','incident_response','acceptable_use','byod','backup','encryption','remote_access','vendor_management');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'policy_content_type_enum') THEN
    CREATE TYPE public.policy_content_type_enum AS ENUM ('paragraph','numbered_list','bullet_list','table','requirement');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'policy_requirement_type_enum') THEN
    CREATE TYPE public.policy_requirement_type_enum AS ENUM ('shall','should','may');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'framework_type_enum') THEN
    CREATE TYPE public.framework_type_enum AS ENUM ('security_standard','compliance_framework','control_framework','risk_framework','audit_standard');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'implementation_complexity_enum') THEN
    CREATE TYPE public.implementation_complexity_enum AS ENUM ('low','medium','high');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_size_enum') THEN
    CREATE TYPE public.org_size_enum AS ENUM ('startup','sme','enterprise');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'framework_control_type_enum') THEN
    CREATE TYPE public.framework_control_type_enum AS ENUM ('preventive','detective','corrective','compensating');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_mapping_type_enum') THEN
    CREATE TYPE public.control_mapping_type_enum AS ENUM ('equivalent','similar','partial','related');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_implementation_status_enum') THEN
    CREATE TYPE public.control_implementation_status_enum AS ENUM ('not_started','planned','in_progress','implemented','verified','not_applicable');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'control_effectiveness_rating_enum') THEN
    CREATE TYPE public.control_effectiveness_rating_enum AS ENUM ('not_effective','partially_effective','largely_effective','fully_effective');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_status_enum') THEN
    CREATE TYPE public.compliance_status_enum AS ENUM ('compliant','partially_compliant','non_compliant','not_applicable');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_category_type_enum') THEN
    CREATE TYPE public.cms_category_type_enum AS ENUM ('project','blog','resource');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_tag_type_enum') THEN
    CREATE TYPE public.cms_tag_type_enum AS ENUM ('framework','tool','skill','industry','technology');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_content_type_enum') THEN
    CREATE TYPE public.cms_content_type_enum AS ENUM ('project','blog_post','policy','framework');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cms_media_file_type_enum') THEN
    CREATE TYPE public.cms_media_file_type_enum AS ENUM ('image','document','video','other');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_action_enum') THEN
    CREATE TYPE public.activity_action_enum AS ENUM ('create','update','delete','publish','unpublish','approve','reject','restore');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_action_enum') THEN
    CREATE TYPE public.approval_action_enum AS ENUM ('submit_review','approve_publish','archive','restore','reject');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'analytics_device_type_enum') THEN
    CREATE TYPE public.analytics_device_type_enum AS ENUM ('desktop','tablet','mobile');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'download_content_type_enum') THEN
    CREATE TYPE public.download_content_type_enum AS ENUM ('project','policy','resume','resource');
  END IF;
END $$;

-- Core content tables
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  project_type public.project_type_enum NOT NULL,
  status public.cms_publication_status NOT NULL DEFAULT 'draft',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  featured_image_url TEXT,
  featured_image_alt TEXT,
  short_description TEXT,
  objective TEXT,
  scope TEXT,
  methodology TEXT,
  timeline TEXT,
  frameworks_used TEXT[] NOT NULL DEFAULT '{}',
  tools_used TEXT[] NOT NULL DEFAULT '{}',
  risk_level public.project_risk_level,
  compliance_status TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  download_count INTEGER NOT NULL DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  published_date TIMESTAMPTZ,
  last_modified_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.project_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section_type public.project_section_type_enum NOT NULL DEFAULT 'custom',
  section_title TEXT NOT NULL,
  section_order INTEGER NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (project_id, section_order)
);

CREATE TABLE IF NOT EXISTS public.project_data_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.project_sections(id) ON DELETE SET NULL,
  table_type public.project_data_table_type_enum NOT NULL,
  table_title TEXT NOT NULL,
  table_order INTEGER NOT NULL DEFAULT 0,
  column_definitions JSONB NOT NULL DEFAULT '[]'::jsonb,
  table_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  show_totals BOOLEAN NOT NULL DEFAULT false,
  show_filters BOOLEAN NOT NULL DEFAULT true,
  allow_export BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.risk_register_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  risk_id TEXT NOT NULL,
  asset_name TEXT,
  threat_description TEXT NOT NULL,
  vulnerability_description TEXT NOT NULL,
  likelihood public.risk_likelihood_level NOT NULL DEFAULT 'low',
  likelihood_score INTEGER NOT NULL DEFAULT 1,
  impact public.risk_impact_level NOT NULL DEFAULT 'low',
  impact_score INTEGER NOT NULL DEFAULT 1,
  risk_score INTEGER NOT NULL DEFAULT 1,
  risk_level public.project_risk_level NOT NULL DEFAULT 'low',
  existing_controls TEXT,
  control_effectiveness public.control_effectiveness_level,
  recommended_controls TEXT NOT NULL,
  iso_control_reference TEXT,
  nist_control_reference TEXT,
  priority public.priority_level_enum NOT NULL DEFAULT 'medium',
  owner TEXT,
  target_completion_date DATE,
  status public.risk_entry_status_enum NOT NULL DEFAULT 'identified',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, risk_id)
);

CREATE TABLE IF NOT EXISTS public.audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  finding_id TEXT NOT NULL,
  control_area TEXT NOT NULL,
  finding_title TEXT NOT NULL,
  finding_description TEXT NOT NULL,
  risk_rating public.project_risk_level NOT NULL DEFAULT 'medium',
  likelihood public.risk_likelihood_level,
  impact public.risk_impact_level,
  root_cause TEXT,
  evidence_description TEXT,
  evidence_references TEXT[] NOT NULL DEFAULT '{}',
  recommendation TEXT NOT NULL,
  management_response TEXT,
  affected_systems TEXT[] NOT NULL DEFAULT '{}',
  compliance_reference TEXT,
  owner TEXT,
  due_date DATE,
  status public.audit_finding_status_enum NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, finding_id)
);

CREATE TABLE IF NOT EXISTS public.vendor_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  vendor_type TEXT,
  service_description TEXT,
  data_access_level public.vendor_data_access_level_enum,
  assessment_date DATE,
  assessor_name TEXT,
  overall_risk_rating public.project_risk_level NOT NULL DEFAULT 'medium',
  certifications JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vendor_assessment_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_assessment_id UUID NOT NULL REFERENCES public.vendor_assessments(id) ON DELETE CASCADE,
  category public.vendor_criteria_category_enum NOT NULL,
  question TEXT NOT NULL,
  response TEXT,
  evidence TEXT,
  rating public.vendor_criteria_rating_enum,
  risk_level public.project_risk_level,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_name TEXT NOT NULL UNIQUE,
  policy_type public.policy_type_enum NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  version TEXT NOT NULL DEFAULT '1.0',
  status public.cms_publication_status NOT NULL DEFAULT 'draft',
  is_active BOOLEAN NOT NULL DEFAULT false,
  effective_date DATE,
  review_date DATE,
  next_review_date DATE,
  purpose TEXT NOT NULL,
  scope TEXT NOT NULL,
  owner TEXT NOT NULL,
  approver TEXT,
  approval_date DATE,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.policy_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.security_policies(id) ON DELETE CASCADE,
  section_number TEXT,
  section_title TEXT NOT NULL,
  section_order INTEGER NOT NULL,
  parent_section_id UUID REFERENCES public.policy_sections(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  content_type public.policy_content_type_enum NOT NULL DEFAULT 'paragraph',
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(policy_id, section_order)
);

CREATE TABLE IF NOT EXISTS public.policy_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.security_policies(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.policy_sections(id) ON DELETE SET NULL,
  requirement_id TEXT,
  requirement_text TEXT NOT NULL,
  requirement_type public.policy_requirement_type_enum NOT NULL,
  applicable_roles TEXT[] NOT NULL DEFAULT '{}',
  applicable_systems TEXT[] NOT NULL DEFAULT '{}',
  compliance_verification_method TEXT,
  enforcement_mechanism TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(policy_id, requirement_id)
);

CREATE TABLE IF NOT EXISTS public.frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_name TEXT NOT NULL UNIQUE,
  framework_code TEXT UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  issuing_organization TEXT NOT NULL,
  version TEXT,
  publication_date DATE,
  framework_type public.framework_type_enum NOT NULL,
  description TEXT NOT NULL,
  purpose TEXT,
  scope TEXT,
  certification_available BOOLEAN NOT NULL DEFAULT false,
  certification_body TEXT,
  implementation_complexity public.implementation_complexity_enum,
  typical_implementation_time TEXT,
  target_organization_size public.org_size_enum[] NOT NULL DEFAULT '{}',
  target_industries TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  official_website_url TEXT,
  documentation_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.framework_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES public.frameworks(id) ON DELETE CASCADE,
  domain_code TEXT NOT NULL,
  domain_name TEXT NOT NULL,
  domain_description TEXT,
  domain_order INTEGER NOT NULL DEFAULT 0,
  parent_domain_id UUID REFERENCES public.framework_domains(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(framework_id, domain_code)
);

CREATE TABLE IF NOT EXISTS public.framework_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES public.frameworks(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES public.framework_domains(id) ON DELETE SET NULL,
  control_id TEXT NOT NULL,
  control_name TEXT NOT NULL,
  control_description TEXT NOT NULL,
  control_type public.framework_control_type_enum,
  implementation_guidance TEXT,
  is_mandatory BOOLEAN NOT NULL DEFAULT false,
  applicability_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(framework_id, control_id)
);

CREATE TABLE IF NOT EXISTS public.control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_control_id UUID NOT NULL REFERENCES public.framework_controls(id) ON DELETE CASCADE,
  target_control_id UUID NOT NULL REFERENCES public.framework_controls(id) ON DELETE CASCADE,
  mapping_type public.control_mapping_type_enum NOT NULL,
  mapping_notes TEXT,
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verification_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_control_id, target_control_id)
);

CREATE TABLE IF NOT EXISTS public.control_implementations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.framework_controls(id) ON DELETE CASCADE,
  implementation_status public.control_implementation_status_enum NOT NULL DEFAULT 'not_started',
  implementation_date DATE,
  implementation_description TEXT,
  evidence_location TEXT,
  effectiveness_rating public.control_effectiveness_rating_enum,
  testing_date DATE,
  tested_by TEXT,
  gaps_identified TEXT,
  remediation_plan TEXT,
  owner TEXT,
  target_completion_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, control_id)
);

CREATE TABLE IF NOT EXISTS public.compliance_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  framework_id UUID NOT NULL REFERENCES public.frameworks(id) ON DELETE CASCADE,
  control_id UUID NOT NULL REFERENCES public.framework_controls(id) ON DELETE CASCADE,
  compliance_status public.compliance_status_enum NOT NULL DEFAULT 'not_applicable',
  gap_description TEXT,
  evidence_references TEXT[] NOT NULL DEFAULT '{}',
  assessed_date DATE,
  assessor TEXT,
  remediation_required BOOLEAN NOT NULL DEFAULT false,
  remediation_priority public.priority_level_enum,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, framework_id, control_id)
);

-- Supporting CMS tables
CREATE TABLE IF NOT EXISTS public.cms_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.cms_categories(id) ON DELETE SET NULL,
  category_type public.cms_category_type_enum NOT NULL,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  tag_type public.cms_tag_type_enum NOT NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_content_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_id UUID NOT NULL REFERENCES public.cms_tags(id) ON DELETE CASCADE,
  content_type public.cms_content_type_enum NOT NULL,
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tag_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS public.cms_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT,
  file_path TEXT NOT NULL UNIQUE,
  file_size BIGINT,
  mime_type TEXT,
  file_type public.cms_media_file_type_enum NOT NULL DEFAULT 'other',
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  usage_count INTEGER NOT NULL DEFAULT 0,
  used_in JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Governance and analytics
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action public.activity_action_enum NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  changes JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  changed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  change_summary TEXT,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_type, content_id, version_number)
);

CREATE TABLE IF NOT EXISTS public.content_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  from_status public.cms_publication_status,
  to_status public.cms_publication_status NOT NULL,
  action public.approval_action_enum NOT NULL,
  notes TEXT,
  performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type public.cms_content_type_enum NOT NULL,
  content_id UUID NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT,
  referrer TEXT,
  device_type public.analytics_device_type_enum,
  time_on_page INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type public.download_content_type_enum NOT NULL,
  content_id UUID,
  file_type TEXT,
  session_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON public.projects(project_type);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_is_active ON public.projects(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_published_date ON public.projects(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_by ON public.projects(created_by);

CREATE INDEX IF NOT EXISTS idx_project_sections_project_id ON public.project_sections(project_id);
CREATE INDEX IF NOT EXISTS idx_project_sections_order ON public.project_sections(project_id, section_order);

CREATE INDEX IF NOT EXISTS idx_project_data_tables_project_id ON public.project_data_tables(project_id);
CREATE INDEX IF NOT EXISTS idx_project_data_tables_type ON public.project_data_tables(table_type);

CREATE INDEX IF NOT EXISTS idx_risk_register_entries_project_id ON public.risk_register_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_risk_register_entries_risk_level ON public.risk_register_entries(risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_register_entries_priority ON public.risk_register_entries(priority);
CREATE INDEX IF NOT EXISTS idx_risk_register_entries_status ON public.risk_register_entries(status);

CREATE INDEX IF NOT EXISTS idx_audit_findings_project_id ON public.audit_findings(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_findings_risk_rating ON public.audit_findings(risk_rating);
CREATE INDEX IF NOT EXISTS idx_audit_findings_status ON public.audit_findings(status);

CREATE INDEX IF NOT EXISTS idx_vendor_assessments_project_id ON public.vendor_assessments(project_id);
CREATE INDEX IF NOT EXISTS idx_vendor_assessments_risk_rating ON public.vendor_assessments(overall_risk_rating);
CREATE INDEX IF NOT EXISTS idx_vendor_assessment_criteria_assessment_id ON public.vendor_assessment_criteria(vendor_assessment_id);
CREATE INDEX IF NOT EXISTS idx_vendor_assessment_criteria_category ON public.vendor_assessment_criteria(category);

CREATE INDEX IF NOT EXISTS idx_security_policies_policy_type ON public.security_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_status ON public.security_policies(status);
CREATE INDEX IF NOT EXISTS idx_security_policies_is_active ON public.security_policies(is_active);

CREATE INDEX IF NOT EXISTS idx_policy_sections_policy_id ON public.policy_sections(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_sections_order ON public.policy_sections(policy_id, section_order);
CREATE INDEX IF NOT EXISTS idx_policy_requirements_policy_id ON public.policy_requirements(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_requirements_requirement_type ON public.policy_requirements(requirement_type);

CREATE INDEX IF NOT EXISTS idx_frameworks_framework_code ON public.frameworks(framework_code);
CREATE INDEX IF NOT EXISTS idx_frameworks_framework_type ON public.frameworks(framework_type);
CREATE INDEX IF NOT EXISTS idx_framework_domains_framework_id ON public.framework_domains(framework_id);
CREATE INDEX IF NOT EXISTS idx_framework_domains_domain_code ON public.framework_domains(domain_code);
CREATE INDEX IF NOT EXISTS idx_framework_controls_framework_id ON public.framework_controls(framework_id);
CREATE INDEX IF NOT EXISTS idx_framework_controls_domain_id ON public.framework_controls(domain_id);
CREATE INDEX IF NOT EXISTS idx_framework_controls_control_id ON public.framework_controls(control_id);

CREATE INDEX IF NOT EXISTS idx_control_mappings_source ON public.control_mappings(source_control_id);
CREATE INDEX IF NOT EXISTS idx_control_mappings_target ON public.control_mappings(target_control_id);

CREATE INDEX IF NOT EXISTS idx_control_implementations_project_id ON public.control_implementations(project_id);
CREATE INDEX IF NOT EXISTS idx_control_implementations_control_id ON public.control_implementations(control_id);
CREATE INDEX IF NOT EXISTS idx_control_implementations_status ON public.control_implementations(implementation_status);

CREATE INDEX IF NOT EXISTS idx_compliance_mappings_project_id ON public.compliance_mappings(project_id);
CREATE INDEX IF NOT EXISTS idx_compliance_mappings_framework_id ON public.compliance_mappings(framework_id);
CREATE INDEX IF NOT EXISTS idx_compliance_mappings_status ON public.compliance_mappings(compliance_status);

CREATE INDEX IF NOT EXISTS idx_cms_categories_category_type ON public.cms_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_cms_tags_tag_type ON public.cms_tags(tag_type);
CREATE INDEX IF NOT EXISTS idx_cms_content_tags_tag_id ON public.cms_content_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_cms_content_tags_content ON public.cms_content_tags(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_cms_media_uploaded_by ON public.cms_media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_cms_media_file_type ON public.cms_media(file_type);

CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_content_versions_lookup ON public.content_versions(content_type, content_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_content_versions_is_current ON public.content_versions(content_type, content_id) WHERE is_current = true;
CREATE INDEX IF NOT EXISTS idx_content_approvals_lookup ON public.content_approvals(content_type, content_id, performed_at DESC);

CREATE INDEX IF NOT EXISTS idx_page_views_content ON public.page_views(content_type, content_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_downloads_content ON public.downloads(content_type, content_id, created_at DESC);

-- Trigger functions
CREATE OR REPLACE FUNCTION public.cms_prepare_project()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.title := btrim(NEW.title);
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.title));
  NEW.featured_image_alt := NULLIF(btrim(NEW.featured_image_alt), '');
  NEW.short_description := NULLIF(btrim(NEW.short_description), '');
  NEW.objective := NULLIF(btrim(NEW.objective), '');
  NEW.scope := NULLIF(btrim(NEW.scope), '');
  NEW.methodology := NULLIF(btrim(NEW.methodology), '');
  NEW.timeline := NULLIF(btrim(NEW.timeline), '');
  NEW.compliance_status := NULLIF(btrim(NEW.compliance_status), '');
  NEW.meta_title := NULLIF(btrim(NEW.meta_title), '');
  NEW.meta_description := NULLIF(btrim(NEW.meta_description), '');
  NEW.frameworks_used := COALESCE(NEW.frameworks_used, '{}');
  NEW.tools_used := COALESCE(NEW.tools_used, '{}');
  NEW.keywords := COALESCE(NEW.keywords, '{}');
  NEW.last_modified_date := now();

  IF NEW.title IS NULL OR NEW.title = '' OR char_length(NEW.title) > 220 THEN
    RAISE EXCEPTION 'Invalid project title';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' OR char_length(NEW.slug) > 260 THEN
    RAISE EXCEPTION 'Invalid project slug';
  END IF;

  IF NEW.short_description IS NOT NULL AND char_length(NEW.short_description) > 300 THEN
    RAISE EXCEPTION 'Project short description cannot exceed 300 characters';
  END IF;

  IF NEW.status = 'published' AND NEW.published_date IS NULL THEN
    NEW.published_date := now();
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_prepare_security_policy()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.policy_name := btrim(NEW.policy_name);
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.policy_name));
  NEW.version := COALESCE(NULLIF(btrim(NEW.version), ''), '1.0');
  NEW.purpose := btrim(NEW.purpose);
  NEW.scope := btrim(NEW.scope);
  NEW.owner := btrim(NEW.owner);
  NEW.approver := NULLIF(btrim(NEW.approver), '');

  IF NEW.policy_name IS NULL OR NEW.policy_name = '' OR char_length(NEW.policy_name) > 220 THEN
    RAISE EXCEPTION 'Invalid policy name';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' OR char_length(NEW.slug) > 260 THEN
    RAISE EXCEPTION 'Invalid policy slug';
  END IF;

  IF NEW.purpose IS NULL OR NEW.purpose = '' THEN
    RAISE EXCEPTION 'Policy purpose is required';
  END IF;

  IF NEW.scope IS NULL OR NEW.scope = '' THEN
    RAISE EXCEPTION 'Policy scope is required';
  END IF;

  IF NEW.status = 'published' AND NEW.effective_date IS NULL THEN
    NEW.effective_date := CURRENT_DATE;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_prepare_framework()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.framework_name := btrim(NEW.framework_name);
  NEW.framework_code := NULLIF(upper(btrim(NEW.framework_code)), '');
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.framework_name));
  NEW.issuing_organization := btrim(NEW.issuing_organization);
  NEW.description := btrim(NEW.description);
  NEW.purpose := NULLIF(btrim(NEW.purpose), '');
  NEW.scope := NULLIF(btrim(NEW.scope), '');
  NEW.certification_body := NULLIF(btrim(NEW.certification_body), '');
  NEW.typical_implementation_time := NULLIF(btrim(NEW.typical_implementation_time), '');
  NEW.official_website_url := NULLIF(btrim(NEW.official_website_url), '');
  NEW.documentation_url := NULLIF(btrim(NEW.documentation_url), '');
  NEW.target_organization_size := COALESCE(NEW.target_organization_size, '{}');
  NEW.target_industries := COALESCE(NEW.target_industries, '{}');

  IF NEW.framework_name IS NULL OR NEW.framework_name = '' THEN
    RAISE EXCEPTION 'Framework name is required';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    RAISE EXCEPTION 'Framework slug is required';
  END IF;

  IF NEW.issuing_organization IS NULL OR NEW.issuing_organization = '' THEN
    RAISE EXCEPTION 'Framework issuing organization is required';
  END IF;

  IF NEW.description IS NULL OR NEW.description = '' THEN
    RAISE EXCEPTION 'Framework description is required';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_prepare_taxonomy()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.name := btrim(NEW.name);
  NEW.slug := public.slugify_text(COALESCE(NULLIF(btrim(NEW.slug), ''), NEW.name));
  NEW.description := NULLIF(btrim(NEW.description), '');

  IF NEW.name IS NULL OR NEW.name = '' OR char_length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Invalid taxonomy name';
  END IF;

  IF NEW.slug IS NULL OR NEW.slug = '' OR char_length(NEW.slug) > 160 THEN
    RAISE EXCEPTION 'Invalid taxonomy slug';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_validate_project_data_table()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF jsonb_typeof(NEW.column_definitions) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'column_definitions must be a JSON array';
  END IF;

  IF jsonb_typeof(NEW.table_data) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'table_data must be a JSON array';
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_calculate_risk_register_entry()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.likelihood_score < 1 OR NEW.likelihood_score > 5 THEN
    RAISE EXCEPTION 'likelihood_score must be between 1 and 5';
  END IF;

  IF NEW.impact_score < 1 OR NEW.impact_score > 5 THEN
    RAISE EXCEPTION 'impact_score must be between 1 and 5';
  END IF;

  NEW.risk_score := NEW.likelihood_score * NEW.impact_score;

  NEW.risk_level := CASE
    WHEN NEW.risk_score <= 4 THEN 'low'::public.project_risk_level
    WHEN NEW.risk_score <= 9 THEN 'medium'::public.project_risk_level
    WHEN NEW.risk_score <= 16 THEN 'high'::public.project_risk_level
    ELSE 'critical'::public.project_risk_level
  END;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_validate_status_transition()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    IF OLD.status = 'draft' AND NEW.status NOT IN ('under_review', 'published', 'archived') THEN
      RAISE EXCEPTION 'Invalid status transition from draft to %', NEW.status;
    ELSIF OLD.status = 'under_review' AND NEW.status NOT IN ('draft', 'published', 'archived') THEN
      RAISE EXCEPTION 'Invalid status transition from under_review to %', NEW.status;
    ELSIF OLD.status = 'published' AND NEW.status NOT IN ('under_review', 'archived') THEN
      RAISE EXCEPTION 'Invalid status transition from published to %', NEW.status;
    ELSIF OLD.status = 'archived' AND NEW.status NOT IN ('draft', 'published') THEN
      RAISE EXCEPTION 'Invalid status transition from archived to %', NEW.status;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cms_capture_activity_and_version()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_content_type TEXT := TG_TABLE_NAME;
  v_content_id UUID;
  v_snapshot JSONB;
  v_action public.activity_action_enum;
  v_changed_by UUID := auth.uid();
  v_next_version INTEGER;
  v_changes JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_content_id := OLD.id;
    v_snapshot := to_jsonb(OLD);
    v_action := 'delete';
    v_changes := jsonb_build_object('old', to_jsonb(OLD));
  ELSIF TG_OP = 'INSERT' THEN
    v_content_id := NEW.id;
    v_snapshot := to_jsonb(NEW);
    v_action := 'create';
    v_changes := jsonb_build_object('new', to_jsonb(NEW));
  ELSE
    v_content_id := NEW.id;
    v_snapshot := to_jsonb(NEW);
    v_action := 'update';
    v_changes := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));

    IF to_jsonb(OLD) ? 'status' AND to_jsonb(NEW) ? 'status' THEN
      IF (to_jsonb(OLD)->>'status') <> (to_jsonb(NEW)->>'status') THEN
        IF to_jsonb(NEW)->>'status' = 'published' THEN
          v_action := 'publish';
        ELSIF to_jsonb(OLD)->>'status' = 'published' AND to_jsonb(NEW)->>'status' <> 'published' THEN
          v_action := 'unpublish';
        ELSIF to_jsonb(NEW)->>'status' = 'archived' THEN
          v_action := 'reject';
        END IF;
      END IF;
    END IF;
  END IF;

  INSERT INTO public.activity_log (user_id, action, entity_type, entity_id, changes)
  VALUES (v_changed_by, v_action, v_content_type, v_content_id, v_changes);

  UPDATE public.content_versions
  SET is_current = false
  WHERE content_type = v_content_type
    AND content_id = v_content_id
    AND is_current = true;

  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO v_next_version
  FROM public.content_versions
  WHERE content_type = v_content_type
    AND content_id = v_content_id;

  INSERT INTO public.content_versions (
    content_type,
    content_id,
    version_number,
    content_snapshot,
    changed_by,
    change_summary,
    is_current
  )
  VALUES (
    v_content_type,
    v_content_id,
    v_next_version,
    v_snapshot,
    v_changed_by,
    CASE TG_OP WHEN 'INSERT' THEN 'Created' WHEN 'UPDATE' THEN 'Updated' ELSE 'Deleted' END,
    true
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

-- Triggers for normalization/validation
DROP TRIGGER IF EXISTS trg_projects_prepare ON public.projects;
CREATE TRIGGER trg_projects_prepare
BEFORE INSERT OR UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.cms_prepare_project();

DROP TRIGGER IF EXISTS trg_projects_status_transition ON public.projects;
CREATE TRIGGER trg_projects_status_transition
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.cms_validate_status_transition();

DROP TRIGGER IF EXISTS trg_project_data_tables_validate_json ON public.project_data_tables;
CREATE TRIGGER trg_project_data_tables_validate_json
BEFORE INSERT OR UPDATE ON public.project_data_tables
FOR EACH ROW EXECUTE FUNCTION public.cms_validate_project_data_table();

DROP TRIGGER IF EXISTS trg_risk_register_entries_score ON public.risk_register_entries;
CREATE TRIGGER trg_risk_register_entries_score
BEFORE INSERT OR UPDATE ON public.risk_register_entries
FOR EACH ROW EXECUTE FUNCTION public.cms_calculate_risk_register_entry();

DROP TRIGGER IF EXISTS trg_security_policies_prepare ON public.security_policies;
CREATE TRIGGER trg_security_policies_prepare
BEFORE INSERT OR UPDATE ON public.security_policies
FOR EACH ROW EXECUTE FUNCTION public.cms_prepare_security_policy();

DROP TRIGGER IF EXISTS trg_security_policies_status_transition ON public.security_policies;
CREATE TRIGGER trg_security_policies_status_transition
BEFORE UPDATE ON public.security_policies
FOR EACH ROW EXECUTE FUNCTION public.cms_validate_status_transition();

DROP TRIGGER IF EXISTS trg_frameworks_prepare ON public.frameworks;
CREATE TRIGGER trg_frameworks_prepare
BEFORE INSERT OR UPDATE ON public.frameworks
FOR EACH ROW EXECUTE FUNCTION public.cms_prepare_framework();

DROP TRIGGER IF EXISTS trg_cms_categories_prepare ON public.cms_categories;
CREATE TRIGGER trg_cms_categories_prepare
BEFORE INSERT OR UPDATE ON public.cms_categories
FOR EACH ROW EXECUTE FUNCTION public.cms_prepare_taxonomy();

DROP TRIGGER IF EXISTS trg_cms_tags_prepare ON public.cms_tags;
CREATE TRIGGER trg_cms_tags_prepare
BEFORE INSERT OR UPDATE ON public.cms_tags
FOR EACH ROW EXECUTE FUNCTION public.cms_prepare_taxonomy();

-- Updated-at triggers
DROP TRIGGER IF EXISTS trg_project_sections_updated_at ON public.project_sections;
CREATE TRIGGER trg_project_sections_updated_at BEFORE UPDATE ON public.project_sections FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_project_data_tables_updated_at ON public.project_data_tables;
CREATE TRIGGER trg_project_data_tables_updated_at BEFORE UPDATE ON public.project_data_tables FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_risk_register_entries_updated_at ON public.risk_register_entries;
CREATE TRIGGER trg_risk_register_entries_updated_at BEFORE UPDATE ON public.risk_register_entries FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_audit_findings_updated_at ON public.audit_findings;
CREATE TRIGGER trg_audit_findings_updated_at BEFORE UPDATE ON public.audit_findings FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_vendor_assessments_updated_at ON public.vendor_assessments;
CREATE TRIGGER trg_vendor_assessments_updated_at BEFORE UPDATE ON public.vendor_assessments FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_vendor_assessment_criteria_updated_at ON public.vendor_assessment_criteria;
CREATE TRIGGER trg_vendor_assessment_criteria_updated_at BEFORE UPDATE ON public.vendor_assessment_criteria FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_security_policies_updated_at ON public.security_policies;
CREATE TRIGGER trg_security_policies_updated_at BEFORE UPDATE ON public.security_policies FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_policy_sections_updated_at ON public.policy_sections;
CREATE TRIGGER trg_policy_sections_updated_at BEFORE UPDATE ON public.policy_sections FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_policy_requirements_updated_at ON public.policy_requirements;
CREATE TRIGGER trg_policy_requirements_updated_at BEFORE UPDATE ON public.policy_requirements FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_frameworks_updated_at ON public.frameworks;
CREATE TRIGGER trg_frameworks_updated_at BEFORE UPDATE ON public.frameworks FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_framework_domains_updated_at ON public.framework_domains;
CREATE TRIGGER trg_framework_domains_updated_at BEFORE UPDATE ON public.framework_domains FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_framework_controls_updated_at ON public.framework_controls;
CREATE TRIGGER trg_framework_controls_updated_at BEFORE UPDATE ON public.framework_controls FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_control_mappings_updated_at ON public.control_mappings;
CREATE TRIGGER trg_control_mappings_updated_at BEFORE UPDATE ON public.control_mappings FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_control_implementations_updated_at ON public.control_implementations;
CREATE TRIGGER trg_control_implementations_updated_at BEFORE UPDATE ON public.control_implementations FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_compliance_mappings_updated_at ON public.compliance_mappings;
CREATE TRIGGER trg_compliance_mappings_updated_at BEFORE UPDATE ON public.compliance_mappings FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_cms_categories_updated_at ON public.cms_categories;
CREATE TRIGGER trg_cms_categories_updated_at BEFORE UPDATE ON public.cms_categories FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_cms_tags_updated_at ON public.cms_tags;
CREATE TRIGGER trg_cms_tags_updated_at BEFORE UPDATE ON public.cms_tags FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();
DROP TRIGGER IF EXISTS trg_cms_media_updated_at ON public.cms_media;
CREATE TRIGGER trg_cms_media_updated_at BEFORE UPDATE ON public.cms_media FOR EACH ROW EXECUTE FUNCTION public.update_row_updated_at();

-- Versioning + activity triggers
DROP TRIGGER IF EXISTS trg_projects_activity_version ON public.projects;
CREATE TRIGGER trg_projects_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_project_sections_activity_version ON public.project_sections;
CREATE TRIGGER trg_project_sections_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.project_sections FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_project_data_tables_activity_version ON public.project_data_tables;
CREATE TRIGGER trg_project_data_tables_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.project_data_tables FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_risk_register_entries_activity_version ON public.risk_register_entries;
CREATE TRIGGER trg_risk_register_entries_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.risk_register_entries FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_audit_findings_activity_version ON public.audit_findings;
CREATE TRIGGER trg_audit_findings_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.audit_findings FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_vendor_assessments_activity_version ON public.vendor_assessments;
CREATE TRIGGER trg_vendor_assessments_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.vendor_assessments FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_vendor_assessment_criteria_activity_version ON public.vendor_assessment_criteria;
CREATE TRIGGER trg_vendor_assessment_criteria_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.vendor_assessment_criteria FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_security_policies_activity_version ON public.security_policies;
CREATE TRIGGER trg_security_policies_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.security_policies FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_policy_sections_activity_version ON public.policy_sections;
CREATE TRIGGER trg_policy_sections_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.policy_sections FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_policy_requirements_activity_version ON public.policy_requirements;
CREATE TRIGGER trg_policy_requirements_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.policy_requirements FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_frameworks_activity_version ON public.frameworks;
CREATE TRIGGER trg_frameworks_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.frameworks FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_framework_domains_activity_version ON public.framework_domains;
CREATE TRIGGER trg_framework_domains_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.framework_domains FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_framework_controls_activity_version ON public.framework_controls;
CREATE TRIGGER trg_framework_controls_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.framework_controls FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_control_mappings_activity_version ON public.control_mappings;
CREATE TRIGGER trg_control_mappings_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.control_mappings FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_control_implementations_activity_version ON public.control_implementations;
CREATE TRIGGER trg_control_implementations_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.control_implementations FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_compliance_mappings_activity_version ON public.compliance_mappings;
CREATE TRIGGER trg_compliance_mappings_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.compliance_mappings FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_cms_categories_activity_version ON public.cms_categories;
CREATE TRIGGER trg_cms_categories_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.cms_categories FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_cms_tags_activity_version ON public.cms_tags;
CREATE TRIGGER trg_cms_tags_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.cms_tags FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_cms_content_tags_activity_version ON public.cms_content_tags;
CREATE TRIGGER trg_cms_content_tags_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.cms_content_tags FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_cms_media_activity_version ON public.cms_media;
CREATE TRIGGER trg_cms_media_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.cms_media FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();
DROP TRIGGER IF EXISTS trg_content_approvals_activity_version ON public.content_approvals;
CREATE TRIGGER trg_content_approvals_activity_version AFTER INSERT OR UPDATE OR DELETE ON public.content_approvals FOR EACH ROW EXECUTE FUNCTION public.cms_capture_activity_and_version();

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_data_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_register_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_assessment_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.framework_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.control_implementations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Admin manage policies
CREATE POLICY "Admins manage projects" ON public.projects FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage project sections" ON public.project_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage project data tables" ON public.project_data_tables FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage risk register entries" ON public.risk_register_entries FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage audit findings" ON public.audit_findings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage vendor assessments" ON public.vendor_assessments FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage vendor criteria" ON public.vendor_assessment_criteria FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage security policies" ON public.security_policies FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage policy sections" ON public.policy_sections FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage policy requirements" ON public.policy_requirements FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage frameworks" ON public.frameworks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage framework domains" ON public.framework_domains FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage framework controls" ON public.framework_controls FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage control mappings" ON public.control_mappings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage control implementations" ON public.control_implementations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage compliance mappings" ON public.compliance_mappings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cms categories" ON public.cms_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cms tags" ON public.cms_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cms content tags" ON public.cms_content_tags FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage cms media" ON public.cms_media FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage activity log" ON public.activity_log FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage content versions" ON public.content_versions FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage content approvals" ON public.content_approvals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read page views" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete page views" ON public.page_views FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins read downloads" ON public.downloads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete downloads" ON public.downloads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Public read policies
CREATE POLICY "Public read published active projects" ON public.projects FOR SELECT USING (status = 'published' AND is_active = true AND (published_date IS NULL OR published_date <= now()));
CREATE POLICY "Public read visible project sections" ON public.project_sections FOR SELECT USING (
  is_visible = true AND EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_sections.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read project data tables" ON public.project_data_tables FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = project_data_tables.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read project risk registers" ON public.risk_register_entries FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = risk_register_entries.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read project audit findings" ON public.audit_findings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = audit_findings.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read project vendor assessments" ON public.vendor_assessments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = vendor_assessments.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read vendor criteria" ON public.vendor_assessment_criteria FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.vendor_assessments va
    JOIN public.projects p ON p.id = va.project_id
    WHERE va.id = vendor_assessment_criteria.vendor_assessment_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read published active policies" ON public.security_policies FOR SELECT USING (status = 'published' AND is_active = true);
CREATE POLICY "Public read policy sections" ON public.policy_sections FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.security_policies sp
    WHERE sp.id = policy_sections.policy_id
      AND sp.status = 'published'
      AND sp.is_active = true
  )
);
CREATE POLICY "Public read policy requirements" ON public.policy_requirements FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.security_policies sp
    WHERE sp.id = policy_requirements.policy_id
      AND sp.status = 'published'
      AND sp.is_active = true
  )
);
CREATE POLICY "Public read active frameworks" ON public.frameworks FOR SELECT USING (is_active = true);
CREATE POLICY "Public read framework domains" ON public.framework_domains FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.frameworks f WHERE f.id = framework_domains.framework_id AND f.is_active = true)
);
CREATE POLICY "Public read framework controls" ON public.framework_controls FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.frameworks f WHERE f.id = framework_controls.framework_id AND f.is_active = true)
);
CREATE POLICY "Public read control mappings" ON public.control_mappings FOR SELECT USING (
  EXISTS (
    SELECT 1
    FROM public.framework_controls c1
    JOIN public.frameworks f1 ON f1.id = c1.framework_id
    WHERE c1.id = control_mappings.source_control_id
      AND f1.is_active = true
  )
);
CREATE POLICY "Public read control implementations" ON public.control_implementations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = control_implementations.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read compliance mappings" ON public.compliance_mappings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = compliance_mappings.project_id
      AND p.status = 'published'
      AND p.is_active = true
      AND (p.published_date IS NULL OR p.published_date <= now())
  )
);
CREATE POLICY "Public read active cms categories" ON public.cms_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read cms tags" ON public.cms_tags FOR SELECT USING (true);
CREATE POLICY "Public read cms content tags" ON public.cms_content_tags FOR SELECT USING (true);
CREATE POLICY "Public read public cms media" ON public.cms_media FOR SELECT USING (is_public = true);

-- Public analytics insert policies
CREATE POLICY "Public insert page views" ON public.page_views FOR INSERT WITH CHECK (
  (session_id IS NULL OR char_length(session_id) <= 120)
  AND (ip_address IS NULL OR char_length(ip_address) <= 80)
  AND (time_on_page IS NULL OR time_on_page >= 0)
);
CREATE POLICY "Public insert downloads" ON public.downloads FOR INSERT WITH CHECK (
  (session_id IS NULL OR char_length(session_id) <= 120)
  AND (ip_address IS NULL OR char_length(ip_address) <= 80)
);
