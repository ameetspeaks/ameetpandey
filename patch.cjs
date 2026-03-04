const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, 'src', 'integrations', 'supabase', 'types.ts');
let content = fs.readFileSync(typesPath, 'utf8');

const tablesToAdd = `      frameworks: {
        Row: {
          id: string
          name: string
          code: string
          slug: string
          issuing_organization: string
          version: string | null
          publication_date: string | null
          framework_type: Database["public"]["Enums"]["framework_type_enum"]
          primary_focus_areas: string[] | null
          description: string
          purpose_statement: string | null
          scope: string | null
          key_benefits: string | null
          certification_available: boolean | null
          certification_body: string | null
          implementation_complexity: Database["public"]["Enums"]["implementation_complexity_enum"] | null
          typical_implementation_time: string | null
          target_organization_sizes: string[] | null
          target_industries: string[] | null
          official_website_url: string | null
          documentation_url: string | null
          purchase_download_url: string | null
          training_resources_url: string | null
          is_active: boolean | null
          is_public: boolean | null
          is_featured: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          code: string
          slug: string
          issuing_organization: string
          version?: string | null
          publication_date?: string | null
          framework_type: Database["public"]["Enums"]["framework_type_enum"]
          primary_focus_areas?: string[] | null
          description: string
          purpose_statement?: string | null
          scope?: string | null
          key_benefits?: string | null
          certification_available?: boolean | null
          certification_body?: string | null
          implementation_complexity?: Database["public"]["Enums"]["implementation_complexity_enum"] | null
          typical_implementation_time?: string | null
          target_organization_sizes?: string[] | null
          target_industries?: string[] | null
          official_website_url?: string | null
          documentation_url?: string | null
          purchase_download_url?: string | null
          training_resources_url?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          is_featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          code?: string
          slug?: string
          issuing_organization?: string
          version?: string | null
          publication_date?: string | null
          framework_type?: Database["public"]["Enums"]["framework_type_enum"]
          primary_focus_areas?: string[] | null
          description?: string
          purpose_statement?: string | null
          scope?: string | null
          key_benefits?: string | null
          certification_available?: boolean | null
          certification_body?: string | null
          implementation_complexity?: Database["public"]["Enums"]["implementation_complexity_enum"] | null
          typical_implementation_time?: string | null
          target_organization_sizes?: string[] | null
          target_industries?: string[] | null
          official_website_url?: string | null
          documentation_url?: string | null
          purchase_download_url?: string | null
          training_resources_url?: string | null
          is_active?: boolean | null
          is_public?: boolean | null
          is_featured?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      framework_domains: {
        Row: {
          id: string
          framework_id: string
          parent_id: string | null
          domain_code: string
          name: string
          description: string | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          framework_id: string
          parent_id?: string | null
          domain_code: string
          name: string
          description?: string | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          framework_id?: string
          parent_id?: string | null
          domain_code?: string
          name?: string
          description?: string | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_domains_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "framework_domains_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "framework_domains"
            referencedColumns: ["id"]
          }
        ]
      }
      framework_controls: {
        Row: {
          id: string
          framework_id: string
          domain_id: string | null
          control_id: string
          name: string
          description: string
          control_type: Database["public"]["Enums"]["framework_control_type_enum"] | null
          control_category: Database["public"]["Enums"]["control_category_enum"] | null
          implementation_guidance: string | null
          is_mandatory: boolean | null
          applicability_notes: string | null
          testing_procedures: string | null
          evidence_requirements: string | null
          common_gaps: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          framework_id: string
          domain_id?: string | null
          control_id: string
          name: string
          description: string
          control_type?: Database["public"]["Enums"]["framework_control_type_enum"] | null
          control_category?: Database["public"]["Enums"]["control_category_enum"] | null
          implementation_guidance?: string | null
          is_mandatory?: boolean | null
          applicability_notes?: string | null
          testing_procedures?: string | null
          evidence_requirements?: string | null
          common_gaps?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          framework_id?: string
          domain_id?: string | null
          control_id?: string
          name?: string
          description?: string
          control_type?: Database["public"]["Enums"]["framework_control_type_enum"] | null
          control_category?: Database["public"]["Enums"]["control_category_enum"] | null
          implementation_guidance?: string | null
          is_mandatory?: boolean | null
          applicability_notes?: string | null
          testing_procedures?: string | null
          evidence_requirements?: string | null
          common_gaps?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_controls_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "framework_controls_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "framework_domains"
            referencedColumns: ["id"]
          }
        ]
      }
      framework_control_references: {
        Row: {
          id: string
          source_control_id: string
          target_control_id: string
          reference_type: string
          created_at: string | null
        }
        Insert: {
          id?: string
          source_control_id: string
          target_control_id: string
          reference_type: string
          created_at?: string | null
        }
        Update: {
          id?: string
          source_control_id?: string
          target_control_id?: string
          reference_type?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "framework_control_references_source_control_id_fkey"
            columns: ["source_control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "framework_control_references_target_control_id_fkey"
            columns: ["target_control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          }
        ]
      }
      control_mappings: {
        Row: {
          id: string
          source_control_id: string
          target_control_id: string
          mapping_type: Database["public"]["Enums"]["control_mapping_type_enum"]
          notes: string | null
          verified_by: string | null
          verification_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          source_control_id: string
          target_control_id: string
          mapping_type: Database["public"]["Enums"]["control_mapping_type_enum"]
          notes?: string | null
          verified_by?: string | null
          verification_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          source_control_id?: string
          target_control_id?: string
          mapping_type?: Database["public"]["Enums"]["control_mapping_type_enum"]
          notes?: string | null
          verified_by?: string | null
          verification_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "control_mappings_source_control_id_fkey"
            columns: ["source_control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "control_mappings_target_control_id_fkey"
            columns: ["target_control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "control_mappings_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {`;

if (!content.includes('frameworks: {')) {
    content = content.replace('    }\n    Views: {', tablesToAdd);
}

const enumsToAdd = `      control_category_enum: "Technical" | "Administrative" | "Physical"\n      download_content_type_enum: "project" | "policy" | "resume" | "resource"`;

if (!content.includes('control_category_enum')) {
    content = content.replace('      download_content_type_enum: "project" | "policy" | "resume" | "resource"', enumsToAdd);
}

fs.writeFileSync(typesPath, content, 'utf8');
console.log('patched successfully');
