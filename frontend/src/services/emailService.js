import axios from "axios";

const API = "http://127.0.0.1:8000/admin";
const springbootAuthAPI = "http://localhost:8080/emailservice";

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

export const sendChatbotInvitation = async (file, refercode, chatbot_name, sender_email) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("refercode", refercode);
  formData.append("chatbot_name", chatbot_name);
  formData.append("sender_email", sender_email);

  try {
    const res = await axios.post(`${springbootAuthAPI}/sendchatbotinvitation`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}