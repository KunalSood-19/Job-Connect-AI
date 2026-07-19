export interface Education {
  degree: string;
  college: string;
  startYear: string;
  endYear: string;
  cgpa: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  github: string;
  demo: string;
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };

  summary: string;

  education: Education[];

  experience: Experience[];

  projects: Project[];

  skills: string[];

  certifications: string[];
}