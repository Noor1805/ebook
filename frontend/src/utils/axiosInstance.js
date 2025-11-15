import axios from "axios";
import { BASE_URL } from "./apiPaths";
import { getErrorMessage } from "./errorHandler";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = getErrorMessage(error);
    
    // Only show toast for certain errors (401 will be handled by individual pages)
    // Don't show toast for 401 as pages handle login redirects
    if (error.response?.status === 401) {
      // Let individual pages handle 401 errors (they might want to redirect)
      return Promise.reject(error);
    }

    // Log error for debugging
    console.error("API Error:", {
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default axiosInstance;
