import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Zap, Target, TrendingUp, AlertTriangle, CheckCircle2, BookOpen,
  Sparkles, Loader2, RefreshCw, ChevronRight, Clock, DollarSign,
  BarChart3, Brain, ArrowRight, Star,
} from "lucide-react";
import { analyzeSkillGap, SkillGapResult } from "@/api/skillGap";
import { Link } from "wouter";

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "Machine Learning Engineer", "DevOps Engineer",
  "Product Manager", "UX Designer", "Cloud Architect",
  "Cybersecurity Engineer", "Android Developer", "iOS Developer",
  "Blockchain Developer", "Game Developer", "QA Engineer",
];

const EXPERIENCE_LEVELS = [
  "Student / No experience", "0-1 years", "1-3 years", "3-5 years", "5+ years",
];

const READINESS_CONFIG: Record<string, { color: string; bg: string; border: string; barColor: string }> = {
  "Not Ready":    { color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20",    barColor: "bg-red-500" },
  "Beginner":     { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", barColor: "bg-orange-500" },
  "Intermediate": { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", barColor: "bg-yellow-500" },
  "Advanced":     { color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20",   barColor: "bg-blue-500" },
  "Ready":        { color: "text-emerald-400",bg: "bg-emerald-500/10",border: "border-emerald-500/20",barColor: "bg-emerald-500" },
};

const PRIORITY_CONFIG = {
  high:   { label: "High Priority",   color: "text-red-400",    bg: "bg-red-500/10",    border: "border-red-500/20" },
  medium: { label: "Medium Priority", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
  low:    { label: "Low Priority",    color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20" },
};

export function SkillGapPage() {
  const [userSkills, setUserSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [experience, setExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const role = targetRole === "custom" ? customRole : targetRole;
    if (!role || !userSkills.trim()) return;
    setError("");
    setLoading(true);
    try {
      const data = await analyzeSkillGap({
        userSkills,
        targetRole: role,
        jobDescription,
        experience,
      });
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ready = READINESS_CONFIG[result?.readinessLevel ?? "Not Ready"];
  const role = targetRole === "custom" ? customRole : targetRole;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-white/5 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-500/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400 mb-6">
            <Brain className="w-4 h-4" /> AI Skill Gap Analyzer
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Know exactly what
            <br />
            <span className="gradient-text">skills you're missing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Enter your current skills and target role — our AI will identify gaps, prioritize what to learn, and build your personalized action plan.
          </p>
        </div>
      </div>

      {/* Form */}
      {!result && !loading && (
        <div className="container mx-auto px-4 py-14 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left column */}
            <div className="space-y-6">
              <Card className="glass-card border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="w-5 h-5 text-violet-400" /> Target Role
                  </CardTitle>
                  <CardDescription>What role are you aiming for?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger className="bg-background/50 border-white/10 h-11">
                      <SelectValue placeholder="Select a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                      <SelectItem value="custom">Something else...</SelectItem>
                    </SelectContent>
                  </Select>
                  {targetRole === "custom" && (
                    <Input
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Embedded Systems Engineer"
                      className="h-11 bg-background/50 border-white/10"
                    />
                  )}
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger className="bg-background/50 border-white/10 h-11">
                      <SelectValue placeholder="Your experience level..." />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-violet-400" /> Job Description
                    <Badge variant="secondary" className="text-xs ml-1">Optional</Badge>
                  </CardTitle>
                  <CardDescription>Paste a job description for a more targeted analysis.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[160px] bg-background/50 border-white/10 focus-visible:ring-violet-500/50 resize-none"
                    placeholder="Paste the job posting here for precise gap analysis..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <Card className="glass-card border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-violet-400" /> Your Current Skills
                  </CardTitle>
                  <CardDescription>List all your skills, separated by commas.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[280px] bg-background/50 border-white/10 focus-visible:ring-violet-500/50 resize-none"
                    placeholder="e.g. HTML, CSS, JavaScript, React, Git, REST APIs, basic Python..."
                    value={userSkills}
                    onChange={(e) => setUserSkills(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Tip: Include frameworks, languages, tools, and soft skills for the best analysis.
                  </p>
                </CardContent>
              </Card>

              {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              <Button
                className="w-full h-14 text-lg gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:shadow-[0_0_40px_rgba(139,92,246,0.4)]"
                onClick={handleAnalyze}
                disabled={(!targetRole || (targetRole === "custom" && !customRole)) || !userSkills.trim() || loading}
              >
                <Brain className="w-5 h-5" /> Analyze My Skill Gap
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="container mx-auto px-4 py-28 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 mb-10">
            <div className="absolute inset-0 border-4 border-violet-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin" />
            <Brain className="w-12 h-12 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Analyzing your skills...</h2>
          <p className="text-muted-foreground max-w-md">
            Our AI is mapping your skills against industry requirements and building your personalized action plan.
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="container mx-auto px-4 py-12 max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Skill Gap Report</h2>
              <p className="text-muted-foreground">for <span className="text-foreground font-medium">{result.targetRole}</span></p>
            </div>
            <Button
              variant="outline"
              className="glass gap-2 shrink-0"
              onClick={() => { setResult(null); setError(""); }}
            >
              <RefreshCw className="w-4 h-4" /> New Analysis
            </Button>
          </div>

          {/* Top Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {/* Match Score */}
            <Card className="glass-card border-white/5 sm:col-span-1">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle
                      cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={`${result.overallMatch * 2.764} 276.4`}
                      className="text-violet-500 transition-all duration-1000"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold">{result.overallMatch}%</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Match</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">Overall Match</h3>
                <Badge className={`${ready.bg} ${ready.color} ${ready.border} border`}>
                  {result.readinessLevel}
                </Badge>
              </CardContent>
            </Card>

            {/* Summary + Salary */}
            <div className="sm:col-span-2 space-y-4">
              <Card className="glass-card border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <h4 className="font-semibold text-sm">AI Summary</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
                </CardContent>
              </Card>
              <Card className="glass-card border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Salary Impact if you close the gap</p>
                    <p className="font-semibold text-emerald-400">{result.salaryImpact}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Skills breakdown */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Strong Skills */}
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strong Skills
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border ml-auto">
                    {result.strongSkills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {result.strongSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No matching skills found yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {result.strongSkills.map((s) => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <Star className="w-3 h-3" /> {s}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Partial Skills */}
            <Card className="glass-card border-white/5">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-yellow-400" /> Needs Improvement
                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 border ml-auto">
                    {result.partialSkills.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {result.partialSkills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No partial matches identified.</p>
                ) : (
                  result.partialSkills.map((p) => (
                    <div key={p.skill} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{p.skill}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{p.gap}</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Missing Skills */}
          <Card className="glass-card border-white/5 mb-6">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Missing Skills
                <Badge className="bg-red-500/10 text-red-400 border-red-500/20 border ml-auto">
                  {result.missingSkills.length} gaps
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {result.missingSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground">You have all the required skills — you are ready to apply!</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {result.missingSkills.map((item) => {
                    const pc = PRIORITY_CONFIG[item.priority] || PRIORITY_CONFIG.medium;
                    return (
                      <div key={item.skill} className={`p-3 rounded-xl border ${pc.bg} ${pc.border}`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="font-semibold text-sm">{item.skill}</span>
                          <Badge className={`${pc.bg} ${pc.color} ${pc.border} border text-[10px] shrink-0`}>
                            {pc.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.reason}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Learning Plan */}
          <Card className="glass-card border-violet-500/10 bg-violet-500/5 mb-8">
            <CardHeader className="pb-3 border-b border-violet-500/10">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" /> Personalized Learning Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {result.learningPlan.length === 0 ? (
                <p className="text-sm text-muted-foreground">Great! No specific learning plan needed — you are well-prepared.</p>
              ) : (
                result.learningPlan.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background/30 border border-white/5 hover:border-violet-500/20 transition-colors group">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                      <span className="text-sm font-bold text-violet-400">{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-semibold text-sm">{item.skill}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                          <Clock className="w-3 h-3" /> {item.timeEstimate}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BookOpen className="w-3 h-3 shrink-0" />
                        <span className="truncate">{item.resource}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="glass-card border-primary/20 bg-primary/5 rounded-2xl p-8 text-center">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready to close the gap?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Practice your interview skills and build your resume to maximize your chances for {result.targetRole} roles.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2" asChild>
                <Link href="/interview">
                  Practice Interviews <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="glass gap-2" asChild>
                <Link href="/career-roadmap">
                  Get Career Roadmap
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
