import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://const API = import.meta.env.VITE_API_URL!;/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("jwtToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export async function analyzeResume(file: File) {
  const formData = new FormData();

  formData.append("resume", file);

  const res = await API.post(
    "/resume/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.analysis;
}