import { useEffect, useState } from "react";
import { Mail, MessageCircle } from "lucide-react";
import { useParams } from "wouter";
import ScheduleInterviewDialog from "@/components/recruiter/ScheduleInterviewDialog";
import OfferLetterDialog from "@/components/recruiter/OfferLetterDialog";
import { getApplicants, updateStatus } from "@/api/recruiter";

export default function Applicants() {
  const [selectedOfferApplication, setSelectedOfferApplication] = useState<
    string | null
  >(null);
  const { id } = useParams<{ id: string }>();

  const [applicants, setApplicants] = useState<any[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (id) {
      loadApplicants();
    }
  }, [id]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  async function loadApplicants() {
    console.log("Job ID:", id);

    const res = await getApplicants(id);

    console.log("API Response:", res);

    setApplicants(res.applicants);
  }

  async function changeStatus(applicationId: string, status: string) {
    await updateStatus(applicationId, status);

    loadApplicants();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Applicants</h1>

      {applicants.length === 0 && <p>No applicants found.</p>}

      <div className="space-y-4 overflow-visible">
        {applicants.map((app: any) => (
          <div
            key={app.id}
            className="relative border rounded-lg p-5 flex justify-between overflow-visible"
          >
            <div>
              <h2 className="font-semibold">{app.user.name}</h2>

              <p>{app.user.email}</p>

              <p>{app.user.student?.college}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-sm font-semibold text-blue-400">
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-blue-400">
                      {app.status}
                    </span>

                    {app.aiScore !== null && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          app.aiScore >= 80
                            ? "bg-green-100 text-green-700"
                            : app.aiScore >= 50
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        AI Match {app.aiScore}%
                        {app.matchedSkills.length > 0 && (
                          <div className="text-xs text-green-500">
                            ✔ {app.matchedSkills.join(", ")}
                          </div>
                        )}
                        {app.missingSkills.length > 0 && (
                          <div className="text-xs text-red-500">
                            ✖ {app.missingSkills.join(", ")}
                          </div>
                        )}
                      </span>
                    )}
                  </div>

                  {app.aiScore !== null && (
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.aiScore >= 80
                          ? "bg-green-100 text-green-700"
                          : app.aiScore >= 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      AI Match {app.aiScore}%
                    </div>
                  )}
                </div>
              </span>
              {app.offerLetter && (
                <div className="mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.offerLetter.status === "ACCEPTED"
                        ? "bg-green-100 text-green-700"
                        : app.offerLetter.status === "DECLINED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Offer {app.offerLetter.status}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `/recruiter/candidate/${app.user.id}`)
                  }
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                >
                  👤 View Profile
                </button>

                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenu(openMenu === app.id ? null : app.id)
                    }
                    className="h-10 w-10 flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    ⋮
                  </button>

                  {openMenu === app.id && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white shadow-xl z-50 overflow-hidden">
                      <button
                        onClick={() => changeStatus(app.id, "SHORTLISTED")}
                        className="w-full text-left px-4 py-3 hover:bg-green-50 text-green-700"
                      >
                        <b>Shortlisted</b>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedApplication(app.id);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 text-blue-700"
                      >
                        📅 Schedule Interview
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOfferApplication(app.id);
                          setOpenMenu(null);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-purple-50 text-purple-700"
                      >
                        📄 Generate Offer Letter
                      </button>

                      <button
                        onClick={() => changeStatus(app.id, "REJECTED")}
                        className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600"
                      >
                        <b>Reject</b>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedApplication && (
        <ScheduleInterviewDialog
          applicationId={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onSuccess={loadApplicants}
        />
      )}
      {selectedOfferApplication && (
        <OfferLetterDialog
          applicationId={selectedOfferApplication}
          onClose={() => setSelectedOfferApplication(null)}
          onSuccess={loadApplicants}
        />
      )}
    </div>
  );
}
