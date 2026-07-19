import { useEffect, useState } from "react";
import {
  getRecruiterInterviews,
  deleteInterview,
  scheduleInterview,
  updateInterview,
} from "@/api/interview";
import ScheduleInterviewDialog from "@/components/recruiter/ScheduleInterviewDialog";
export default function Interviews() {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);
  const [editingInterview, setEditingInterview] =
  useState<any>(null);

  async function loadInterviews() {
    try {
      setLoading(true);

      const res = await getRecruiterInterviews();

      setInterviews(res.interviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const ok = window.confirm(
      "Are you sure you want to cancel this interview?"
    );

    if (!ok) return;

    await deleteInterview(id);

    loadInterviews();
  }

  function handleEdit(interview: any) {
  setEditingInterview(interview);
}

  function badge(status: string) {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "COMPLETED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        Loading Interviews...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">

      <h1 className="text-3xl font-bold mb-8">
        Interview Management
      </h1>

      {interviews.length === 0 && (
        <div className="border rounded-xl p-10 text-center">
          No Interviews Scheduled
        </div>
      )}

      <div className="space-y-5">

        {interviews.map((interview: any) => (

          <div
            key={interview.id}
            className="border rounded-xl p-6 bg-card shadow-sm flex justify-between items-center"
          >

            <div>

              <h2 className="text-xl font-semibold">

                {interview.application.user.name}

              </h2>

              <p className="text-muted-foreground">

                {interview.application.job.title}

              </p>

              <p className="text-sm text-muted-foreground">

                {interview.application.job.company.name}

              </p>

              <p className="mt-3">

                📅{" "}
                {new Date(
                  interview.interviewDate
                ).toLocaleString()}

              </p>

              <p>

                💻 {interview.mode}

              </p>

              {interview.meetingLink && (

                <a
                  href={interview.meetingLink}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Join Meeting
                </a>

              )}

            </div>

            <div className="flex flex-col items-end gap-4">

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${badge(
                  interview.status
                )}`}
              >
                {interview.status}
              </span>

              <button
                onClick={() =>
                  window.location.href = `/recruiter/candidate/${interview.application.user.id}`
                }
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
              >
                View Candidate
              </button>
<button
  onClick={() => handleEdit(interview)}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
>
  Edit Interview
</button>
              <button
                onClick={() =>
                  handleDelete(interview.id)
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                Cancel Interview
              </button>

            </div>

          </div>

        ))}

      </div>
{editingInterview && (
  <ScheduleInterviewDialog
    applicationId={editingInterview.applicationId}
    interview={editingInterview}
    onClose={() => setEditingInterview(null)}
    onSuccess={() => {
      loadInterviews();
      setEditingInterview(null);
    }}
  />
)}
    </div>
    
  );
}