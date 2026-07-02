import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Briefcase, Target, Sparkles, Users, Globe, Heart,
  ArrowRight, Linkedin, Github, Twitter, Building2, TrendingUp, Award
} from "lucide-react";

const team = [
  { name: "Marcus Chen", role: "CEO & Co-Founder", bio: "Former Google recruiter who saw firsthand how broken hiring was. Built JobConnect AI to fix it.", avatar: "MC", grad: "from-blue-500 to-purple-600" },
  { name: "Priya Sharma", role: "CTO & Co-Founder", bio: "Ex-Meta staff engineer. Obsessed with using AI to reduce bias and increase opportunity in hiring.", avatar: "PS", grad: "from-purple-500 to-pink-600" },
  { name: "Jordan Lee", role: "Head of Product", bio: "Designed products at Figma and Notion. Believes great software feels invisible.", avatar: "JL", grad: "from-emerald-500 to-teal-600" },
  { name: "Aisha Patel", role: "Head of AI", bio: "PhD in NLP from Stanford. Building the AI layer that makes every career conversation smarter.", avatar: "AP", grad: "from-amber-500 to-orange-600" },
  { name: "Devon Brooks", role: "Head of Growth", bio: "Led growth at three YC-backed startups. Brings students and recruiters together at scale.", avatar: "DB", grad: "from-red-500 to-pink-600" },
  { name: "Sakura Tanaka", role: "Head of Design", bio: "Craft-obsessed designer who makes complex things feel simple. Former Apple product designer.", avatar: "ST", grad: "from-sky-500 to-indigo-600" },
];

const values = [
  { icon: Target, title: "Precision over volume", desc: "We'd rather surface 10 perfect matches than 1,000 mediocre ones. Quality always wins." },
  { icon: Heart, title: "People first", desc: "Behind every resume is a human story. We build technology that respects that." },
  { icon: Sparkles, title: "AI as a tool, not a gatekeeper", desc: "Our AI empowers — it surfaces opportunity without replacing human judgment or connection." },
  { icon: Globe, title: "Equal opportunity", desc: "Geography and background shouldn't limit your career. We're reducing barriers, globally." },
];

const milestones = [
  { year: "2022", event: "Founded in San Francisco with a mission to fix hiring" },
  { year: "2023", event: "Launched beta — 10,000 users in 3 months" },
  { year: "2023", event: "Raised $8M seed round from top-tier VCs" },
  { year: "2024", event: "Crossed 500 company partners and 1M student profiles" },
  { year: "2025", event: "Launched AI Interview Coach with real-time feedback" },
  { year: "2026", event: "Serving 2M+ job seekers across 40 countries" },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-white/5 py-24 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Briefcase className="w-4 h-4" /> Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Hiring should work for<br /><span className="gradient-text">everyone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We built JobConnect AI because the best people aren't always the best at job hunting — and the best companies aren't always the best at finding them.
          </p>
        </div>
      </div>

      {/* Mission */}
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our mission</h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              We believe that talent is equally distributed, but opportunity is not. A brilliant engineer in Lagos or Manila shouldn't have fewer chances than someone in Silicon Valley.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              JobConnect AI uses artificial intelligence to level the playing field — helping candidates present their best selves, helping companies find the people they actually need, and making the whole process more human in the process.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2" asChild>
              <Link href="/auth/register">Join the mission <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Job seekers", value: "2M+", icon: Users },
              { label: "Company partners", value: "500+", icon: Building2 },
              { label: "Countries reached", value: "40+", icon: Globe },
              { label: "Offers facilitated", value: "80K+", icon: TrendingUp },
            ].map(s => (
              <Card key={s.label} className="glass-card border-white/5">
                <CardContent className="p-5 text-center">
                  <s.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-4">What we believe</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Our values aren't on a poster in the office. They show up in every product decision we make.</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(v => (
              <Card key={v.title} className="glass-card border-white/5 hover:border-primary/20 transition-colors">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-10">How we got here</h2>
          <div className="relative border-l-2 border-white/10 pl-8 space-y-8 ml-4">
            {milestones.map((m, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-primary border-2 border-background" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">{m.year}</span>
                <p className="text-foreground mt-1">{m.event}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-4">The team</h2>
          <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">Former engineers, recruiters, and designers from Google, Meta, Apple, and top startups — united by the mission.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(t => (
              <Card key={t.name} className="glass-card border-white/5">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${t.grad} flex items-center justify-center text-white font-bold text-lg mb-4`}>
                    {t.avatar}
                  </div>
                  <h3 className="font-semibold mb-0.5">{t.name}</h3>
                  <p className="text-xs text-primary font-medium mb-3">{t.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
                  <div className="flex gap-3 mt-4">
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></a>
                    <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="w-4 h-4" /></a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card border-primary/20 bg-primary/5 rounded-3xl p-10 text-center">
          <Award className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">Ready to join us?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Whether you're looking for your next role or your next hire, we're here to make it happen.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-primary hover:bg-primary/90 text-white h-12 px-8" asChild>
              <Link href="/auth/register">Get started free</Link>
            </Button>
            <Button variant="outline" className="glass h-12 px-8" asChild>
              <Link href="/jobs">Browse jobs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
