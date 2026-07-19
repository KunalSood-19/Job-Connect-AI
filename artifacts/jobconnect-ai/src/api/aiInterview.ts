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
export const startInterview = async (data: {
  role: string;
  difficulty: string;
  company: string;
  interviewType: string;
  timePerQuestion: number;
  totalQuestions: number;
}) => {
  const res = await API.post("/interview/start", data);
  return res.data;
};

export const submitAnswer = async (data: {
  sessionId: string;
  question: string;
  answer: string;
}) => {
  const res = await API.post("/interview/answer", data);
  return res.data;
};

export const finishInterview = async (sessionId: string) => {
  const res = await API.post("/interview/finish", {
    sessionId,
  });

  return res.data;
};

export const getHistory = async (userId: string) => {
  const res = await API.get(`/interview/history/${userId}`);
  return res.data;
};