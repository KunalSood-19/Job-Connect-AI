import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResumePDF from "@/components/resume/ResumePDF";

import {
  FileText,
  Plus,
  Trash2,
  Download,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}
interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
}
interface Project {
  id: string;
  name: string;
  description: string;
  tech: string;
  url: string;
}

const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    desc: "Clean dark aesthetic",
    preview: "bg-gradient-to-br from-primary/20 to-purple-600/20",
  },
  {
    id: "classic",
    name: "Classic",
    desc: "Traditional layout",
    preview: "bg-gradient-to-br from-slate-500/20 to-slate-700/20",
  },
  {
    id: "minimal",
    name: "Minimal",
    desc: "Distraction-free",
    preview: "bg-gradient-to-br from-zinc-500/20 to-zinc-700/20",
  },
  {
    id: "bold",
    name: "Bold",
    desc: "High-impact design",
    preview: "bg-gradient-to-br from-emerald-500/20 to-teal-700/20",
  },
];

const uid = () => Math.random().toString(36).slice(2, 9);
type SectionProps = {
  id: string;
  icon: any;
  title: string;
  children: React.ReactNode;
  openSection: string;
  setOpenSection: React.Dispatch<React.SetStateAction<string>>;
};

function Section({
  id,
  icon: Icon,
  title,
  children,
  openSection,
  setOpenSection,
}: SectionProps) {
  return (
    <Card className="glass-card border-white/5">
      <button
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors rounded-t-xl"
        onClick={() => setOpenSection(openSection === id ? "" : id)}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>

          <span className="font-semibold">{title}</span>
        </div>

        {openSection === id ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {openSection === id && (
        <CardContent className="pt-0 pb-6 px-5 border-t border-white/5">
          <div className="pt-5">{children}</div>
        </CardContent>
      )}
    </Card>
  );
}
export function ResumeBuilderPage() {
 
  const { toast } = useToast();
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string>("contact");
  console.log("ResumeBuilder Render");
  const [contact, setContact] = useState({
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
  });
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experience, setExperience] = useState<Experience[]>([
    {
      id: uid(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  ]);
  const [education, setEducation] = useState<Education[]>([
    {
      id: uid(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
    },
  ]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [generating, setGenerating] = useState(false);

  const addExp = () =>
    setExperience((e) => [
      ...e,
      {
        id: uid(),
        title: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ]);
  const removeExp = (id: string) =>
    setExperience((e) => e.filter((x) => x.id !== id));
  const updateExp = (id: string, field: keyof Experience, value: any) =>
    setExperience((e) =>
      e.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );

  const addEdu = () =>
    setEducation((e) => [
      ...e,
      {
        id: uid(),
        degree: "",
        school: "",
        location: "",
        startDate: "",
        endDate: "",
        gpa: "",
      },
    ]);
  const removeEdu = (id: string) =>
    setEducation((e) => e.filter((x) => x.id !== id));
  const updateEdu = (id: string, field: keyof Education, value: string) =>
    setEducation((e) =>
      e.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );

  const addProject = () =>
    setProjects((p) => [
      ...p,
      { id: uid(), name: "", description: "", tech: "", url: "" },
    ]);
  const removeProject = (id: string) =>
    setProjects((p) => p.filter((x) => x.id !== id));
  const updateProject = (id: string, field: keyof Project, value: string) =>
    setProjects((p) =>
      p.map((x) => (x.id === id ? { ...x, [field]: value } : x)),
    );

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((sk) => [...sk, s]);
      setSkillInput("");
    }
  };
  const removeSkill = (s: string) =>
    setSkills((sk) => sk.filter((x) => x !== s));

  const handleAISummary = () => {
    if (!contact.title) {
      toast({ title: "Enter your job title first", variant: "destructive" });
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setSummary(
        `Results-driven ${contact.title} with a passion for building impactful solutions. ${skills.length > 0 ? `Proficient in ${skills.slice(0, 4).join(", ")}.` : ""} Committed to delivering high-quality work through collaboration, clear communication, and continuous learning. Seeking opportunities to leverage technical expertise to create meaningful products that scale.`,
      );
      setGenerating(false);
      toast({
        title: "Summary generated!",
        description: "AI crafted a professional summary for you.",
      });
    }, 1800);
  };


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/5 bg-card/30 sticky top-16 z-30">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <FileText className="w-5 h-5 text-primary" /> */}
            {/* <span className="font-semibold">Resume Builder</span> */}
            {/* <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
              Beta
            </Badge> */}
          </div>
          <div className="flex items-center gap-2">
  <Button
    variant="ghost"
    size="sm"
    className="gap-1.5 text-sm"
    onClick={() => setPreviewOpen((v) => !v)}
  >
    <Eye className="w-4 h-4" />
    {previewOpen ? "Hide Preview" : "Preview"}
  </Button>

 <PDFDownloadLink
  document={
    <ResumePDF
      contact={contact}
      summary={summary}
      skills={skills}
      experience={experience}
      education={education}
      projects={projects}
      template={activeTemplate}
    />
  }
  fileName={`${contact.name || "Resume"}.pdf`}
>
  {({ loading }) => (
    <Button
      size="sm"
      className="gap-2 bg-primary text-white"
    >
      <Download className="w-4 h-4" />
      {loading ? "Generating..." : "Export"}
    </Button>
  )}
</PDFDownloadLink>
</div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div
          className={`grid gap-8 ${previewOpen ? "lg:grid-cols-2" : "max-w-3xl mx-auto"}`}
        >
          {/* Editor */}
          <div className="space-y-4">
            {/* Templates */}
            <div className="space-y-3">
              {/* <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Template
              </h2> */}
              <div className="grid grid-cols-4 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    className={`rounded-xl p-3 text-left border-2 transition-all ${activeTemplate === t.id ? "border-primary" : "border-white/5 hover:border-white/20"}`}
                  >
                    <div className={`h-12 rounded-lg mb-2 ${t.preview}`} />
                    <p className="text-xs font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-white/5" />

            {/* Contact */}
            <Section
              id="contact"
              icon={User}
              title="Contact Information"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "name",
                    label: "Full Name",
                    placeholder: "John Doe",
                    icon: User,
                  },
                  {
                    key: "title",
                    label: "Job Title",
                    placeholder: "Senior Software Engineer",
                    icon: Briefcase,
                  },
                  {
                    key: "email",
                    label: "Email",
                    placeholder: "john@example.com",
                    icon: Mail,
                  },
                  {
                    key: "phone",
                    label: "Phone",
                    placeholder: "+1 (555) 000-0000",
                    icon: Phone,
                  },
                  {
                    key: "location",
                    label: "Location",
                    placeholder: "San Francisco, CA",
                    icon: MapPin,
                  },
                  {
                    key: "website",
                    label: "Website",
                    placeholder: "https://johndoe.dev",
                    icon: Globe,
                  },
                  {
                    key: "linkedin",
                    label: "LinkedIn",
                    placeholder: "linkedin.com/in/johndoe",
                    icon: Linkedin,
                  },
                  {
                    key: "github",
                    label: "GitHub",
                    placeholder: "github.com/johndoe",
                    icon: Github,
                  },
                ].map((f) => (
                  <div key={f.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      {f.label}
                    </label>
                    <Input
                      placeholder={f.placeholder}
                      value={(contact as any)[f.key]}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, [f.key]: e.target.value }))
                      }
                      className="h-9 bg-background/50 border-white/10 text-sm"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Summary */}
            <Section
              id="summary"
              icon={Sparkles}
              title="Professional Summary"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a compelling 2-3 sentence summary that highlights your expertise, key skills, and career goals..."
                className="min-h-[120px] bg-background/50 border-white/10 text-sm mb-3 resize-none"
              />
              <Button
                size="sm"
                variant="outline"
                className="gap-2 glass border-primary/20 text-primary hover:bg-primary/10"
                onClick={handleAISummary}
                disabled={generating}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {generating ? "Generating..." : "Generate with AI"}
              </Button>
            </Section>

            {/* Experience */}
            <Section
              id="experience"
              icon={Briefcase}
              title="Work Experience"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <div className="space-y-6">
                {experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className="relative rounded-xl border border-white/5 bg-background/30 p-4 space-y-3"
                  >
                    {experience.length > 1 && (
                      <button
                        onClick={() => removeExp(exp.id)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Position {idx + 1}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Job Title
                        </label>
                        <Input
                          value={exp.title}
                          onChange={(e) =>
                            updateExp(exp.id, "title", e.target.value)
                          }
                          placeholder="Software Engineer"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Company
                        </label>
                        <Input
                          value={exp.company}
                          onChange={(e) =>
                            updateExp(exp.id, "company", e.target.value)
                          }
                          placeholder="Acme Corp"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Location
                        </label>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            updateExp(exp.id, "location", e.target.value)
                          }
                          placeholder="San Francisco, CA"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">
                            Start
                          </label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) =>
                              updateExp(exp.id, "startDate", e.target.value)
                            }
                            className="h-9 bg-background/50 border-white/10 text-sm"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs text-muted-foreground">
                            End
                          </label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) =>
                              updateExp(exp.id, "endDate", e.target.value)
                            }
                            disabled={exp.current}
                            placeholder="Present"
                            className="h-9 bg-background/50 border-white/10 text-sm disabled:opacity-40"
                          />
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.current}
                        onChange={(e) =>
                          updateExp(exp.id, "current", e.target.checked)
                        }
                        className="rounded border-white/20 bg-background/50 text-primary w-4 h-4"
                      />
                      <span className="text-muted-foreground">
                        Currently working here
                      </span>
                    </label>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        Responsibilities & Achievements
                      </label>
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExp(exp.id, "description", e.target.value)
                        }
                        placeholder="• Led a team of 5 engineers to deliver a new payment system, reducing processing time by 40%&#10;• Built scalable REST APIs serving 2M+ requests/day"
                        className="min-h-[100px] bg-background/50 border-white/10 text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addExp}
                  className="w-full glass gap-2 border-dashed border-white/10 hover:border-primary/30"
                >
                  <Plus className="w-4 h-4" /> Add Position
                </Button>
              </div>
            </Section>

            {/* Education */}
            <Section
              id="education"
              icon={GraduationCap}
              title="Education"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div
                    key={edu.id}
                    className="relative rounded-xl border border-white/5 bg-background/30 p-4 space-y-3"
                  >
                    {education.length > 1 && (
                      <button
                        onClick={() => removeEdu(edu.id)}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Degree {idx + 1}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Degree & Major
                        </label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            updateEdu(edu.id, "degree", e.target.value)
                          }
                          placeholder="B.S. Computer Science"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          School
                        </label>
                        <Input
                          value={edu.school}
                          onChange={(e) =>
                            updateEdu(edu.id, "school", e.target.value)
                          }
                          placeholder="University of California"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Location
                        </label>
                        <Input
                          value={edu.location}
                          onChange={(e) =>
                            updateEdu(edu.id, "location", e.target.value)
                          }
                          placeholder="Berkeley, CA"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          GPA (optional)
                        </label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) =>
                            updateEdu(edu.id, "gpa", e.target.value)
                          }
                          placeholder="3.8 / 4.0"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Start Year
                        </label>
                        <Input
                          type="month"
                          value={edu.startDate}
                          onChange={(e) =>
                            updateEdu(edu.id, "startDate", e.target.value)
                          }
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          End Year
                        </label>
                        <Input
                          type="month"
                          value={edu.endDate}
                          onChange={(e) =>
                            updateEdu(edu.id, "endDate", e.target.value)
                          }
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEdu}
                  className="w-full glass gap-2 border-dashed border-white/10 hover:border-primary/30"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </Button>
              </div>
            </Section>

            {/* Skills */}
            <Section
              id="skills"
              icon={Wrench}
              title="Skills"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="e.g. React, TypeScript, Node.js..."
                    className="h-9 bg-background/50 border-white/10 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={addSkill}
                    variant="outline"
                    className="glass shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <span
                        key={s}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary/10 border border-primary/20 text-primary"
                      >
                        {s}
                        <button
                          onClick={() => removeSkill(s)}
                          className="hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-muted-foreground w-full">
                    Quick add:
                  </p>
                  {[
                    "JavaScript",
                    "TypeScript",
                    "React",
                    "Node.js",
                    "Python",
                    "AWS",
                    "Docker",
                    "PostgreSQL",
                    "Git",
                  ]
                    .filter((s) => !skills.includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => setSkills((sk) => [...sk, s])}
                        className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-muted-foreground hover:border-primary/30 hover:text-primary transition-colors"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </Section>

            {/* Projects */}
            <Section
              id="projects"
              icon={Award}
              title="Projects"
              openSection={openSection}
              setOpenSection={setOpenSection}
            >
              <div className="space-y-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="relative rounded-xl border border-white/5 bg-background/30 p-4 space-y-3"
                  >
                    <button
                      onClick={() => removeProject(p.id)}
                      className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Project Name
                        </label>
                        <Input
                          value={p.name}
                          onChange={(e) =>
                            updateProject(p.id, "name", e.target.value)
                          }
                          placeholder="My Awesome Project"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground">
                          Tech Stack
                        </label>
                        <Input
                          value={p.tech}
                          onChange={(e) =>
                            updateProject(p.id, "tech", e.target.value)
                          }
                          placeholder="React, Node.js, PostgreSQL"
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs text-muted-foreground">
                          Live URL / GitHub
                        </label>
                        <Input
                          value={p.url}
                          onChange={(e) =>
                            updateProject(p.id, "url", e.target.value)
                          }
                          placeholder="https://github.com/..."
                          className="h-9 bg-background/50 border-white/10 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-muted-foreground">
                        Description
                      </label>
                      <Textarea
                        value={p.description}
                        onChange={(e) =>
                          updateProject(p.id, "description", e.target.value)
                        }
                        placeholder="Built a full-stack app that solves X problem for Y users, resulting in Z impact..."
                        className="min-h-[80px] bg-background/50 border-white/10 text-sm resize-none"
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addProject}
                  className="w-full glass gap-2 border-dashed border-white/10 hover:border-primary/30"
                >
                  <Plus className="w-4 h-4" /> Add Project
                </Button>
              </div>
            </Section>
          </div>

          {/* Live Preview */}
          {previewOpen && (
            <div className="lg:sticky lg:top-28 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                  Live Preview
                </h2>
                <Button
                  size="sm"
                  
                  className="gap-1.5 bg-primary text-white text-xs h-7 px-3"
                >
                  <Download className="w-3 h-3" /> Export
                </Button>
              </div>
<div
  id="resume-preview"
            
  className="bg-white text-black p-8"
>
                <ResumePreview
                  contact={contact}
                  summary={summary}
                  skills={skills}
                  experience={experience}
                  education={education}
                  projects={projects}
                  template={activeTemplate}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResumePreview({
  contact,
  summary,
  skills,
  experience,
  education,
  projects,
  template,
}: any) {
  const accentColor =
    template === "bold"
      ? "#10b981"
      : template === "classic"
        ? "#475569"
        : template === "minimal"
          ? "#71717a"
          : "#7c3aed";

  return (
    <div className="p-8 font-sans leading-relaxed">
      {/* Header */}
      <div
        className="mb-5 pb-4"
        style={{ borderBottom: `3px solid ${accentColor}` }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
          {contact.name || "Your Name"}
        </h1>
        <p className="text-sm font-medium mb-2" style={{ color: accentColor }}>
          {contact.title || "Your Title"}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {contact.email && <span>{contact.email}</span>}
          {contact.phone && <span>{contact.phone}</span>}
          {contact.location && <span>{contact.location}</span>}
          {contact.linkedin && <span>{contact.linkedin}</span>}
          {contact.github && <span>{contact.github}</span>}
        </div>
      </div>

      {/* Summary */}
      {/* Summary */}
{summary && (
  <section className="mb-5">
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-2"
      style={{ color: accentColor }}
    >
      Summary
    </h2>

    <p
      style={{
        color: "#444444",
        lineHeight: "1.7",
        fontSize: "12px",
      }}
    >
      {summary}
    </p>
  </section>
)}

{/* Skills */}
{skills.length > 0 && (
  <section className="mb-5">
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-2"
      style={{ color: accentColor }}
    >
      Skills
    </h2>

    <p
      style={{
        color: "#444444",
        fontSize: "12px",
        lineHeight: "1.6",
      }}
    >
      {skills.join(" • ")}
    </p>
  </section>
)}

{/* Experience */}
{experience.some((e: Experience) => e.title) && (
  <section className="mb-5">
    <h2
      className="text-xs font-bold uppercase tracking-widest mb-3"
      style={{ color: accentColor }}
    >
      Experience
    </h2>

    {experience
      .filter((e: Experience) => e.title)
      .map((exp: Experience) => (
        <div key={exp.id} className="mb-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  color: "#111111",
                  fontWeight: 600,
                  fontSize: "13px",
                }}
              >
                {exp.title}
              </p>

              <p
                style={{
                  color: "#555555",
                  fontSize: "12px",
                }}
              >
                {exp.company}
                {exp.location ? ` • ${exp.location}` : ""}
              </p>
            </div>

            <p
              style={{
                color: "#777777",
                fontSize: "11px",
              }}
            >
              {exp.startDate} – {exp.current ? "Present" : exp.endDate}
            </p>
          </div>

          {exp.description && (
            <div
              style={{
                color: "#444444",
                whiteSpace: "pre-line",
                marginTop: "6px",
                fontSize: "12px",
                lineHeight: "1.6",
              }}
            >
              {exp.description}
            </div>
          )}
        </div>
      ))}
  </section>
)}

      {/* Education */}
      {education.some((e: Education) => e.degree) && (
        <section className="mb-5">
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            Education
          </h2>
          {education
            .filter((e: Education) => e.degree)
            .map((edu: Education) => (
              <div key={edu.id} className="mb-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{edu.degree}</p>
                    <p className="text-gray-600">
                      {edu.school}
                      {edu.location ? ` · ${edu.location}` : ""}
                    </p>
                  </div>
                  <p className="text-gray-400">
                    {edu.startDate} – {edu.endDate}
                  </p>
                </div>
                {edu.gpa && <p className="text-gray-500">GPA: {edu.gpa}</p>}
              </div>
            ))}
        </section>
      )}

      {/* Projects */}
      {projects.some((p: Project) => p.name) && (
        <section>
          <h2
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            Projects
          </h2>
          {projects
            .filter((p: Project) => p.name)
            .map((proj: Project) => (
              <div key={proj.id} className="mb-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-gray-900">{proj.name}</p>
                  {proj.tech && <p className="text-gray-400">{proj.tech}</p>}
                </div>
                {proj.description && (
                  <p className="text-gray-600">{proj.description}</p>
                )}
                {proj.url && <p style={{ color: accentColor }}>{proj.url}</p>}
              </div>
            ))}
        </section>
      )}
    </div>
  );
}
