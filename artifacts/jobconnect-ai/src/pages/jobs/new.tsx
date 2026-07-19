import { useState, useEffect } from "react";
import { getMe } from "@/api/auth";
import { useLocation } from "wouter";
import { useCreateJob, useGetMe } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Briefcase, Sparkles, Building2 } from "lucide-react";
import { Link } from "wouter";
export function PostJobPage() {

  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  const { mutateAsync: createJob, isPending: submitting } = useCreateJob();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
console.log("USER =", user);
console.log("USER.USER =", (user as any)?.user);
console.log("RECRUITER =", (user as any)?.user?.recruiter);
console.log("COMPANY ID =", (user as any)?.user?.recruiter?.companyId);
  // Force refetch on mount to bypass React Query cache
 useEffect(() => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    setUserLoading(false);
    return;
  }

  getMe(token)
    .then((data) => {
      console.log("DATA:", data);
      setUser(data);
      setUserLoading(false);
    })
    .catch((err) => {
      console.error(err);
      setUserLoading(false);
    });
}, []);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [remote, setRemote] = useState(false);
  const [salary, setSalary] = useState("");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState("JUNIOR");
  const [skills, setSkills] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");

const recruiterProfile =
  (user as any)?.user?.recruiter ??
  (user as any)?.recruiter ??
  (user as any)?.data?.user?.recruiter ??
  (user as any)?.data?.recruiter;

console.log(user);
console.log(recruiterProfile);
  const companyId = recruiterProfile?.companyId;

  console.log("[DEBUG] PostJobPage Auth State:", {
    rawUserResponse: user,
    recruiterProfile,
    companyId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!companyId) {
      toast({
        title: "Error",
        description: "Please complete your recruiter profile and register a company first.",
        variant: "destructive",
      });
      return;
    }

    if (!title || !description || !locationVal) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Job Title, Description, and Location).",
        variant: "destructive",
      });
      return;
    }

    if (description.length < 20) {
      toast({
        title: "Validation Error",
        description: "Description must be at least 20 characters.",
        variant: "destructive",
      });
      return;
    }

    try {
      const skillsArray = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const jobData = {
        title,
        description,
        location: locationVal,
        remote,
        salary: salary ? parseInt(salary) : undefined,
        employmentType: employmentType as any,
        experienceLevel: experienceLevel as any,
        companyId: companyId as any, // Cast to avoid TS number/string mismatch from orval spec
        skills: skillsArray,
        requirements: requirements || undefined,
        benefits: benefits || undefined,
      };

      await createJob({ data: jobData as any });

      toast({
        title: "Success",
        description: "Job posted successfully!",
      });

      setLocation("/dashboard/recruiter");
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Failed to post job",
        description: err.message || "An error occurred while creating the job.",
        variant: "destructive",
      });
    }
  };

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If recruiter doesn't have a company profile setup
  if (!companyId) {
    return (
      <div className="container max-w-2xl py-12">
        <Card className="glass-card border-yellow-500/20 bg-yellow-500/5 text-center p-8">
          <CardHeader className="flex flex-col items-center">
            <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500 mb-4">
              <Building2 className="w-12 h-12" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Company Not Found</CardTitle>
            <CardDescription className="text-muted-foreground mt-2 max-w-md mx-auto">
              Before you can post jobs, you must set up your recruiter profile and create your company profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-4">
            <Button asChild className="bg-primary text-white">
              <Link href="/profile">Go to Profile Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 px-4 sm:px-6">
      {/* Back link */}
      <div className="mb-6">
        <Link href="/dashboard/recruiter" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Recruiter Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
          <Briefcase className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Post a New Job
          </h1>
          <p className="text-muted-foreground mt-1">
            Reach top talent by creating a detailed job posting.
          </p>
        </div>
      </div>

      <Card className="glass-card shadow-2xl relative overflow-hidden border border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold flex items-center gap-1.5">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. Senior Full Stack Engineer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-slate-900/50 border-white/10 focus:border-primary/50 text-white placeholder-slate-500 rounded-lg"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Description <span className="text-red-500">*</span> (Min 20 chars)
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the job role, team, and day-to-day responsibilities..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="bg-slate-900/50 border-white/10 focus:border-primary/50 text-white placeholder-slate-500 rounded-lg resize-y"
                required
              />
            </div>

            {/* Grid 2 Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Noida, India or Remote"
                  value={locationVal}
                  onChange={(e) => setLocationVal(e.target.value)}
                  className="bg-slate-900/50 border-white/10 text-white placeholder-slate-500"
                  required
                />
              </div>

              {/* Salary */}
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-semibold">
                  Annual CTC (INR)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g. 1200000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="bg-slate-900/50 border-white/10 text-white placeholder-slate-500"
                />
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <Label htmlFor="employmentType" className="text-sm font-semibold">
                  Employment Type
                </Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white">
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div className="space-y-2">
                <Label htmlFor="experienceLevel" className="text-sm font-semibold">
                  Experience Level
                </Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="bg-slate-900/50 border-white/10 text-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white">
                    <SelectItem value="FRESHER">Fresher</SelectItem>
                    <SelectItem value="JUNIOR">Junior (1-3 yrs)</SelectItem>
                    <SelectItem value="MID">Mid Level (3-5 yrs)</SelectItem>
                    <SelectItem value="SENIOR">Senior (5+ yrs)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>

            {/* Remote and Switch */}
            <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-xl border border-white/5">
              <div className="space-y-0.5">
                <Label htmlFor="remote" className="text-sm font-semibold cursor-pointer">
                  Remote Eligible
                </Label>
                <p className="text-xs text-muted-foreground">
                  Can this role be performed fully or partially from remote locations?
                </p>
              </div>
              <Switch
                id="remote"
                checked={remote}
                onCheckedChange={setRemote}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills" className="text-sm font-semibold flex items-center gap-1">
                Required Skills <Sparkles className="w-3.5 h-3.5 text-primary" />
              </Label>
              <Input
                id="skills"
                placeholder="e.g. React, Node.js, TypeScript (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="bg-slate-900/50 border-white/10 text-white placeholder-slate-500"
              />
              <p className="text-xs text-muted-foreground">
                Enter skills separated by commas.
              </p>
            </div>

            {/* Requirements (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-sm font-semibold">
                Requirements (Optional)
              </Label>
              <Textarea
                id="requirements"
                placeholder="Mention specific qualifications, degrees or tools experience..."
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
                className="bg-slate-900/50 border-white/10 text-white placeholder-slate-500"
              />
            </div>

            {/* Benefits (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="benefits" className="text-sm font-semibold">
                Benefits & Perks (Optional)
              </Label>
              <Textarea
                id="benefits"
                placeholder="e.g. Health insurance, flexible hours, learning budget..."
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                rows={3}
                className="bg-slate-900/50 border-white/10 text-white placeholder-slate-500"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLocation("/dashboard/recruiter")}
                className="text-slate-400 hover:text-white"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 px-8 flex items-center gap-2"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Post Job Listing"
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
