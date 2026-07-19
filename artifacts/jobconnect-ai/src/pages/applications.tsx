import { useEffect, useState } from "react";
import api from "@/api/axios";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    api.get("/applications").then((res) => {
      setApplications(res.data.applications);
    });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">
        My Applications
      </h1>

      {applications.length === 0 ? (
        <p>No Applications Found</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-xl p-5"
            >
              <h2 className="font-bold text-xl">
                {app.job.title}
              </h2>

              <p>{app.job.company.name}</p>

              <p>{app.job.location}</p>

              <p>Status : {app.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}