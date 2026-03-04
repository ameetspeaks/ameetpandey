import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Settings = {
  blog_title: string;
  blog_tagline: string;
  posts_per_page: number;
  date_format: string;
  timezone: string;
  default_meta_description: string;
  default_og_image: string;
  google_verification_code: string;
  bing_verification_code: string;
  google_analytics_id: string;
  robots_txt: string;
  sitemap_enabled: boolean;
  linkedin_url: string;
  github_url: string;
  twitter_handle: string;
  contact_email: string;
  comments_enabled: boolean;
  comments_require_approval: boolean;
  spam_words: string;
  show_author_bio: boolean;
  show_related_posts: boolean;
  toc_enabled: boolean;
  share_buttons_position: "top" | "bottom" | "both";
  newsletter_provider: string;
  newsletter_api_key_hint: string;
  custom_css: string;
  header_injection: string;
  footer_injection: string;
};

const supabaseAny = supabase as any;

const defaultState: Settings = {
  blog_title: "",
  blog_tagline: "",
  posts_per_page: 9,
  date_format: "PPP",
  timezone: "UTC",
  default_meta_description: "",
  default_og_image: "",
  google_verification_code: "",
  bing_verification_code: "",
  google_analytics_id: "",
  robots_txt: "",
  sitemap_enabled: true,
  linkedin_url: "",
  github_url: "",
  twitter_handle: "",
  contact_email: "",
  comments_enabled: true,
  comments_require_approval: true,
  spam_words: "",
  show_author_bio: true,
  show_related_posts: true,
  toc_enabled: true,
  share_buttons_position: "top",
  newsletter_provider: "",
  newsletter_api_key_hint: "",
  custom_css: "",
  header_injection: "",
  footer_injection: "",
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [state, setState] = useState<Settings>(defaultState);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabaseAny.from("blog_settings").select("*").eq("id", true).maybeSingle();
      if (!data) return;

      setState({
        blog_title: data.blog_title || "",
        blog_tagline: data.blog_tagline || "",
        posts_per_page: data.posts_per_page || 9,
        date_format: data.date_format || "PPP",
        timezone: data.timezone || "UTC",
        default_meta_description: data.default_meta_description || "",
        default_og_image: data.default_og_image || "",
        google_verification_code: data.google_verification_code || "",
        bing_verification_code: data.bing_verification_code || "",
        google_analytics_id: data.google_analytics_id || "",
        robots_txt: data.robots_txt || "",
        sitemap_enabled: Boolean(data.sitemap_enabled),
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        twitter_handle: data.twitter_handle || "",
        contact_email: data.contact_email || "",
        comments_enabled: Boolean(data.comments_enabled),
        comments_require_approval: Boolean(data.comments_require_approval),
        spam_words: Array.isArray(data.spam_words) ? data.spam_words.join(", ") : "",
        show_author_bio: Boolean(data.show_author_bio),
        show_related_posts: Boolean(data.show_related_posts),
        toc_enabled: Boolean(data.toc_enabled),
        share_buttons_position: (data.share_buttons_position as Settings["share_buttons_position"]) || "top",
        newsletter_provider: data.newsletter_provider || "",
        newsletter_api_key_hint: data.newsletter_api_key_hint || "",
        custom_css: data.custom_css || "",
        header_injection: data.header_injection || "",
        footer_injection: data.footer_injection || "",
      });
    };

    void load();
  }, []);

  const setField = <K extends keyof Settings>(key: K, value: Settings[K]) => setState((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabaseAny.from("blog_settings").update({
      blog_title: state.blog_title,
      blog_tagline: state.blog_tagline,
      posts_per_page: Number(state.posts_per_page),
      date_format: state.date_format,
      timezone: state.timezone,
      default_meta_description: state.default_meta_description || null,
      default_og_image: state.default_og_image || null,
      google_verification_code: state.google_verification_code || null,
      bing_verification_code: state.bing_verification_code || null,
      google_analytics_id: state.google_analytics_id || null,
      robots_txt: state.robots_txt || null,
      sitemap_enabled: state.sitemap_enabled,
      linkedin_url: state.linkedin_url || null,
      github_url: state.github_url || null,
      twitter_handle: state.twitter_handle || null,
      contact_email: state.contact_email || null,
      comments_enabled: state.comments_enabled,
      comments_require_approval: state.comments_require_approval,
      spam_words: state.spam_words
        .split(",")
        .map((word) => word.trim())
        .filter(Boolean),
      show_author_bio: state.show_author_bio,
      show_related_posts: state.show_related_posts,
      toc_enabled: state.toc_enabled,
      share_buttons_position: state.share_buttons_position,
      newsletter_provider: state.newsletter_provider || null,
      newsletter_api_key_hint: state.newsletter_api_key_hint || null,
      custom_css: state.custom_css || null,
      header_injection: state.header_injection || null,
      footer_injection: state.footer_injection || null,
    }).eq("id", true);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Settings saved" });
  };

  return (
    <section className="space-y-4">
      <header className="surface-card flex flex-wrap items-center justify-between gap-2 p-5">
        <div>
          <h1 className="text-2xl">Site Settings</h1>
          <p className="text-sm text-muted-foreground">Global blog defaults, SEO, social, comments, reading, and advanced configuration.</p>
        </div>
        <Button onClick={() => void save()} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Blog Title</Label><Input value={state.blog_title} onChange={(e) => setField("blog_title", e.target.value)} />
            <Label>Blog Tagline</Label><Input value={state.blog_tagline} onChange={(e) => setField("blog_tagline", e.target.value)} />
            <Label>Posts Per Page</Label><Input type="number" value={state.posts_per_page} onChange={(e) => setField("posts_per_page", Number(e.target.value))} />
            <Label>Date Format</Label><Input value={state.date_format} onChange={(e) => setField("date_format", e.target.value)} />
            <Label>Time Zone</Label><Input value={state.timezone} onChange={(e) => setField("timezone", e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SEO Defaults</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Default Meta Description</Label><Textarea value={state.default_meta_description} onChange={(e) => setField("default_meta_description", e.target.value)} rows={3} />
            <Label>Default OG Image URL</Label><Input value={state.default_og_image} onChange={(e) => setField("default_og_image", e.target.value)} />
            <Label>Google Verification Code</Label><Input value={state.google_verification_code} onChange={(e) => setField("google_verification_code", e.target.value)} />
            <Label>Bing Verification Code</Label><Input value={state.bing_verification_code} onChange={(e) => setField("bing_verification_code", e.target.value)} />
            <Label>Google Analytics ID</Label><Input value={state.google_analytics_id} onChange={(e) => setField("google_analytics_id", e.target.value)} />
            <Label>Robots.txt</Label><Textarea value={state.robots_txt} onChange={(e) => setField("robots_txt", e.target.value)} rows={4} />
            <Label>Sitemap Enabled</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.sitemap_enabled ? "true" : "false"} onChange={(e) => setField("sitemap_enabled", e.target.value === "true")}>
              <option value="true">Enabled</option><option value="false">Disabled</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Social + Contact</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>LinkedIn URL</Label><Input value={state.linkedin_url} onChange={(e) => setField("linkedin_url", e.target.value)} />
            <Label>GitHub URL</Label><Input value={state.github_url} onChange={(e) => setField("github_url", e.target.value)} />
            <Label>Twitter Handle</Label><Input value={state.twitter_handle} onChange={(e) => setField("twitter_handle", e.target.value)} />
            <Label>Contact Email</Label><Input value={state.contact_email} onChange={(e) => setField("contact_email", e.target.value)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Comments + Reading</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Comments Enabled</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.comments_enabled ? "true" : "false"} onChange={(e) => setField("comments_enabled", e.target.value === "true")}>
              <option value="true">Enabled</option><option value="false">Disabled</option>
            </select>
            <Label>Require Approval</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.comments_require_approval ? "true" : "false"} onChange={(e) => setField("comments_require_approval", e.target.value === "true")}>
              <option value="true">Yes</option><option value="false">No</option>
            </select>
            <Label>Block Spam Words (comma-separated)</Label><Textarea value={state.spam_words} onChange={(e) => setField("spam_words", e.target.value)} rows={3} />
            <Label>Show Author Bio</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.show_author_bio ? "true" : "false"} onChange={(e) => setField("show_author_bio", e.target.value === "true")}>
              <option value="true">Yes</option><option value="false">No</option>
            </select>
            <Label>Show Related Posts</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.show_related_posts ? "true" : "false"} onChange={(e) => setField("show_related_posts", e.target.value === "true")}>
              <option value="true">Yes</option><option value="false">No</option>
            </select>
            <Label>TOC Enabled</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.toc_enabled ? "true" : "false"} onChange={(e) => setField("toc_enabled", e.target.value === "true")}>
              <option value="true">Yes</option><option value="false">No</option>
            </select>
            <Label>Share Buttons Position</Label>
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={state.share_buttons_position} onChange={(e) => setField("share_buttons_position", e.target.value as Settings["share_buttons_position"])}>
              <option value="top">Top</option><option value="bottom">Bottom</option><option value="both">Both</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Email</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Newsletter Provider</Label><Input value={state.newsletter_provider} onChange={(e) => setField("newsletter_provider", e.target.value)} placeholder="mailchimp / convertkit / custom" />
            <Label>Provider Key Hint</Label><Input value={state.newsletter_api_key_hint} onChange={(e) => setField("newsletter_api_key_hint", e.target.value)} placeholder="Store actual secret in Supabase secrets" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Advanced</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Label>Custom CSS</Label><Textarea value={state.custom_css} onChange={(e) => setField("custom_css", e.target.value)} rows={4} />
            <Label>Header Code Injection</Label><Textarea value={state.header_injection} onChange={(e) => setField("header_injection", e.target.value)} rows={3} />
            <Label>Footer Code Injection</Label><Textarea value={state.footer_injection} onChange={(e) => setField("footer_injection", e.target.value)} rows={3} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdminSettings;
