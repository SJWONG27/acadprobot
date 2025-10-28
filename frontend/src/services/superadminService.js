import axios from "axios";

const API = "http://127.0.0.1:8000/admin";
const springbootAuthAPI = "http://localhost:8080/superadmin";

export const createChatbot = async (chatbotName, adminEmail) => {
    const response = await axios.post(`${springbootAuthAPI}/createchatbot`, { chatbotName, adminEmail });
    return response.data;
}

export const getAllChatbots = async () => {
    const response = await axios.get(`${springbootAuthAPI}/chatbots`);
    return response.data;
}

export const deleteChatbot = async (id) => {
    return await axios.delete(`${springbootAuthAPI}/chatbots/${id}`)
}

export const requestAdminChatbot = async (
    email,
    fullname,
    title,
    chatbot_name,
    department_program,
    purpose
) => {
    const response = await axios.post(`${springbootAuthAPI}/requestadmin`, {
        email,
        fullname,
        title,
        chatbot_name,
        department_program,
        purpose
    });
    return response.data;
}


export const getAllRequest = async(status) =>{
    const response = await axios.get(`${springbootAuthAPI}/requestadmin`,{
        params: {status}
    });
    return response.data;
}

export const approveRequest = async(request_id) =>{
    const response = await axios.post(`${springbootAuthAPI}/approverequest`, null,{
        params: {request_id}
    })
    return response.data;
}

export const rejectRequest = async(request_id) =>{
    const response = await axios.post(`${springbootAuthAPI}/rejectrequest`, null, {
        params: {request_id}
    })
    return response.data;
}