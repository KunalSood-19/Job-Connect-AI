import { useState, useEffect } from "react";
import CompleteProfileDialog from "@/components/profile/CompleteProfileDialog";
import { getRecruiterAnalytics } from "@/api/analytics";
import { FileText, Mail, MessageCircle } from "lucide-react";
import {
  useGetMe,
  useGetRecruiterDashboard,
} from "@workspace/api-client-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Briefcase,
  Users,
  CheckCircle2,
  Search,
  Building2,
  TrendingUp,
  Filter,
  Plus,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { timeAgo } from "@/lib/mock-data";
import { Progress } from "@radix-ui/react-progress";

// Real shape returned by /api/auth/me (generated type is incomplete)
type RecruiterProfile = {
  designation?: string | null;
  companyId?: number | null;
};

type MeResponse = {
  success?: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    location?: string | null;
    avatarUrl?: string | null;
    recruiter?: RecruiterProfile | null;
  };
};

export function RecruiterDashboard() {
  const [, setLocation] = useLocation();
  const { data: userResponse } = useGetMe() as { data: MeResponse | undefined };
  const profile = userResponse?.user;

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (profile) {
      const recruiterProfile = profile.recruiter;
      const isIncomplete =
        !profile.phone ||
        !profile.location ||
        !recruiterProfile ||
        !recruiterProfile.designation ||
        !recruiterProfile.companyId;

      setShowPopup(!!isIncomplete);
    }
  }, [profile]);
  const { data: dashboard, isLoading } = useGetRecruiterDashboard({
    query: {
      enabled: !!userResponse,
      queryKey: ["recruiterDashboard"],
    },
  }) as any;

  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    async function loadAnalytics() {
      const data = await getRecruiterAnalytics();
      setAnalytics(data);
    }

    loadAnalytics();
  }, []);
  // Fallback mock data
  const stats = {
    activeJobs: analytics?.totalJobs ?? 0,

    totalApplicants: analytics?.totalApplicants ?? 0,

    shortlisted: dashboard?.statusBreakdown?.shortlisted ?? 0,

    interviews: analytics?.interviews ?? 0,

    offers: analytics?.offers ?? 0,

    hired: analytics?.accepted ?? 0,

    hiringFunnel: {
      applied: analytics?.totalApplicants ?? 0,
      screening: dashboard?.statusBreakdown?.reviewing ?? 0,
      interview: analytics?.interviews ?? 0,
      offer: analytics?.offers ?? 0,
      hired: analytics?.accepted ?? 0,
    },

    topSkills: dashboard?.topSkills ?? [],

    applicantsByMonth: dashboard?.applicantsByMonth ?? [],
  };
  const funnelData = Object.entries(stats.hiringFunnel || {}).map(
    ([stage, count]) => ({
      stage: stage.charAt(0).toUpperCase() + stage.slice(1),
      count: Number(count),
    }),
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-8">
        <div className="h-10 w-1/3 bg-white/5 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  console.log(dashboard);
  console.log(stats.applicantsByMonth);
  return (
    <>
      <CompleteProfileDialog
        open={showPopup}
        onClose={() => setShowPopup(false)}
      />

      <div>
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Employer Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your job postings and candidate pipeline.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="glass flex items-center gap-2"
              >
                <Search className="w-4 h-4" /> AI Candidate Search
              </Button>
              <Button
                variant="outline"
                className="glass flex items-center gap-2"
                asChild
              >
                <Link href="/recruiter/interviews">Interview Management</Link>
              </Button>
              <Button
                className="bg-primary text-white flex items-center gap-2"
                onClick={() => setLocation("/jobs/new")}
              >
                <Plus className="w-4 h-4" /> Post New Job
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Jobs
                  </p>
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold">{stats.activeJobs}</h3>
                <p className="text-xs text-muted-foreground mt-1 hover:underline cursor-pointer">
                  <Link href="/recruiter/jobs">Manage postings</Link>
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Applicants
                  </p>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold">{stats.totalApplicants}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1 text-emerald-500" />{" "}
                  {stats.totalApplicants} applicants received
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Shortlisted
                  </p>
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                    <Filter className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold">{stats.shortlisted}</h3>
                <p className="text-xs text-muted-foreground mt-1 hover:underline cursor-pointer">
                  <Link href="/dashboard/recruiter/candidates?status=shortlisted">
                    Review candidates
                  </Link>
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Interviews
                  </p>

                  <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold">{stats.interviews}</h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled interviews
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Offers Sent
                  </p>

                  <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-3xl font-bold">{stats.offers}</h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Offer letters sent
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-muted-foreground">
                    Hired
                  </p>
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  {stats.hired}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Offer accepted
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Charts */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Applicant Growth</CardTitle>
                <CardDescription>
                  Total applicants received over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.applicantsByMonth}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorApplicants"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorApplicants)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">Hiring Funnel</CardTitle>
                <CardDescription>
                  Conversion rates across pipeline stages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={funnelData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={true}
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--muted-foreground))",
                        }}
                      />
                      <YAxis
                        dataKey="stage"
                        type="category"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 12,
                          fill: "hsl(var(--foreground))",
                          fontWeight: 500,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Offer Acceptance Rate</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="text-5xl font-bold text-green-500">
                  {stats.offers
                    ? Math.round((stats.hired / stats.offers) * 100)
                    : 0}
                  %
                </div>

                <p className="text-muted-foreground mt-2">
                  {stats.hired} accepted out of {stats.offers} offers
                </p>
              </CardContent>
            </Card>
            {/* Recent Applications */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Needs Review</CardTitle>
                  <CardDescription>
                    Recent applicants awaiting AI screening or manual review
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/recruiter/candidates">
                    View Pipeline
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg font-medium">
                          Candidate
                        </th>
                        <th className="px-4 py-3 font-medium">Applied For</th>
                        <th className="px-4 py-3 font-medium">
                          AI Match Score
                        </th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Date</th>
                        <th className="px-4 py-3 rounded-tr-lg font-medium text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Mock rows since API is likely empty */}
                      {dashboard?.recentApplications?.map((app: any) => (
                        <tr
                          key={app.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                        >
                          <td className="px-4 py-4 font-medium">
                            {app.user.name}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {app.job.title}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={app.aiScore ?? 0}
                                className="w-16 h-1.5"
                              />

                              <span
                                className={`font-medium ${
                                  (app.aiScore ?? 0) >= 80
                                    ? "text-emerald-500"
                                    : (app.aiScore ?? 0) >= 50
                                      ? "text-yellow-500"
                                      : "text-red-500"
                                }`}
                              >
                                {app.aiScore ?? 0}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-2 py-0.5 capitalize
                          ${
                            app.status === "APPLIED"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : ""
                          }
                          ${app.status === "REVIEWING" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : ""}
                          ${app.status === "SHORTLISTED" ? "bg-purple-500/10 text-purple-500 border-purple-500/20" : ""}
                        `}
                            >
                              {app.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">
                            {timeAgo(app.appliedAt)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {/* View Profile */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  (window.location.href = `/recruiter/candidate/${app.user.id}`)
                                }
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                View Profile
                              </Button>

                              {/* Email */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  window.open(
                                    `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                                      app.user.email,
                                    )}`,
                                    "_blank",
                                  )
                                }
                              >
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </Button>
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
      </div>
    </>
  );
}
