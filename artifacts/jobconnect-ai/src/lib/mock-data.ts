export const mockJobs = [
  {
    id: 1,
    title: "Senior AI Engineer",
    companyId: 101,
    companyName: "Nexus Dynamics",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Nexus+Dynamics&background=6366f1&color=fff",
    location: "San Francisco, CA",
    type: "full-time",
    experienceLevel: "senior",
    salaryMin: 150000,
    salaryMax: 220000,
    skills: ["Python", "PyTorch", "Transformers", "LLMs"],
    isRemote: true,
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicantCount: 45
  },
  {
    id: 2,
    title: "Frontend Architect",
    companyId: 102,
    companyName: "Vercel",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Vercel&background=000&color=fff",
    location: "Remote",
    type: "full-time",
    experienceLevel: "lead",
    salaryMin: 160000,
    salaryMax: 200000,
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    isRemote: true,
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicantCount: 120
  },
  {
    id: 3,
    title: "Machine Learning Intern",
    companyId: 103,
    companyName: "OpenAI",
    companyLogoUrl: "https://ui-avatars.com/api/?name=OpenAI&background=10a37f&color=fff",
    location: "San Francisco, CA",
    type: "internship",
    experienceLevel: "entry",
    salaryMin: 80000,
    salaryMax: 100000,
    skills: ["Python", "Machine Learning", "Data Analysis"],
    isRemote: false,
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicantCount: 300
  },
  {
    id: 4,
    title: "Product Designer",
    companyId: 104,
    companyName: "Stripe",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Stripe&background=635bff&color=fff",
    location: "New York, NY",
    type: "full-time",
    experienceLevel: "mid",
    salaryMin: 130000,
    salaryMax: 170000,
    skills: ["Figma", "UI/UX", "Prototyping", "Design Systems"],
    isRemote: true,
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    applicantCount: 85
  },
  {
    id: 5,
    title: "Data Scientist",
    companyId: 105,
    companyName: "Spotify",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Spotify&background=1db954&color=fff",
    location: "London, UK",
    type: "full-time",
    experienceLevel: "mid",
    salaryMin: 90000,
    salaryMax: 120000,
    skills: ["SQL", "Python", "A/B Testing", "Statistics"],
    isRemote: false,
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    applicantCount: 210
  }
];

export const mockCompanies = [
  {
    id: 101,
    name: "Nexus Dynamics",
    logoUrl: "https://ui-avatars.com/api/?name=Nexus+Dynamics&background=6366f1&color=fff",
    industry: "Artificial Intelligence",
    size: "50-200",
    location: "San Francisco, CA",
    openPositions: 12,
    isVerified: true
  },
  {
    id: 102,
    name: "Vercel",
    logoUrl: "https://ui-avatars.com/api/?name=Vercel&background=000&color=fff",
    industry: "Developer Tools",
    size: "201-500",
    location: "Remote",
    openPositions: 8,
    isVerified: true
  },
  {
    id: 103,
    name: "OpenAI",
    logoUrl: "https://ui-avatars.com/api/?name=OpenAI&background=10a37f&color=fff",
    industry: "Artificial Intelligence",
    size: "501-1000",
    location: "San Francisco, CA",
    openPositions: 45,
    isVerified: true
  },
  {
    id: 104,
    name: "Stripe",
    logoUrl: "https://ui-avatars.com/api/?name=Stripe&background=635bff&color=fff",
    industry: "Financial Services",
    size: "1001-5000",
    location: "San Francisco, CA",
    openPositions: 120,
    isVerified: true
  }
];

export const formatSalary = (min?: number | null, max?: number | null) => {
  if (!min && !max) return "Competitive";
  if (min && !max) return `$${(min / 1000).toFixed(0)}k+`;
  if (!min && max) return `Up to $${(max / 1000).toFixed(0)}k`;
  return `$${((min || 0) / 1000).toFixed(0)}k - $${((max || 0) / 1000).toFixed(0)}k`;
};

export const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};