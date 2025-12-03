import axios from "axios";

const API_URL = "http://localhost:8000/chat";


export const sendMessage = async (userId, chatbotId, prompt, sessionId = null) => {
  const payload = {
    id: userId,
    chatbot_id: chatbotId,
    prompt,
    ...(sessionId && { session_id: sessionId }),
  };

  const res = await axios.post(`${API_URL}/`, payload);
  return res.data;
};


export const getMessages = async (sessionId) => {
  const res = await axios.get(`${API_URL}/sessions/${sessionId}/messages`);
  return res.data;
};

export const getChatSessions = async (userId, chatbotId) => {
  const res = await axios.get(`${API_URL}/sessions/${userId}/${chatbotId}`);
  return res.data;
};

export const deleteChatSession = async (sessionId) => {
  const res = await axios.delete(`${API_URL}/sessions/${sessionId}`)
  return res.data;
}

export const speechToText = async (audio) => {
  const audioBlob = new Blob(audio, { type: "audio/wav" });
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  try {
    const res = await axios.post(`${API_URL}/stt`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("STT error:", err);
    return null;
  }
}