import { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { generateSummary } from "@/api/aiResume";
import EducationForm from "./EducationForm";
import SkillsInput from "./SkillsInput";
import ProjectsForm from "./ProjectsForm";

export default function ResumeForm() {
  const { resume, setResume } = useResume();
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    try {
      setLoading(true);

      const res = await generateSummary({
        name: resume.personal.name,
        degree: resume.education?.[0]?.degree || "",
        skills: resume.skills || [],
        projects:
          resume.projects?.map((project: any) => project.title) || [],
      });

      setResume({
        ...resume,
        summary: res.summary,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI summary.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="space-y-6 rounded-xl border p-6 bg-white dark:bg-slate-900">

    <h2 className="text-2xl font-bold">
      Resume Builder
    </h2>

    {/* ================= PERSONAL INFO ================= */}

    <input
      className="w-full border rounded-lg p-3"
      placeholder="Full Name"
      value={resume.personal.name}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            name: e.target.value,
          },
        })
      }
    />

    <input
      className="w-full border rounded-lg p-3"
      placeholder="Email"
      value={resume.personal.email}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            email: e.target.value,
          },
        })
      }
    />

    <input
      className="w-full border rounded-lg p-3"
      placeholder="Phone Number"
      value={resume.personal.phone}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            phone: e.target.value,
          },
        })
      }
    />

    <input
      className="w-full border rounded-lg p-3"
      placeholder="Location"
      value={resume.personal.location}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            location: e.target.value,
          },
        })
      }
    />

    <input
      className="w-full border rounded-lg p-3"
      placeholder="LinkedIn URL"
      value={resume.personal.linkedin}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            linkedin: e.target.value,
          },
        })
      }
    />

    <input
      className="w-full border rounded-lg p-3"
      placeholder="GitHub URL"
      value={resume.personal.github}
      onChange={(e) =>
        setResume({
          ...resume,
          personal: {
            ...resume.personal,
            github: e.target.value,
          },
        })
      }
    />

    {/* ================= SUMMARY ================= */}

    <div>

      <h2 className="text-xl font-semibold mb-3">
        Professional Summary
      </h2>

      <textarea
        rows={6}
        className="w-full border rounded-lg p-3"
        placeholder="Write your professional summary..."
        value={resume.summary}
        onChange={(e) =>
          setResume({
            ...resume,
            summary: e.target.value,
          })
        }
      />

      <button
        onClick={handleGenerateSummary}
        disabled={loading}
        className="mt-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white rounded-lg px-5 py-2"
      >
        {loading ? "Generating..." : "✨ Generate AI Summary"}
      </button>

    </div>

    {/* ================= EDUCATION ================= */}

    <EducationForm />

    {/* ================= SKILLS ================= */}

    <SkillsInput />

    {/* ================= PROJECTS ================= */}

    <ProjectsForm />

  </div>
);
}