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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
