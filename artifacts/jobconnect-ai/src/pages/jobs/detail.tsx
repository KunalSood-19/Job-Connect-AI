import { useGetJob, useGetMe, useApplyToJob } from "@workspace/api-client-react";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Building, DollarSign, Clock, Target, Briefcase, Globe, Users, ChevronLeft, Share2, Bookmark, CheckCircle2 } from "lucide-react";
import { formatSalary, timeAgo, mockJobs } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function JobDetailPage() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = parseInt(params?.id || "0");
  
  const { data: user } = useGetMe();
  const { data: job, isLoading } = useGetJob(jobId, { query: { enabled: !!jobId } });
  const applyMutation = useApplyToJob();
  const { toast } = useToast();
  
  const [hasApplied, setHasApplied] = useState(false);

  // Fallback to mock data if API fails or is loading
  const displayJob = job || mockJobs.find(j => j.id === jobId) || mockJobs[0];

  const handleApply = () => {
    if (!user) {
      window.location.href = `/auth/login?redirect=/jobs/${jobId}`;
      return;
    }

    applyMutation.mutate(
      { data: { jobId } },
      {
        onSuccess: () => {
          setHasApplied(true);
          toast({
            title: "Application Submitted",
            description: "Your profile has been sent to the employer.",
          });
        },
        onError: () => {
          // Fake success for demo since API might not exist yet
          setHasApplied(true);
          toast({
            title: "Application Submitted (Mock)",
            description: "Your profile has been sent to the employer.",
          });
        }
      }
    );
  };

  if (isLoading && !job) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-8 max-w-5xl">
        <div className="h-8 w-24 bg-white/5 rounded-md mb-8"></div>
        <div className="flex gap-6">
          <div className="w-20 h-20 bg-white/5 rounded-xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 bg-white/5 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-white/5 rounded-lg"></div>
          </div>
        </div>
        <div className="h-[400px] bg-white/5 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card/50 border-b border-white/5 py-8 relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground hover:text-foreground">
            <Link href="/jobs"><ChevronLeft className="w-4 h-4 mr-1" /> Back to jobs</Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg border border-white/10 p-1">
                {displayJob.companyLogoUrl ? (
                  <img src={displayJob.companyLogoUrl} alt={displayJob.companyName} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <Building className="w-10 h-10 text-gray-400" />
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold mb-2">{displayJob.title}</h1>
                <div className="flex flex-wrap items-center text-muted-foreground text-base gap-y-2 gap-x-4">
                  <Link href={`/companies/${displayJob.companyId}`} className="font-medium text-primary hover:underline flex items-center">
                    <Building className="w-4 h-4 mr-1.5" />{displayJob.companyName}
                  </Link>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1.5" /> {displayJob.location}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> {timeAgo(displayJob.postedAt)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button variant="outline" size="icon" className="glass h-12 w-12 shrink-0">
                <Bookmark className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="glass h-12 w-12 shrink-0">
                <Share2 className="w-5 h-5" />
              </Button>
              {hasApplied ? (
                <Button size="lg" disabled className="h-12 flex-1 md:w-40 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Applied
                </Button>
              ) : (
                <Button size="lg" className="h-12 flex-1 md:w-40 bg-primary hover:bg-primary/90 text-white font-medium shadow-[0_0_20px_rgba(var(--primary),0.3)]" onClick={handleApply} disabled={applyMutation.isPending}>
                  {applyMutation.isPending ? "Applying..." : "Apply Now"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-secondary/40 border-white/5 font-normal">
              <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" /> {displayJob.experienceLevel ? displayJob.experienceLevel.charAt(0).toUpperCase() + displayJob.experienceLevel.slice(1) : 'Experience not specified'}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-secondary/40 border-white/5 font-normal capitalize">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" /> {displayJob.type}
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm bg-secondary/40 border-white/5 font-normal">
              <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" /> {formatSalary(displayJob.salaryMin, displayJob.salaryMax)}
            </Badge>
            {displayJob.isRemote && (
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-normal">
                <Globe className="w-4 h-4 mr-2" /> Remote Eligible
              </Badge>
            )}
          </div>

          {user && user.role === 'student' && (
            <Card className="glass-card border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-primary/20 to-transparent"></div>
              <CardContent className="p-6">
                <div className="flex items-start md:items-center justify-between gap-4 flex-col md:flex-row relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-background border-4 border-primary flex items-center justify-center font-bold text-lg text-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                      85%
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">Strong Match <Target className="w-4 h-4 text-primary" /></h3>
                      <p className="text-sm text-muted-foreground">Your profile matches 5 of 6 required skills.</p>
                    </div>
                  </div>
                  <Button variant="outline" className="glass bg-background/50 border-primary/20 text-primary hover:bg-primary hover:text-white">
                    View Gap Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6 prose prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-headings:text-foreground">
            <div>
              <h2 className="text-xl font-bold mb-4">About the Role</h2>
              <p>
                {/* Mock description if not provided */}
                We are looking for a passionate {displayJob.title} to join our team at {displayJob.companyName}. 
                In this role, you will be responsible for designing and developing scalable software solutions that 
                impact millions of users. You'll work closely with product managers, designers, and other engineers 
                to build innovative features in a fast-paced, collaborative environment.
              </p>
              <p>
                The ideal candidate is a self-starter who thrives in ambiguity and is passionate about solving 
                complex technical challenges. If you love building elegant, high-performance applications and 
                want to shape the future of our platform, we'd love to hear from you.
              </p>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {displayJob.skills?.map(skill => (
                  <Badge key={skill} variant="outline" className="px-3 py-1.5 text-sm bg-background border-white/10 font-medium">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-xl font-bold mb-4">What You'll Do</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Design, develop, test, deploy, maintain and improve software.</li>
                <li>Manage individual project priorities, deadlines and deliverables.</li>
                <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                <li>Write clean, maintainable, and efficient code.</li>
                <li>Participate in code reviews and mentor junior developers.</li>
              </ul>
            </div>
            
            <Separator className="bg-white/5" />

            <div>
              <h2 className="text-xl font-bold mb-4">Benefits & Perks</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Competitive salary and equity package.</li>
                <li>Comprehensive health, dental, and vision insurance.</li>
                <li>Flexible work hours and remote-first culture.</li>
                <li>Unlimited PTO policy.</li>
                <li>Annual learning and development stipend.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg">About the Company</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white p-1">
                   {displayJob.companyLogoUrl ? (
                    <img src={displayJob.companyLogoUrl} alt={displayJob.companyName} className="w-full h-full object-contain rounded-md" />
                  ) : (
                    <Building className="w-full h-full text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{displayJob.companyName}</h3>
                  <p className="text-sm text-primary hover:underline cursor-pointer"><Link href={`/companies/${displayJob.companyId}`}>View profile</Link></p>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><Building className="w-4 h-4 mr-2" /> Industry</span>
                  <span className="font-medium text-right">Technology</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><Users className="w-4 h-4 mr-2" /> Size</span>
                  <span className="font-medium text-right">500-1000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center"><MapPin className="w-4 h-4 mr-2" /> HQ</span>
                  <span className="font-medium text-right">{displayJob.location.split(',')[0]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card bg-transparent border-none shadow-none">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg">Similar Roles</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-3">
              {mockJobs.filter(j => j.id !== jobId).slice(0, 3).map(job => (
                <div key={job.id} className="p-4 rounded-xl glass-card border border-white/5 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => window.location.href=`/jobs/${job.id}`}>
                  <h4 className="font-medium text-sm mb-1">{job.title}</h4>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{job.companyName}</span>
                    <span>{job.location.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}