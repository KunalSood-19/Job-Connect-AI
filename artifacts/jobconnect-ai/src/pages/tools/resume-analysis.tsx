import { useGetMe } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Bot, UploadCloud, FileText, CheckCircle, Target, Sparkles, Loader2, RefreshCw } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ResumeAnalysisPage() {
  const { data: user } = useGetMe();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = () => {
    if (!resumeText) return;
    
    setIsAnalyzing(true);
    // Simulate API call for demo purposes
    setTimeout(() => {
      setResult({
        atsScore: 78,
        strength: 'good',
        missingKeywords: ['React Context', 'GraphQL', 'Agile Methodology', 'CI/CD'],
        grammarSuggestions: ['Consider replacing "responsible for" with action verbs like "spearheaded" or "directed"'],
        formattingSuggestions: ['Use bullet points instead of paragraphs for experience descriptions', 'Ensure consistent date formatting (e.g., MM/YYYY)'],
        suggestions: [
          'Quantify your achievements (e.g., "Increased performance by 20%") instead of just stating duties.',
          'Your summary statement is a bit generic. Tailor it to highlight your specific frontend expertise.',
          'Move the Skills section above Experience to make it more visible to technical recruiters.'
        ],
        extractedSkills: ['JavaScript', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git']
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge />
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Bot className="w-10 h-10 text-primary" /> AI Resume Analyzer
        </h1>
        <p className="text-xl text-muted-foreground">
          Beat the ATS. Get instant, actionable feedback to make your resume stand out to recruiters and tracking systems.
        </p>
      </div>

      {!result && !isAnalyzing && (
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><FileText className="w-5 h-5 mr-2 text-primary" /> 1. Provide Your Resume</CardTitle>
              <CardDescription>Paste your resume text or upload a PDF/Word document.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center mb-4 hover:bg-white/5 transition-colors cursor-pointer group">
                <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                <p className="font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max 5MB)</p>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or paste text</span>
                </div>
              </div>
              
              <Textarea 
                className="mt-4 min-h-[200px] bg-background/50 border-white/10 focus-visible:ring-primary/50" 
                placeholder="Paste your resume content here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center text-lg"><Target className="w-5 h-5 mr-2 text-primary" /> 2. Target Job (Optional)</CardTitle>
              <CardDescription>Provide a job description to get tailored match analysis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-full">
              <Textarea 
                className="flex-1 min-h-[300px] bg-background/50 border-white/10 focus-visible:ring-primary/50 mb-6" 
                placeholder="Paste the job description here. Our AI will analyze how well your resume matches the specific requirements and suggest targeted keywords..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button 
                size="lg" 
                className="w-full h-14 text-lg bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                disabled={!resumeText}
                onClick={handleAnalyze}
              >
                <Sparkles className="w-5 h-5 mr-2" /> Analyze My Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {isAnalyzing && (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <Bot className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Analyzing your resume...</h2>
          <p className="text-muted-foreground max-w-md">Our AI is parsing your experience, extracting skills, and comparing against industry standards.</p>
        </div>
      )}

      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <Button variant="outline" className="glass" onClick={() => setResult(null)}>
              <RefreshCw className="w-4 h-4 mr-2" /> Analyze Another
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card border-primary/20 bg-primary/5 md:col-span-1">
              <CardContent className="p-8 flex flex-col items-center text-center justify-center h-full">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-background border-white/5" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${result.atsScore * 2.83} 283`} className="text-primary" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold text-foreground">{result.atsScore}</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Score</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 capitalize">{result.strength} Match</h3>
                <p className="text-sm text-muted-foreground">Your resume scores higher than 65% of applicants, but there's room for improvement.</p>
              </CardContent>
            </Card>

            <div className="md:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center"><Target className="w-5 h-5 mr-2 text-red-400" /> Missing Keywords</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground mb-4">Adding these terms in context will significantly improve your ATS pass rate for the target role.</p>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw: string) => (
                      <span key={kw} className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-500/10 border border-red-500/20 text-red-400">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader className="pb-3 border-b border-white/5">
                  <CardTitle className="text-lg flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-emerald-500" /> Identified Skills</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex flex-wrap gap-2">
                    {result.extractedSkills.map((skill: string) => (
                      <span key={skill} className="px-3 py-1.5 rounded-md text-sm font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="glass-card">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-lg flex items-center"><Sparkles className="w-5 h-5 mr-2 text-primary" /> Key Action Items</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3 uppercase tracking-wider text-xs">Content & Impact</h4>
                <ul className="space-y-3">
                  {result.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 mr-3 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-3 uppercase tracking-wider text-xs">Formatting & Style</h4>
                <ul className="space-y-3">
                  {result.formattingSuggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-3 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                  {result.grammarSuggestions.map((s: string, i: number) => (
                    <li key={`g-${i}`} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-3 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8 pt-8 border-t border-white/5">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href="/resume-builder">Fix Issues in Resume Builder</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge() {
  return (
    <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mb-6">
      AI Powered Feature
    </div>
  )
}