import { Link } from "wouter";
import { Briefcase, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                JobConnect<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The premium AI-powered career and recruitment platform bridging the gap between talent and opportunity.
            </p>
            <div className="flex gap-4 mt-1">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" /><span className="sr-only">Twitter</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" /><span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" /><span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">For Candidates</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Companies</Link></li>
              <li><Link href="/resume-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link href="/resume-analysis" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume Analyzer</Link></li>
              <li><Link href="/interview-practice" className="text-sm text-muted-foreground hover:text-primary transition-colors">Interview Practice</Link></li>
              <li><Link href="/career-roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Roadmap</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">For Employers</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/auth/register?role=recruiter" className="text-sm text-muted-foreground hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/auth/register?role=recruiter" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search Candidates</Link></li>
              <li><Link href="/auth/register?role=recruiter" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Screening</Link></li>
              <li><Link href="/companies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Company Profiles</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About JobConnect AI</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JobConnect AI, Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
            <span>Made with precision · San Francisco, CA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
