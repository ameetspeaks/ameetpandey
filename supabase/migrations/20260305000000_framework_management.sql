-- Create new Enum Type for control category since it didn't exist
DO $$ BEGIN
    CREATE TYPE control_category_enum AS ENUM ('Technical', 'Administrative', 'Physical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  issuing_organization TEXT NOT NULL,
  version TEXT,
  publication_date DATE,
  framework_type framework_type_enum NOT NULL,
  primary_focus_areas TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  purpose_statement TEXT,
  scope TEXT,
  key_benefits TEXT,
  certification_available BOOLEAN DEFAULT false,
  certification_body TEXT,
  implementation_complexity implementation_complexity_enum,
  typical_implementation_time TEXT,
  target_organization_sizes TEXT[] DEFAULT '{}',
  target_industries TEXT[] DEFAULT '{}',
  official_website_url TEXT,
  documentation_url TEXT,
  purchase_download_url TEXT,
  training_resources_url TEXT,
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE framework_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES frameworks(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES framework_domains(id) ON DELETE CASCADE,
  domain_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(framework_id, domain_code)
);

CREATE TABLE framework_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID NOT NULL REFERENCES frameworks(id) ON DELETE CASCADE,
  domain_id UUID REFERENCES framework_domains(id) ON DELETE SET NULL,
  control_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  control_type framework_control_type_enum,
  control_category control_category_enum,
  implementation_guidance TEXT,
  is_mandatory BOOLEAN DEFAULT false,
  applicability_notes TEXT,
  testing_procedures TEXT,
  evidence_requirements TEXT,
  common_gaps TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(framework_id, control_id)
);

CREATE TABLE framework_control_references (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_control_id UUID NOT NULL REFERENCES framework_controls(id) ON DELETE CASCADE,
  target_control_id UUID NOT NULL REFERENCES framework_controls(id) ON DELETE CASCADE,
  reference_type TEXT NOT NULL CHECK (reference_type IN ('Supersedes', 'Dependencies', 'Related')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_control_id, target_control_id, reference_type)
);

CREATE TABLE control_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_control_id UUID NOT NULL REFERENCES framework_controls(id) ON DELETE CASCADE,
  target_control_id UUID NOT NULL REFERENCES framework_controls(id) ON DELETE CASCADE,
  mapping_type control_mapping_type_enum NOT NULL,
  notes TEXT,
  verified_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  verification_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_control_id, target_control_id)
);

-- RLS Policies
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE framework_control_references ENABLE ROW LEVEL SECURITY;
ALTER TABLE control_mappings ENABLE ROW LEVEL SECURITY;

-- Read policies for active/public data
CREATE POLICY "Public can view active frameworks" ON frameworks FOR SELECT USING (is_active = true AND is_public = true);
CREATE POLICY "Public can view active framework domains" ON framework_domains FOR SELECT USING (EXISTS (SELECT 1 FROM frameworks WHERE id = framework_id AND is_active = true AND is_public = true));
CREATE POLICY "Public can view active framework controls" ON framework_controls FOR SELECT USING (EXISTS (SELECT 1 FROM frameworks WHERE id = framework_id AND is_active = true AND is_public = true));
CREATE POLICY "Public can view active control mappings" ON control_mappings FOR SELECT USING (
  EXISTS (SELECT 1 FROM framework_controls fc JOIN frameworks f ON fc.framework_id = f.id WHERE fc.id = source_control_id AND f.is_active = true AND f.is_public = true) AND
  EXISTS (SELECT 1 FROM framework_controls fc JOIN frameworks f ON fc.framework_id = f.id WHERE fc.id = target_control_id AND f.is_active = true AND f.is_public = true)
);

-- Authenticated roles (admins) can do everything
CREATE POLICY "Authenticated users can do everything on frameworks" ON frameworks FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do everything on framework domains" ON framework_domains FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do everything on framework controls" ON framework_controls FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do everything on framework control references" ON framework_control_references FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can do everything on control mappings" ON control_mappings FOR ALL TO authenticated USING (true);
