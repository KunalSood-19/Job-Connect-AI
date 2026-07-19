import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { getCompany } from "@/api/companies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Globe, Users, Briefcase, ExternalLink, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CompanyDetailPage() {
  const [, params] = useRoute("/companies/:id");
  const companyId = params?.id || "";

  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await getCompany(companyId);
        setCompany(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (companyId) {
      fetchCompany();
    }
  }, [companyId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse space-y-8 max-w-5xl">
        <div className="h-8 w-24 bg-white/5 rounded-md mb-8"></div>
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-white/5 rounded-2xl"></div>
          <div className="flex-1 space-y-4">
            <div className="h-10 w-2/3 bg-white/5 rounded-lg"></div>
            <div className="h-6 w-1/2 bg-white/5 rounded-lg"></div>
          </div>
        </div>
        <div className="h-[400px] bg-white/5 rounded-xl mt-8"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Company Not Found</h2>
        <p className="text-muted-foreground mb-8">The company you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/companies">Browse Companies</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card/50 border-b border-white/5 py-10 relative">
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Button variant="ghost" size="sm" asChild className="mb-6 -ml-3 text-muted-foreground hover:text-foreground">
            <Link href="/companies">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to companies
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg border border-white/10 p-2">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full rounded object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{company.name}</h1>
              </div>
              <div className="flex flex-wrap items-center text-muted-foreground text-base gap-y-2 gap-x-5">
                {company.industry && (
                  <span className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-1.5" /> {company.industry}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1.5" /> {company.location}
                  </span>
                )}
                {company.size && (
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" /> {company.size} employees
                  </span>
                )}
              </div>
            </div>

            {company.website && (
              <Button asChild variant="outline" className="glass gap-2 h-12 shrink-0">
                <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4" /> Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">About {company.name}</h2>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {company.description || "No description provided."}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Card className="glass-card">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Open Roles
                <Badge className="bg-primary/10 text-primary border-primary/20 ml-auto">
                  {company.jobs?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {company.jobs && company.jobs.length > 0 ? (
                company.jobs.map((job: any) => (
                  <div key={job.id} className="p-4 rounded-xl border border-white/5 bg-background/50 hover:border-primary/30 transition-colors group">
                    <Link href={`/jobs/${job.id}`} className="block">
                      <h4 className="font-semibold group-hover:text-primary transition-colors">{job.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <MapPin className="w-3 h-3" /> {job.location || "Remote"}
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No open roles currently available.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
