import api from "./axios";

export async function getStudentDashboard() {
  const { data } = await api.get("/dashboard/student");
  return data;
}

export async function getRecruiterDashboard() {

    const { data } =
        await api.get("/dashboard/recruiter");

    return data;
}