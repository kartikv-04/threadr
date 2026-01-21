import axios, {AxiosInstance} from "axios";
import { useAuthStore } from "@/store/AuthStore";

//  Centralized Axios Instance
const api : AxiosInstance = axios.create({
    baseURL : "http://localhost:5000/api/v1",
    timeout : 10000,
    headers : {
        'Content-Type' : 'application/json',
        "Authorization" : ""
    }
});

api.interceptors.request.use((config) => {
  // Access the store directly (non-hook way)
  const token = useAuthStore.getState().accessToken; 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export  {api};