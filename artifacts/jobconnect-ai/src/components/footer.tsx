import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Briefcase, Facebook, Github, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                JobConnect<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              The premium AI-powered career and recruitment platform bridging the gap between talent and opportunity.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">For Candidates</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Jobs</Link></li>
              <li><Link href="/companies" className="text-sm text-muted-foreground hover:text-primary transition-colors">Companies</Link></li>
              <li><Link href="/resume-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Resume Builder</Link></li>
              <li><Link href="/interview-practice" className="text-sm text-muted-foreground hover:text-primary transition-colors">Interview Practice</Link></li>
              <li><Link href="/career-roadmap" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Roadmap</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">For Employers</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Post a Job</Link></li>
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Search Candidates</Link></li>
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Screening</Link></li>
              <li><Link href="/auth/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Accessibility</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} JobConnect AI. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Made with precision</span>
            <span>•</span>
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}