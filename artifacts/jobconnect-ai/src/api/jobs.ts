import api from "./axios";

export async function getJobs(params: {
  search?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  remoteOnly?: boolean;
  under100Applicants?: boolean;
  page?: number;
  limit?: number;
}) {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data;
}

export async function getTrendingJobs() {
  const response = await api.get("/jobs", {
    params: {
      limit: 6,
    },
  });

  return response.data;
}

export async function getJob(id: string) {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
}

export async function createJob(
  token: string,
  data: any
) {
  const response = await api.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}