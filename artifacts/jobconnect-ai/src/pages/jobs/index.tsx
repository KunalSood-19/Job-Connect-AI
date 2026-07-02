import { useGetMe, useListJobs } from "@workspace/api-client-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Building, DollarSign, Clock, Filter, SlidersHorizontal, Loader2 } from "lucide-react";
import { formatSalary, timeAgo, mockJobs } from "@/lib/mock-data";
import { useDebounce } from "@/lib/utils-hooks";

export function JobsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [location, setLocationQuery] = useState("");
  const debouncedLocation = useDebounce(location, 500);
  const [type, setType] = useState<string>("all");
  
  const { data: jobsResponse, isLoading } = useListJobs({ 
    q: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    type: type !== "all" ? type : undefined,
    limit: 20
  });

  const displayJobs = jobsResponse?.jobs?.length ? jobsResponse.jobs : mockJobs;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card/50 border-b border-white/5 py-8 md:py-12 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Find your next role</h1>
          
          <div className="glass-card p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-5xl">
            <div className="relative flex-1 flex items-center bg-background/50 rounded-xl px-4 py-2 border border-white/5">
              <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, skills, or company..." 
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-base"
              />
            </div>
            <div className="relative flex-1 flex items-center bg-background/50 rounded-xl px-4 py-2 border border-white/5">
              <MapPin className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
              <Input 
                value={location}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="City, state, or remote..." 
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-base"
              />
            </div>
            <Button size="lg" className="h-14 rounded-xl px-8 bg-primary hover:bg-primary/90 text-white font-medium text-lg w-full md:w-auto">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-6 md:sticky md:top-24">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</h2>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-8">Clear all</Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Job Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="glass bg-background/50">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
              <Select defaultValue="all">
                <SelectTrigger className="glass bg-background/50">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent className="glass">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead/Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-background/50 text-primary focus:ring-primary/50 w-4 h-4" />
                <span className="text-sm font-medium">Remote Only</span>
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-background/50 text-primary focus:ring-primary/50 w-4 h-4" />
                <span className="text-sm font-medium">Under 100 applicants</span>
              </label>
            </div>
          </div>
          
          <Card className="glass-card border-primary/20 bg-primary/5 mt-8">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2 text-sm flex items-center"><SlidersHorizontal className="w-4 h-4 mr-2" /> AI Match View</h3>
              <p className="text-xs text-muted-foreground mb-3">Sign in to sort these jobs by your personal AI match score.</p>
              <Button size="sm" variant="outline" className="w-full text-xs" asChild>
                <Link href="/auth/login">Sign in for AI matching</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results List */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-muted-foreground text-sm">
              Showing <span className="font-medium text-foreground">{displayJobs.length}</span> results
            </p>
            <Select defaultValue="relevant">
              <SelectTrigger className="w-[140px] h-8 text-xs glass bg-background/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="relevant">Most Relevant</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : displayJobs.length === 0 ? (
            <Card className="glass-card py-16 text-center">
              <CardContent>
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
                  We couldn't find any jobs matching your current filters. Try adjusting your search criteria.
                </p>
                <Button variant="outline" onClick={() => { setSearch(""); setLocationQuery(""); setType("all"); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {displayJobs.map((job) => (
                <Card key={job.id} className="glass-card border-white/5 hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Logo */}
                      <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-white/10">
                        {job.companyLogoUrl ? (
                          <img src={job.companyLogoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                        ) : (
                          <Building className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${job.id}`} className="inline-block group-hover:text-primary transition-colors">
                          <h3 className="text-xl font-semibold mb-1 truncate">{job.title}</h3>
                        </Link>
                        <div className="flex flex-wrap items-center text-muted-foreground text-sm gap-y-1 gap-x-3 mb-3">
                          <span className="font-medium text-foreground/80 flex items-center"><Building className="w-3 h-3 mr-1" />{job.companyName}</span>
                          <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {job.location}</span>
                          <span className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> {formatSalary(job.salaryMin, job.salaryMax)}</span>
                          <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {timeAgo(job.postedAt)}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.isRemote && (
                            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-normal">
                              Remote
                            </Badge>
                          )}
                          <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground border-white/5 font-normal capitalize">
                            {job.type}
                          </Badge>
                          {job.skills?.slice(0, 3).map(skill => (
                            <Badge key={skill} variant="outline" className="bg-background/50 border-white/10 font-normal text-muted-foreground">
                              {skill}
                            </Badge>
                          ))}
                          {(job.skills?.length || 0) > 3 && (
                            <span className="text-xs text-muted-foreground flex items-center px-1">
                              +{(job.skills?.length || 0) - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Action */}
                      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 mt-4 md:mt-0 shrink-0">
                        <div className="text-xs text-muted-foreground text-right">
                          <span className="font-medium text-foreground">{job.applicantCount || 0}</span> applicants
                        </div>
                        <Button asChild className="bg-white/10 hover:bg-primary hover:text-white transition-colors border border-white/5">
                          <Link href={`/jobs/${job.id}`}>View Job</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoading && displayJobs.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="glass">Load More Results</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}