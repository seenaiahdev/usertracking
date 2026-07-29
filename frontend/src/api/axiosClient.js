// Axios instance with base URL and automatic Authorization header injection
import axios from "axios";
import supabase from "../supabaseClient";

const defaultBaseURL = import.meta.env.DEV ? "http://localhost:5000" : "";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
