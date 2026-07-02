import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { setAuthTokenGetter } from '@workspace/api-client-react';

// Configure the API client to send the stored JWT on every request
setAuthTokenGetter(() => localStorage.getItem('jwtToken'));

// Layout
import { Shell } from '@/components/shell';
import { ProtectedRoute } from '@/components/protected-route';

// Pages — public
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { JobsPage } from '@/pages/jobs/index';
import { JobDetailPage } from '@/pages/jobs/detail';
import { CompaniesPage } from '@/pages/companies/index';

// Pages — tools
import { ResumeAnalysisPage } from '@/pages/tools/resume-analysis';
import { ResumeBuilderPage } from '@/pages/tools/resume-builder';
import { InterviewPracticePage } from '@/pages/tools/interview-practice';
import { CareerRoadmapPage } from '@/pages/tools/career-roadmap';

// Pages — protected dashboards
import { StudentDashboard } from '@/pages/dashboard/student';
import { RecruiterDashboard } from '@/pages/dashboard/recruiter';

// Pages — footer / informational
import { AboutPage } from '@/pages/about';
import { PrivacyPage } from '@/pages/legal/privacy';
import { TermsPage } from '@/pages/legal/terms';
import { CookiesPage } from '@/pages/legal/cookies';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function ShellRoute({ component: Component }: { component: React.ComponentType }) {
  return <Shell><Component /></Shell>;
}

function ProtectedShellRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles?: string[] }) {
  return (
    <Shell>
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component />
      </ProtectedRoute>
    </Shell>
  );
}

function Router() {
  return (
    <Switch>
      {/* Landing */}
      <Route path="/"><ShellRoute component={LandingPage} /></Route>

      {/* Auth */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />

      {/* Jobs */}
      <Route path="/jobs"><ShellRoute component={JobsPage} /></Route>
      <Route path="/jobs/:id"><ShellRoute component={JobDetailPage} /></Route>

      {/* Companies */}
      <Route path="/companies"><ShellRoute component={CompaniesPage} /></Route>

      {/* Tools */}
      <Route path="/resume-analysis"><ShellRoute component={ResumeAnalysisPage} /></Route>
      <Route path="/resume-builder"><ShellRoute component={ResumeBuilderPage} /></Route>
      <Route path="/interview-practice"><ShellRoute component={InterviewPracticePage} /></Route>
      <Route path="/career-roadmap"><ShellRoute component={CareerRoadmapPage} /></Route>

      {/* Protected dashboards */}
      <Route path="/dashboard/student">
        <ProtectedShellRoute component={StudentDashboard} allowedRoles={['student']} />
      </Route>
      <Route path="/dashboard/recruiter">
        <ProtectedShellRoute component={RecruiterDashboard} allowedRoles={['recruiter']} />
      </Route>

      {/* About & legal */}
      <Route path="/about"><ShellRoute component={AboutPage} /></Route>
      <Route path="/privacy"><ShellRoute component={PrivacyPage} /></Route>
      <Route path="/terms"><ShellRoute component={TermsPage} /></Route>
      <Route path="/cookies"><ShellRoute component={CookiesPage} /></Route>

      {/* 404 */}
      <Route><ShellRoute component={NotFound} /></Route>
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="jobconnect-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
