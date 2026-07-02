import { Router, type IRouter } from "express";
import { db, resumesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, getCurrentUser } from "../lib/auth";

const router: IRouter = Router();

function formatResume(r: typeof resumesTable.$inferSelect) {
  return {
    id: r.id,
    userId: r.userId,
    title: r.title,
    templateId: r.templateId,
    content: (() => { try { return JSON.parse(r.content ?? "{}"); } catch { return {}; } })(),
    atsScore: r.atsScore,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

router.get("/resumes", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const resumes = await db.select().from(resumesTable).where(eq(resumesTable.userId, user.id));
  res.json(resumes.map(formatResume));
});

router.post("/resumes", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const { title, templateId, content } = req.body;
  if (!title) { res.status(400).json({ error: "title is required" }); return; }

  const [resume] = await db.insert(resumesTable).values({
    userId: user.id,
    title,
    templateId: templateId ?? "modern",
    content: JSON.stringify(content ?? {}),
  }).returning();
  res.status(201).json(formatResume(resume));
});

router.get("/resumes/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;

  const [resume] = await db.select().from(resumesTable)
    .where(and(eq(resumesTable.id, id), eq(resumesTable.userId, user.id)));
  if (!resume) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatResume(resume));
});

router.put("/resumes/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;

  const { title, templateId, content } = req.body;
  const updates: Partial<typeof resumesTable.$inferInsert> = { updatedAt: new Date() };
  if (title != null) updates.title = title;
  if (templateId != null) updates.templateId = templateId;
  if (content != null) updates.content = JSON.stringify(content);

  const [updated] = await db.update(resumesTable).set(updates)
    .where(and(eq(resumesTable.id, id), eq(resumesTable.userId, user.id))).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(formatResume(updated));
});

router.delete("/resumes/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;

  await db.delete(resumesTable).where(and(eq(resumesTable.id, id), eq(resumesTable.userId, user.id)));
  res.json({ message: "Deleted" });
});

export default router;
