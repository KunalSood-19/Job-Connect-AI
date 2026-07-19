import api from "./axios";

export async function getCompanies() {
  const response = await api.get("/companies");

  return response.data;
}

export async function getCompany(id: string) {
  const response = await api.get(`/companies/${id}`);

  return response.data;
}