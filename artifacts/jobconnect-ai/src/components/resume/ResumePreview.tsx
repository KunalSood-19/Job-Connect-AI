import { useResume } from "@/context/ResumeContext";
import {
  Education,
  Project,
} from "@/types/resume";
export default function ResumePreview() {
  const { resume } = useResume();

  return (
    <div className="bg-white text-black shadow-xl rounded-xl p-10 min-h-[1000px]">

      {/* Header */}

      <div className="text-center">

        <h1 className="text-4xl font-bold">
          {resume.personal.name || "Your Name"}
        </h1>

        <p className="mt-2 text-gray-700">
          {resume.personal.email}
        </p>

        <p className="text-gray-700">
          {resume.personal.phone}
        </p>

        <p className="text-gray-700">
          {resume.personal.location}
        </p>

      </div>

      <hr className="my-6"/>

      {/* Summary */}

      <h2 className="text-xl font-bold border-b pb-1">
        Professional Summary
      </h2>

      <p className="mt-3 leading-7">
        {resume.summary}
      </p>

      {/* Education */}

      <div className="mt-8">

        <h2 className="text-xl font-bold border-b pb-1">
          Education
        </h2>

        {resume.education.map((edu: Education, index: number) => (
          <div key={index} className="mt-3">

            <h3 className="font-semibold">
              {edu.degree}
            </h3>

            <p>
              {edu.college}
            </p>

            <p className="text-sm text-gray-600">
              {edu.startYear} - {edu.endYear}
            </p>

            <p>
              CGPA : {edu.cgpa}
            </p>

          </div>
        ))}

      </div>

      {/* Skills */}

      <div className="mt-8">

        <h2 className="text-xl font-bold border-b pb-1">
          Skills
        </h2>

        <div className="flex flex-wrap gap-2 mt-3">

          {resume.skills.map((skill: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-200 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      {/* Projects */}

      <div className="mt-8">

        <h2 className="text-xl font-bold border-b pb-1">
          Projects
        </h2>

        {resume.projects.map((project: Project, index: number) => (
          <div key={index} className="mt-5">

            <h3 className="font-semibold text-lg">
              {project.title}
            </h3>

            <p className="mt-1">
              {project.description}
            </p>

            {project.github && (
              <p className="text-blue-600">
                GitHub : {project.github}
              </p>
            )}

            {project.demo && (
              <p className="text-blue-600">
                Live : {project.demo}
              </p>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}