import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../feature/auth/AuthStore"; 

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. Type Definition: Extends Axios config to allow our custom '_retry' flag
interface AxiosConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 2. Queue Mechanism: Holds requests that fail while refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

// Helper to process the queue once the token is refreshed
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 3. Axios Instance Creation
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 4. Request Interceptor: Attaches the Token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 5. Response Interceptor: Handles Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosConfigWithRetry;

    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // CASE A: If ALREADY refreshing, add this request to the queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // CASE B: We are the first one to fail. Start the refresh process.
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // 1. Call the refresh endpoint
        const response = await axios.post(
          `${API_BASE_URL}/u/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.accessToken;
        
        // 2. IMPORTANT: Keep the existing User ID so we don't break the session
        const currentUserId = useAuthStore.getState().userId || ""; 
        useAuthStore.getState().login(newAccessToken, currentUserId);

        // 3. Process the queue of waiting requests
        processQueue(null, newAccessToken);

        // 4. Retry the original failing request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);

      } catch (refreshError) {
        // If refresh fails, kill the session
        processQueue(refreshError as Error, null);
        useAuthStore.getState().logout();
        
        // Redirect to login only on client-side
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Return any other errors as is
    return Promise.reject(error);
  }
);