
Implementation Plan: Medium-Style Blog Platform (Prompts 9–11)

1) Current State Snapshot (from codebase)
- Frontend already has portfolio pages, policies, resume, and contact form.
- No blog routes/components yet (`/blog` is linked in Contact but route does not exist).
- No auth system exists yet (no `supabase.auth` usage).
- Supabase currently has only `contact_submissions`.
- Confirmed decisions:
  - User profiles: Yes
  - Admin model: Single-admin
  - Comments: Enabled
  - Newsletter: Capture + integration placeholders

2) Delivery Strategy
- Build in 3 phases aligned to your prompts, but with an auth/security foundation first.
- Keep public blog and admin CRM separated:
  - Public: `/blog`, `/blog/:slug`
  - Protected: `/admin/*` with role checks
- Use incremental releases so each phase is testable and production-safe.

3) Phase 0 (Foundation required before Prompt 10)
A. Authentication + authorization
- Implement Supabase auth pages/flows: login, forgot password, reset password route.
- Create role system in separate table (secure pattern):
  - `app_role` enum
  - `user_roles` table
  - `has_role()` security definer function
- Single-admin bootstrap: first configured user gets `admin` role via migration seed path.
- Add protected route wrapper for `/admin/*` using server-validated role checks.

B. Profiles (required by your decision)
- Create `profiles` table linked to `auth.users(id)` (cascade delete).
- Trigger to auto-create profile on signup.
- RLS: user reads/updates own profile; admin can read all as needed.

4) Phase 1 (Prompt 9: Blog Frontend & Reading Experience)
A. Data model (public-facing core)
- Create: `blog_posts`, `blog_categories`, `blog_tags`, `blog_post_tags`, `blog_subscribers`, `blog_post_views`.
- Add `slug` uniqueness + indexes for slug/date/status/category.
- Store rich content as structured JSON blocks (supports terminal/image/callout/table blocks cleanly).

B. Public blog UI
- `/blog`: hero, featured post, searchable latest grid, category tabs, sidebar widgets, pagination.
- `/blog/:slug`: full article layout, reading progress bar, share actions, related posts, prev/next nav.
- Add responsive reading typography + content block renderers (terminal, callout, gallery, code with copy).

C. SEO
- Add page-level meta/OG/Twitter/canonical tags.
- Add article JSON-LD schema.
- Ensure image alt text handling and semantic heading structure.

5) Phase 2 (Prompt 10: Admin CRM & Editor)
A. Admin shell
- `/admin` layout with sidebar nav and protected routes.
- Dashboard cards + charts using existing chart stack (`recharts` already installed).

B. Posts management
- `/admin/posts`: filters, search, sort, bulk actions, status management, duplication, soft delete.
- `/admin/posts/new` + `/admin/posts/edit/:id`: 2-column editor + settings panels.

C. Rich editor
- Implement block-based editor (headings, lists, code, terminal block, callouts, images/video/table).
- Auto-save every 30s, save state indicator, manual save, draft/publish/schedule states.
- Revision capture table for version history and restore.

6) Phase 3 (Prompt 11: Advanced CRUD & Operations)
A. Admin modules
- Categories CRUD (`/admin/categories`) with hierarchy + sort order.
- Tags CRUD + merge workflow (`/admin/tags`).
- Media library (`/admin/media`) with upload, metadata, usage count.
- Comments moderation (`/admin/comments`).
- Subscribers management (`/admin/subscribers`).
- Analytics page (`/admin/analytics`) using tracked events.

B. Settings
- `/admin/settings`: blog defaults, SEO defaults, social links, reading options, moderation toggles.
- Newsletter integration placeholders only (capture + export + connector-ready hooks).

7) Security & RLS Plan
- Public read policies only for published + active posts/categories/tags.
- Admin write/read policies gated by `has_role(auth.uid(), 'admin')`.
- Comments/subscribers public insert allowed with strict validation.
- Rate-limit strategy:
  - DB validation triggers for comments/subscribers
  - optional edge-function throttling for public write endpoints
- Input validation:
  - Client: Zod schemas
  - Server: trigger validation on critical public-write tables

8) Supabase Technical Details (planned schema)
- Core tables:
  - `profiles`, `user_roles`
  - `blog_posts`, `blog_post_revisions`
  - `blog_categories`, `blog_tags`, `blog_post_tags`
  - `blog_media`
  - `blog_comments`
  - `blog_subscribers`
  - `blog_analytics_events`
- Storage:
  - Public bucket for optimized blog media variants
  - RLS on `storage.objects` scoped to admin writes, public reads where needed

9) Frontend Integration Updates
- Navigation:
  - Add “Blog” to header/footer (desktop + mobile)
  - Keep separate admin navigation in `/admin` shell
- Homepage:
  - Add “Latest Security Insights” section (3 recent posts + CTA)
- Existing pages remain unchanged except link consistency and shared style tokens.

10) Known Constraints / Decisions
- Newsletter sending is not implemented as native marketing email in Lovable auth email tooling.
- Phase 1 will implement subscriber capture, export, and integration-ready architecture.
- Since prompts are large, implementation will be split into scoped milestones to avoid regressions.

11) Execution Milestones
- Milestone A: Auth + roles + profiles + protected admin shell
- Milestone B: Public blog list/detail + SEO + view tracking
- Milestone C: Admin posts CRUD + editor + autosave + revisions
- Milestone D: Categories/tags/media/comments/subscribers/analytics/settings
- Milestone E: Final QA (desktop/mobile), security verification, and end-to-end flow tests

12) End-to-End Test Plan (must pass before completion)
- Create/edit/publish/schedule post flow
- Terminal/image/callout block rendering on `/blog/:slug`
- Category/tag/search filters and pagination
- Media upload + reuse in editor
- Comments submission + moderation lifecycle
- SEO tags/schema verification in page source
- Admin route protection and role enforcement
- Mobile reading and admin usability checks
