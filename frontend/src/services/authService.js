import axios from "axios";

const API = "http://127.0.0.1:8000/auth";
const springbootAuthAPI = "http://localhost:8080/api/auth";

export const register = async(email, password, refercode)=>{
    const response = await axios.post(`${springbootAuthAPI}/register`, {email, password, refercode});
    return response.data;
}

export const login = async(email, password)=>{
    const response = await axios.post(`${springbootAuthAPI}/login`, {email, password});
    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${springbootAuthAPI}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

