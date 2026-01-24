import axios, { AxiosInstance } from "axios";
import { useAuthStore } from "@/store/AuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Centralized Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests (for refresh token)
});

// Request interceptor - add access token to headers
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401 and auto-refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token using the refresh token cookie
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/u/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        // Update the store with new token
        useAuthStore.getState().login(newAccessToken);

        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh failed - token expired or invalid
        // Clear auth state and redirect to login
        useAuthStore.getState().logout();

        // Only redirect if we're in the browser
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };