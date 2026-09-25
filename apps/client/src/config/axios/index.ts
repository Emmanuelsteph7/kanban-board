import axios from "axios";
import { toast } from "../../components/toast";

const baseURL = "http://localhost:3000";

export const axiosConfig = axios.create({
  baseURL,
  showToastOnError: true,
});

// Runs before every request: attach the JWT if we have one
axiosConfig.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Runs after every response: if the token is invalid/expired, clear it and
// bounce to login. We do a hard redirect (not react-router navigate) because
// this interceptor lives outside React's component tree.
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem("token");
    const showToastOnError = error.config?.showToastOnError;
    const errorMsg =
      error?.response?.data?.message || error?.response?.data?.error;
    const is401Error = error.response?.status === 401 && token;

    if (showToastOnError && !is401Error) {
      toast.error({
        description: errorMsg,
      });
    }

    if (is401Error) {
      localStorage.removeItem("token");
      window.location.href = "/login";

      toast.error({
        title: "Session Expired",
        description:
          "Your session has expired. Please log in again to continue accessing your account.",
      });
    }
    return Promise.reject(error);
  },
);
