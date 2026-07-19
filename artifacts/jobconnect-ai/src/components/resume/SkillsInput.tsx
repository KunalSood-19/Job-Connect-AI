import { useResume } from "@/context/ResumeContext";

export default function SkillsInput() {

  const { resume, setResume } = useResume();

  return (
    <div className="space-y-3 border rounded-xl p-5">

      <h2 className="text-xl font-bold">
        Skills
      </h2>

      <textarea
        rows={4}
        className="w-full border rounded-lg p-3"
        placeholder="Java, React, Node.js, Prisma..."
        value={resume.skills.join(", ")}
        onChange={(e)=>
          setResume({
            ...resume,
            skills:e.target.value
              .split(",")
              .map(s=>s.trim())
              .filter(Boolean)
          })
        }
      />

    </div>
  );
}