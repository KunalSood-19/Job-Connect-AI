import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Target, FileText, Zap, ChevronRight, CheckCircle2, TrendingUp, Users, Building, ShieldCheck, MapPin, DollarSign, Clock, Star } from "lucide-react";
import { mockJobs, mockCompanies, formatSalary, timeAgo } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { getTrendingJobs } from "@/api/jobs";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
 visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } } 
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function LandingPage() {
  const [trendingJobs, setTrendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
  const loadTrendingJobs = async () => {
    try {
      const res = await getTrendingJobs();

      setTrendingJobs(res.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadTrendingJobs();
}, []);
 const displayJobs =
  trendingJobs.length > 0
    ? trendingJobs.slice(0, 4)
    : mockJobs.slice(0, 4);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-16 md:pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay z-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container px-4 md:px-6 relative z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn}>
              <Badge variant="outline" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 backdrop-blur-sm rounded-full mb-6">
                <SparklesIcon className="w-4 h-4 mr-2 inline-block" />
                The next generation of hiring is here
              </Badge>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground to-muted-foreground leading-tight pb-2">
              Find your next role with <span className="gradient-text">precision</span>
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              JobConnect AI analyzes your skills, experience, and potential to match you with opportunities you didn't even know existed.
            </motion.p>
            
            <motion.div variants={fadeIn} className="w-full max-w-2xl mt-8">
              <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl -z-10"></div>
                <div className="relative flex-1 flex items-center bg-background/50 rounded-xl px-4 py-2 border border-white/5">
                  <Search className="h-5 w-5 text-muted-foreground mr-3" />
                  <Input 
                    type="text" 
                    placeholder="Job title, keywords, or company..." 
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-base"
                  />
                </div>
                <div className="relative flex-1 flex items-center bg-background/50 rounded-xl px-4 py-2 border border-white/5">
                  <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                  <Input 
                    type="text" 
                    placeholder="City, state, or remote..." 
                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-base"
                  />
                </div>
                <Button size="lg" className="h-14 rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-medium text-lg w-full md:w-auto shadow-[0_0_20px_rgba(var(--primary),0.3)]" asChild>
                  <Link href="/jobs">Search</Link>
                </Button>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
                <span>Trending:</span>
                {["Frontend Developer", "Machine Learning", "Product Manager", "Remote", "React"].map(tag => (
                  <Link key={tag} href={`/jobs?q=${encodeURIComponent(tag)}`} className="hover:text-primary transition-colors cursor-pointer">
                    {tag}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 bg-black/20">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Jobs", value: "10,000+" },
              { label: "Top Companies", value: "500+" },
              { label: "Successful Hires", value: "25,000+" },
              { label: "AI Matches", value: "1M+" },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-2">
                <h4 className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</h4>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">More than just a job board. <br/>An <span className="text-primary">AI career copilot</span>.</h2>
            <p className="text-xl text-muted-foreground">We give you the tools to stand out, practice, and land your dream role.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "AI Resume Builder & Analysis",
                desc: "Generate tailored resumes that beat ATS systems. Get instant feedback on your existing resume with actionable improvement suggestions.",
                icon: FileText,
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                title: "Smart Job Matching",
                desc: "Stop manually searching. Our AI analyzes your complete profile and skills to recommend jobs where you have the highest probability of success.",
                icon: Target,
                color: "text-purple-500",
                bg: "bg-purple-500/10"
              },
              {
                title: "Mock Interviews",
                desc: "Practice behavioral and technical questions customized for your target role. Get real-time audio and text evaluation of your answers.",
                icon: Brain,
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              }
            ].map((feature, i) => (
              <Card key={i} className="glass-card border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] group">
                <CardContent className="p-8">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-24 bg-card/30">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Opportunities</h2>
              <p className="text-lg text-muted-foreground">Hand-picked roles tailored for top talent.</p>
            </div>
            <Button variant="outline" className="glass hover:bg-white/5" asChild>
              <Link href="/jobs">View all jobs <ChevronRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {displayJobs.map((job) => (
              <Card key={job.id} className="glass-card border-white/5 hover:border-primary/30 transition-all duration-300 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -z-10 group-hover:bg-primary/10 transition-colors"></div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {job.companyLogoUrl ? (
                          <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-1">{job.title}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1 gap-2">
                          <span className="font-medium text-foreground/80">{job.companyName}</span>
                          <span>•</span>
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-primary">
                      <Star className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-white/5">
                      <Clock className="w-3 h-3 mr-1" /> {job.type}
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-white/5">
                      <DollarSign className="w-3 h-3 mr-1" /> {formatSalary(job.salaryMin, job.salaryMax)}
                    </Badge>
                    {job.isRemote && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                        Remote
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {job.skills?.slice(0, 4).map((skill: string) => (
                      <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border text-muted-foreground">
                        {skill}
                      </span>
                    ))}
                    {(job.skills?.length || 0) > 4 && (
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-background border border-border text-muted-foreground">
                        +{(job.skills?.length || 0) - 4}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xs text-muted-foreground">{timeAgo(job.postedAt)}</span>
                    <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
                      <Link href={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden relative">
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Trusted by top talent.</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The AI interview prep completely changed my confidence level. The questions were exactly what they asked me in the real interview.",
                author: "Sarah J.",
                role: "Frontend Engineer at Stripe",
                avatar: "https://i.pravatar.cc/150?u=sarah"
              },
              {
                quote: "I was struggling to get past ATS filters. JobConnect's resume analyzer pointed out exactly what I was missing. Got 3 interviews in a week.",
                author: "Michael T.",
                role: "Product Manager",
                avatar: "https://i.pravatar.cc/150?u=michael"
              },
              {
                quote: "The skill gap analysis showed me exactly which course to take to qualify for senior roles. 6 months later, I got the promotion.",
                author: "Elena R.",
                role: "Data Scientist",
                avatar: "https://i.pravatar.cc/150?u=elena"
              }
            ].map((t, i) => (
              <Card key={i} className="glass-card border-white/5 bg-background/40">
                <CardContent className="p-8">
                  <div className="flex text-yellow-500 mb-6">
                    {[1,2,3,4,5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-lg text-foreground/90 italic mb-8 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-4 mt-auto">
                    <Avatar className="h-12 w-12 border-2 border-white/10">
                      <AvatarImage src={t.avatar} />
                      <AvatarFallback>{t.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{t.author}</p>
                      <p className="text-sm text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="glass-card rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/10 to-background z-0"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to accelerate your career?</h2>
              <p className="text-xl text-muted-foreground mb-10">Join thousands of professionals finding their next role with AI-powered insights.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 text-lg bg-primary text-white shadow-[0_0_30px_rgba(var(--primary),0.4)]" asChild>
                  <Link href="/auth/register">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg glass" asChild>
                  <Link href="/auth/register?role=recruiter">I'm Hiring</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}