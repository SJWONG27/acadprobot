import axios from "axios";

const API = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API,
  timeout: 600000,
});

api.interceptors.response.use(
  res => res,
  error => {
    console.log("Interceptor caught an error:", error);
    console.log("Error Response:", error.response);
    console.log("Error Request:", error.request);
    if (!error.respons || error.code === 'ECONNABORTED' || error.code === 'ERR_CONNECTION_REFUSED') {
      if (window.location.pathname !== "/backend-down") {
        window.location.href = "/backend-down";
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
