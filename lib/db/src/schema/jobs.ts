import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  companyId: integer("company_id").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull().default("full-time"), // full-time | part-time | contract | internship | remote
  experienceLevel: text("experience_level").default("mid"), // entry | mid | senior | lead | executive
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  skills: text("skills").array().default([]),
  description: text("description").notNull().default(""),
  requirements: text("requirements").array().default([]),
  responsibilities: text("responsibilities").array().default([]),
  benefits: text("benefits").array().default([]),
  isRemote: boolean("is_remote").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  isTrending: boolean("is_trending").notNull().default(false),
  postedById: integer("posted_by_id"), // recruiter user id
  postedAt: timestamp("posted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobsTable).omit({
  id: true,
  postedAt: true,
  updatedAt: true,
});
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobsTable.$inferSelect;
