import axios from "axios";

const API = "http://127.0.0.1:8000/admin";
const springbootAuthAPI = "http://localhost:8080/superadmin";

export const createChatbot = async(chatbotName, adminEmail)=>{
    const response = await axios.post(`${springbootAuthAPI}/createchatbot`, {chatbotName, adminEmail});
    return response.data;
}

export const getAllChatbots = async() =>{
    const response = await axios.get(`${springbootAuthAPI}/chatbots`);
    return response.data;
}

export const deleteChatbot = async(id) =>{
    return await axios.delete(`${springbootAuthAPI}/chatbots/${id}`)
}