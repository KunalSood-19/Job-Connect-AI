import { useGetMe, useGetStudentDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Briefcase, Target, FileText, Brain, ChevronRight, Clock, Star, MapPin, DollarSign, Activity, CheckCircle2, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatSalary, timeAgo } from "@/lib/mock-data";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function StudentDashboard() {
  const { data: user } = useGetMe();
  const { data: dashboard, isLoading } = useGetStudentDashboard({ query: { enabled: !!user } });

  // Fallback mock data if API doesn't return full dashboard
  const stats = dashboard || {
    totalApplications: 12,
    interviews: 3,
    savedJobs: 24,
    profileStrength: 85,
    atsScore: 78,
    recentApplications: [],
    recommendedJobs: [],
    upcomingInterviews: [],
    activityByMonth: [
      { month: 'Jan', count: 2 },
      { month: 'Feb', count: 5 },
      { month: 'Mar', count: 4 },
      { month: 'Apr', count: 8 },
      { month: 'May', count: 12 },
      { month: 'Jun', count: 7 }
    ]
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="h-10 w-1/3 bg-white/5 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 h-96 bg-white/5 rounded-xl"></div>
          <div className="h-96 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-muted-foreground mt-1">Here is what's happening with your career search today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass" asChild>
            <Link href="/profile">Edit Profile</Link>
          </Button>
          <Button className="bg-primary text-white" asChild>
            <Link href="/jobs">Search Jobs</Link>
          </Button>
        </div>
      </div>

      {/* Profile Strength Banner */}
      {stats.profileStrength < 100 && (
        <Card className="glass-card border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-6">
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg flex items-center"><Target className="w-5 h-5 mr-2 text-primary" /> Profile Strength</h3>
                <span className="font-bold text-primary">{stats.profileStrength}%</span>
              </div>
              <Progress value={stats.profileStrength} className="h-2 bg-primary/20" />
              <p className="text-sm text-muted-foreground">Complete your profile to increase your visibility to recruiters by up to 3x.</p>
            </div>
            <Button variant="secondary" className="shrink-0" asChild>
              <Link href="/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Applications</p>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.totalApplications}</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-emerald-500" /> +2 this week</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Interviews</p>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.interviews}</h3>
            <p className="text-xs text-muted-foreground mt-1">1 upcoming</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Saved Jobs</p>
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.savedJobs}</h3>
            <p className="text-xs text-muted-foreground mt-1">Ready to apply</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Resume Score</p>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{stats.atsScore || '--'}<span className="text-lg text-muted-foreground font-normal">/100</span></h3>
            <p className="text-xs text-primary mt-1 hover:underline cursor-pointer"><Link href="/resume-analysis">Improve score</Link></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Career Copilot Section */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center"><Brain className="w-5 h-5 mr-2 text-primary" /> AI Career Copilot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => window.location.href='/resume-analysis'}>
                <CardContent className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Resume Analyzer</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Get an instant ATS score and tailored keywords for your target role.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => window.location.href='/interview-practice'}>
                <CardContent className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Brain className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Mock Interviews</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Practice role-specific questions and get instant AI feedback on your answers.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => window.location.href='/skill-gap'}>
                <CardContent className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Target className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Skill Gap Analysis</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">See exactly what skills you're missing for your dream job.</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-white/5 hover:border-primary/30 transition-colors group cursor-pointer" onClick={() => window.location.href='/career-roadmap'}>
                <CardContent className="p-5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">Career Roadmap</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Generate a step-by-step plan to reach your target role.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Activity Chart */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Application Activity</CardTitle>
              <CardDescription>Your job search momentum over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.activityByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">AI Matches</CardTitle>
              <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs"><Link href="/jobs/recommended">View all</Link></Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              {stats.recommendedJobs && stats.recommendedJobs.length > 0 ? (
                stats.recommendedJobs.slice(0, 3).map((match, i) => (
                  <div key={i} className="flex flex-col gap-2 p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/20 transition-colors cursor-pointer" onClick={() => window.location.href=`/jobs/${match.job.id}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-sm line-clamp-1">{match.job.title}</h4>
                        <p className="text-xs text-muted-foreground">{match.job.companyName}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs shrink-0">
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {match.matchedSkills.slice(0, 2).map(skill => (
                        <span key={skill} className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">{skill}</span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Target className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Complete your profile to get personalized AI job matches.</p>
                  <Button size="sm" asChild><Link href="/profile">Update Profile</Link></Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <Button variant="ghost" size="sm" asChild className="h-8 px-2 text-xs"><Link href="/applications">Tracker</Link></Button>
            </CardHeader>
            <CardContent className="grid gap-4">
              {stats.recentApplications && stats.recentApplications.length > 0 ? (
                stats.recentApplications.slice(0, 4).map((app, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center shrink-0">
                        {app.job?.companyLogoUrl ? (
                          <img src={app.job.companyLogoUrl} alt={app.job.companyName} className="w-full h-full rounded object-cover" />
                        ) : (
                          <Briefcase className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{app.job?.title || 'Unknown Role'}</p>
                        <p className="text-xs text-muted-foreground">{app.job?.companyName || 'Unknown Company'}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 capitalize
                      ${app.status === 'applied' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                      ${app.status === 'reviewing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                      ${app.status === 'interview' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : ''}
                      ${app.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                    `}>
                      {app.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">No recent applications.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}