import springapi from "./springapi";

const SPRING_API = "/api/auth";

export const register = async(email, password, refercode)=>{
    const response = await springapi.post(`${SPRING_API}/register`, {email, password, refercode});
    return response.data;
}

export const login = async(email, password)=>{
    const response = await springapi.post(`${SPRING_API}/login`, {email, password});
    return response.data;
}

export const getCurrentUser = async () => {
    const token = localStorage.getItem("token");
    return springapi.get(`${SPRING_API}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
};