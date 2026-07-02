import { useGetMe, useGetRecruiterDashboard } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Briefcase, Users, CheckCircle2, Search, Building2, TrendingUp, Filter, Plus, MessageSquare, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { timeAgo } from "@/lib/mock-data";
import { Progress } from "@radix-ui/react-progress";

export function RecruiterDashboard() {
  const { data: user } = useGetMe();
  const { data: dashboard, isLoading } = useGetRecruiterDashboard({ query: { enabled: !!user } });

  // Fallback mock data
  const stats = dashboard || {
    activeJobs: 8,
    totalApplicants: 245,
    shortlisted: 32,
    hired: 4,
    recentApplications: [],
    hiringFunnel: {
      applied: 245,
      screening: 120,
      interview: 45,
      offer: 8,
      hired: 4
    },
    topSkills: ["React", "Python", "TypeScript", "AWS", "Figma"],
    applicantsByMonth: [
      { month: 'Jan', count: 40 },
      { month: 'Feb', count: 65 },
      { month: 'Mar', count: 55 },
      { month: 'Apr', count: 90 },
      { month: 'May', count: 120 },
      { month: 'Jun', count: 245 }
    ]
  };

  const funnelData = Object.entries(stats.hiringFunnel).map(([stage, count]) => ({
    stage: stage.charAt(0).toUpperCase() + stage.slice(1),
    count
  }));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="h-10 w-1/3 bg-white/5 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your job postings and candidate pipeline.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass flex items-center gap-2">
            <Search className="w-4 h-4" /> AI Candidate Search
          </Button>
          <Button className="bg-primary text-white flex items-center gap-2" asChild>
            <Link href="/jobs/new"><Plus className="w-4 h-4" /> Post New Job</Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.activeJobs}</h3>
            <p className="text-xs text-muted-foreground mt-1 hover:underline cursor-pointer"><Link href="/dashboard/recruiter/jobs">Manage postings</Link></p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.totalApplicants}</h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-emerald-500" /> +12% this week</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <Filter className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold">{stats.shortlisted}</h3>
            <p className="text-xs text-muted-foreground mt-1 hover:underline cursor-pointer"><Link href="/dashboard/recruiter/candidates?status=shortlisted">Review candidates</Link></p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-muted-foreground">Hired</p>
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground">{stats.hired}</h3>
            <p className="text-xs text-muted-foreground mt-1">This quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Applicant Growth</CardTitle>
            <CardDescription>Total applicants received over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.applicantsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
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
                  <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorApplicants)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Hiring Funnel</CardTitle>
            <CardDescription>Conversion rates across pipeline stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="stage" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }} />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Needs Review</CardTitle>
              <CardDescription>Recent applicants awaiting AI screening or manual review</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild><Link href="/dashboard/recruiter/candidates">View Pipeline</Link></Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-medium">Candidate</th>
                    <th className="px-4 py-3 font-medium">Applied For</th>
                    <th className="px-4 py-3 font-medium">AI Match Score</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 rounded-tr-lg font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Mock rows since API is likely empty */}
                  {[
                    { name: 'Alex Johnson', role: 'Frontend Engineer', score: 92, status: 'reviewing', date: new Date().toISOString() },
                    { name: 'Sarah Miller', role: 'Product Manager', score: 85, status: 'applied', date: new Date(Date.now() - 86400000).toISOString() },
                    { name: 'David Chen', role: 'UX Designer', score: 78, status: 'applied', date: new Date(Date.now() - 2*86400000).toISOString() },
                    { name: 'Emily Davis', role: 'Frontend Engineer', score: 95, status: 'shortlisted', date: new Date(Date.now() - 3*86400000).toISOString() }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="px-4 py-4 font-medium">{row.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{row.role}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={row.score} className="w-16 h-1.5" />
                          <span className={row.score >= 90 ? 'text-emerald-500 font-medium' : ''}>{row.score}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={`text-[10px] px-2 py-0.5 capitalize
                          ${row.status === 'applied' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                          ${row.status === 'reviewing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''}
                          ${row.status === 'shortlisted' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : ''}
                        `}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{timeAgo(row.date)}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"><FileText className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary"><MessageSquare className="h-4 w-4" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}