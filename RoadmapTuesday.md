
# Roadmap to Fix Build, Implement RBAC with NextAuth, and Ship an AI Content Generation + Translation Pipeline

Below is a production-ready, sprint-based roadmap aligned with the current codebase structure and your workflow (Gemini CLI-driven), with concrete tasks, acceptance tests, and best practices to avoid regressions. It starts by unblocking the build, then hardens authentication/RBAC, implements the AI content pipeline (reading prompt.txt, admin approval, publish), and finally validates dynamic i18n support on generated content.

Important notes

- Do not paste or store plaintext API keys in code or issue trackers; use environment variables and store the key in your .env files or secret managers.
- The legacy site is a reference for content and IA, not a technical dependency.[^1]
- Next.js App Router supports i18n routing and rendering; follow current guidance for locale-aware routes and translations.[^2][^3]
- Use standard Next.js auth/authorization guidance as a baseline and apply middleware-based guards for RBAC.[^4][^5][^6]


## Sprint 0 — Build Unblocker and Repository Hardening

Goals

- Fix the current build error in src/app/api/ai/generate/route.ts.
- Stabilize TypeScript and linting.
- Align environment variables and secrets.

Tasks

- Repair malformed template/string content in src/app/api/ai/generate/route.ts (unclosed template literals or pasted plain text in a TS file is causing “Expected ';', '}' or <eof>” around lines 40–46). Ensure only valid TS/JS code exists in the file and remove stray narrative text embedded in code.
- Add strict Prettier+ESLint formatting and run lint:fix in CI and before build to catch syntax early.
- Validate tsconfig paths resolution across packages, and ensure all imports resolve during next build.
- Ensure Prisma (if used) generates before build and schema compiles.
- Validate presence of required .env.* entries: NEXTAUTH_URL, NEXTAUTH_SECRET, DATABASE_URL, OPENAI_API_KEY (for OpenAI-compatible providers), and app-specific vars. Never commit them.

Acceptance tests

- pnpm i \&\& pnpm prisma generate (if applicable) runs without error.
- pnpm build (or npm run build) succeeds.
- All API route files compile; no stray text fragments remain.

References

- Next.js auth and best-practice guard patterns for protected routes and middleware.[^5][^6][^4]
- Next.js i18n guide for App Router to keep locale-safe paths during later sprints.[^3][^2]


## Sprint 1 — Authentication and RBAC Foundation with NextAuth

Goals

- Establish solid NextAuth configuration with session tokens/JWT.
- Implement role-based access control (RBAC) persisted in DB.
- Protect /admin and admin APIs with middleware.

Tasks

- NextAuth setup:
    - Configure [...nextauth]/route.ts with your chosen providers (Credentials and/or OAuth).
    - Enable JWT sessions; include role in JWT and session objects.
- RBAC schema and persistence:
    - Add User table with role field: Admin | Editor | Author | Viewer.
    - Optionally add Role and Permission tables for extensibility if granular permissions are required.
- Middleware:
    - Implement middleware.ts to guard /admin/:path* and sensitive /api/admin/:path* routes that check session and role.
    - On missing/invalid session, redirect to custom sign-in.
    - On insufficient role, return 403 or /unauthorized page.
- Frontend:
    - Ensure login page exists and sign-in flow works.
    - Build an Admin layout that shows admin-only navigation and hides controls for non-admins.

Acceptance tests

- Unauthenticated requests to /admin and protected API routes redirect to sign-in.
- Signed-in users with role!==Admin are blocked from Admin pages.
- Admin user can access /admin and protected APIs.
- Session includes role and is verified in middleware on each request.

References

- Next.js official guidance for auth and middleware guards.[^6][^5]
- NextAuth role-based route protection patterns and storing role in session/JWT.[^4]


## Sprint 2 — Admin UIs and Content Workflow Entities

Goals

- Create database entities for AI-generated drafts and approvals.
- Build minimal admin UI to review, approve, or reject content.

Tasks

- DB schema:
    - Tables: ContentDraft(id, slug, locale, title, body, status: ‘pending’|‘approved’|‘rejected’, createdBy, createdAt, updatedAt, metadata JSONB).
    - PublishedContent(id, slug, locale, title, body, publishedAt, publishedBy, metadata).
    - Optional: AuditLog(action, actorId, entityType, entityId, snapshot).
- Admin pages:
    - /admin/staging: list drafts with status filters.
    - /admin/staging/[id]: view draft, SEO preview, approve/reject.
- APIs:
    - POST /api/admin/drafts -> create new draft.
    - GET /api/admin/drafts -> list drafts (filter by status).
    - PATCH /api/admin/drafts/[id]/approve -> move to PublishedContent and set approvedBy/At.
    - PATCH /api/admin/drafts/[id]/reject -> set status rejected with reason.
- Permissions:
    - Only Admin can approve/reject.
    - Editor can create drafts; Admin and Editor can edit drafts; only Admin can publish.

Acceptance tests

- Admin can see all pending drafts, open details, approve to publish.
- Approval creates PublishedContent and marks draft approved.
- Non-admins cannot approve/reject.
- API returns correct status codes for unauthorized/forbidden.

References

- Authorization rule examples for role checks on middleware and API handlers.[^5][^6][^4]


## Sprint 3 — AI Content Generation Pipeline (reads prompt.txt)

Goals

- Implement AI generation API that reads prompt.txt, injects topic/context, and creates drafts.
- Secure the route to Admin/Editor roles.
- Do not publish automatically; admin approval required.

Tasks

- Prompt loading:
    - Place prompt.txt at a stable path (e.g., src/app/api/ai/generate/prompt.txt or at repository root) and read via fs/promises in the route handler.
- AI provider integration:
    - Use OpenAI-compatible client with your key via environment var OPENAI_API_KEY (do not hardcode the key in code).
    - Construct messages with system prompt from prompt.txt and user content (topic, locale, constraints).
    - Parse model output into structured content: title, dek/summary, sections, metadata.
- API route:
    - POST /api/ai/generate: body {topic, locale} -> generates content -> stores as ContentDraft(status='pending').
    - RBAC: Admin and Editor allowed to call; Author optional depending on policy.
- Content schema:
    - Store raw LLM output and parsed fields in metadata for traceability.
- Error handling:
    - Validate inputs and return 400 for missing topic/locale, 401 if not authenticated, 403 if insufficient role, 500 on provider errors.

Acceptance tests

- Calling POST /api/ai/generate with Admin/Editor auth creates a pending draft with parsed content.
- Draft visible in /admin/staging and can be approved into PublishedContent.
- Route rejects unauthenticated or non-privileged users.

References

- Follow modern Next.js server route patterns; keep secrets in env and never in client code.[^6]
- For production security, never log full prompts with secrets and avoid PII.


## Sprint 4 — Publishing and Site Integration

Goals

- Make published content available on localized routes /[locale]/reports/[slug].
- Ensure ISR/SSG or SSR strategy is sound and revalidate on publish.

Tasks

- Pages:
    - Implement server component to fetch PublishedContent by slug and locale.
    - Ensure canonical URLs, breadcrumb, and SEO metadata generation.
- Revalidation:
    - On approval/publish, trigger revalidation for the affected route(s) or use dynamic SSR as needed.
- Listing:
    - /[locale]/reports to list published content with pagination and filters.
- Redirects and legacy slugs:
    - If migrating from the legacy site structure, consider redirects table to align with SEO.

Acceptance tests

- Approved content appears on the public site at the expected URL.
- Unapproved drafts never show publicly.
- Revalidation or SSR ensures fresh content availability after approval.

References

- Next.js i18n routing and rendering guidance for locale-aware pages.[^2][^3]


## Sprint 5 — Dynamic Translation for Generated Content

Goals

- Add translation pipeline to produce localized variants of approved content across supported locales.

Tasks

- Translation options:
    - Option A: LLM-based translation job on approve (server-side), creating additional PublishedContent rows for each target locale with translated body/title/metadata.
    - Option B: On-demand translation at request time with caching; less deterministic and can vary over time; generally not advised for SEO-heavy sites.
- Admin controls:
    - In /admin/staging/[id] or /admin/reports/[id], add “Generate translations” action.
    - Provide per-locale review/override editors for human QA.
- Storage:
    - Persist translations per locale in PublishedContent; avoid mixing translated content in a single record for simpler queries and SEO.
- i18n routing:
    - Ensure route /[locale]/reports/[slug] resolves to correct locale record.
    - Provide localized metadata (title/description) and structured data.

Acceptance tests

- After approval, translations are generated for all target locales.
- Translational variants display correctly with locale switch.
- Admin can edit translations per locale and re-publish.

References

- Next.js i18n with App Router patterns and locale-based routing.[^3][^2]
- Using next-intl/i18next or similar libraries for static UI strings; generated content lives in DB and is not part of static JSON bundles.[^7][^8][^2]


## Sprint 6 — Security, Observability, and Reliability

Goals

- Harden auth, secure secrets, add logging and audit trails, rate limit public APIs.

Tasks

- Security:
    - Use HTTP-only secure cookies for sessions.
    - Sanitize and validate all inputs; escape rendered content or store as structured markup and whitelist components.
    - Role checks in middleware and server routes; client state is not trusted.
- Secrets:
    - OPENAI_API_KEY and NEXTAUTH_SECRET in env only, never committed.
    - If exposing webhooks or background tasks, add signature verification.
- Rate limiting:
    - Add basic rate limiting for public routes like search and contact.
- Observability:
    - Add server logs for generate/approve/reject actions.
    - Add AuditLog entries for content lifecycle actions.

Acceptance tests

- Attempted access to admin APIs without role returns 403.
- Inputs with scripts are not executed in the UI.
- Logs show full audit trail for content lifecycle.

References

- Next.js auth/authorization best practices with middleware, cookie usage, and per-route protection.[^9][^5][^6]


## Sprint 7 — Performance, SEO, and QA

Goals

- Optimize delivery, ensure SEO correctness, finalize E2E QA.

Tasks

- Performance:
    - Ensure images and assets use Next/Image and caching.
    - Use ISR where applicable; minimize cold SSR latency.
- SEO:
    - Ensure per-locale meta tags, canonical URLs, and schema.org markup.
    - Validate sitemaps for each locale.
- QA:
    - Manual walkthroughs: content generation -> admin approval -> publish -> translations -> revalidation -> public render.
    - Implement basic Playwright tests for protected routes and publish flow.

Acceptance tests

- Lighthouse performance >90 on key pages.
- Sitemaps and canonical tags correct per locale.
- E2E tests pass for critical workflows.

References

- Next.js docs on internationalization and auth for aligning with platform expectations.[^2][^6][^3]

***

## Implementation Details and Best Practices

Authentication and RBAC

- Store role in the JWT/session and verify in middleware for every protected route; never rely on client state.[^9][^4][^5][^6]
- Pattern:
    - middleware.ts checks session token; if missing, redirect to sign-in.
    - If present, decode JWT and check role; if insufficient, return NextResponse with 403 or redirect to /unauthorized.
- Avoid storing tokens in localStorage; rely on HTTP-only cookies tied to NextAuth session.[^9]

AI Content Generation

- Read prompt.txt via fs/promises at runtime in the API route and pass it as system instruction to the LLM.
- Keep topic, locale, and guardrails in the user message.
- Parse LLM output into structured fields; store both raw and parsed in ContentDraft.metadata for traceability.
- Use env var OPENAI_API_KEY; do not embed the provided key in code.

Dynamic Translation

- Prefer server-side translation at approval time for stable SEO content; allow human review on a per-locale basis.
- Store per-locale published rows to ensure clean locale routing and consistent metadata.

i18n App Router

- Use /[locale]/ segments and ensure locale-aware fetching of content from DB.
- Keep UI strings in localization framework; content stored in DB per-locale and not bundled statically.[^8][^7][^3][^2]

***

## Gemini CLI-Oriented Prompts for Each Sprint

You can copy each sprint prompt, run it from repo root, and pipe output to MILESTONEB.md or sprint-specific files.

Sprint 0 prompt (Build unblocker and repository hardening)
gemini "Act as a senior Next.js/TypeScript maintainer. Audit the repository for build blockers. Focus on src/app/api/ai/generate/route.ts for malformed strings or stray text causing 'Expected ;, } or <eof>' errors, and fix them. Verify imports, tsconfig path resolution, Prisma generate (if present), and linting. Propose concrete diffs, then output a step-by-step fix plan and final validated file versions. Do not include secrets. Output all findings and corrected code blocks, ready to copy-paste."

Sprint 1 prompt (NextAuth + RBAC)
gemini "Act as a NextAuth/Next.js App Router expert. Implement JWT sessions with role in token and session. Add middleware-based protection for /admin and /api/admin routes. Provide complete examples for [...nextauth]/route.ts, middleware.ts, role helpers, and a minimal login page. Include DB schema changes for User with role. Output precise code blocks and migration SQL. Do not include secrets."

Sprint 2 prompt (Admin UI and workflow entities)
gemini "Implement content workflow entities and admin UI. Define DB schema for ContentDraft and PublishedContent, plus optional AuditLog. Create admin pages: /admin/staging list and detail, with approve/reject actions; implement corresponding API routes with RBAC. Provide code blocks for pages, server actions or route handlers, and Prisma schema/migrations."

Sprint 3 prompt (AI generation reads prompt.txt)
gemini "Create POST /api/ai/generate that reads prompt.txt, takes {topic, locale}, calls an OpenAI-compatible API using OPENAI_API_KEY from env, parses output into {title, summary, body, metadata}, and stores ContentDraft(status='pending'). Include robust error handling and RBAC to allow Admin/Editor. Provide code for the route handler, parsing utilities, and a sample prompt.txt structure. Do not log secrets."

Sprint 4 prompt (Publishing integration)
gemini "Wire publishing to the site. On approval, create PublishedContent per locale and trigger revalidation or ensure SSR fetch correctness. Implement /[locale]/reports/[slug] server component that fetches PublishedContent and renders page with SEO metadata. Provide code blocks for revalidation, the page component, and list page with pagination."

Sprint 5 prompt (Dynamic translation)
gemini "Add translation pipeline for generated content. On approve, generate translations for target locales via LLM, store PublishedContent per locale, and provide admin controls to review/edit translations. Provide code for server actions/API routes, translation job function, and admin UI updates. Include caching and retry strategy."

Sprint 6 prompt (Security and observability)
gemini "Harden security and add observability. Add input validation for all routes, HTTP-only cookies, RBAC checks, basic rate limiting for public endpoints, and audit logging for content lifecycle. Provide code blocks for validators, middleware changes, and logging."

Sprint 7 prompt (Performance, SEO, QA)
gemini "Optimize performance and SEO. Add locale-aware metadata and sitemaps, ensure ISR/SSR strategy, and propose Playwright tests covering generation->approval->publish->translation. Provide code examples for metadata generation and tests."

Run format example (per sprint)
gemini "<the sprint prompt...>" > MILESTONEB.md

***

## Key Policies and Guardrails

- Secrets handling: always via env; never commit secrets or print in logs.[^6]
- Role checks enforced on server through middleware and API routes, not just client UI.[^4][^5][^9][^6]
- Generated content must be moderated and approved before publishing; store raw LLM output for audit but display sanitized/parsed content.
- Translations are persisted per-locale to ensure stable SEO and i18n navigation.[^3][^2]

***

## Risk Mitigation

- Build regressions: add a CI step running lint, type-check, and build on each PR.
- Data integrity: use migrations and backup before schema changes; add unique constraints on slug+locale.
- SEO risks: verify canonical, hreflang, and sitemaps for locales before enabling indexing.
- Abuse of AI routes: restrict to Admin/Editor and add rate limiting.

***

## What to Execute First

1) Fix the build (Sprint 0) and commit.
2) Implement NextAuth+RBAC (Sprint 1), protect admin/API routes, commit.
3) Add ContentDraft/PublishedContent models and admin UIs (Sprint 2), commit.
4) Implement AI generation from prompt.txt (Sprint 3), commit.
5) Wire publishing with revalidation and public pages (Sprint 4), commit.
6) Add translation workflow and admin review (Sprint 5), commit.
7) Harden security and add audit+rate limits (Sprint 6), commit.
8) Optimize SEO/perf and add E2E tests (Sprint 7), commit.

This sequence ensures that each sprint produces a working, testable increment that integrates tightly with the current Next.js App Router, NextAuth RBAC model, and internationalized routing guidance.

openai key:

