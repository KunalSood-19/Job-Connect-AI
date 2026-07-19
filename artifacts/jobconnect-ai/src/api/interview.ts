import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://const API = import.meta.env.VITE_API_URL!;/api",
});

// Schedule a new interview
export const scheduleInterview = async (data: {
  applicationId: string;
  interviewDate: string;
  mode: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
}) => {
  const res = await API.post("/recruiter/interviews", data);
  return res.data;
};

// Update interview
export const updateInterview = async (
  interviewId: string,
  data: {
    interviewDate: string;
    mode: string;
    meetingLink?: string;
    location?: string;
    notes?: string;
  }
) => {
  const res = await API.put(
    `/recruiter/interviews/${interviewId}`,
    data
  );

  return res.data;
};

// Delete interview
export const deleteInterview = async (
  interviewId: string
) => {
  const res = await API.delete(
    `/recruiter/interviews/${interviewId}`
  );

  return res.data;
};

// Get recruiter interviews
export const getRecruiterInterviews = async () => {
  const res = await API.get("/recruiter/interviews");
  return res.data;
};

// Get single interview
export const getInterview = async (
  interviewId: string
) => {
  const res = await API.get(
    `/recruiter/interviews/${interviewId}`
  );

  return res.data;
};