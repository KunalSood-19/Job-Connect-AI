import axios from "axios";

const API = "http://localhost:5000/api";

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