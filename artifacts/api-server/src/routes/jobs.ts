import { Router, type IRouter } from "express";
import { db, jobsTable, companiesTable, savedJobsTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, sql, desc, inArray } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";

const router: IRouter = Router();

function formatJob(job: typeof jobsTable.$inferSelect, company: { name: string; logoUrl: string | null } | undefined, isSaved = false, applicantCount = 0) {
  return {
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
    applicantCount,
    savedCount: 0,
    postedAt: job.postedAt.toISOString(),
    isSaved,
  };
}

async function getSavedJobIds(userId: number): Promise<Set<number>> {
  const saved = await db.select().from(savedJobsTable).where(eq(savedJobsTable.userId, userId));
  return new Set(saved.map(s => s.jobId));
}

router.get("/jobs", async (req, res): Promise<void> => {
  const { q, location, type, experienceLevel, salaryMin, salaryMax, isRemote, isInternship, page = "1", limit = "20" } = req.query as Record<string, string>;

  const conditions = [eq(jobsTable.isActive, true)];

  if (q) conditions.push(ilike(jobsTable.title, `%${q}%`));
  if (location) conditions.push(ilike(jobsTable.location, `%${location}%`));
  if (type) conditions.push(eq(jobsTable.type, type));
  if (experienceLevel) conditions.push(eq(jobsTable.experienceLevel, experienceLevel));
  if (salaryMin) conditions.push(gte(jobsTable.salaryMin, parseInt(salaryMin)));
  if (salaryMax) conditions.push(lte(jobsTable.salaryMax, parseInt(salaryMax)));
  if (isRemote === "true") conditions.push(eq(jobsTable.isRemote, true));
  if (isInternship === "true") conditions.push(eq(jobsTable.type, "internship"));

  const pageNum = parseInt(page);
  const limitNum = Math.min(parseInt(limit), 50);
  const offset = (pageNum - 1) * limitNum;

  const [jobs, totalResult] = await Promise.all([
    db.select().from(jobsTable).where(and(...conditions)).orderBy(desc(jobsTable.postedAt)).limit(limitNum).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(jobsTable).where(and(...conditions)),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);
  const companyIds = [...new Set(jobs.map(j => j.companyId))];
  const companies = companyIds.length > 0
    ? await db.select().from(companiesTable).where(inArray(companiesTable.id, companyIds))
    : [];
  const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));

  // Try to get saved jobs if authenticated
  let savedIds = new Set<number>();
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { parseToken } = await import("../lib/auth.js");
      const parsed = parseToken(authHeader.slice(7));
      if (parsed) savedIds = await getSavedJobIds(parsed.userId);
    } catch { /* ignore */ }
  }

  res.json({
    jobs: jobs.map(j => formatJob(j, companyMap[j.companyId], savedIds.has(j.id))),
    total,
    page: pageNum,
    limit: limitNum,
  });
});

router.post("/jobs", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Only recruiters can post jobs" }); return;
  }
  const { title, companyId, location, type, experienceLevel, salaryMin, salaryMax, skills, description, requirements, responsibilities, benefits, isRemote } = req.body;
  if (!title || !companyId || !location || !type || !description) {
    res.status(400).json({ error: "Missing required fields" }); return;
  }
  const [job] = await db.insert(jobsTable).values({
    title, companyId, location, type, experienceLevel, salaryMin, salaryMax,
    skills: skills ?? [], description, requirements: requirements ?? [],
    responsibilities: responsibilities ?? [], benefits: benefits ?? [],
    isRemote: isRemote ?? false, postedById: user.id,
  }).returning();
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, job.companyId));
  res.status(201).json(formatJob(job, company));
});

router.get("/jobs/trending", async (req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable)
    .where(and(eq(jobsTable.isActive, true), eq(jobsTable.isTrending, true)))
    .orderBy(desc(jobsTable.postedAt)).limit(8);

  const companyIds = [...new Set(jobs.map(j => j.companyId))];
  const companies = companyIds.length > 0
    ? await db.select().from(companiesTable).where(inArray(companiesTable.id, companyIds))
    : [];
  const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
  res.json(jobs.map(j => formatJob(j, companyMap[j.companyId])));
});

router.get("/jobs/latest", async (req, res): Promise<void> => {
  const jobs = await db.select().from(jobsTable)
    .where(eq(jobsTable.isActive, true))
    .orderBy(desc(jobsTable.postedAt)).limit(12);

  const companyIds = [...new Set(jobs.map(j => j.companyId))];
  const companies = companyIds.length > 0
    ? await db.select().from(companiesTable).where(inArray(companiesTable.id, companyIds))
    : [];
  const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));
  res.json(jobs.map(j => formatJob(j, companyMap[j.companyId])));
});

router.get("/jobs/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }

  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, job.companyId));

  let isSaved = false;
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const { parseToken } = await import("../lib/auth.js");
      const parsed = parseToken(authHeader.slice(7));
      if (parsed) {
        const [s] = await db.select().from(savedJobsTable)
          .where(and(eq(savedJobsTable.userId, parsed.userId), eq(savedJobsTable.jobId, id)));
        isSaved = !!s;
      }
    } catch { /* ignore */ }
  }

  res.json({
    ...formatJob(job, company, isSaved),
    description: job.description,
    requirements: job.requirements ?? [],
    responsibilities: job.responsibilities ?? [],
    benefits: job.benefits ?? [],
    company: company ? {
      id: company.id,
      name: company.name,
      logoUrl: company.logoUrl,
      industry: company.industry,
      size: company.size,
      location: company.location,
      website: company.website,
      openPositions: 0,
      isVerified: company.isVerified,
    } : null,
  });
});

router.put("/jobs/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }
  if (user.role === "recruiter" && job.postedById !== user.id) {
    res.status(403).json({ error: "You do not own this job posting" }); return;
  }

  const { title, companyId, location, type, experienceLevel, salaryMin, salaryMax, skills, description, requirements, responsibilities, benefits, isRemote } = req.body;
  const updates: Partial<typeof jobsTable.$inferInsert> = {};
  if (title != null) updates.title = title;
  if (companyId != null) updates.companyId = companyId;
  if (location != null) updates.location = location;
  if (type != null) updates.type = type;
  if (experienceLevel != null) updates.experienceLevel = experienceLevel;
  if (salaryMin != null) updates.salaryMin = salaryMin;
  if (salaryMax != null) updates.salaryMax = salaryMax;
  if (skills != null) updates.skills = skills;
  if (description != null) updates.description = description;
  if (requirements != null) updates.requirements = requirements;
  if (responsibilities != null) updates.responsibilities = responsibilities;
  if (benefits != null) updates.benefits = benefits;
  if (isRemote != null) updates.isRemote = isRemote;
  updates.updatedAt = new Date();

  const [updated] = await db.update(jobsTable).set(updates).where(eq(jobsTable.id, id)).returning();
  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, updated.companyId));
  res.json(formatJob(updated, company));
});

router.delete("/jobs/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, id));
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }
  if (user.role === "recruiter" && job.postedById !== user.id) {
    res.status(403).json({ error: "You do not own this job posting" }); return;
  }
  await db.update(jobsTable).set({ isActive: false }).where(eq(jobsTable.id, id));
  res.json({ message: "Job deleted" });
});

router.post("/jobs/:id/save", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;

  const [existing] = await db.select().from(savedJobsTable)
    .where(and(eq(savedJobsTable.userId, user.id), eq(savedJobsTable.jobId, id)));

  if (existing) {
    await db.delete(savedJobsTable).where(eq(savedJobsTable.id, existing.id));
    res.json({ saved: false });
  } else {
    await db.insert(savedJobsTable).values({ userId: user.id, jobId: id });
    res.json({ saved: true });
  }
});

export default router;
