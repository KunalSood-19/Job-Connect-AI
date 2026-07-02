import { pgTable, serial, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("student"), // student | recruiter | admin
  avatarUrl: text("avatar_url"),
  headline: text("headline"),
  bio: text("bio"),
  location: text("location"),
  phone: text("phone"),
  website: text("website"),
  linkedinUrl: text("linkedin_url"),
  githubUrl: text("github_url"),
  skills: text("skills").array().default([]),
  experience: text("experience").default("[]"), // JSON string
  education: text("education").default("[]"),   // JSON string
  projects: text("projects").default("[]"),     // JSON string
  certifications: text("certifications").default("[]"), // JSON string
  profileStrength: integer("profile_strength").default(0),
  atsScore: integer("ats_score"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
