import { createRoot } from "react-dom/client";
import {
  setAuthTokenGetter,
  setBaseUrl,
} from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

// 👇 Backend URL
setBaseUrl("https://jobconnect-backend-mmkw.onrender.com");
console.log("Base URL configured");

// 👇 JWT
setAuthTokenGetter(() => localStorage.getItem("jwtToken"));

createRoot(document.getElementById("root")!).render(<App />);