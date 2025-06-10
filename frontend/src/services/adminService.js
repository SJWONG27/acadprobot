import axios from "axios";

const API = "http://127.0.0.1:8000/admin";

export const getUsersOfAdmin = async () => {
    const token = localStorage.getItem("token"); 
    return axios.get(`${API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  