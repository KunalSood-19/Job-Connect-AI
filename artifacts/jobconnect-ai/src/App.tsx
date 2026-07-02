import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { setAuthTokenGetter } from '@workspace/api-client-react';

// Configure the API client to send the stored JWT on every request
setAuthTokenGetter(() => localStorage.getItem('jwtToken'));

// Components
import { Shell } from '@/components/shell';
import { ProtectedRoute } from '@/components/protected-route';

// Pages
import { LandingPage } from '@/pages/landing';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { StudentDashboard } from '@/pages/dashboard/student';
import { RecruiterDashboard } from '@/pages/dashboard/recruiter';
import { JobsPage } from '@/pages/jobs/index';
import { JobDetailPage } from '@/pages/jobs/detail';
import { ResumeAnalysisPage } from '@/pages/tools/resume-analysis';

const queryClient = new QueryClient();

// Shell Wrapper for pages that need navbar/footer
function ShellRoute({ component: Component }: { component: React.ComponentType }) {
  return (
    <Shell>
      <Component />
    </Shell>
  );
}

// Protected Shell Wrapper
function ProtectedShellRoute({ component: Component, allowedRoles }: { component: React.ComponentType, allowedRoles?: string[] }) {
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
      {/* Public Routes with Shell */}
      <Route path="/">
        <ShellRoute component={LandingPage} />
      </Route>
      <Route path="/jobs">
        <ShellRoute component={JobsPage} />
      </Route>
      <Route path="/jobs/:id">
        <ShellRoute component={JobDetailPage} />
      </Route>
      <Route path="/resume-analysis">
        <ShellRoute component={ResumeAnalysisPage} />
      </Route>
      
      {/* Auth Routes (No Shell needed usually, but keeping consistent background) */}
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />

      {/* Protected Dashboards */}
      <Route path="/dashboard/student">
        <ProtectedShellRoute component={StudentDashboard} allowedRoles={['student']} />
      </Route>
      <Route path="/dashboard/recruiter">
        <ProtectedShellRoute component={RecruiterDashboard} allowedRoles={['recruiter']} />
      </Route>

      {/* 404 Route */}
      <Route>
        <ShellRoute component={NotFound} />
      </Route>
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