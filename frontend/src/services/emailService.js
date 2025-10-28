import axios from "axios";

const API = "http://127.0.0.1:8000/admin";
const springbootAuthAPI = "http://localhost:8080/superadmin";

export const sendResetEmail = async (recipient_email) => {
    const response = await axios.post(`${springbootAuthAPI}/sendresetemail`, {
        params: { recipient_email }
    })
    return response.data;
}

export const sendAdminChatbotResultEmail = async (
    title,
    fullname,
    chatbot_name,
    recipient_email,
    status,
    remarks
) => {
    const response = await axios.post(`${springbootAuthAPI}/sendAdminChatbotResultEmail`, {
        title,
        fullname,
        chatbot_name,
        recipient_email,
        status,
        remarks
    })
    return response.data;
}