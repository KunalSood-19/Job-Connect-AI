# JobConnect AI

A production-ready AI-powered career and recruitment SaaS platform. Students find AI-matched jobs, analyze resumes, practice interviews, and track applications. Recruiters post jobs, screen candidates with AI, and manage hiring pipelines.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/jobconnect-ai run dev` — run the frontend (port 24826)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, Recharts, next-themes (dark mode)
- Backend: Express 5, pino logging
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec in lib/api-spec/openapi.yaml)
- Build: esbuild (CJS bundle)

## Where Things Live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth for all API types)
- `lib/db/src/schema/` — Drizzle table definitions (users, companies, jobs, applications, saved_jobs, resumes, notifications, interviews)
- `artifacts/api-server/src/routes/` — Express route handlers split by domain
- `artifacts/api-server/src/lib/auth.ts` — Auth helpers (token, password hash, middleware)
- `artifacts/jobconnect-ai/src/` — React frontend with pages, components, hooks
- `lib/api-client-react/src/generated/` — Generated React Query hooks (do not edit)
- `lib/api-zod/src/generated/` — Generated Zod schemas for server validation (do not edit)

## Architecture Decisions

- **Simple token auth**: Tokens are base64-encoded JSON payloads (not JWT) for development simplicity. Replace with proper JWT + bcrypt before production.
- **AI features are mocked**: `/ai/*` routes return computed/rule-based responses. Wire up Gemini API / spaCy for production AI.
- **Fallback mock data in frontend**: Pages show realistic hardcoded fallback data when the API returns empty, so the app always looks populated.
- **Drizzle stores arrays as native PG arrays** and JSON blobs as `text` columns (parsed at read time).
- **Role-based access**: `role` field on users table (student/recruiter/admin). Routes check role via `requireAuth` + `getCurrentUser`.

## Product

**For Students:**
- Landing page with job search, AI feature showcase, trending jobs
- Job board with advanced filters (type, location, salary, experience, remote)
- AI resume analyzer with ATS score, keyword gaps, and improvement suggestions
- AI job recommendations with match percentage per job
- Skill gap analysis against any job
- AI interview practice (question generation + answer evaluation)
- Career roadmap generator by target role
- Student dashboard with application tracker, profile strength, activity chart
- Profile editor (experience, education, skills, projects, certifications)
- Resume builder with templates

**For Recruiters:**
- Post, edit, and manage job listings
- Recruiter dashboard with hiring funnel chart and applicant pipeline
- Candidate screening with AI match scoring
- Application status management (shortlist, interview, offer, reject)

**For Admins:**
- Admin dashboard with platform growth charts
- User management (activate/suspend accounts)
- Platform-wide statistics

## User Preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after any change to `lib/api-spec/openapi.yaml`
- Run `pnpm --filter @workspace/db run push` after any DB schema changes
- Clearbit logo URLs (`logo.clearbit.com`) may not resolve in sandbox — apps use fallbacks
- The `notifications/read-all` route must be registered BEFORE `notifications/:id/read` to avoid param conflicts in Express

## Pointers

- See `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
