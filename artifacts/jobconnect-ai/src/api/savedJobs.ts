import api from "./axios";

export async function getSavedJobs() {
  const { data } = await api.get("/saved-jobs");
  return data;
}

export async function saveJob(jobId: string) {
  const { data } = await api.post(`/saved-jobs/${jobId}`);
  return data;
}

export async function unsaveJob(jobId: string) {
  const { data } = await api.delete(`/saved-jobs/${jobId}`);
  return data;
}