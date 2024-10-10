import axios from "axios";

// Pointing to the Django backend running on port 8000
// axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.baseURL = "/api";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true; // Ensures cookies are sent with requests

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Add a request interceptor for axiosReq and axiosRes
axiosReq.interceptors.request.use(
  (config) => {
    // During development, if token-based authentication is needed
    if (process.env.NODE_ENV === 'development') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRes.interceptors.request.use(
  (config) => {
    // During development, if token-based authentication is needed
    if (process.env.NODE_ENV === 'development') {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
