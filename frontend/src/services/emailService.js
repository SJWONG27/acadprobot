import springapi from './springapi.js';

const SPRING_API = "/emailservice";

export const sendResetEmail = async (recipient_email) => {
    const response = await springapi.post(`${SPRING_API}/sendresetemail`, null, {
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
    const response = await springapi.post(`${SPRING_API}/sendAdminChatbotResultEmail`, {
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
    const res = await springapi.post(`${SPRING_API}/sendchatbotinvitation`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}