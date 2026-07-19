import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Map, Sparkles, ChevronRight, Clock, BookOpen, Rocket, CheckCircle2,
  Target, Code2, TrendingUp, Star, ArrowRight, ExternalLink, Loader2
} from "lucide-react";
import { Link } from "wouter";

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Mobile Developer", "Data Scientist", "Machine Learning Engineer",
  "DevOps Engineer", "Product Manager", "UX Designer",
  "Cloud Architect", "Cybersecurity Engineer", "Blockchain Developer",
];

const EXPERIENCE_LEVELS = ["Student / No experience", "0–1 years", "1–3 years", "3–5 years", "5+ years"];

interface Phase {
  title: string;
  duration: string;
  skills: string[];
  projects: string[];
  courses: string[];
  milestones: string[];
}

interface Roadmap {
  targetRole: string;
  totalDuration: string;
  difficulty: string;
  phases: Phase[];
  resources: string[];
  salaryRange: string;
  jobOutlook: string;
}

const ROADMAP_DATA: Record<string, Roadmap> = {
  "Frontend Developer": {
    targetRole: "Frontend Developer",
    totalDuration: "4–6 months",
    difficulty: "Beginner-friendly",
    salaryRange: "$80K – $160K",
    jobOutlook: "Excellent — high demand",
    phases: [
      { title: "Web Fundamentals", duration: "Month 1", skills: ["HTML5", "CSS3", "Flexbox & Grid", "Responsive Design", "Git Basics"], projects: ["Personal portfolio site", "Product landing page"], courses: ["The Web Developer Bootcamp (Udemy)", "CSS-Tricks complete guide"], milestones: ["Build 3 responsive pages", "Push first project to GitHub"] },
      { title: "JavaScript Mastery", duration: "Month 2–3", skills: ["JavaScript ES6+", "DOM Manipulation", "Async/Await", "Fetch API", "TypeScript basics"], projects: ["Weather App", "Todo list with local storage", "GitHub user search tool"], courses: ["JavaScript: The Complete Guide", "Eloquent JavaScript (free book)"], milestones: ["Complete 30 JS challenges", "Build 2 API-connected projects"] },
      { title: "React & Ecosystem", duration: "Month 4–5", skills: ["React 19", "React Hooks", "React Router", "Tailwind CSS", "React Query", "Vite"], projects: ["E-commerce UI clone", "Full blog with routing", "Dashboard with charts"], courses: ["React — The Complete Guide", "Epic React by Kent C. Dodds"], milestones: ["Deploy first React app", "Get first freelance project"] },
      { title: "Production Ready", duration: "Month 6", skills: ["Testing (Vitest/RTL)", "Performance optimization", "Accessibility (a11y)", "Next.js basics", "CI/CD basics"], projects: ["Full-stack Next.js app", "Accessible component library"], courses: ["Testing JavaScript", "Next.js & React — The Complete Guide"], milestones: ["Pass 3 technical interviews", "Land first job!"] },
    ],
    resources: ["MDN Web Docs", "Frontend Masters", "roadmap.sh/frontend", "CSS-Tricks", "JavaScript.info", "web.dev"],
  },
  "Backend Developer": {
    targetRole: "Backend Developer",
    totalDuration: "5–7 months",
    difficulty: "Moderate",
    salaryRange: "$90K – $180K",
    jobOutlook: "Excellent — very high demand",
    phases: [
      { title: "Programming Foundation", duration: "Month 1–2", skills: ["Node.js / Python", "Data Structures", "Algorithms basics", "Git & GitHub", "HTTP fundamentals"], projects: ["CLI tool", "Simple file processor"], courses: ["Node.js Developer Course", "Python for Everybody"], milestones: ["Solve 50 coding challenges", "Understand request/response cycle"] },
      { title: "Server & APIs", duration: "Month 3", skills: ["Express / FastAPI", "REST API design", "Authentication (JWT)", "Middleware & routing", "Error handling"], projects: ["REST API for a blog", "Auth system with JWT"], courses: ["REST API Design Masterclass"], milestones: ["Build a fully functional REST API", "Implement secure auth"] },
      { title: "Databases", duration: "Month 4", skills: ["PostgreSQL", "SQL queries", "Drizzle / Prisma ORM", "MongoDB basics", "Indexing & optimization"], projects: ["Full CRUD app with DB", "Analytics dashboard"], courses: ["SQL and PostgreSQL", "MongoDB University (free)"], milestones: ["Design a normalized schema", "Write complex queries"] },
      { title: "Scale & Deploy", duration: "Month 5–6", skills: ["Docker", "AWS / GCP basics", "Redis caching", "Message queues", "Observability (logging)"], projects: ["Dockerized microservice", "Redis-cached API"], courses: ["AWS Certified Developer", "Docker & Kubernetes Practical Guide"], milestones: ["Deploy to cloud", "Pass backend interviews"] },
    ],
    resources: ["Node.js docs", "PostgreSQL docs", "System Design Primer", "Designing Data-Intensive Applications", "AWS Free Tier"],
  },
  "Data Scientist": {
    targetRole: "Data Scientist",
    totalDuration: "6–9 months",
    difficulty: "Moderate–Advanced",
    salaryRange: "$100K – $200K",
    jobOutlook: "Strong — AI boom driving demand",
    phases: [
      { title: "Python & Statistics", duration: "Month 1–2", skills: ["Python", "NumPy", "Pandas", "Matplotlib", "Statistics & probability"], projects: ["EDA on public dataset", "Data cleaning pipeline"], courses: ["Python for Data Science and AI", "Statistics with Python Specialization"], milestones: ["Complete 3 EDA projects", "Understand core statistics"] },
      { title: "Machine Learning", duration: "Month 3–5", skills: ["Scikit-learn", "Linear & logistic regression", "Decision trees", "Clustering", "Model evaluation & tuning"], projects: ["House price prediction", "Customer churn model", "Sentiment classifier"], courses: ["Machine Learning Specialization (Andrew Ng)", "Hands-On ML with Scikit-Learn"], milestones: ["Enter a Kaggle competition", "Build end-to-end ML pipeline"] },
      { title: "Deep Learning & NLP", duration: "Month 6–7", skills: ["TensorFlow / PyTorch", "Neural networks", "CNNs & RNNs", "Transformers & LLMs", "NLP fundamentals"], projects: ["Image classifier", "Text generation model", "Fine-tuned LLM"], courses: ["Deep Learning Specialization", "fast.ai Practical Deep Learning"], milestones: ["Publish Kaggle notebook", "Fine-tune an open-source LLM"] },
      { title: "Production ML", duration: "Month 8–9", skills: ["MLflow", "Model deployment (FastAPI)", "Feature stores", "A/B testing", "SQL for data"], projects: ["ML model served as API", "A/B experiment analysis"], courses: ["MLOps Specialization", "Advanced SQL for Data Scientists"], milestones: ["Deploy ML model to prod", "Land first DS role"] },
    ],
    resources: ["Kaggle", "Papers With Code", "fast.ai", "Towards Data Science", "Arxiv", "Google Colab"],
  },
};

const DEFAULT_ROADMAP: Roadmap = {
  targetRole: "Software Engineer",
  totalDuration: "4–6 months",
  difficulty: "Beginner-friendly",
  salaryRange: "$80K – $160K",
  jobOutlook: "Excellent",
  phases: [
    { title: "Foundation", duration: "Month 1–2", skills: ["Core concepts", "Development tools", "Version control (Git)", "Problem-solving basics"], projects: ["Hello World in multiple languages", "Personal project starter"], courses: ["Foundations course on Coursera"], milestones: ["Set up your dev environment", "Solve 20 beginner challenges"] },
    { title: "Core Skills", duration: "Month 3–4", skills: ["Primary language mastery", "Data structures", "Algorithms", "Building with frameworks"], projects: ["Full working application", "Open source contribution"], courses: ["Intermediate specialization course"], milestones: ["Build your first portfolio project", "Contribute to open source"] },
    { title: "Professional Ready", duration: "Month 5–6", skills: ["Best practices", "Testing", "Deployment", "Collaboration workflows"], projects: ["Production-quality app", "Team project"], courses: ["Advanced topics course"], milestones: ["Pass technical interviews", "Land first opportunity"] },
  ],
  resources: ["Official documentation", "roadmap.sh", "YouTube tutorials", "Community forums"],
};

export function CareerRoadmapPage() {
  const [targetRole, setTargetRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [experience, setExperience] = useState("");
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    const role = targetRole === "custom" ? customRole : targetRole;
    if (!role) return;
    setLoading(true);
    setTimeout(() => {
      const found = ROADMAP_DATA[role];
      setRoadmap(found ?? { ...DEFAULT_ROADMAP, targetRole: role });
      setLoading(false);
    }, 1500);
  };

  const phaseColors = ["from-blue-500/20 to-blue-600/10 border-blue-500/20", "from-purple-500/20 to-purple-600/10 border-purple-500/20", "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20", "from-amber-500/20 to-amber-600/10 border-amber-500/20"];
  const phaseIconColors = ["text-blue-400 bg-blue-500/10", "text-purple-400 bg-purple-500/10", "text-emerald-400 bg-emerald-500/10", "text-amber-400 bg-amber-500/10"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-white/5 py-20 md:py-28 overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Map className="w-4 h-4" /> AI Career Roadmap
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Your path to<br /><span className="gradient-text">your dream role</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10">
            Enter your target role and get a personalized, month-by-month learning roadmap with courses, projects, and milestones.
          </p>

          {/* Generator */}
          {!roadmap && (
            <Card className="glass-card border-white/5 text-left max-w-2xl mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Role</label>
                  <Select value={targetRole} onValueChange={setTargetRole}>
                    <SelectTrigger className="glass bg-background/50 h-11">
                      <SelectValue placeholder="Choose a role..." />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      <SelectItem value="custom">Something else...</SelectItem>
                    </SelectContent>
                  </Select>
                  {targetRole === "custom" && (
                    <Input
                      value={customRole}
                      onChange={e => setCustomRole(e.target.value)}
                      placeholder="e.g. Blockchain Developer, Game Designer..."
                      className="h-11 bg-background/50 border-white/10"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Experience Level</label>
                  <Select value={experience} onValueChange={setExperience}>
                    <SelectTrigger className="glass bg-background/50 h-11">
                      <SelectValue placeholder="Select experience..." />
                    </SelectTrigger>
                    <SelectContent className="glass">
                      {EXPERIENCE_LEVELS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2"
                  onClick={generate}
                  disabled={(!targetRole || (targetRole === "custom" && !customRole)) || loading}
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating roadmap...</> : <><Sparkles className="w-4 h-4" /> Generate My Roadmap</>}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Roadmap Result */}
      {roadmap && (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Roadmap: {roadmap.targetRole}</h2>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5">
                  <Clock className="w-3 h-3" /> {roadmap.totalDuration}
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1.5">
                  <TrendingUp className="w-3 h-3" /> {roadmap.salaryRange}
                </Badge>
                <Badge className="bg-white/5 border-white/10 gap-1.5">
                  <Target className="w-3 h-3" /> {roadmap.difficulty}
                </Badge>
              </div>
            </div>
            <Button variant="outline" className="glass gap-2 shrink-0" onClick={() => setRoadmap(null)}>
              <Map className="w-4 h-4" /> New Roadmap
            </Button>
          </div>

          {/* Phases */}
          <div className="space-y-6 mb-12">
            {roadmap.phases.map((phase, idx) => (
              <Card key={idx} className={`border bg-gradient-to-br ${phaseColors[idx % phaseColors.length]}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${phaseIconColors[idx % phaseIconColors.length]}`}>
                      <span className="font-bold text-lg">{idx + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{phase.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" /> {phase.duration}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" /> Skills to Learn
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.skills.map(s => (
                          <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-foreground">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5" /> Projects to Build
                      </h4>
                      <ul className="space-y-1.5">
                        {phase.projects.map(p => (
                          <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> Recommended Courses
                      </h4>
                      <ul className="space-y-1.5">
                        {phase.courses.map(c => (
                          <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" /> {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Milestones
                      </h4>
                      <ul className="space-y-1.5">
                        {phase.milestones.map(m => (
                          <li key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="w-3 h-3 text-amber-400 shrink-0" /> {m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resources */}
          <Card className="glass-card border-white/5 mb-10">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><BookOpen className="w-5 h-5 text-primary" /> Essential Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {roadmap.resources.map(r => (
                  <span key={r} className="px-3 py-1.5 rounded-full text-sm bg-primary/5 border border-primary/10 text-foreground hover:bg-primary/10 transition-colors cursor-pointer flex items-center gap-1.5">
                    <ExternalLink className="w-3 h-3" /> {r}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="glass-card border-primary/20 bg-primary/5 rounded-2xl p-8 text-center">
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">Practice your interview skills and analyze your resume to maximize your chances of landing {roadmap.targetRole} roles.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2" asChild>
                <Link href="/interview">
                  Practice Interviews <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="glass gap-2" asChild>
                <Link href="/jobs">
                  Browse {roadmap.targetRole} Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Explore if no roadmap */}
      {!roadmap && (
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-2xl font-bold text-center mb-8">Popular roadmaps</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Object.keys(ROADMAP_DATA).map(role => (
              <Card
                key={role}
                className="glass-card border-white/5 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => { setTargetRole(role); setTimeout(generate, 100); }}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <span className="font-medium group-hover:text-primary transition-colors">{role}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
