import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // proxy to Next.js BFF API routes
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to all requests
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
