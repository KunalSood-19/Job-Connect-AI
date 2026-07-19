import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://const API = import.meta.env.VITE_API_URL!;/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface MissingSkill {
  skill: string;
  priority: "high" | "medium" | "low";
  reason: string;
}

export interface PartialSkill {
  skill: string;
  gap: string;
}

export interface LearningPlanItem {
  skill: string;
  resource: string;
  timeEstimate: string;
}

export interface SkillGapResult {
  targetRole: string;
  overallMatch: number;
  readinessLevel: "Not Ready" | "Beginner" | "Intermediate" | "Advanced" | "Ready";
  summary: string;
  salaryImpact: string;
  strongSkills: string[];
  missingSkills: MissingSkill[];
  partialSkills: PartialSkill[];
  learningPlan: LearningPlanItem[];
}

export async function analyzeSkillGap(payload: {
  userSkills: string;
  targetRole: string;
  jobDescription?: string;
  experience?: string;
}): Promise<SkillGapResult> {
  const res = await API.post("/skill-gap/analyze", payload);
  return res.data.data;
}
