import { Router, type IRouter } from "express";
import { db, companiesTable, jobsTable } from "@workspace/db";
import { eq, ilike, and, desc, sql } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";

const router: IRouter = Router();

function formatCompany(c: typeof companiesTable.$inferSelect, openPositions = 0) {
  return {
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
    industry: c.industry,
    size: c.size,
    location: c.location,
    website: c.website,
    openPositions,
    isVerified: c.isVerified,
  };
}

router.get("/companies", async (req, res): Promise<void> => {
  const { q, industry } = req.query as Record<string, string>;
  const conditions = [];
  if (q) conditions.push(ilike(companiesTable.name, `%${q}%`));
  if (industry) conditions.push(eq(companiesTable.industry, industry));

  const companies = await db.select().from(companiesTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(companiesTable.name).limit(50);
  res.json(companies.map(c => formatCompany(c)));
});

router.post("/companies", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }
  const { name, logoUrl, industry, size, location, website, description, founded, benefits, culture } = req.body;
  if (!name) { res.status(400).json({ error: "name is required" }); return; }

  const [company] = await db.insert(companiesTable).values({
    name, logoUrl, industry, size, location, website, description, founded,
    benefits: benefits ?? [], culture, ownerId: user.id,
  }).returning();
  res.status(201).json(formatCompany(company));
});

router.get("/companies/featured", async (_req, res): Promise<void> => {
  const companies = await db.select().from(companiesTable)
    .where(eq(companiesTable.isFeatured, true)).limit(8);

  const result = [];
  for (const c of companies) {
    const [{ count }] = await db.select({ count: sql<number>`count(*)` })
      .from(jobsTable).where(and(eq(jobsTable.companyId, c.id), eq(jobsTable.isActive, true)));
    result.push(formatCompany(c, Number(count)));
  }
  res.json(result);
});

router.get("/companies/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }

  const [company] = await db.select().from(companiesTable).where(eq(companiesTable.id, id));
  if (!company) { res.status(404).json({ error: "Company not found" }); return; }

  const jobs = await db.select().from(jobsTable)
    .where(and(eq(jobsTable.companyId, id), eq(jobsTable.isActive, true)))
    .orderBy(desc(jobsTable.postedAt)).limit(10);

  res.json({
    ...formatCompany(company, jobs.length),
    description: company.description,
    founded: company.founded,
    benefits: company.benefits ?? [],
    culture: company.culture,
    jobs: jobs.map(j => ({
      id: j.id,
      title: j.title,
      companyId: j.companyId,
      companyName: company.name,
      companyLogoUrl: company.logoUrl,
      location: j.location,
      type: j.type,
      experienceLevel: j.experienceLevel,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      skills: j.skills ?? [],
      isRemote: j.isRemote,
      isActive: j.isActive,
      applicantCount: 0,
      savedCount: 0,
      postedAt: j.postedAt.toISOString(),
      isSaved: false,
    })),
  });
});

router.put("/companies/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const { name, logoUrl, industry, size, location, website, description, founded, benefits, culture } = req.body;
  const updates: Partial<typeof companiesTable.$inferInsert> = { updatedAt: new Date() };
  if (name != null) updates.name = name;
  if (logoUrl != null) updates.logoUrl = logoUrl;
  if (industry != null) updates.industry = industry;
  if (size != null) updates.size = size;
  if (location != null) updates.location = location;
  if (website != null) updates.website = website;
  if (description != null) updates.description = description;
  if (founded != null) updates.founded = founded;
  if (benefits != null) updates.benefits = benefits;
  if (culture != null) updates.culture = culture;

  const [updated] = await db.update(companiesTable).set(updates).where(eq(companiesTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatCompany(updated));
});

export default router;
