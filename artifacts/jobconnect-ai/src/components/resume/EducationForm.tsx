import { useResume } from "@/context/ResumeContext";

export default function EducationForm() {
  const { resume, setResume } = useResume();

  const education = resume.education[0] || {
    degree: "",
    college: "",
    startYear: "",
    endYear: "",
    cgpa: "",
  };

  const update = (field: string, value: string) => {
    const updated = {
      ...education,
      [field]: value,
    };

    setResume({
      ...resume,
      education: [updated],
    });
  };

  return (
    <div className="space-y-3 border rounded-xl p-5">

      <h2 className="text-xl font-bold">
        Education
      </h2>

      <input
        placeholder="Degree"
        className="w-full border rounded-lg p-3"
        value={education.degree}
        onChange={(e)=>update("degree",e.target.value)}
      />

      <input
        placeholder="College"
        className="w-full border rounded-lg p-3"
        value={education.college}
        onChange={(e)=>update("college",e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">

        <input
          placeholder="Start Year"
          className="border rounded-lg p-3"
          value={education.startYear}
          onChange={(e)=>update("startYear",e.target.value)}
        />

        <input
          placeholder="End Year"
          className="border rounded-lg p-3"
          value={education.endYear}
          onChange={(e)=>update("endYear",e.target.value)}
        />

      </div>

      <input
        placeholder="CGPA"
        className="w-full border rounded-lg p-3"
        value={education.cgpa}
        onChange={(e)=>update("cgpa",e.target.value)}
      />

    </div>
  );
}