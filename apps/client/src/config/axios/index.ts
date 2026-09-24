import axios from "axios";

const baseURL = "http://localhost:3000";

export const axiosConfig = axios.create({
  baseURL,
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

    if (error.response?.status === 401 && token) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
