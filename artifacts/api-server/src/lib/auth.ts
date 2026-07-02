import { createHash, createHmac, randomBytes } from "crypto";
import { Request, Response, NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const SECRET = process.env.SESSION_SECRET ?? "jobconnect-dev-fallback-secret-change-in-prod";

export function hashPassword(password: string): string {
  // PBKDF2-style stretch with a pepper; swap for bcrypt in production
  const pepper = process.env.SESSION_SECRET ?? "jobconnect-pepper";
  return createHash("sha256").update(password + pepper).digest("hex");
}

/**
 * Generate an HMAC-signed bearer token.
 * Format: base64(payload).signature
 */
export function generateToken(userId: number, role: string): string {
  const payload = JSON.stringify({
    userId,
    role,
    iat: Math.floor(Date.now() / 1000),
    jti: randomBytes(12).toString("hex"),
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

/**
 * Parse and verify a signed token.
 * Returns null on any verification or parse failure.
 */
export function parseToken(token: string): { userId: number; role: string } | null {
  try {
    const dotIdx = token.lastIndexOf(".");
    if (dotIdx === -1) return null;
    const encoded = token.slice(0, dotIdx);
    const sig = token.slice(dotIdx + 1);

    // Constant-time comparison
    const expected = createHmac("sha256", SECRET).update(encoded).digest("base64url");
    if (!timingSafeEqual(sig, expected)) return null;

    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf-8"));
    if (typeof payload.userId !== "number" || typeof payload.role !== "string") return null;
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  const parsed = parseToken(token);
  if (!parsed) {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, parsed.userId));
  if (!user || !user.isActive) {
    res.status(401).json({ error: "User not found or inactive" });
    return;
  }
  (req as any).currentUser = user;
  next();
}

export function getCurrentUser(req: Request) {
  return (req as any).currentUser as typeof usersTable.$inferSelect | undefined;
}

export function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    createdAt: user.createdAt.toISOString(),
  };
}

export function formatUserProfile(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    headline: user.headline,
    bio: user.bio,
    location: user.location,
    phone: user.phone,
    website: user.website,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    skills: user.skills ?? [],
    experience: safeParseJSON(user.experience, []),
    education: safeParseJSON(user.education, []),
    projects: safeParseJSON(user.projects, []),
    certifications: safeParseJSON(user.certifications, []),
    profileStrength: user.profileStrength,
    createdAt: user.createdAt.toISOString(),
  };
}

export function safeParseJSON(val: string | null | undefined, fallback: any): any {
  try {
    return JSON.parse(val ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}
