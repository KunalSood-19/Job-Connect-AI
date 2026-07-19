import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_API_URL.replace("/api", "");

export const socket = io(BACKEND_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});