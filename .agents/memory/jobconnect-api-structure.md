---
name: JobConnect AI API structure
description: OpenAPI-first codegen flow and route organization
---

## Golden rule
`lib/api-spec/openapi.yaml` is the single source of truth. After any change to it, run:
```
pnpm --filter @workspace/api-spec run codegen
```
Never hand-edit `lib/api-client-react/src/generated/` or `lib/api-zod/src/generated/`.

## Route organization
Each domain has its own file in `artifacts/api-server/src/routes/`:
- auth.ts, users.ts, jobs.ts, applications.ts, companies.ts, resumes.ts
- ai.ts (AI features — resume analysis, recommendations, skill gap, career roadmap, interview practice)
- notifications.ts, dashboard.ts (student/recruiter/admin dashboards + admin user management)
- index.ts — registers all routers; ORDER MATTERS: `notifications/read-all` must come before the wildcard router would interpret `:id`

## AI routes are mocked
All `/ai/*` routes return computed/rule-based responses. Wire up Gemini API for production.

## Mock data fallback
Frontend pages in `artifacts/jobconnect-ai/src/` fall back to hardcoded mock data when API returns empty, so UI always looks populated during development.
