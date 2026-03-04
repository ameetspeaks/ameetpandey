
Implementation plan to convert the portfolio to a fully database-driven CMS (while keeping existing blog module unchanged, additive/safe rollout, single-admin self-approval, and versioning on all content tables).

1) Review Summary (current state)
- Blog/admin module is already database-driven (`blog_*` tables + admin CRUD).
- Non-blog content is still static/hardcoded:
  - Projects/case studies (`/grc-projects`, `/projects/*`)
  - Frameworks (`/frameworks`)
  - Policies (`/policies/*` + static PDFs)
  - Some GRC subpages are placeholders.
- Existing auth/RBAC foundation is good (`profiles`, `user_roles`, `has_role()`).
- Therefore: add a new non-blog CMS data layer and migrate frontend routes to query Supabase.

2) Architecture Decisions Applied
- Keep blog untouched (no breaking refactor of `blog_*` tables).
- Additive migration: introduce new tables for portfolio/GRC/policies/frameworks.
- Approval workflow: `draft -> under_review -> published -> archived`, self-approval allowed for admin.
- Version all tables: implement generic version + activity logging with trigger-based snapshots.
- Security correction: do NOT create a `users` table with roles; continue using `profiles` + `user_roles` (separate roles table).

3) Database Design (safe namespace strategy)
To avoid collisions with existing blog tables and preserve safe rollout:
- Core non-blog tables (as requested, same concepts):
  - `projects`, `project_sections`, `project_data_tables`
  - `risk_register_entries`, `audit_findings`
  - `vendor_assessments`, `vendor_assessment_criteria`
  - `security_policies`, `policy_sections`, `policy_requirements`
  - `frameworks`, `framework_domains`, `framework_controls`, `control_mappings`
  - `control_implementations`, `compliance_mappings`
- Shared supporting tables (non-blog scope):
  - `cms_categories`, `cms_tags`, `cms_content_tags`, `cms_media`
- Governance/audit/version:
  - `activity_log`
  - `content_versions` (generic: `content_type`, `content_id`, `version_number`, `content_snapshot`)
  - `content_approvals` (optional but recommended for explicit review actions even in single-admin mode)
- Analytics:
  - `page_views`, `downloads` (for projects/policies/frameworks)
- Link actor fields to `profiles(id)` where needed (`created_by`, `reviewed_by`, `approved_by`, `changed_by`).

4) Validation, Automation, and Data Integrity
- Add trigger functions for:
  - slug generation/normalization
  - enum/status transitions and publish date handling
  - risk score/risk level calculation
  - updated_at maintenance
  - structured JSON shape checks for rich sections/tables
- Add server-side guards (trigger-level) for max lengths and required fields.
- Add public insert protections (if any public endpoints are introduced) via strict `WITH CHECK`.
- Add indexes exactly on high-query fields (slug, status, type, published_date, foreign keys).

5) RLS & Access Model
- Public read: only `published + is_active` content for projects/policies/frameworks and their sections.
- Admin manage: full CRUD via `has_role(auth.uid(), 'admin')`.
- Version/audit tables: admin read/write only.
- No recursive RLS patterns; role checks only through `has_role()`.

6) Frontend Migration Plan (no downtime)
Phase A: Data access layer
- Add typed query modules/hooks for each content type (projects, policies, frameworks).
- Keep existing static pages functional until dynamic pages are ready.

Phase B: Public dynamic pages
- Convert:
  - `/grc-projects` and `/projects/*` to DB-backed listing/details
  - `/frameworks` to DB-backed framework cards + comparison + linked controls
  - `/policies/*` to DB-backed policy document rendering (replace hardcoded sections/PDF dependency)
- Maintain existing URLs; map old routes to slug-based loaders.

Phase C: Admin CMS expansion
- Add admin modules:
  - Projects CRUD with section/table editors
  - Risk register editor
  - Audit findings editor
  - Vendor assessment + criteria editor
  - Policies + policy sections + requirements editor
  - Frameworks/domains/controls/mappings editor
  - Compliance/implementation tracker
  - Shared categories/tags/media manager for non-blog content
- Add publish/review actions and revision timeline per record.

Phase D: Approval + accuracy workflows
- Implement status transitions and action buttons:
  - Submit for review / Approve & publish / Archive / Restore
- Add “accuracy checklist” fields + verification metadata (review notes, approval date, reviewer).
- Add compare-and-restore UI from `content_versions`.

7) Static-to-Database Content Migration
- Create one-time migration scripts to seed current static content into new tables:
  - case study data arrays -> `project_sections`, `risk_register_entries`, etc.
  - policy sections -> `policy_sections`
  - frameworks comparison -> `frameworks/domains/controls` seed baseline
- After parity validation, remove hardcoded content from page components.

8) QA & Release Gates
- Gate 1: schema + RLS + triggers validated with sample CRUD.
- Gate 2: dynamic public pages match current content and URL behavior.
- Gate 3: admin CRUD + publish workflow + version restore works for each module.
- Gate 4: audit log and version entries generated on every change.
- Gate 5: final regression on blog module (must remain unaffected).

9) Deliverables Sequence (recommended)
1. Schema + RLS + triggers + indexes
2. Shared hooks/repositories
3. Projects module (public + admin)
4. Policies module (public + admin)
5. Frameworks/compliance module (public + admin)
6. Versioning/activity UI + migration completion + cleanup

This approach gives you a true enterprise CMS model for all portfolio/GRC content, with auditability and controlled publishing, without destabilizing the already-working blog system.
