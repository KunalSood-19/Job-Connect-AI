import { Router, type IRouter } from "express";
import { db, usersTable, jobsTable, savedJobsTable, companiesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth, getCurrentUser, formatUserProfile, safeParseJSON } from "../lib/auth";

const router: IRouter = Router();

router.get("/users/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  res.json(formatUserProfile(user));
});

router.put("/users/:id/profile", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const current = getCurrentUser(req)!;
  if (current.id !== id && current.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const { name, headline, bio, location, phone, website, linkedinUrl, githubUrl,
    experience, education, projects, certifications } = req.body;

  const updates: Partial<typeof usersTable.$inferInsert> = {};
  if (name != null) updates.name = name;
  if (headline != null) updates.headline = headline;
  if (bio != null) updates.bio = bio;
  if (location != null) updates.location = location;
  if (phone != null) updates.phone = phone;
  if (website != null) updates.website = website;
  if (linkedinUrl != null) updates.linkedinUrl = linkedinUrl;
  if (githubUrl != null) updates.githubUrl = githubUrl;
  if (experience != null) updates.experience = JSON.stringify(experience);
  if (education != null) updates.education = JSON.stringify(education);
  if (projects != null) updates.projects = JSON.stringify(projects);
  if (certifications != null) updates.certifications = JSON.stringify(certifications);
  updates.updatedAt = new Date();

  // Calculate profile strength
  const filledFields = [updates.name || current.name, updates.headline || current.headline,
    updates.bio || current.bio, updates.location || current.location,
    (current.skills?.length ?? 0) > 0].filter(Boolean).length;
  updates.profileStrength = Math.min(100, filledFields * 20);

  const [updated] = await db.update(usersTable).set(updates).where(eq(usersTable.id, id)).returning();
  res.json(formatUserProfile(updated));
});

router.put("/users/:id/skills", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const current = getCurrentUser(req)!;
  if (current.id !== id && current.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  const { skills } = req.body;
  if (!Array.isArray(skills)) { res.status(400).json({ error: "skills must be array" }); return; }

  const [updated] = await db.update(usersTable).set({ skills, updatedAt: new Date() })
    .where(eq(usersTable.id, id)).returning();
  res.json(formatUserProfile(updated));
});

router.get("/users/:id/saved-jobs", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const saved = await db.select().from(savedJobsTable).where(eq(savedJobsTable.userId, id));
  if (saved.length === 0) { res.json([]); return; }

  const jobIds = saved.map(s => s.jobId);
  const jobs = await db.select().from(jobsTable).where(inArray(jobsTable.id, jobIds));

  const companies = jobs.length > 0
    ? await db.select().from(companiesTable)
        .where(inArray(companiesTable.id, jobs.map(j => j.companyId)))
    : [];
  const companyMap = Object.fromEntries(companies.map(c => [c.id, c]));

  res.json(jobs.map(j => ({
    ...j,
    companyName: companyMap[j.companyId]?.name ?? "",
    companyLogoUrl: companyMap[j.companyId]?.logoUrl ?? null,
    skills: j.skills ?? [],
    applicantCount: 0,
    savedCount: 0,
    postedAt: j.postedAt.toISOString(),
    isSaved: true,
  })));
});

export default router;
