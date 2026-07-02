import { Router, type IRouter } from "express";
import { db, applicationsTable, jobsTable, companiesTable, usersTable } from "@workspace/db";
import { logger } from "../lib/logger";
import { eq, and, desc, sql } from "drizzle-orm";
import { requireAuth, getCurrentUser, formatUserProfile } from "../lib/auth";

const router: IRouter = Router();

async function formatApplication(app: typeof applicationsTable.$inferSelect, includeJob = true, includeApplicant = false) {
  const result: any = {
    id: app.id,
    jobId: app.jobId,
    userId: app.userId,
    status: app.status,
    coverLetter: app.coverLetter,
    resumeId: app.resumeId,
    appliedAt: app.appliedAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  };

  if (includeJob) {
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, app.jobId));
    if (job) {
      const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, job.companyId));
      result.job = {
        id: job.id,
        title: job.title,
        companyId: job.companyId,
        companyName: company?.name ?? "",
        companyLogoUrl: company?.logoUrl ?? null,
        location: job.location,
        type: job.type,
        experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        skills: job.skills ?? [],
        isRemote: job.isRemote,
        isActive: job.isActive,
        applicantCount: 0,
        savedCount: 0,
        postedAt: job.postedAt.toISOString(),
        isSaved: false,
      };
    }
  }

  if (includeApplicant) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, app.userId));
    if (user) result.applicant = formatUserProfile(user);
  }

  return result;
}

router.get("/applications", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const { jobId, status } = req.query as Record<string, string>;

  const conditions = [];

  if (user.role === "student") {
    // Students only see their own applications
    conditions.push(eq(applicationsTable.userId, user.id));
    if (jobId) conditions.push(eq(applicationsTable.jobId, parseInt(jobId)));
  } else if (user.role === "recruiter") {
    // Recruiters must specify a jobId AND that job must belong to them
    if (!jobId) {
      res.status(400).json({ error: "jobId is required for recruiters" });
      return;
    }
    const parsedJobId = parseInt(jobId);
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, parsedJobId));
    if (!job || job.postedById !== user.id) {
      res.status(403).json({ error: "You do not own this job posting" });
      return;
    }
    conditions.push(eq(applicationsTable.jobId, parsedJobId));
  } else if (user.role === "admin") {
    // Admins can filter by jobId optionally
    if (jobId) conditions.push(eq(applicationsTable.jobId, parseInt(jobId)));
  }

  if (status) conditions.push(eq(applicationsTable.status, status));

  const apps = await db.select().from(applicationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(applicationsTable.appliedAt))
    .limit(100);

  const includeApplicant = user.role === "recruiter" || user.role === "admin";
  const formatted = await Promise.all(apps.map(a => formatApplication(a, true, includeApplicant)));
  res.json(formatted);
});

router.post("/applications", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "student") {
    res.status(403).json({ error: "Only students can apply" }); return;
  }

  const { jobId, coverLetter, resumeId } = req.body;
  if (!jobId) { res.status(400).json({ error: "jobId is required" }); return; }

  const [existing] = await db.select().from(applicationsTable)
    .where(and(eq(applicationsTable.userId, user.id), eq(applicationsTable.jobId, jobId)));
  if (existing) {
    res.status(409).json({ error: "Already applied to this job" }); return;
  }

  const [app] = await db.insert(applicationsTable)
    .values({ jobId, userId: user.id, coverLetter, resumeId, status: "applied" })
    .returning();

  res.status(201).json(await formatApplication(app, true, false));
});

router.get("/applications/stats", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const apps = await db.select().from(applicationsTable)
    .where(eq(applicationsTable.userId, user.id));

  const byStatus: Record<string, number> = {};
  let interviews = 0;
  let offers = 0;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  let thisWeek = 0;

  for (const app of apps) {
    byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
    if (app.status === "interview") interviews++;
    if (app.status === "offered") offers++;
    if (app.appliedAt >= weekAgo) thisWeek++;
  }

  res.json({ total: apps.length, byStatus, thisWeek, interviews, offers });
});

router.get("/applications/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const [app] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, id));
  if (!app) { res.status(404).json({ error: "Not found" }); return; }

  const user = getCurrentUser(req)!;
  if (app.userId !== user.id && user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  res.json(await formatApplication(app, true, user.role !== "student"));
});

router.patch("/applications/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  // Recruiters may only update applications for jobs they own
  if (user.role === "recruiter") {
    const [app] = await db.select().from(applicationsTable).where(eq(applicationsTable.id, id));
    if (!app) { res.status(404).json({ error: "Not found" }); return; }
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, app.jobId));
    if (!job || job.postedById !== user.id) {
      res.status(403).json({ error: "You do not own this job posting" }); return;
    }
  }

  const { status, notes } = req.body;
  const updates: Partial<typeof applicationsTable.$inferInsert> = { updatedAt: new Date() };
  if (status) updates.status = status;
  if (notes != null) updates.notes = notes;

  const [updated] = await db.update(applicationsTable).set(updates)
    .where(eq(applicationsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }

  res.json(await formatApplication(updated, true, true));
});

export default router;
