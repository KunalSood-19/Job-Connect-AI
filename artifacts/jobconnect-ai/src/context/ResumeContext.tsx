import { createContext, useContext, useState } from "react";
import { ResumeData } from "@/types/resume";

const defaultResume: ResumeData = {
  personal: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
  },

  summary: "",

  education: [],

  experience: [],

  projects: [],

  skills: [],

  certifications: [],
};

const ResumeContext = createContext<any>(null);

export function ResumeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [resume, setResume] =
    useState<ResumeData>(defaultResume);

  return (
    <ResumeContext.Provider
      value={{
        resume,
        setResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  return useContext(ResumeContext);
}