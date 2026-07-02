import { useState } from "react";
import { Link } from "wouter";
import { useListCompanies } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, Search, MapPin, Users, Globe, Star, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

const mockCompanies = [
  { id: 1, name: "Google", logoUrl: "https://logo.clearbit.com/google.com", industry: "Technology", size: "10000+", location: "Mountain View, CA", description: "Global leader in search, cloud, and AI.", isVerified: true, isFeatured: true, openRoles: 24 },
  { id: 2, name: "Meta", logoUrl: "https://logo.clearbit.com/meta.com", industry: "Technology", size: "10000+", location: "Menlo Park, CA", description: "Building the future of social connection and the metaverse.", isVerified: true, isFeatured: true, openRoles: 18 },
  { id: 3, name: "Microsoft", logoUrl: "https://logo.clearbit.com/microsoft.com", industry: "Technology", size: "10000+", location: "Redmond, WA", description: "Empowering every person and organization on the planet to achieve more.", isVerified: true, isFeatured: true, openRoles: 31 },
  { id: 4, name: "Shopify", logoUrl: "https://logo.clearbit.com/shopify.com", industry: "E-Commerce", size: "5000-10000", location: "Ottawa, Canada", description: "Powering commerce for businesses of all sizes worldwide.", isVerified: true, isFeatured: true, openRoles: 12 },
  { id: 5, name: "Airbnb", logoUrl: "https://logo.clearbit.com/airbnb.com", industry: "Travel", size: "1000-5000", location: "San Francisco, CA", description: "Marketplace for short-term homestays and unique travel experiences.", isVerified: true, isFeatured: true, openRoles: 9 },
  { id: 6, name: "Netflix", logoUrl: "https://logo.clearbit.com/netflix.com", industry: "Entertainment", size: "5000-10000", location: "Los Gatos, CA", description: "Leading subscription streaming service and production company.", isVerified: true, isFeatured: false, openRoles: 15 },
  { id: 7, name: "Figma", logoUrl: "https://logo.clearbit.com/figma.com", industry: "Design Tools", size: "500-1000", location: "San Francisco, CA", description: "Collaborative design platform for building great products.", isVerified: true, isFeatured: false, openRoles: 7 },
  { id: 8, name: "Linear", logoUrl: "https://logo.clearbit.com/linear.app", industry: "Productivity", size: "100-500", location: "Remote", description: "The issue tracking tool you will enjoy using.", isVerified: true, isFeatured: false, openRoles: 4 },
  { id: 9, name: "Vercel", logoUrl: "https://logo.clearbit.com/vercel.com", industry: "Developer Tools", size: "100-500", location: "Remote", description: "Deploy frontend apps with zero configuration.", isVerified: true, isFeatured: false, openRoles: 6 },
  { id: 10, name: "Stripe", logoUrl: "https://logo.clearbit.com/stripe.com", industry: "FinTech", size: "1000-5000", location: "San Francisco, CA", description: "Financial infrastructure for the internet.", isVerified: true, isFeatured: false, openRoles: 20 },
  { id: 11, name: "Notion", logoUrl: "https://logo.clearbit.com/notion.com", industry: "Productivity", size: "500-1000", location: "San Francisco, CA", description: "All-in-one workspace for notes, docs, and collaboration.", isVerified: false, isFeatured: false, openRoles: 5 },
  { id: 12, name: "Atlassian", logoUrl: "https://logo.clearbit.com/atlassian.com", industry: "Developer Tools", size: "5000-10000", location: "Sydney, Australia", description: "Collaboration software for teams of all sizes.", isVerified: true, isFeatured: false, openRoles: 22 },
];

const industries = ["All Industries", "Technology", "E-Commerce", "Travel", "Entertainment", "Design Tools", "FinTech", "Developer Tools", "Productivity"];
const sizes = ["All Sizes", "1-100", "100-500", "500-1000", "1000-5000", "5000-10000", "10000+"];

function CompanyLogo({ company }: { company: typeof mockCompanies[0] }) {
  return (
    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-white/10">
      <img
        src={company.logoUrl}
        alt={company.name}
        className="w-12 h-12 object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-2xl font-bold text-gray-400">${company.name[0]}</span>`;
        }}
      />
    </div>
  );
}

export function CompaniesPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [size, setSize] = useState("All Sizes");

  const { data: apiCompanies, isLoading } = useListCompanies({ limit: 50 });
  const companies = (apiCompanies?.companies?.length ? apiCompanies.companies : mockCompanies) as typeof mockCompanies;

  const filtered = companies.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.industry?.toLowerCase().includes(search.toLowerCase());
    const matchIndustry = industry === "All Industries" || c.industry === industry;
    const matchSize = size === "All Sizes" || c.size === size;
    return matchSearch && matchIndustry && matchSize;
  });

  const featured = filtered.filter(c => c.isFeatured);
  const rest = filtered.filter(c => !c.isFeatured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative border-b border-white/5 py-16 md:py-24 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Building2 className="w-4 h-4" /> 500+ Companies Hiring
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Find your dream<br />
            <span className="gradient-text">workplace</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Discover top companies, explore their culture, benefits, and open roles — all in one place.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-2 flex gap-2">
            <div className="flex-1 flex items-center bg-background/50 rounded-xl px-4 border border-white/5">
              <Search className="h-4 w-4 text-muted-foreground mr-3 shrink-0" />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search companies or industries..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-12 text-base"
              />
            </div>
            <Button size="lg" className="h-12 px-6 bg-primary hover:bg-primary/90 text-white rounded-xl">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10 items-center">
          <span className="text-sm text-muted-foreground font-medium">Filter:</span>
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-48 glass bg-background/50 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              {industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger className="w-40 glass bg-background/50 h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass">
              {sizes.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {(search || industry !== "All Industries" || size !== "All Sizes") && (
            <Button variant="ghost" size="sm" className="h-9 text-muted-foreground text-sm" onClick={() => { setSearch(""); setIndustry("All Industries"); setSize("All Sizes"); }}>
              Clear filters
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">{filtered.length} companies</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h2 className="text-xl font-semibold">Featured Companies</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featured.map(company => (
                    <CompanyCard key={company.id} company={company} featured />
                  ))}
                </div>
              </section>
            )}

            {/* All companies */}
            <section>
              {featured.length > 0 && rest.length > 0 && (
                <h2 className="text-xl font-semibold mb-6">All Companies</h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rest.map(company => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </section>

            {filtered.length === 0 && (
              <div className="text-center py-20">
                <Building2 className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters.</p>
                <Button variant="outline" onClick={() => { setSearch(""); setIndustry("All Industries"); setSize("All Sizes"); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CompanyCard({ company, featured }: { company: typeof mockCompanies[0]; featured?: boolean }) {
  return (
    <Card className={`glass-card border-white/5 hover:border-primary/30 transition-all duration-300 group ${featured ? "bg-primary/5 border-primary/20" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <CompanyLogo company={company} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors leading-tight">{company.name}</h3>
              {company.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" title="Verified company" />
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.location}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{company.size}</span>
            </div>
          </div>
        </div>

        <Badge variant="secondary" className="bg-secondary/40 text-secondary-foreground border-white/5 text-xs mb-3">
          {company.industry}
        </Badge>

        <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
          {company.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-primary">
            {(company as any).openRoles ?? 0} open roles
          </span>
          <Button size="sm" variant="ghost" className="group/btn h-8 px-3 hover:bg-primary/10 hover:text-primary" asChild>
            <Link href={`/jobs?company=${company.id}`}>
              View Jobs <ArrowRight className="w-3 h-3 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
