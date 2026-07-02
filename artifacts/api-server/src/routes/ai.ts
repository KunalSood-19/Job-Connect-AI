import { Router, type IRouter } from "express";
import { db, jobsTable, applicationsTable, usersTable, interviewSessionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, getCurrentUser, safeParseJSON } from "../lib/auth";

const router: IRouter = Router();

// Mock AI analysis — production would call Gemini/spaCy
function analyzeResumeText(resumeText: string, jobDescription?: string) {
  const wordCount = resumeText.split(/\s+/).length;
  const hasEmail = /\w+@\w+\.\w+/.test(resumeText);
  const hasPhone = /\d{10}|\(\d{3}\)\s*\d{3}-\d{4}/.test(resumeText);

  const commonSkills = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
    "AWS", "Docker", "Git", "REST API", "GraphQL", "MongoDB", "PostgreSQL", "CSS", "HTML"];
  const extractedSkills = commonSkills.filter(s => resumeText.toLowerCase().includes(s.toLowerCase()));

  const baseScore = Math.min(95, 40 + wordCount / 20 + extractedSkills.length * 3 + (hasEmail ? 5 : 0) + (hasPhone ? 3 : 0));
  const atsScore = Math.round(baseScore);

  const strength = atsScore >= 85 ? "excellent" : atsScore >= 70 ? "strong" : atsScore >= 55 ? "good" : atsScore >= 40 ? "fair" : "weak";

  const suggestions = [
    "Add measurable achievements with specific numbers and percentages",
    "Include action verbs at the start of each bullet point",
    "Tailor your resume to match the job description keywords",
    "Add a professional summary that highlights your value proposition",
  ];

  const missingKeywords = jobDescription
    ? ["leadership", "collaboration", "agile", "problem-solving"].filter(k => !resumeText.toLowerCase().includes(k))
    : [];

  return {
    atsScore,
    strength,
    missingKeywords,
    grammarSuggestions: ["Ensure consistent verb tense throughout", "Avoid passive voice where possible"],
    formattingSuggestions: ["Use consistent font sizes (10-12pt)", "Keep to 1-2 pages", "Use white space effectively"],
    suggestions,
    extractedSkills,
    extractedInfo: {
      name: null,
      email: hasEmail ? resumeText.match(/\w+@\w+\.\w+/)?.[0] ?? null : null,
      phone: null,
      skills: extractedSkills,
      education: [],
      experience: [],
    },
  };
}

router.post("/ai/analyze-resume", requireAuth, async (req, res): Promise<void> => {
  const { resumeText, jobDescription } = req.body;
  if (!resumeText) { res.status(400).json({ error: "resumeText is required" }); return; }

  const result = analyzeResumeText(resumeText, jobDescription);
  res.json(result);
});

router.get("/ai/job-recommendations", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const userSkills = (user.skills ?? []).map((s: string) => s.toLowerCase());

  const jobs = await db.select().from(jobsTable).where(eq(jobsTable.isActive, true)).limit(50);

  const scored = jobs.map(job => {
    const jobSkills = (job.skills ?? []).map((s: string) => s.toLowerCase());
    const matched = userSkills.filter(s => jobSkills.includes(s));
    const missing = jobSkills.filter(s => !userSkills.includes(s));
    const matchScore = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 50;

    return {
      job: {
        id: job.id, title: job.title, companyId: job.companyId, companyName: "",
        companyLogoUrl: null, location: job.location, type: job.type,
        experienceLevel: job.experienceLevel, salaryMin: job.salaryMin, salaryMax: job.salaryMax,
        skills: job.skills ?? [], isRemote: job.isRemote, isActive: job.isActive,
        applicantCount: 0, savedCount: 0, postedAt: job.postedAt.toISOString(), isSaved: false,
      },
      matchScore,
      matchedSkills: matched,
      missingSkills: missing.slice(0, 5),
      salaryEstimate: job.salaryMin ? `$${job.salaryMin.toLocaleString()} - $${(job.salaryMax ?? job.salaryMin * 1.3).toLocaleString()}` : null,
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  res.json(scored.slice(0, 10));
});

router.post("/ai/skill-gap", requireAuth, async (req, res): Promise<void> => {
  const { userSkills, jobId } = req.body;
  if (!Array.isArray(userSkills) || !jobId) {
    res.status(400).json({ error: "userSkills and jobId are required" }); return;
  }

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, jobId));
  if (!job) { res.status(404).json({ error: "Job not found" }); return; }

  const jobSkills = job.skills ?? [];
  const userSkillsLower = userSkills.map((s: string) => s.toLowerCase());
  const jobSkillsLower = jobSkills.map((s: string) => s.toLowerCase());

  const matchedSkills = jobSkills.filter(s => userSkillsLower.includes(s.toLowerCase()));
  const missingSkills = jobSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));
  const matchPercentage = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 100;

  const courseMap: Record<string, { title: string; platform: string; url: null; duration: string; skill: string }> = {
    "react": { title: "React - The Complete Guide", platform: "Udemy", url: null, duration: "40 hours", skill: "React" },
    "node.js": { title: "Node.js Developer Course", platform: "Udemy", url: null, duration: "35 hours", skill: "Node.js" },
    "typescript": { title: "Understanding TypeScript", platform: "Udemy", url: null, duration: "15 hours", skill: "TypeScript" },
    "python": { title: "Python Bootcamp", platform: "Udemy", url: null, duration: "22 hours", skill: "Python" },
    "aws": { title: "AWS Certified Developer", platform: "AWS Training", url: null, duration: "50 hours", skill: "AWS" },
    "docker": { title: "Docker & Kubernetes Practical Guide", platform: "Udemy", url: null, duration: "20 hours", skill: "Docker" },
  };

  const recommendedCourses = missingSkills.slice(0, 4).map(skill => {
    const key = skill.toLowerCase();
    return courseMap[key] ?? { title: `${skill} Fundamentals`, platform: "Coursera", url: null, duration: "10 hours", skill };
  });

  const totalHours = missingSkills.length * 15;
  const estimatedLearningTime = totalHours < 40 ? `${totalHours} hours` : `${Math.round(totalHours / 40)} weeks`;

  res.json({
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendedCourses,
    estimatedLearningTime,
    learningRoadmap: missingSkills.slice(0, 4).map((s, i) => `Week ${i + 1}: Master ${s} fundamentals and build a project`),
  });
});

router.post("/ai/career-roadmap", requireAuth, async (req, res): Promise<void> => {
  const { targetRole, currentSkills = [], experienceYears = 0 } = req.body;
  if (!targetRole) { res.status(400).json({ error: "targetRole is required" }); return; }

  const roleRoadmaps: Record<string, any> = {
    "frontend developer": {
      phases: [
        { title: "Foundation", duration: "Month 1-2", skills: ["HTML", "CSS", "JavaScript"], projects: ["Personal portfolio"], courses: ["The Web Developer Bootcamp"], milestones: ["Build 3 static websites"] },
        { title: "Framework Mastery", duration: "Month 3-4", skills: ["React", "TypeScript", "Redux"], projects: ["Todo app", "E-commerce UI"], courses: ["React - The Complete Guide"], milestones: ["Deploy a React app"] },
        { title: "Advanced Topics", duration: "Month 5-6", skills: ["Next.js", "Testing", "Performance"], projects: ["Full-stack Next.js app"], courses: ["Testing JavaScript"], milestones: ["Get first freelance client"] },
      ],
      totalDuration: "6 months",
      resources: ["MDN Web Docs", "Frontend Masters", "CSS-Tricks", "JavaScript.info"],
    },
    "backend developer": {
      phases: [
        { title: "Core Backend", duration: "Month 1-2", skills: ["Node.js", "Express", "REST APIs"], projects: ["REST API server"], courses: ["Node.js Developer Course"], milestones: ["Build a production API"] },
        { title: "Databases", duration: "Month 3-4", skills: ["PostgreSQL", "MongoDB", "Redis"], projects: ["Full CRUD application"], courses: ["SQL and PostgreSQL"], milestones: ["Deploy to cloud"] },
        { title: "Architecture", duration: "Month 5-6", skills: ["Microservices", "Docker", "AWS"], projects: ["Microservice system"], courses: ["AWS Certified Developer"], milestones: ["Land first job"] },
      ],
      totalDuration: "6 months",
      resources: ["Node.js docs", "PostgreSQL docs", "AWS Free Tier", "System Design Primer"],
    },
    "full stack developer": {
      phases: [
        { title: "Frontend Basics", duration: "Month 1-2", skills: ["HTML", "CSS", "JavaScript", "React"], projects: ["Portfolio website"], courses: ["The Web Developer Bootcamp"], milestones: ["Deploy first app"] },
        { title: "Backend Integration", duration: "Month 3-4", skills: ["Node.js", "Express", "PostgreSQL"], projects: ["Full-stack app with auth"], courses: ["Node.js + React Full Stack"], milestones: ["Ship a product"] },
        { title: "DevOps & Deployment", duration: "Month 5-6", skills: ["Docker", "CI/CD", "Cloud"], projects: ["Production-ready SaaS"], courses: ["DevOps Fundamentals"], milestones: ["First 100 users"] },
      ],
      totalDuration: "6 months",
      resources: ["Full Stack Open", "The Odin Project", "roadmap.sh"],
    },
    "data scientist": {
      phases: [
        { title: "Python & Stats", duration: "Month 1-2", skills: ["Python", "NumPy", "Pandas", "Statistics"], projects: ["EDA on public dataset"], courses: ["Python for Data Science"], milestones: ["Complete 5 EDA projects"] },
        { title: "Machine Learning", duration: "Month 3-4", skills: ["Scikit-learn", "TensorFlow", "Model Evaluation"], projects: ["Predictive model"], courses: ["Machine Learning Specialization"], milestones: ["Kaggle competition"] },
        { title: "Deep Learning & MLOps", duration: "Month 5-6", skills: ["Deep Learning", "MLflow", "Cloud ML"], projects: ["End-to-end ML pipeline"], courses: ["Deep Learning Specialization"], milestones: ["Deploy ML model to prod"] },
      ],
      totalDuration: "6 months",
      resources: ["Kaggle", "Papers with Code", "fast.ai", "Towards Data Science"],
    },
  };

  const normalizedRole = targetRole.toLowerCase();
  const roadmap = roleRoadmaps[normalizedRole] ?? {
    phases: [
      { title: "Foundations", duration: "Month 1-2", skills: ["Core concepts", "Tools setup"], projects: ["Learning project"], courses: ["Fundamentals course"], milestones: ["Complete basics"] },
      { title: "Intermediate", duration: "Month 3-4", skills: ["Advanced concepts", "Best practices"], projects: ["Real project"], courses: ["Advanced course"], milestones: ["Build portfolio"] },
      { title: "Professional", duration: "Month 5-6", skills: ["Industry standards", "Collaboration"], projects: ["Production project"], courses: ["Specialization"], milestones: ["Land first role"] },
    ],
    totalDuration: "6 months",
    resources: ["Documentation", "Online courses", "Community forums"],
  };

  res.json({ targetRole, ...roadmap });
});

router.post("/ai/interview-questions", requireAuth, async (req, res): Promise<void> => {
  const { role, type, difficulty = "medium", count = 5 } = req.body;
  if (!role || !type) { res.status(400).json({ error: "role and type are required" }); return; }

  const questionBanks: Record<string, string[]> = {
    technical: [
      `Explain the difference between REST and GraphQL APIs.`,
      `What is the event loop in JavaScript and how does it work?`,
      `Describe the SOLID principles and give an example of each.`,
      `How do you optimize a slow database query?`,
      `What is the difference between SQL and NoSQL databases?`,
      `Explain the concept of microservices architecture.`,
      `What is Docker and how does containerization work?`,
      `Describe the CI/CD pipeline and its components.`,
    ],
    hr: [
      `Tell me about yourself and your career journey.`,
      `Why do you want to work at this company?`,
      `Where do you see yourself in 5 years?`,
      `What are your greatest strengths and weaknesses?`,
      `How do you handle pressure and tight deadlines?`,
      `Describe your ideal work environment.`,
      `What motivates you in your work?`,
    ],
    behavioral: [
      `Tell me about a time you resolved a conflict with a teammate.`,
      `Describe a project you failed at and what you learned.`,
      `Give an example of when you went above and beyond for a project.`,
      `Tell me about a time you had to learn something quickly.`,
      `Describe a situation where you had to deal with ambiguity.`,
      `How did you handle a disagreement with your manager?`,
    ],
    coding: [
      `Reverse a linked list in-place. What is the time complexity?`,
      `Implement a function to find the longest common subsequence.`,
      `Write a function to detect a cycle in a graph.`,
      `Implement binary search and explain its time complexity.`,
      `Design a URL shortening service like bit.ly.`,
      `Write a function to validate balanced parentheses.`,
    ],
  };

  const questions = (questionBanks[type] ?? questionBanks.technical)
    .slice(0, Math.min(count, 8))
    .map((q, i) => ({
      id: `q-${i + 1}`,
      question: q,
      type,
      difficulty,
      hint: null,
    }));

  res.json({ questions });
});

router.post("/ai/evaluate-answer", requireAuth, async (req, res): Promise<void> => {
  const { question, answer, role = "software engineer" } = req.body;
  if (!question || !answer) {
    res.status(400).json({ error: "question and answer are required" }); return;
  }

  const wordCount = answer.split(/\s+/).length;
  const score = Math.min(95, Math.max(30, 40 + Math.min(wordCount / 2, 30) + (answer.length > 100 ? 15 : 0)));

  res.json({
    score: Math.round(score),
    answerQuality: score >= 80 ? "Excellent" : score >= 65 ? "Good" : score >= 50 ? "Fair" : "Needs improvement",
    confidence: score >= 75 ? "High" : score >= 55 ? "Medium" : "Low",
    communication: score >= 70 ? "Clear and structured" : "Could be more structured",
    feedback: `Your answer demonstrates ${score >= 70 ? "strong" : "developing"} understanding of the topic. ${score < 70 ? "Consider providing more specific examples with measurable outcomes." : "You effectively communicated key concepts."}`,
    suggestions: [
      "Use the STAR method (Situation, Task, Action, Result) for behavioral questions",
      "Include specific metrics and outcomes where possible",
      "Practice thinking aloud to show your problem-solving process",
    ],
  });
});

router.post("/ai/generate-summary", requireAuth, async (req, res): Promise<void> => {
  const { role, skills = [], experience = 0, achievements = [] } = req.body;
  if (!role) { res.status(400).json({ error: "role is required" }); return; }

  const skillStr = skills.slice(0, 5).join(", ");
  const expStr = experience === 0 ? "a recent graduate" : `${experience}+ year${experience > 1 ? "s" : ""} of experience`;
  const achievementStr = achievements.length > 0 ? ` ${achievements[0]}.` : "";

  const text = `Results-driven ${role} with ${expStr} in building scalable solutions. ${skillStr ? `Proficient in ${skillStr}.` : ""} Passionate about delivering high-quality software that drives business impact.${achievementStr} Seeking opportunities to leverage technical expertise and collaborative skills to create meaningful products.`;

  res.json({ text });
});

// Interview sessions
router.get("/interviews", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const sessions = await db.select().from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.userId, user.id))
    .orderBy(desc(interviewSessionsTable.createdAt)).limit(20);

  res.json(sessions.map(s => ({
    id: s.id, userId: s.userId, role: s.role, type: s.type,
    status: s.status, overallScore: s.overallScore,
    questionsCount: s.questionsCount, answeredCount: s.answeredCount,
    createdAt: s.createdAt.toISOString(),
  })));
});

router.post("/interviews", requireAuth, async (req, res): Promise<void> => {
  const user = getCurrentUser(req)!;
  const { role, type, difficulty = "medium" } = req.body;
  if (!role || !type) { res.status(400).json({ error: "role and type are required" }); return; }

  const [session] = await db.insert(interviewSessionsTable).values({
    userId: user.id, role, type, difficulty, status: "in-progress",
    questionsCount: 5, answeredCount: 0,
  }).returning();

  res.status(201).json({
    id: session.id, userId: session.userId, role: session.role, type: session.type,
    status: session.status, overallScore: session.overallScore,
    questionsCount: session.questionsCount, answeredCount: session.answeredCount,
    createdAt: session.createdAt.toISOString(),
  });
});

router.get("/interviews/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const user = getCurrentUser(req)!;

  const [session] = await db.select().from(interviewSessionsTable)
    .where(eq(interviewSessionsTable.id, id));
  if (!session || session.userId !== user.id) {
    res.status(404).json({ error: "Not found" }); return;
  }

  res.json({
    id: session.id, userId: session.userId, role: session.role, type: session.type,
    status: session.status, overallScore: session.overallScore,
    questionsCount: session.questionsCount, answeredCount: session.answeredCount,
    createdAt: session.createdAt.toISOString(),
  });
});

export default router;
