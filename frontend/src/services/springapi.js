import axios from "axios";

const springbootAuthAPI = "http://localhost:8080";

const api = axios.create({
  baseURL: springbootAuthAPI,
  timeout: 600000,
});

api.interceptors.response.use(
  res => res,
  error => {
    console.log("Interceptor caught an error:", error);
    console.log("Error Code:", error.code);
    if (error.code === 'ERR_NETWORK') {
      if (window.location.pathname !== "/backend-down") {
        window.location.href = "/backend-down";
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
