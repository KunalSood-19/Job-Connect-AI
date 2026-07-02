---
name: JobConnect AI access control rules
description: Role-based and resource-level authorization rules that must be enforced
---

## Applications endpoint (`/api/applications`)
- **Students**: see only their own applications; may filter by jobId
- **Recruiters**: MUST provide `jobId`; server verifies `jobs.posted_by_id = recruiter.id` before returning
- **Admins**: may query all, optionally filtered by jobId

**Why:** Without jobId requirement for recruiters, any recruiter could read all candidate applications across the platform (cross-tenant data leak).

## Jobs PUT/DELETE (`/api/jobs/:id`)
- Recruiters may only edit/delete jobs where `posted_by_id = their userId`
- Admins bypass ownership check

**Why:** Without ownership check, any recruiter could deactivate or modify any competitor's job posting.

## Applications PATCH (`/api/applications/:id/status`)
- Recruiters may only update applications for jobs they own (checked via app.jobId → job.posted_by_id)

## Enforcement location
All checks are in the route handler, after the `requireAuth` middleware confirms the user is authenticated. The pattern is: fetch the resource, compare ownership, 403 if mismatch.
