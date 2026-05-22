import springapi from './springapi.js'

const SPRING_API = "/chatbots";

// export const joinChatbot = async(user_id, refercode)=>{
//     const response = await springapi.post(`${SPRING_API}/joinchatbot`, {user_id, refercode});
//     return response.data;
// }

// export const leaveChatbot = async(user_id, chatbot_id)=>{
//     const response = await springapi.post(`${SPRING_API}/leavechatbot`, {user_id, chatbot_id});
//     return response.data;
// }

// export const getChatbotUnderUser = async(userId)=>{
//     const response = await springapi.get(`${SPRING_API}/?user_id=${userId}`);
//     return response.data;
// }

export const createChatbot = async (chatbotName, adminEmail) => {
    const response = await springapi.post(`${SPRING_API}`, { chatbotName, adminEmail });
    return response.data;
}

export const getAllChatbots = async () => {
    const response = await springapi.get(`${SPRING_API}`);
    return response.data;
}

export const deleteChatbot = async (id) => {
    return await springapi.delete(`${SPRING_API}?id=${id}`)
}

