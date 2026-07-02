import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Mic, MicOff, Bot, ChevronRight, RotateCcw, Sparkles, Clock, CheckCircle2,
  Brain, Code2, Users, MessageSquare, Trophy, ArrowRight, Timer, Star,
  Target, Lightbulb, TrendingUp, PlayCircle, ChevronLeft, Volume2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Stage = "landing" | "setup" | "session" | "results";
type QuestionType = "technical" | "behavioral" | "hr" | "coding";

interface Question { id: string; question: string; type: QuestionType; hint?: string; }
interface Answer { questionId: string; answer: string; score: number; feedback: string; }

const ROLES = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist",
  "Machine Learning Engineer", "DevOps Engineer", "Product Manager", "Product Designer",
  "iOS Developer", "Android Developer", "Software Architect", "QA Engineer",
];

const QUESTION_TYPES: { id: QuestionType; label: string; icon: any; desc: string; color: string }[] = [
  { id: "technical", label: "Technical", icon: Code2, desc: "System design, concepts, tools", color: "text-blue-400" },
  { id: "behavioral", label: "Behavioral", icon: Users, desc: "Situational & STAR method", color: "text-purple-400" },
  { id: "hr", label: "HR / Culture", icon: MessageSquare, desc: "Career goals & soft skills", color: "text-emerald-400" },
  { id: "coding", label: "Coding", icon: Brain, desc: "Algorithms & problem solving", color: "text-amber-400" },
];

const QUESTION_BANK: Record<QuestionType, string[]> = {
  technical: [
    "Explain the difference between REST and GraphQL APIs and when you'd choose each.",
    "What is the event loop in JavaScript? Explain with an example of async behavior.",
    "Describe the SOLID principles and give a real-world example of one you've applied.",
    "How would you optimize a slow-performing database query? Walk me through your process.",
    "What's the difference between SQL and NoSQL databases? When would you use each?",
    "Explain microservices architecture and its trade-offs compared to a monolith.",
    "What is Docker and how does containerization work? Why is it useful?",
    "Describe CI/CD and how you would set up a deployment pipeline from scratch.",
    "How does HTTPS work? Explain the TLS handshake process.",
    "What are React hooks? Explain useState and useEffect with examples.",
  ],
  behavioral: [
    "Tell me about a time you resolved a conflict with a teammate. What was the outcome?",
    "Describe a project where you failed or made a significant mistake. What did you learn?",
    "Give me an example of when you went above and beyond for a project or customer.",
    "Tell me about a time you had to learn something very quickly under pressure.",
    "Describe a situation where you had to deal with ambiguity and how you handled it.",
    "How did you handle a strong disagreement with your manager?",
    "Tell me about your most impactful project. What made it successful?",
    "Describe a time you had to juggle multiple competing priorities. How did you decide?",
  ],
  hr: [
    "Tell me about yourself and your career journey so far.",
    "Why do you want to work at this company specifically?",
    "Where do you see yourself in 5 years?",
    "What are your greatest strengths and how do they apply to this role?",
    "What is your biggest weakness and what are you doing to improve it?",
    "How do you handle pressure and tight deadlines?",
    "What motivates you most in your day-to-day work?",
    "Describe your ideal work environment and team culture.",
  ],
  coding: [
    "Reverse a linked list in-place. Explain the time and space complexity.",
    "Given an array of integers, find two numbers that add up to a target sum.",
    "Implement a function to check if a binary tree is balanced.",
    "Write a function to detect a cycle in a directed graph.",
    "Implement LRU cache with O(1) get and put operations.",
    "Find the longest substring without repeating characters.",
    "Given a string of parentheses, determine if it is valid.",
    "Implement binary search and explain its time complexity.",
  ],
};

function shuffleAndPick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function generateQuestions(type: QuestionType, count: number): Question[] {
  const bank = QUESTION_BANK[type];
  return shuffleAndPick(bank, Math.min(count, bank.length)).map((q, i) => ({
    id: `q-${i}`, question: q, type,
    hint: type === "behavioral" ? "Use the STAR method: Situation, Task, Action, Result" :
          type === "coding" ? "Think aloud, consider edge cases, then code" : undefined,
  }));
}

function evaluateAnswer(answer: string): { score: number; feedback: string; confidence: string } {
  const words = answer.trim().split(/\s+/).filter(Boolean).length;
  if (words < 10) return { score: 30, feedback: "Your answer was too brief. Provide more detail and specific examples.", confidence: "Low" };
  if (words < 30) return { score: 55, feedback: "Good start, but elaborate more. Add concrete examples and measurable outcomes.", confidence: "Medium" };
  if (words < 80) return { score: 72, feedback: "Solid answer with good depth. Consider adding more specific metrics or outcomes.", confidence: "Medium" };
  return { score: 88, feedback: "Excellent! Well-structured, detailed answer. Clear communication with strong examples.", confidence: "High" };
}

export function InterviewPracticePage() {
  const { toast } = useToast();
  const [stage, setStage] = useState<Stage>("landing");
  const [role, setRole] = useState("Frontend Developer");
  const [questionType, setQuestionType] = useState<QuestionType>("technical");
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      toast({ title: "Time's up!", description: "Move on to the next question." });
      setTimerActive(false);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, timeLeft]);

  const startSession = () => {
    const qs = generateQuestions(questionType, questionCount);
    setQuestions(qs);
    setCurrentIdx(0);
    setAnswers([]);
    setCurrentAnswer("");
    setStage("session");
    setTimeLeft(120);
    setTimerActive(false);
    setShowHint(false);
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) {
      toast({ title: "Please write an answer before submitting.", variant: "destructive" });
      return;
    }
    const { score, feedback, confidence } = evaluateAnswer(currentAnswer);
    const newAnswer: Answer = { questionId: questions[currentIdx].id, answer: currentAnswer, score, feedback };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setCurrentAnswer("");
      setTimeLeft(120);
      setShowHint(false);
    } else {
      setStage("results");
    }
  };

  const skipQuestion = () => {
    const skipped: Answer = { questionId: questions[currentIdx].id, answer: "", score: 0, feedback: "Question skipped." };
    const newAnswers = [...answers, skipped];
    setAnswers(newAnswers);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setCurrentAnswer("");
      setTimeLeft(120);
      setTimerActive(false);
      setShowHint(false);
    } else {
      setStage("results");
    }
  };

  const avgScore = answers.length ? Math.round(answers.reduce((s, a) => s + a.score, 0) / answers.length) : 0;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (stage === "landing") {
    return (
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="relative border-b border-white/5 py-20 md:py-28 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Bot className="w-4 h-4" /> AI Interview Coach
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              Practice until<br />
              <span className="gradient-text">you're ready</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Simulate real interviews with AI-generated questions. Get instant feedback on your answers and track your improvement over time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" onClick={() => setStage("setup")}>
                Start Practicing <PlayCircle className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 glass">
                Watch Demo <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { label: "Questions Asked", value: "10,000+", icon: MessageSquare, color: "text-blue-400" },
              { label: "Mock Sessions", value: "5,200+", icon: Brain, color: "text-purple-400" },
              { label: "Avg. Score Improvement", value: "+32%", icon: TrendingUp, color: "text-emerald-400" },
              { label: "Success Rate", value: "78%", icon: Trophy, color: "text-amber-400" },
            ].map(s => (
              <Card key={s.label} className="glass-card border-white/5 text-center">
                <CardContent className="pt-6 pb-4">
                  <s.icon className={`w-6 h-6 mx-auto mb-3 ${s.color}`} />
                  <p className="text-2xl font-bold mb-1">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Question Types */}
          <h2 className="text-2xl font-bold text-center mb-8">Practice every type of interview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {QUESTION_TYPES.map(qt => (
              <Card key={qt.id} className="glass-card border-white/5 hover:border-primary/30 transition-all group cursor-pointer" onClick={() => { setQuestionType(qt.id); setStage("setup"); }}>
                <CardContent className="p-6">
                  <qt.icon className={`w-8 h-8 mb-4 ${qt.color}`} />
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{qt.label}</h3>
                  <p className="text-sm text-muted-foreground">{qt.desc}</p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Practice now <ArrowRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How it works */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: Target, title: "Choose your focus", desc: "Pick your target role and the type of questions you want to practice." },
                { step: "2", icon: MessageSquare, title: "Answer questions", desc: "Type or speak your answers. Use the timer to simulate real pressure." },
                { step: "3", icon: Sparkles, title: "Get AI feedback", desc: "Receive instant scores and detailed tips to improve your answers." },
              ].map(s => (
                <div key={s.step} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 relative">
                    <s.icon className="w-6 h-6 text-primary" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{s.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "setup") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-xl">
          <button onClick={() => setStage("landing")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <Card className="glass-card border-white/5">
            <CardHeader className="pb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Set up your session</CardTitle>
              <CardDescription>Configure your mock interview to match your target role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Role</label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="glass bg-background/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass">
                    {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Question Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {QUESTION_TYPES.map(qt => (
                    <button
                      key={qt.id}
                      onClick={() => setQuestionType(qt.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${questionType === qt.id ? "border-primary bg-primary/5" : "border-white/5 hover:border-white/20"}`}
                    >
                      <qt.icon className={`w-5 h-5 shrink-0 ${qt.color}`} />
                      <div>
                        <p className="text-sm font-medium">{qt.label}</p>
                        <p className="text-xs text-muted-foreground">{qt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Questions</label>
                <div className="flex gap-2">
                  {[3, 5, 7, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all ${questionCount === n ? "border-primary bg-primary/10 text-primary" : "border-white/5 hover:border-white/20 text-muted-foreground"}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-white" onClick={startSession}>
                Start Interview <PlayCircle className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (stage === "session" && questions.length > 0) {
    const current = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${QUESTION_TYPES.find(q => q.id === questionType)?.color?.replace("text-", "bg-")?.replace("-400", "-400/10") ?? "bg-primary/10"}`}>
                {(() => { const T = QUESTION_TYPES.find(q => q.id === questionType); return T ? <T.icon className={`w-4 h-4 ${T.color}`} /> : null; })()}
              </div>
              <span className="font-medium capitalize">{questionType} Interview — {role}</span>
            </div>
            <Badge variant="outline" className="border-white/10">
              {currentIdx + 1} / {questions.length}
            </Badge>
          </div>

          <Progress value={progress} className="h-1.5 mb-8 bg-white/5" />

          {/* Question */}
          <Card className="glass-card border-white/5 mb-6">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Question {currentIdx + 1}</p>
                  <p className="text-lg md:text-xl font-medium leading-relaxed">{current.question}</p>
                  {showHint && current.hint && (
                    <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-amber-300">{current.hint}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tools bar */}
          <div className="flex items-center gap-3 mb-4">
            <Button
              size="sm"
              variant="outline"
              className={`glass gap-2 ${timerActive ? "border-primary/40 text-primary" : "border-white/10"}`}
              onClick={() => setTimerActive(v => !v)}
            >
              <Timer className="w-4 h-4" />
              {timerActive ? formatTime(timeLeft) : "Start Timer"}
            </Button>
            {current.hint && (
              <Button size="sm" variant="outline" className="glass gap-2 border-amber-500/20 text-amber-400 hover:bg-amber-500/10" onClick={() => setShowHint(v => !v)}>
                <Lightbulb className="w-4 h-4" /> {showHint ? "Hide" : "Hint"}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className={`glass gap-2 ml-auto ${isRecording ? "border-red-500/40 text-red-400 bg-red-500/10" : "border-white/10"}`}
              onClick={() => { setIsRecording(r => !r); toast({ title: isRecording ? "Recording stopped" : "Recording started (simulated)", description: isRecording ? "Your answer has been captured." : "Speak your answer clearly." }); }}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? "Stop" : "Voice"}
            </Button>
          </div>

          {/* Answer area */}
          <Textarea
            value={currentAnswer}
            onChange={e => setCurrentAnswer(e.target.value)}
            placeholder={
              questionType === "behavioral" ? "Use the STAR method — Situation: describe the context, Task: what was your role, Action: what did you do specifically, Result: what was the measurable outcome..." :
              questionType === "coding" ? "Walk through your thought process first. Discuss time/space complexity, edge cases, then describe your implementation..." :
              "Type your answer here. Be specific and use concrete examples where possible..."
            }
            className="min-h-[220px] mb-4 bg-background/50 border-white/10 focus-visible:ring-primary/50 text-base resize-none"
          />

          <div className="flex gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={skipQuestion}>
              Skip question
            </Button>
            <Button
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white"
              onClick={submitAnswer}
              disabled={!currentAnswer.trim()}
            >
              {currentIdx < questions.length - 1 ? "Submit & Next" : "Finish Interview"}
              <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results
  const scoreColor = avgScore >= 80 ? "text-emerald-400" : avgScore >= 60 ? "text-amber-400" : "text-red-400";
  const scoreLabel = avgScore >= 80 ? "Excellent" : avgScore >= 65 ? "Good" : avgScore >= 50 ? "Fair" : "Needs Work";

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-6">
            <Trophy className={`w-10 h-10 ${scoreColor}`} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Session Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed across {answers.length} questions.</p>
        </div>

        {/* Overall score */}
        <Card className="glass-card border-primary/20 bg-primary/5 mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center shrink-0">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={`${avgScore * 2.64} 264`}
                      className={scoreColor} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${scoreColor}`}>{avgScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <p className={`font-semibold mt-2 ${scoreColor}`}>{scoreLabel}</p>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">{answers.filter(a => a.score >= 75).length}</p>
                  <p className="text-xs text-muted-foreground">Strong answers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{answers.filter(a => a.score > 0 && a.score < 75).length}</p>
                  <p className="text-xs text-muted-foreground">Need improvement</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{answers.filter(a => a.score === 0).length}</p>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Per-question breakdown */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold">Question Breakdown</h2>
          {questions.map((q, i) => {
            const ans = answers[i];
            if (!ans) return null;
            const sc = ans.score;
            const col = sc >= 75 ? "text-emerald-400" : sc >= 50 ? "text-amber-400" : "text-red-400";
            return (
              <Card key={q.id} className="glass-card border-white/5">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${sc >= 75 ? "bg-emerald-500/10 text-emerald-400" : sc >= 50 ? "bg-amber-500/10 text-amber-400" : "bg-red-500/10 text-red-400"}`}>
                      {sc === 0 ? "–" : sc}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-1">{q.question}</p>
                      {ans.answer && <p className="text-xs text-muted-foreground mb-2 line-clamp-2 italic">"{ans.answer}"</p>}
                      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-white/3 border border-white/5">
                        <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground">{ans.feedback}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 glass gap-2" onClick={() => { setStage("setup"); setAnswers([]); }}>
            <RotateCcw className="w-4 h-4" /> Practice Again
          </Button>
          <Button className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2" asChild>
            <Link href="/resume-analysis">
              <Star className="w-4 h-4" /> Analyze Your Resume
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
