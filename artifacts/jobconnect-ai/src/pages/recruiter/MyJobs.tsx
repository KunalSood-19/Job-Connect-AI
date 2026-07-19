import { useEffect, useState } from "react";
import { getMyJobs } from "@/api/recruiter";

export default function MyJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const res = await getMyJobs();
      setJobs(res.jobs);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto py-8">

      <h1 className="text-3xl font-bold mb-8">
        My Posted Jobs
      </h1>

      <div className="space-y-4">

        {jobs.map((job) => (

          <div
            key={job.id}
            className="border rounded-lg p-5 flex justify-between"
          >

            <div>

              <h2 className="text-xl font-semibold">
                {job.title}
              </h2>

              <p>{job.location}</p>

              <p>{job.company.name}</p>

            </div>

        <div className="text-right flex flex-col items-end gap-3">

  <p>
    Applicants :
    <strong>
      {" "}
      {job._count.applications}
    </strong>
  </p>

  <button
    onClick={() =>
      (window.location.href = `/recruiter/jobs/${job.id}`)
    }
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
  >
    View Applicants
  </button>

</div>

          </div>

        ))}

      </div>

    </div>
  );
}