import axios from "axios";

// Pointing to the Django backend running on port 8000
axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

// Retrieve token from localStorage (or cookies, depending on your setup)
const token = localStorage.getItem("token"); // You can use cookies if that's how you're storing the token

// Set the Authorization header for axios instances
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Create axios instances
export const axiosReq = axios.create();
export const axiosRes = axios.create();

// Automatically add the Authorization header to all axiosReq and axiosRes requests
axiosReq.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosRes.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
