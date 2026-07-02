import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const interviewSessionsTable = pgTable("interview_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull(),
  type: text("type").notNull().default("technical"), // technical | hr | behavioral | coding
  difficulty: text("difficulty").default("medium"),
  status: text("status").notNull().default("in-progress"), // in-progress | completed
  questions: text("questions").default("[]"), // JSON array
  answers: text("answers").default("[]"),     // JSON array
  evaluations: text("evaluations").default("[]"), // JSON array
  overallScore: integer("overall_score"),
  questionsCount: integer("questions_count").default(0),
  answeredCount: integer("answered_count").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInterviewSessionSchema = createInsertSchema(interviewSessionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertInterviewSession = z.infer<typeof insertInterviewSessionSchema>;
export type InterviewSession = typeof interviewSessionsTable.$inferSelect;
