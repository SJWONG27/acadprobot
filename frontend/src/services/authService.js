import axios from "axios";

const API = "http://127.0.0.1:8000/auth";

export const register = async(email, password, refercode)=>{
    const response = await axios.post(`${API}/register`, {email, password, refercode});
    return response.data;
}

export const login = async(email, password)=>{
    const response = await axios.post(`${API}/login`, {email, password});
    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};

