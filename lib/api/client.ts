import axios from "axios";

const api = axios.create({
  baseURL: "", // Relative to the app, since API routes are /api/*
  withCredentials: true, // Send cookies with requests
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for auth endpoints (login/register failures are expected)
      if (!error.config?.url?.includes("/api/auth/")) {
        // Token expired or invalid, clear localStorage and redirect
        localStorage.removeItem("authToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("decks");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
