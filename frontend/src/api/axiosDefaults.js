import axios from "axios";

// Set the base URL for the API (Django backend)
axios.defaults.baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:8000/api";

axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add a request interceptor for axiosReq and axiosRes
axiosReq.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRes.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
