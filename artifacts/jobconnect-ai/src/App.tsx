import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch, Router as WouterRouter } from "wouter";
import MyJobs from "@/pages/recruiter/MyJobs";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import InterviewHome from "@/pages/interview/InterviewHome";
import { Shell } from "@/components/shell";
import { ProtectedRoute } from "@/components/protected-route";
import ApplicationsPage from "@/pages/applications";
import NotFound from "@/pages/not-found";
import Applicants from "@/pages/recruiter/Applicants";
// Public Pages
import { LandingPage } from "@/pages/landing";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { ForgotPasswordPage } from "@/pages/ForgotPassword";
import { JobsPage } from "@/pages/jobs";
import { PostJobPage } from "@/pages/jobs/new";
import { JobDetailPage } from "@/pages/jobs/detail";
import { CompaniesPage } from "@/pages/companies";
import { CompanyDetailPage } from "@/pages/companies/detail";

// Tools
import { ResumeAnalysisPage } from "@/pages/tools/resume-analysis";
import { ResumeBuilderPage } from "@/pages/tools/resume-builder";
import { InterviewPracticePage } from "@/pages/tools/interview-practice";
import { CareerRoadmapPage } from "@/pages/tools/career-roadmap";
import { SkillGapPage } from "@/pages/tools/skill-gap";
import CandidateProfile from "@/pages/recruiter/CandidateProfile";
// Dashboards
import { StudentDashboard } from "@/pages/dashboard/student";
import { RecruiterDashboard } from "@/pages/dashboard/recruiter";
import Interviews from "@/pages/recruiter/Interviews";
import Analytics from "@/pages/recruiter/Analytics";
// Profile
import ProfilePage from "@/pages/profile";

// Footer Pages
import { AboutPage } from "@/pages/about";
import { PrivacyPage } from "@/pages/legal/privacy";
import { TermsPage } from "@/pages/legal/terms";
import { CookiesPage } from "@/pages/legal/cookies";
import MyOffers from "@/pages/student/MyOffers";
import InterviewHistory from "@/pages/interview/InterviewHistory";
import ResumeBuilder from "./pages/student/ResumeBuilder";
import InterviewSession from "@/pages/interview/InterviewSession";
import InterviewReport from "@/pages/interview/InterviewReport";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

function ShellRoute({
  component: Component,
}: {
  component: React.ComponentType;
}) {
  return (
    <Shell>
      <Component />
    </Shell>
  );
}

function ProtectedShellRoute({
  component: Component,
  allowedRoles,
}: {
  component: React.ComponentType;
  allowedRoles?: string[];
}) {
  return (
    <Shell>
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component />
      </ProtectedRoute>
    </Shell>
  );
}
console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);
function Router() {
  return (
    <Switch>
      {/* Landing */}
      <Route path="/">
        <ShellRoute component={LandingPage} />
      </Route>

      {/* Authentication */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/reset-password" component={ForgotPasswordPage} />
      <Route path="/applications">
        <ProtectedShellRoute
          component={ApplicationsPage}
          allowedRoles={["STUDENT"]}
        />
      </Route>

      <Route path="/recruiter/analytics" component={Analytics} />
      {/* Jobs */}
      <Route path="/jobs">
        <ShellRoute component={JobsPage} />
      </Route>
      <Route path="/recruiter/interviews" component={Interviews} />

      <Route path="/jobs/new">
        <ProtectedShellRoute
          component={PostJobPage}
          allowedRoles={["RECRUITER"]}
        />
      </Route>
      <Route path="/recruiter/candidate/:userId">
        <ProtectedShellRoute
          component={CandidateProfile}
          allowedRoles={["RECRUITER"]}
        />
      </Route>
<Route path="/interview/history">
  <ShellRoute component={InterviewHistory} />
</Route>
      <Route path="/student/offers" component={MyOffers} />
      <Route path="/recruiter/jobs">
        <ProtectedShellRoute component={MyJobs} allowedRoles={["RECRUITER"]} />
      </Route>
      <Route path="/jobs/:id">
        <ShellRoute component={JobDetailPage} />
      </Route>
      <Route path="/recruiter/jobs/:id">
        <ProtectedShellRoute
          component={Applicants}
          allowedRoles={["RECRUITER"]}
        />
      </Route>
      {/* Companies */}
      <Route path="/companies">
        <ShellRoute component={CompaniesPage} />
      </Route>
      <Route path="/companies/:id">
        <ShellRoute component={CompanyDetailPage} />
      </Route>
   

<Route path="/interview/session">
  <ShellRoute component={InterviewSession} />
</Route>

<Route path="/interview/report">
  <ShellRoute component={InterviewReport} />
</Route>

      {/* AI Tools */}
      <Route path="/resume-analysis">
        <ShellRoute component={ResumeAnalysisPage} />
      </Route>

      <Route path="/resume-builder" component={ResumeBuilderPage} />

      <Route path="/interview-practice">
        <ShellRoute component={InterviewPracticePage} />
      </Route>

      <Route path="/career-roadmap">
        <ShellRoute component={CareerRoadmapPage} />
      </Route>

      <Route path="/skill-gap">
        <ShellRoute component={SkillGapPage} />
      </Route>

      {/* Student Dashboard */}
      <Route path="/dashboard/student">
        <ProtectedShellRoute
          component={StudentDashboard}
          allowedRoles={["STUDENT"]}
        />
      </Route>
      <Route path="/interview">
        <ShellRoute component={InterviewHome} />
      </Route>
      {/* Recruiter Dashboard */}
      <Route path="/dashboard/recruiter">
        <ProtectedShellRoute
          component={RecruiterDashboard}
          allowedRoles={["RECRUITER"]}
        />
      </Route>

      {/* Profile */}
      <Route path="/profile">
        <ProtectedShellRoute
          component={ProfilePage}
          allowedRoles={["STUDENT", "RECRUITER", "ADMIN"]}
        />
      </Route>

      {/* About */}
      <Route path="/about">
        <ShellRoute component={AboutPage} />
      </Route>

      {/* Privacy */}
      <Route path="/privacy">
        <ShellRoute component={PrivacyPage} />
      </Route>

      {/* Terms */}
      <Route path="/terms">
        <ShellRoute component={TermsPage} />
      </Route>

      {/* Cookies */}
      <Route path="/cookies">
        <ShellRoute component={CookiesPage} />
      </Route>

      {/* 404 */}
      <Route>
        <ShellRoute component={NotFound} />
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jobconnect-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>

          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
