export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: Database["public"]["Enums"]["activity_action_enum"]
          changes: Json
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["activity_action_enum"]
          changes?: Json
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["activity_action_enum"]
          changes?: Json
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_findings: {
        Row: {
          affected_systems: string[]
          compliance_reference: string | null
          control_area: string
          created_at: string
          due_date: string | null
          evidence_description: string | null
          evidence_references: string[]
          finding_description: string
          finding_id: string
          finding_title: string
          id: string
          impact: Database["public"]["Enums"]["risk_impact_level"] | null
          likelihood:
          | Database["public"]["Enums"]["risk_likelihood_level"]
          | null
          management_response: string | null
          owner: string | null
          project_id: string
          recommendation: string
          risk_rating: Database["public"]["Enums"]["project_risk_level"]
          root_cause: string | null
          status: Database["public"]["Enums"]["audit_finding_status_enum"]
          updated_at: string
        }
        Insert: {
          affected_systems?: string[]
          compliance_reference?: string | null
          control_area: string
          created_at?: string
          due_date?: string | null
          evidence_description?: string | null
          evidence_references?: string[]
          finding_description: string
          finding_id: string
          finding_title: string
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact_level"] | null
          likelihood?:
          | Database["public"]["Enums"]["risk_likelihood_level"]
          | null
          management_response?: string | null
          owner?: string | null
          project_id: string
          recommendation: string
          risk_rating?: Database["public"]["Enums"]["project_risk_level"]
          root_cause?: string | null
          status?: Database["public"]["Enums"]["audit_finding_status_enum"]
          updated_at?: string
        }
        Update: {
          affected_systems?: string[]
          compliance_reference?: string | null
          control_area?: string
          created_at?: string
          due_date?: string | null
          evidence_description?: string | null
          evidence_references?: string[]
          finding_description?: string
          finding_id?: string
          finding_title?: string
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact_level"] | null
          likelihood?:
          | Database["public"]["Enums"]["risk_likelihood_level"]
          | null
          management_response?: string | null
          owner?: string | null
          project_id?: string
          recommendation?: string
          risk_rating?: Database["public"]["Enums"]["project_risk_level"]
          root_cause?: string | null
          status?: Database["public"]["Enums"]["audit_finding_status_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_findings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_analytics_events: {
        Row: {
          created_at: string
          device_type: string | null
          event_type: string
          id: string
          metadata: Json
          post_id: string | null
          referrer: string | null
          user_session_id: string | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          event_type: string
          id?: string
          metadata?: Json
          post_id?: string | null
          referrer?: string | null
          user_session_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          event_type?: string
          id?: string
          metadata?: Json
          post_id?: string | null
          referrer?: string | null
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_events_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          featured_image: string | null
          id: string
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          featured_image?: string | null
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          status: string
          updated_at: string
        }
        Insert: {
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          file_path: string
          file_size: number | null
          filename: string
          height: number | null
          id: string
          mime_type: string | null
          public_url: string
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_path: string
          file_size?: number | null
          filename: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_path?: string
          file_size?: number | null
          filename?: string
          height?: number | null
          id?: string
          mime_type?: string | null
          public_url?: string
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      blog_post_revisions: {
        Row: {
          change_note: string | null
          changed_by: string | null
          content: Json
          created_at: string
          excerpt: string | null
          id: string
          post_id: string
          published_date: string | null
          scheduled_date: string | null
          slug: string
          status: string
          title: string
        }
        Insert: {
          change_note?: string | null
          changed_by?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          id?: string
          post_id: string
          published_date?: string | null
          scheduled_date?: string | null
          slug: string
          status: string
          title: string
        }
        Update: {
          change_note?: string | null
          changed_by?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          id?: string
          post_id?: string
          published_date?: string | null
          scheduled_date?: string | null
          slug?: string
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_revisions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          created_at: string
          post_id: string
          tag_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          tag_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_views: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          post_id: string
          referrer: string | null
          user_agent: string | null
          user_session_id: string | null
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          post_id: string
          referrer?: string | null
          user_agent?: string | null
          user_session_id?: string | null
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          post_id?: string
          referrer?: string | null
          user_agent?: string | null
          user_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_views_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean
          author_id: string
          canonical_url: string | null
          category_id: string | null
          content: Json
          created_at: string
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          focus_keyphrase: string | null
          id: string
          image_caption: string | null
          image_credit: string | null
          is_active: boolean
          is_featured: boolean
          last_modified_date: string
          meta_description: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          published_date: string | null
          read_time_minutes: number
          scheduled_date: string | null
          seo_title: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          allow_comments?: boolean
          author_id: string
          canonical_url?: string | null
          category_id?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          focus_keyphrase?: string | null
          id?: string
          image_caption?: string | null
          image_credit?: string | null
          is_active?: boolean
          is_featured?: boolean
          last_modified_date?: string
          meta_description?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_date?: string | null
          read_time_minutes?: number
          scheduled_date?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          allow_comments?: boolean
          author_id?: string
          canonical_url?: string | null
          category_id?: string | null
          content?: Json
          created_at?: string
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          focus_keyphrase?: string | null
          id?: string
          image_caption?: string | null
          image_credit?: string | null
          is_active?: boolean
          is_featured?: boolean
          last_modified_date?: string
          meta_description?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          published_date?: string | null
          read_time_minutes?: number
          scheduled_date?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_settings: {
        Row: {
          bing_verification_code: string | null
          blog_tagline: string
          blog_title: string
          comments_enabled: boolean
          comments_require_approval: boolean
          contact_email: string | null
          custom_css: string | null
          date_format: string
          default_meta_description: string | null
          default_og_image: string | null
          footer_injection: string | null
          github_url: string | null
          google_analytics_id: string | null
          google_verification_code: string | null
          header_injection: string | null
          id: boolean
          linkedin_url: string | null
          newsletter_api_key_hint: string | null
          newsletter_provider: string | null
          posts_per_page: number
          robots_txt: string | null
          share_buttons_position: string
          show_author_bio: boolean
          show_related_posts: boolean
          sitemap_enabled: boolean
          spam_words: string[]
          timezone: string
          toc_enabled: boolean
          twitter_handle: string | null
          updated_at: string
        }
        Insert: {
          bing_verification_code?: string | null
          blog_tagline?: string
          blog_title?: string
          comments_enabled?: boolean
          comments_require_approval?: boolean
          contact_email?: string | null
          custom_css?: string | null
          date_format?: string
          default_meta_description?: string | null
          default_og_image?: string | null
          footer_injection?: string | null
          github_url?: string | null
          google_analytics_id?: string | null
          google_verification_code?: string | null
          header_injection?: string | null
          id?: boolean
          linkedin_url?: string | null
          newsletter_api_key_hint?: string | null
          newsletter_provider?: string | null
          posts_per_page?: number
          robots_txt?: string | null
          share_buttons_position?: string
          show_author_bio?: boolean
          show_related_posts?: boolean
          sitemap_enabled?: boolean
          spam_words?: string[]
          timezone?: string
          toc_enabled?: boolean
          twitter_handle?: string | null
          updated_at?: string
        }
        Update: {
          bing_verification_code?: string | null
          blog_tagline?: string
          blog_title?: string
          comments_enabled?: boolean
          comments_require_approval?: boolean
          contact_email?: string | null
          custom_css?: string | null
          date_format?: string
          default_meta_description?: string | null
          default_og_image?: string | null
          footer_injection?: string | null
          github_url?: string | null
          google_analytics_id?: string | null
          google_verification_code?: string | null
          header_injection?: string | null
          id?: boolean
          linkedin_url?: string | null
          newsletter_api_key_hint?: string | null
          newsletter_provider?: string | null
          posts_per_page?: number
          robots_txt?: string | null
          share_buttons_position?: string
          show_author_bio?: boolean
          show_related_posts?: boolean
          sitemap_enabled?: boolean
          spam_words?: string[]
          timezone?: string
          toc_enabled?: boolean
          twitter_handle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_subscribers: {
        Row: {
          email: string
          id: string
          source: string
          status: string
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          source?: string
          status?: string
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          source?: string
          status?: string
          subscribed_at?: string
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      cms_categories: {
        Row: {
          category_type: Database["public"]["Enums"]["cms_category_type_enum"]
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          category_type: Database["public"]["Enums"]["cms_category_type_enum"]
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          category_type?: Database["public"]["Enums"]["cms_category_type_enum"]
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cms_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content_tags: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at: string
          id: string
          tag_id: string
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at?: string
          id?: string
          tag_id: string
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cms_content_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "cms_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          file_path: string
          file_size: number | null
          file_type: Database["public"]["Enums"]["cms_media_file_type_enum"]
          filename: string
          height: number | null
          id: string
          is_public: boolean
          mime_type: string | null
          original_filename: string | null
          updated_at: string
          uploaded_by: string | null
          usage_count: number
          used_in: Json
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_path: string
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["cms_media_file_type_enum"]
          filename: string
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          original_filename?: string | null
          updated_at?: string
          uploaded_by?: string | null
          usage_count?: number
          used_in?: Json
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          file_path?: string
          file_size?: number | null
          file_type?: Database["public"]["Enums"]["cms_media_file_type_enum"]
          filename?: string
          height?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          original_filename?: string | null
          updated_at?: string
          uploaded_by?: string | null
          usage_count?: number
          used_in?: Json
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cms_media_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          tag_type: Database["public"]["Enums"]["cms_tag_type_enum"]
          updated_at: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          tag_type: Database["public"]["Enums"]["cms_tag_type_enum"]
          updated_at?: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          tag_type?: Database["public"]["Enums"]["cms_tag_type_enum"]
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      compliance_mappings: {
        Row: {
          assessed_date: string | null
          assessor: string | null
          compliance_status: Database["public"]["Enums"]["compliance_status_enum"]
          control_id: string
          created_at: string
          evidence_references: string[]
          framework_id: string
          gap_description: string | null
          id: string
          project_id: string
          remediation_priority:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          remediation_required: boolean
          updated_at: string
        }
        Insert: {
          assessed_date?: string | null
          assessor?: string | null
          compliance_status?: Database["public"]["Enums"]["compliance_status_enum"]
          control_id: string
          created_at?: string
          evidence_references?: string[]
          framework_id: string
          gap_description?: string | null
          id?: string
          project_id: string
          remediation_priority?:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          remediation_required?: boolean
          updated_at?: string
        }
        Update: {
          assessed_date?: string | null
          assessor?: string | null
          compliance_status?: Database["public"]["Enums"]["compliance_status_enum"]
          control_id?: string
          created_at?: string
          evidence_references?: string[]
          framework_id?: string
          gap_description?: string | null
          id?: string
          project_id?: string
          remediation_priority?:
          | Database["public"]["Enums"]["priority_level_enum"]
          | null
          remediation_required?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_mappings_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_mappings_framework_id_fkey"
            columns: ["framework_id"]
            isOneToOne: false
            referencedRelation: "frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_mappings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string
        }
        Relationships: []
      }
      content_approvals: {
        Row: {
          action: Database["public"]["Enums"]["approval_action_enum"]
          content_id: string
          content_type: string
          created_at: string
          from_status:
          | Database["public"]["Enums"]["cms_publication_status"]
          | null
          id: string
          notes: string | null
          performed_at: string
          performed_by: string | null
          to_status: Database["public"]["Enums"]["cms_publication_status"]
        }
        Insert: {
          action: Database["public"]["Enums"]["approval_action_enum"]
          content_id: string
          content_type: string
          created_at?: string
          from_status?:
          | Database["public"]["Enums"]["cms_publication_status"]
          | null
          id?: string
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          to_status: Database["public"]["Enums"]["cms_publication_status"]
        }
        Update: {
          action?: Database["public"]["Enums"]["approval_action_enum"]
          content_id?: string
          content_type?: string
          created_at?: string
          from_status?:
          | Database["public"]["Enums"]["cms_publication_status"]
          | null
          id?: string
          notes?: string | null
          performed_at?: string
          performed_by?: string | null
          to_status?: Database["public"]["Enums"]["cms_publication_status"]
        }
        Relationships: [
          {
            foreignKeyName: "content_approvals_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_versions: {
        Row: {
          change_summary: string | null
          changed_by: string | null
          content_id: string
          content_snapshot: Json
          content_type: string
          created_at: string
          id: string
          is_current: boolean
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          changed_by?: string | null
          content_id: string
          content_snapshot: Json
          content_type: string
          created_at?: string
          id?: string
          is_current?: boolean
          version_number: number
        }
        Update: {
          change_summary?: string | null
          changed_by?: string | null
          content_id?: string
          content_snapshot?: Json
          content_type?: string
          created_at?: string
          id?: string
          is_current?: boolean
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      control_implementations: {
        Row: {
          control_id: string
          created_at: string
          effectiveness_rating:
          | Database["public"]["Enums"]["control_effectiveness_rating_enum"]
          | null
          evidence_location: string | null
          gaps_identified: string | null
          id: string
          implementation_date: string | null
          implementation_description: string | null
          implementation_status: Database["public"]["Enums"]["control_implementation_status_enum"]
          owner: string | null
          project_id: string
          remediation_plan: string | null
          target_completion_date: string | null
          tested_by: string | null
          testing_date: string | null
          updated_at: string
        }
        Insert: {
          control_id: string
          created_at?: string
          effectiveness_rating?:
          | Database["public"]["Enums"]["control_effectiveness_rating_enum"]
          | null
          evidence_location?: string | null
          gaps_identified?: string | null
          id?: string
          implementation_date?: string | null
          implementation_description?: string | null
          implementation_status?: Database["public"]["Enums"]["control_implementation_status_enum"]
          owner?: string | null
          project_id: string
          remediation_plan?: string | null
          target_completion_date?: string | null
          tested_by?: string | null
          testing_date?: string | null
          updated_at?: string
        }
        Update: {
          control_id?: string
          created_at?: string
          effectiveness_rating?:
          | Database["public"]["Enums"]["control_effectiveness_rating_enum"]
          | null
          evidence_location?: string | null
          gaps_identified?: string | null
          id?: string
          implementation_date?: string | null
          implementation_description?: string | null
          implementation_status?: Database["public"]["Enums"]["control_implementation_status_enum"]
          owner?: string | null
          project_id?: string
          remediation_plan?: string | null
          target_completion_date?: string | null
          tested_by?: string | null
          testing_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "control_implementations_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "framework_controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "control_implementations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
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
      downloads: {
        Row: {
          content_id: string | null
          content_type: Database["public"]["Enums"]["download_content_type_enum"]
          created_at: string
          file_type: string | null
          id: string
          ip_address: string | null
          session_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type: Database["public"]["Enums"]["download_content_type_enum"]
          created_at?: string
          file_type?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: Database["public"]["Enums"]["download_content_type_enum"]
          created_at?: string
          file_type?: string | null
          id?: string
          ip_address?: string | null
          session_id?: string | null
        }
        Relationships: []
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
      frameworks: {
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
      page_views: {
        Row: {
          content_id: string
          content_type: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at: string
          device_type:
          | Database["public"]["Enums"]["analytics_device_type_enum"]
          | null
          id: string
          ip_address: string | null
          referrer: string | null
          session_id: string | null
          time_on_page: number | null
          user_agent: string | null
        }
        Insert: {
          content_id: string
          content_type: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at?: string
          device_type?:
          | Database["public"]["Enums"]["analytics_device_type_enum"]
          | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
        }
        Update: {
          content_id?: string
          content_type?: Database["public"]["Enums"]["cms_content_type_enum"]
          created_at?: string
          device_type?:
          | Database["public"]["Enums"]["analytics_device_type_enum"]
          | null
          id?: string
          ip_address?: string | null
          referrer?: string | null
          session_id?: string | null
          time_on_page?: number | null
          user_agent?: string | null
        }
        Relationships: []
      }
      policy_requirements: {
        Row: {
          applicable_roles: string[]
          applicable_systems: string[]
          compliance_verification_method: string | null
          created_at: string
          enforcement_mechanism: string | null
          id: string
          policy_id: string
          requirement_id: string | null
          requirement_text: string
          requirement_type: Database["public"]["Enums"]["policy_requirement_type_enum"]
          section_id: string | null
          updated_at: string
        }
        Insert: {
          applicable_roles?: string[]
          applicable_systems?: string[]
          compliance_verification_method?: string | null
          created_at?: string
          enforcement_mechanism?: string | null
          id?: string
          policy_id: string
          requirement_id?: string | null
          requirement_text: string
          requirement_type: Database["public"]["Enums"]["policy_requirement_type_enum"]
          section_id?: string | null
          updated_at?: string
        }
        Update: {
          applicable_roles?: string[]
          applicable_systems?: string[]
          compliance_verification_method?: string | null
          created_at?: string
          enforcement_mechanism?: string | null
          id?: string
          policy_id?: string
          requirement_id?: string | null
          requirement_text?: string
          requirement_type?: Database["public"]["Enums"]["policy_requirement_type_enum"]
          section_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_requirements_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "security_policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_requirements_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "policy_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      policy_sections: {
        Row: {
          content: string
          content_type: Database["public"]["Enums"]["policy_content_type_enum"]
          created_at: string
          id: string
          is_mandatory: boolean
          parent_section_id: string | null
          policy_id: string
          section_number: string | null
          section_order: number
          section_title: string
          updated_at: string
        }
        Insert: {
          content: string
          content_type?: Database["public"]["Enums"]["policy_content_type_enum"]
          created_at?: string
          id?: string
          is_mandatory?: boolean
          parent_section_id?: string | null
          policy_id: string
          section_number?: string | null
          section_order: number
          section_title: string
          updated_at?: string
        }
        Update: {
          content?: string
          content_type?: Database["public"]["Enums"]["policy_content_type_enum"]
          created_at?: string
          id?: string
          is_mandatory?: boolean
          parent_section_id?: string | null
          policy_id?: string
          section_number?: string | null
          section_order?: number
          section_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "policy_sections_parent_section_id_fkey"
            columns: ["parent_section_id"]
            isOneToOne: false
            referencedRelation: "policy_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policy_sections_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "security_policies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferences?: Json
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferences?: Json
          updated_at?: string
        }
        Relationships: []
      }
      project_data_tables: {
        Row: {
          allow_export: boolean
          column_definitions: Json
          created_at: string
          id: string
          project_id: string
          section_id: string | null
          show_filters: boolean
          show_totals: boolean
          table_data: Json
          table_order: number
          table_title: string
          table_type: Database["public"]["Enums"]["project_data_table_type_enum"]
          updated_at: string
        }
        Insert: {
          allow_export?: boolean
          column_definitions?: Json
          created_at?: string
          id?: string
          project_id: string
          section_id?: string | null
          show_filters?: boolean
          show_totals?: boolean
          table_data?: Json
          table_order?: number
          table_title: string
          table_type: Database["public"]["Enums"]["project_data_table_type_enum"]
          updated_at?: string
        }
        Update: {
          allow_export?: boolean
          column_definitions?: Json
          created_at?: string
          id?: string
          project_id?: string
          section_id?: string | null
          show_filters?: boolean
          show_totals?: boolean
          table_data?: Json
          table_order?: number
          table_title?: string
          table_type?: Database["public"]["Enums"]["project_data_table_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_data_tables_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_data_tables_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "project_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      project_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          is_visible: boolean
          project_id: string
          section_order: number
          section_title: string
          section_type: Database["public"]["Enums"]["project_section_type_enum"]
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          project_id: string
          section_order: number
          section_title: string
          section_type?: Database["public"]["Enums"]["project_section_type_enum"]
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          is_visible?: boolean
          project_id?: string
          section_order?: number
          section_title?: string
          section_type?: Database["public"]["Enums"]["project_section_type_enum"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_sections_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          approved_by: string | null
          compliance_status: string | null
          created_at: string
          created_by: string | null
          download_count: number
          featured_image_alt: string | null
          featured_image_url: string | null
          frameworks_used: string[]
          id: string
          is_active: boolean
          is_featured: boolean
          keywords: string[]
          last_modified_date: string
          meta_description: string | null
          meta_title: string | null
          methodology: string | null
          objective: string | null
          project_type: Database["public"]["Enums"]["project_type_enum"]
          published_date: string | null
          reviewed_by: string | null
          risk_level: Database["public"]["Enums"]["project_risk_level"] | null
          scope: string | null
          short_description: string | null
          slug: string
          status: Database["public"]["Enums"]["cms_publication_status"]
          timeline: string | null
          title: string
          tools_used: string[]
          updated_at: string
          view_count: number
        }
        Insert: {
          approved_by?: string | null
          compliance_status?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          featured_image_alt?: string | null
          featured_image_url?: string | null
          frameworks_used?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[]
          last_modified_date?: string
          meta_description?: string | null
          meta_title?: string | null
          methodology?: string | null
          objective?: string | null
          project_type: Database["public"]["Enums"]["project_type_enum"]
          published_date?: string | null
          reviewed_by?: string | null
          risk_level?: Database["public"]["Enums"]["project_risk_level"] | null
          scope?: string | null
          short_description?: string | null
          slug: string
          status?: Database["public"]["Enums"]["cms_publication_status"]
          timeline?: string | null
          title: string
          tools_used?: string[]
          updated_at?: string
          view_count?: number
        }
        Update: {
          approved_by?: string | null
          compliance_status?: string | null
          created_at?: string
          created_by?: string | null
          download_count?: number
          featured_image_alt?: string | null
          featured_image_url?: string | null
          frameworks_used?: string[]
          id?: string
          is_active?: boolean
          is_featured?: boolean
          keywords?: string[]
          last_modified_date?: string
          meta_description?: string | null
          meta_title?: string | null
          methodology?: string | null
          objective?: string | null
          project_type?: Database["public"]["Enums"]["project_type_enum"]
          published_date?: string | null
          reviewed_by?: string | null
          risk_level?: Database["public"]["Enums"]["project_risk_level"] | null
          scope?: string | null
          short_description?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["cms_publication_status"]
          timeline?: string | null
          title?: string
          tools_used?: string[]
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "projects_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_register_entries: {
        Row: {
          asset_name: string | null
          control_effectiveness:
          | Database["public"]["Enums"]["control_effectiveness_level"]
          | null
          created_at: string
          existing_controls: string | null
          id: string
          impact: Database["public"]["Enums"]["risk_impact_level"]
          impact_score: number
          iso_control_reference: string | null
          likelihood: Database["public"]["Enums"]["risk_likelihood_level"]
          likelihood_score: number
          nist_control_reference: string | null
          owner: string | null
          priority: Database["public"]["Enums"]["priority_level_enum"]
          project_id: string
          recommended_controls: string
          risk_id: string
          risk_level: Database["public"]["Enums"]["project_risk_level"]
          risk_score: number
          status: Database["public"]["Enums"]["risk_entry_status_enum"]
          target_completion_date: string | null
          threat_description: string
          updated_at: string
          vulnerability_description: string
        }
        Insert: {
          asset_name?: string | null
          control_effectiveness?:
          | Database["public"]["Enums"]["control_effectiveness_level"]
          | null
          created_at?: string
          existing_controls?: string | null
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact_level"]
          impact_score?: number
          iso_control_reference?: string | null
          likelihood?: Database["public"]["Enums"]["risk_likelihood_level"]
          likelihood_score?: number
          nist_control_reference?: string | null
          owner?: string | null
          priority?: Database["public"]["Enums"]["priority_level_enum"]
          project_id: string
          recommended_controls: string
          risk_id: string
          risk_level?: Database["public"]["Enums"]["project_risk_level"]
          risk_score?: number
          status?: Database["public"]["Enums"]["risk_entry_status_enum"]
          target_completion_date?: string | null
          threat_description: string
          updated_at?: string
          vulnerability_description: string
        }
        Update: {
          asset_name?: string | null
          control_effectiveness?:
          | Database["public"]["Enums"]["control_effectiveness_level"]
          | null
          created_at?: string
          existing_controls?: string | null
          id?: string
          impact?: Database["public"]["Enums"]["risk_impact_level"]
          impact_score?: number
          iso_control_reference?: string | null
          likelihood?: Database["public"]["Enums"]["risk_likelihood_level"]
          likelihood_score?: number
          nist_control_reference?: string | null
          owner?: string | null
          priority?: Database["public"]["Enums"]["priority_level_enum"]
          project_id?: string
          recommended_controls?: string
          risk_id?: string
          risk_level?: Database["public"]["Enums"]["project_risk_level"]
          risk_score?: number
          status?: Database["public"]["Enums"]["risk_entry_status_enum"]
          target_completion_date?: string | null
          threat_description?: string
          updated_at?: string
          vulnerability_description?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_register_entries_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      security_policies: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          approver: string | null
          created_at: string
          created_by: string | null
          effective_date: string | null
          id: string
          is_active: boolean
          next_review_date: string | null
          owner: string
          policy_name: string
          policy_type: Database["public"]["Enums"]["policy_type_enum"]
          purpose: string
          review_date: string | null
          scope: string
          slug: string
          status: Database["public"]["Enums"]["cms_publication_status"]
          updated_at: string
          version: string
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          approver?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean
          next_review_date?: string | null
          owner: string
          policy_name: string
          policy_type: Database["public"]["Enums"]["policy_type_enum"]
          purpose: string
          review_date?: string | null
          scope: string
          slug: string
          status?: Database["public"]["Enums"]["cms_publication_status"]
          updated_at?: string
          version?: string
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          approver?: string | null
          created_at?: string
          created_by?: string | null
          effective_date?: string | null
          id?: string
          is_active?: boolean
          next_review_date?: string | null
          owner?: string
          policy_name?: string
          policy_type?: Database["public"]["Enums"]["policy_type_enum"]
          purpose?: string
          review_date?: string | null
          scope?: string
          slug?: string
          status?: Database["public"]["Enums"]["cms_publication_status"]
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "security_policies_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_policies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_assessment_criteria: {
        Row: {
          category: Database["public"]["Enums"]["vendor_criteria_category_enum"]
          created_at: string
          evidence: string | null
          id: string
          notes: string | null
          question: string
          rating:
          | Database["public"]["Enums"]["vendor_criteria_rating_enum"]
          | null
          response: string | null
          risk_level: Database["public"]["Enums"]["project_risk_level"] | null
          updated_at: string
          vendor_assessment_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["vendor_criteria_category_enum"]
          created_at?: string
          evidence?: string | null
          id?: string
          notes?: string | null
          question: string
          rating?:
          | Database["public"]["Enums"]["vendor_criteria_rating_enum"]
          | null
          response?: string | null
          risk_level?: Database["public"]["Enums"]["project_risk_level"] | null
          updated_at?: string
          vendor_assessment_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["vendor_criteria_category_enum"]
          created_at?: string
          evidence?: string | null
          id?: string
          notes?: string | null
          question?: string
          rating?:
          | Database["public"]["Enums"]["vendor_criteria_rating_enum"]
          | null
          response?: string | null
          risk_level?: Database["public"]["Enums"]["project_risk_level"] | null
          updated_at?: string
          vendor_assessment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_assessment_criteria_vendor_assessment_id_fkey"
            columns: ["vendor_assessment_id"]
            isOneToOne: false
            referencedRelation: "vendor_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_assessments: {
        Row: {
          assessment_date: string | null
          assessor_name: string | null
          certifications: Json
          created_at: string
          data_access_level:
          | Database["public"]["Enums"]["vendor_data_access_level_enum"]
          | null
          id: string
          overall_risk_rating: Database["public"]["Enums"]["project_risk_level"]
          project_id: string
          service_description: string | null
          updated_at: string
          vendor_name: string
          vendor_type: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessor_name?: string | null
          certifications?: Json
          created_at?: string
          data_access_level?:
          | Database["public"]["Enums"]["vendor_data_access_level_enum"]
          | null
          id?: string
          overall_risk_rating?: Database["public"]["Enums"]["project_risk_level"]
          project_id: string
          service_description?: string | null
          updated_at?: string
          vendor_name: string
          vendor_type?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessor_name?: string | null
          certifications?: Json
          created_at?: string
          data_access_level?:
          | Database["public"]["Enums"]["vendor_data_access_level_enum"]
          | null
          id?: string
          overall_risk_rating?: Database["public"]["Enums"]["project_risk_level"]
          project_id?: string
          service_description?: string | null
          updated_at?: string
          vendor_name?: string
          vendor_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_assessments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_single_admin: { Args: never; Returns: boolean }
      create_blog_post_revision: {
        Args: { _change_note?: string; _post_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      slugify_text: { Args: { input: string }; Returns: string }
      upsert_my_profile: {
        Args: { _avatar_url?: string; _display_name?: string }
        Returns: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          preferences: Json
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
    }
    Enums: {
      activity_action_enum:
      | "create"
      | "update"
      | "delete"
      | "publish"
      | "unpublish"
      | "approve"
      | "reject"
      | "restore"
      analytics_device_type_enum: "desktop" | "tablet" | "mobile"
      app_role: "admin" | "moderator" | "user"
      approval_action_enum:
      | "submit_review"
      | "approve_publish"
      | "archive"
      | "restore"
      | "reject"
      audit_finding_status_enum:
      | "open"
      | "in_progress"
      | "resolved"
      | "accepted"
      | "deferred"
      cms_category_type_enum: "project" | "blog" | "resource"
      cms_content_type_enum: "project" | "blog_post" | "policy" | "framework"
      cms_media_file_type_enum: "image" | "document" | "video" | "other"
      cms_publication_status:
      | "draft"
      | "under_review"
      | "published"
      | "archived"
      cms_tag_type_enum:
      | "framework"
      | "tool"
      | "skill"
      | "industry"
      | "technology"
      compliance_status_enum:
      | "compliant"
      | "partially_compliant"
      | "non_compliant"
      | "not_applicable"
      control_effectiveness_level:
      | "ineffective"
      | "partially_effective"
      | "effective"
      control_effectiveness_rating_enum:
      | "not_effective"
      | "partially_effective"
      | "largely_effective"
      | "fully_effective"
      control_implementation_status_enum:
      | "not_started"
      | "planned"
      | "in_progress"
      | "implemented"
      | "verified"
      | "not_applicable"
      control_mapping_type_enum:
      | "equivalent"
      | "similar"
      | "partial"
      | "related"
      control_category_enum: "Technical" | "Administrative" | "Physical"
      download_content_type_enum: "project" | "policy" | "resume" | "resource"
      framework_control_type_enum:
      | "preventive"
      | "detective"
      | "corrective"
      | "compensating"
      framework_type_enum:
      | "security_standard"
      | "compliance_framework"
      | "control_framework"
      | "risk_framework"
      | "audit_standard"
      implementation_complexity_enum: "low" | "medium" | "high"
      org_size_enum: "startup" | "sme" | "enterprise"
      policy_content_type_enum:
      | "paragraph"
      | "numbered_list"
      | "bullet_list"
      | "table"
      | "requirement"
      policy_requirement_type_enum: "shall" | "should" | "may"
      policy_type_enum:
      | "access_control"
      | "password"
      | "data_classification"
      | "incident_response"
      | "acceptable_use"
      | "byod"
      | "backup"
      | "encryption"
      | "remote_access"
      | "vendor_management"
      priority_level_enum: "low" | "medium" | "high" | "critical"
      project_data_table_type_enum:
      | "risk_register"
      | "asset_inventory"
      | "threat_analysis"
      | "control_mapping"
      | "audit_findings"
      | "gap_analysis"
      | "vendor_scorecard"
      project_risk_level: "low" | "medium" | "high" | "critical"
      project_section_type_enum:
      | "overview"
      | "methodology"
      | "findings"
      | "analysis"
      | "recommendations"
      | "conclusion"
      | "custom"
      project_type_enum:
      | "risk_assessment"
      | "it_audit"
      | "vendor_assessment"
      | "compliance_mapping"
      | "policy_development"
      | "framework_implementation"
      risk_entry_status_enum:
      | "identified"
      | "in_progress"
      | "mitigated"
      | "accepted"
      | "transferred"
      risk_impact_level: "low" | "medium" | "high"
      risk_likelihood_level: "low" | "medium" | "high"
      vendor_criteria_category_enum:
      | "data_protection"
      | "access_control"
      | "incident_response"
      | "compliance"
      | "business_continuity"
      | "physical_security"
      vendor_criteria_rating_enum:
      | "compliant"
      | "partially_compliant"
      | "non_compliant"
      | "not_applicable"
      vendor_data_access_level_enum:
      | "none"
      | "public"
      | "internal"
      | "confidential"
      | "restricted"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
    DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
  ? R
  : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
    DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
    DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
  ? R
  : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I
  }
  ? I
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Insert: infer I
  }
  ? I
  : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema["Tables"]
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
  : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U
  }
  ? U
  : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
    Update: infer U
  }
  ? U
  : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema["Enums"]
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
  : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema["CompositeTypes"]
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
  ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
  : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  public: {
    Enums: {
      activity_action_enum: [
        "create",
        "update",
        "delete",
        "publish",
        "unpublish",
        "approve",
        "reject",
        "restore",
      ],
      analytics_device_type_enum: ["desktop", "tablet", "mobile"],
      app_role: ["admin", "moderator", "user"],
      approval_action_enum: [
        "submit_review",
        "approve_publish",
        "archive",
        "restore",
        "reject",
      ],
      audit_finding_status_enum: [
        "open",
        "in_progress",
        "resolved",
        "accepted",
        "deferred",
      ],
      cms_category_type_enum: ["project", "blog", "resource"],
      cms_content_type_enum: ["project", "blog_post", "policy", "framework"],
      cms_media_file_type_enum: ["image", "document", "video", "other"],
      cms_publication_status: [
        "draft",
        "under_review",
        "published",
        "archived",
      ],
      cms_tag_type_enum: [
        "framework",
        "tool",
        "skill",
        "industry",
        "technology",
      ],
      control_category_enum: [
        "administrative",
        "technical",
        "physical",
        "management",
      ],
      compliance_status_enum: [
        "compliant",
        "partially_compliant",
        "non_compliant",
        "not_applicable",
      ],
      control_effectiveness_level: [
        "ineffective",
        "partially_effective",
        "effective",
      ],
      control_effectiveness_rating_enum: [
        "not_effective",
        "partially_effective",
        "largely_effective",
        "fully_effective",
      ],
      control_implementation_status_enum: [
        "not_started",
        "planned",
        "in_progress",
        "implemented",
        "verified",
        "not_applicable",
      ],
      control_mapping_type_enum: [
        "equivalent",
        "similar",
        "partial",
        "related",
      ],
      download_content_type_enum: ["project", "policy", "resume", "resource"],
      framework_control_type_enum: [
        "preventive",
        "detective",
        "corrective",
        "compensating",
      ],
      framework_type_enum: [
        "security_standard",
        "compliance_framework",
        "control_framework",
        "risk_framework",
        "audit_standard",
      ],
      implementation_complexity_enum: ["low", "medium", "high"],
      org_size_enum: ["startup", "sme", "enterprise"],
      policy_content_type_enum: [
        "paragraph",
        "numbered_list",
        "bullet_list",
        "table",
        "requirement",
      ],
      policy_requirement_type_enum: ["shall", "should", "may"],
      policy_type_enum: [
        "access_control",
        "password",
        "data_classification",
        "incident_response",
        "acceptable_use",
        "byod",
        "backup",
        "encryption",
        "remote_access",
        "vendor_management",
      ],
      priority_level_enum: ["low", "medium", "high", "critical"],
      project_data_table_type_enum: [
        "risk_register",
        "asset_inventory",
        "threat_analysis",
        "control_mapping",
        "audit_findings",
        "gap_analysis",
        "vendor_scorecard",
      ],
      project_risk_level: ["low", "medium", "high", "critical"],
      project_section_type_enum: [
        "overview",
        "methodology",
        "findings",
        "analysis",
        "recommendations",
        "conclusion",
        "custom",
      ],
      project_type_enum: [
        "risk_assessment",
        "it_audit",
        "vendor_assessment",
        "compliance_mapping",
        "policy_development",
        "framework_implementation",
      ],
      risk_entry_status_enum: [
        "identified",
        "in_progress",
        "mitigated",
        "accepted",
        "transferred",
      ],
      risk_impact_level: ["low", "medium", "high"],
      risk_likelihood_level: ["low", "medium", "high"],
      vendor_criteria_category_enum: [
        "data_protection",
        "access_control",
        "incident_response",
        "compliance",
        "business_continuity",
        "physical_security",
      ],
      vendor_criteria_rating_enum: [
        "compliant",
        "partially_compliant",
        "non_compliant",
        "not_applicable",
      ],
      vendor_data_access_level_enum: [
        "none",
        "public",
        "internal",
        "confidential",
        "restricted",
      ],
    },
  },
} as const
