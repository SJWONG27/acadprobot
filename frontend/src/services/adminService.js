import axios from "axios";

const API = "http://127.0.0.1:8000/admin";
const springbootAuthAPI = "http://localhost:8080/admin";

export const getChatbotsOfAdmin = async (user_id) => {
  const res = await axios.get(`${springbootAuthAPI}/chatbotsunderadmin?user_id=${user_id}`)
  return res.data;
};

export const uploadDocs = async (file, chatbot_id) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("chatbot_id", chatbot_id);

  try {
    const res = await axios.post(`${API}/upload`, formData, {
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
  const res = await axios.get(`${API}/documents/${chatbot_id}`);
  return res.data;
}

export const uploadWebsiteDocs = async (websiteurl, chatbot_id) => {
  const res = await axios.post(`${API}/uploadwebsite`, {
    url: websiteurl,
    chatbot_id: chatbot_id,
  });
  return res.data;
};


export const getWebsiteDocs = async (chatbot_id) => {
  const res = await axios.get(`${API}/websitedocuments/${chatbot_id}`);
  return res.data;
}

export const deleteDocument = async (document_id) => {
  const res = await axios.delete(`${API}/deletedoc/${document_id}`)
  return res.data;
}

export const deleteWebsiteDocument = async (website_id) => {
  const res = await axios.delete(`${API}/deletewebsitedoc/${website_id}`)
  return res.data;
}

export const getUsersUnderChatbot = async(chatbot_id)=>{
    const response = await axios.get(`${springbootAuthAPI}/chatbots?chatbot_id=${chatbot_id}`);
    return response.data;
}

export const deleteUsersFromChatbot = async(chatbotId, userId) =>{
    return await axios.delete(`${springbootAuthAPI}/chatbots/${chatbotId}/users/${userId}`)
}