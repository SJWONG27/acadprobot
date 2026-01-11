import springapi from './springapi.js'
import fastapi from './fastapi.js'

const FASTAPI_API = "/admin";
const SPRING_API = "/admin";

export const getChatbotsOfAdmin = async (user_id) => {
  const res = await springapi.get(`${SPRING_API}/chatbotsunderadmin?user_id=${user_id}`)
  return res.data;
};

export const uploadDocs = async (file, chatbot_id) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chatbot_id", chatbot_id);

  try {
    const res = await fastapi.post(`${FASTAPI_API}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export const getDocs = async (chatbot_id) => {
  const res = await fastapi.get(`${FASTAPI_API}/documents/${chatbot_id}`);
  return res.data;
}

export const uploadWebsiteDocs = async (websiteurl, chatbot_id) => {
  const res = await fastapi.post(`${FASTAPI_API}/uploadwebsite`, {
    url: websiteurl,
    chatbot_id: chatbot_id,
  });
  return res.data;
};


export const getWebsiteDocs = async (chatbot_id) => {
  const res = await fastapi.get(`${FASTAPI_API}/websitedocuments/${chatbot_id}`);
  return res.data;
}

export const deleteDocument = async (document_id) => {
  const res = await fastapi.delete(`${FASTAPI_API}/deletedoc/${document_id}`)
  return res.data;
}

export const deleteWebsiteDocument = async (website_id) => {
  const res = await fastapi.delete(`${FASTAPI_API}/deletewebsitedoc/${website_id}`)
  return res.data;
}

export const getUsersUnderChatbot = async(chatbot_id)=>{
    const response = await springapi.get(`${SPRING_API}/chatbots?chatbot_id=${chatbot_id}`);
    return response.data;
}

export const deleteUsersFromChatbot = async(chatbotId, userId) =>{
    return await springapi.delete(`${SPRING_API}/chatbots/${chatbotId}/users/${userId}`)
}