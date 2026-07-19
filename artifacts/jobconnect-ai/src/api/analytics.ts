import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export async function getRecruiterAnalytics() {
  const token = localStorage.getItem("jwtToken");

  const res = await axios.get(
    `${API}/recruiter/analytics`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.analytics;
}