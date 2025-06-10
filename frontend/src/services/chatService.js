import axios from "axios";

const API_URL = "http://localhost:8000/chat"; 

export const sendMessage = async (userId, prompt, sessionId = null) => {
  const payload = {
    id: userId,
    prompt,
    ...(sessionId && { session_id: sessionId }),
  };

  const res = await axios.post(`${API_URL}`, payload);
  return res.data;
};

export const getSessions = async (userId) => {
  const res = await axios.get(`${API_URL}/sessions/${userId}`);
  return res.data;
};

export const getMessagesBySession = async (sessionId) => {
  const res = await axios.get(`${API_URL}/messages/${sessionId}`);
  return res.data;
};
