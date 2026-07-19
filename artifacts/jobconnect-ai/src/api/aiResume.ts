import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://const API = import.meta.env.VITE_API_URL!;/api";

export async function generateSummary(data: any) {
  const token = localStorage.getItem("jwtToken");

  const res = await axios.post(
    `${API}/ai-resume/summary`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}