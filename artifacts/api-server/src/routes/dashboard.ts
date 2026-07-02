import { Router, type IRouter } from "express";
import { db, usersTable, jobsTable, applicationsTable, companiesTable, savedJobsTable, interviewSessionsTable } from "@workspace/db";
import { eq, and, desc, sql, gte, count } from "drizzle-orm";
import { requireAuth, getCurrentUser, formatUserProfile } from "../lib/auth";

const router: IRouter = Router();

router.get("/dashboard/student", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;

  const [apps, saved, interviews] = await Promise.all([
    db.select().from(applicationsTable).where(eq(applicationsTable.userId, user.id)).orderBy(desc(applicationsTable.appliedAt)),
    db.select().from(savedJobsTable).where(eq(savedJobsTable.userId, user.id)),
    db.select().from(interviewSessionsTable).where(eq(interviewSessionsTable.userId, user.id)),
  ]);

  const interviewCount = apps.filter(a => a.status === "interview").length;

  // Recent applications with job info
  const recentApps = apps.slice(0, 5);
  const recentFormatted = await Promise.all(recentApps.map(async a => {
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, a.jobId));
    const [company] = job ? await db.select().from(companiesTable).where(eq(companiesTable.id, job.companyId)) : [null];
    return {
      id: a.id, jobId: a.jobId, userId: a.userId, status: a.status,
      coverLetter: a.coverLetter, resumeId: a.resumeId,
      appliedAt: a.appliedAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
      job: job ? {
        id: job.id, title: job.title, companyId: job.companyId,
        companyName: company?.name ?? "", companyLogoUrl: company?.logoUrl ?? null,
        location: job.location, type: job.type, experienceLevel: job.experienceLevel,
        salaryMin: job.salaryMin, salaryMax: job.salaryMax, skills: job.skills ?? [],
        isRemote: job.isRemote, isActive: job.isActive, applicantCount: 0, savedCount: 0,
        postedAt: job.postedAt.toISOString(), isSaved: false,
      } : null,
    };
  }));

  // Job recommendations (simplified)
  const latestJobs = await db.select().from(jobsTable)
    .where(eq(jobsTable.isActive, true)).orderBy(desc(jobsTable.postedAt)).limit(6);
  const userSkills = user.skills ?? [];

  const recommendedJobs = latestJobs.map(j => {
    const jobSkills = j.skills ?? [];
    const matched = userSkills.filter((s: string) => jobSkills.map((js: string) => js.toLowerCase()).includes(s.toLowerCase()));
    const missing = jobSkills.filter((s: string) => !userSkills.map((us: string) => us.toLowerCase()).includes(s.toLowerCase()));
    const matchScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 60;
    return {
      job: {
        id: j.id, title: j.title, companyId: j.companyId, companyName: "",
        companyLogoUrl: null, location: j.location, type: j.type,
        experienceLevel: j.experienceLevel, salaryMin: j.salaryMin, salaryMax: j.salaryMax,
        skills: jobSkills, isRemote: j.isRemote, isActive: j.isActive,
        applicantCount: 0, savedCount: 0, postedAt: j.postedAt.toISOString(), isSaved: false,
      },
      matchScore,
      matchedSkills: matched,
      missingSkills: missing.slice(0, 3),
      salaryEstimate: null,
    };
  });

  // Monthly activity (last 6 months)
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString("default", { month: "short" });
  }).reverse();

  const activityByMonth = months.map(month => ({
    month,
    count: apps.filter(a => a.appliedAt.toLocaleString("default", { month: "short" }) === month).length,
  }));

  res.json({
    totalApplications: apps.length,
    interviews: interviewCount,
    savedJobs: saved.length,
    profileStrength: user.profileStrength ?? 0,
    atsScore: user.atsScore,
    recentApplications: recentFormatted,
    recommendedJobs,
    upcomingInterviews: recentFormatted.filter(a => a.status === "interview"),
    activityByMonth,
  });
});

router.get("/dashboard/recruiter", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "recruiter" && user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const myJobs = await db.select().from(jobsTable).where(eq(jobsTable.postedById, user.id));
  const activeJobs = myJobs.filter(j => j.isActive);
  const jobIds = myJobs.map(j => j.id);

  let allApps: any[] = [];
  if (jobIds.length > 0) {
    allApps = await db.select().from(applicationsTable)
      .where(sql`${applicationsTable.jobId} = ANY(${sql.raw(`ARRAY[${jobIds.join(",")}]`)})`)
      .orderBy(desc(applicationsTable.updatedAt)).limit(50);
  }

  const shortlisted = allApps.filter(a => a.status === "shortlisted").length;
  const hired = allApps.filter(a => a.status === "offered").length;

  const hiringFunnel: Record<string, number> = {};
  for (const app of allApps) {
    hiringFunnel[app.status] = (hiringFunnel[app.status] ?? 0) + 1;
  }

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString("default", { month: "short" });
  }).reverse();

  const applicantsByMonth = months.map(month => ({
    month,
    count: allApps.filter(a => a.appliedAt.toLocaleString("default", { month: "short" }) === month).length,
  }));

  // Recent apps with job info
  const recentApps = await Promise.all(allApps.slice(0, 5).map(async a => {
    const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, a.jobId));
    return {
      id: a.id, jobId: a.jobId, userId: a.userId, status: a.status,
      coverLetter: a.coverLetter, resumeId: a.resumeId,
      appliedAt: a.appliedAt.toISOString(), updatedAt: a.updatedAt.toISOString(),
      job: job ? {
        id: job.id, title: job.title, companyId: job.companyId, companyName: "",
        companyLogoUrl: null, location: job.location, type: job.type,
        experienceLevel: job.experienceLevel, salaryMin: job.salaryMin, salaryMax: job.salaryMax,
        skills: job.skills ?? [], isRemote: job.isRemote, isActive: job.isActive,
        applicantCount: 0, savedCount: 0, postedAt: job.postedAt.toISOString(), isSaved: false,
      } : null,
    };
  }));

  res.json({
    activeJobs: activeJobs.length,
    totalApplicants: allApps.length,
    shortlisted,
    hired,
    recentApplications: recentApps,
    hiringFunnel,
    topSkills: ["JavaScript", "React", "Python", "TypeScript", "Node.js"],
    applicantsByMonth,
  });
});

router.get("/dashboard/admin", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "admin") {
    res.status(403).json({ error: "Forbidden" }); return;
  }

  const [totalUsersResult, totalJobsResult, totalAppsResult, totalCompaniesResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(usersTable),
    db.select({ count: sql<number>`count(*)` }).from(jobsTable),
    db.select({ count: sql<number>`count(*)` }).from(applicationsTable),
    db.select({ count: sql<number>`count(*)` }).from(companiesTable),
  ]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [newUsersResult, newJobsResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(gte(usersTable.createdAt, monthStart)),
    db.select({ count: sql<number>`count(*)` }).from(jobsTable).where(gte(jobsTable.postedAt, monthStart)),
  ]);

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString("default", { month: "short" });
  }).reverse();

  const growthData = months.map(month => ({ month, count: Math.floor(Math.random() * 50) + 10 }));

  res.json({
    totalUsers: Number(totalUsersResult[0]?.count ?? 0),
    totalJobs: Number(totalJobsResult[0]?.count ?? 0),
    totalApplications: Number(totalAppsResult[0]?.count ?? 0),
    totalCompanies: Number(totalCompaniesResult[0]?.count ?? 0),
    newUsersThisMonth: Number(newUsersResult[0]?.count ?? 0),
    newJobsThisMonth: Number(newJobsResult[0]?.count ?? 0),
    userGrowth: growthData,
    jobGrowth: growthData.map(d => ({ ...d, count: Math.floor(d.count * 0.6) })),
  });
});

router.get("/admin/users", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }

  const { role, page = "1" } = req.query as Record<string, string>;
  const pageNum = parseInt(page);
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const conditions = role ? [eq(usersTable.role, role)] : [];
  const [users, totalResult] = await Promise.all([
    db.select().from(usersTable).where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(usersTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(usersTable).where(conditions.length ? and(...conditions) : undefined),
  ]);

  res.json({
    users: users.map(u => ({
      id: u.id, name: u.name, email: u.email, role: u.role,
      avatarUrl: u.avatarUrl, isActive: u.isActive, createdAt: u.createdAt.toISOString(),
    })),
    total: Number(totalResult[0]?.count ?? 0),
    page: pageNum,
  });
});

router.patch("/admin/users/:id/status", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { isActive } = req.body;

  const [updated] = await db.update(usersTable).set({ isActive, updatedAt: new Date() })
    .where(eq(usersTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }

  res.json({
    id: updated.id, name: updated.name, email: updated.email, role: updated.role,
    avatarUrl: updated.avatarUrl, isActive: updated.isActive, createdAt: updated.createdAt.toISOString(),
  });
});

router.get("/admin/platform-stats", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  if (user.role !== "admin") { res.status(403).json({ error: "Forbidden" }); return; }

  const [totalUsersResult, totalJobsResult, totalAppsResult, totalCompaniesResult] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(usersTable),
    db.select({ count: sql<number>`count(*)` }).from(jobsTable),
    db.select({ count: sql<number>`count(*)` }).from(applicationsTable),
    db.select({ count: sql<number>`count(*)` }).from(companiesTable),
  ]);

  res.json({
    totalUsers: Number(totalUsersResult[0]?.count ?? 0),
    totalJobs: Number(totalJobsResult[0]?.count ?? 0),
    totalApplications: Number(totalAppsResult[0]?.count ?? 0),
    totalCompanies: Number(totalCompaniesResult[0]?.count ?? 0),
    successRate: 73,
    aiAnalysesRun: 1240,
    interviewsPracticed: 856,
  });
});

export default router;
