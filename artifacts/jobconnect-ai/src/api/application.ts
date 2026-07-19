import api from "./axios";

export const applyJob = async (jobId: string) => {
  const { data } = await api.post(
    `/applications/${jobId}`
  );

  return data;
};

export const getMyApplications = async () => {
  const { data } = await api.get(
    "/applications/my"
  );

  return data;
};