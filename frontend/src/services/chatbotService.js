import axios from "axios";

const springbootAuthAPI = "http://localhost:8080/chatbots";

export const joinChatbot = async(user_id, refercode)=>{
    const response = await axios.post(`${springbootAuthAPI}/joinchatbot`, {user_id, refercode});
    return response.data;
}

export const leaveChatbot = async(user_id, chatbot_id)=>{
    const response = await axios.post(`${springbootAuthAPI}/leavechatbot`, {user_id, chatbot_id});
    return response.data;
}

export const getChatbotUnderUser = async(userId)=>{
    const response = await axios.get(`${springbootAuthAPI}/?user_id=${userId}`);
    return response.data;
}

