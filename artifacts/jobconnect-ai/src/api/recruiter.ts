import api from "./axios";

export async function getMyJobs() {
  const { data } = await api.get("/jobs/my/jobs");

  return data;
}


export async function getApplicants(jobId: string) {
  const { data } = await api.get(
    `/recruiter/jobs/${jobId}/applicants`
  );
  

  return data;
}

export async function updateStatus(
  applicationId: string,
  status: string
) {
  const { data } = await api.patch(
    `/recruiter/applications/${applicationId}/status`,
    {
      status,
    }
  );

  return data;
}

export async function saveRecruiterNote(
  candidateId: string,
  note: string
) {
  const { data } = await api.put(
    `/recruiter/notes/${candidateId}`,
    {
      note,
    }
  );

  return data;
}

export async function getRecruiterNote(
  candidateId: string
) {
  const { data } = await api.get(
    `/recruiter/notes/${candidateId}`
  );

  return data;
}