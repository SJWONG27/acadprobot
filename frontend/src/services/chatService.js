import fastapi from './fastapi.js'
import axios from 'axios';

const FASTAPI_API = "/chat";


export const sendMessage = async (userId, chatbotId, prompt, sessionId = null) => {
  const payload = {
    id: userId,
    chatbot_id: chatbotId,
    prompt,
    ...(sessionId && { session_id: sessionId }),
  };

  const res = await fastapi.post(`${FASTAPI_API}/`, payload);
  return res.data;
};

export const sendMessageStream = async (
  userId,
  chatbotId,
  prompt,
  sessionId = null,
  { onProcessLog } = {}
) => {
  const payload = {
    id: userId,
    chatbot_id: chatbotId,
    prompt,
    ...(sessionId && { session_id: sessionId }),
  };

  const res = await fetch(`${fastapi.defaults.baseURL}${FASTAPI_API}/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok || !res.body) {
    throw new Error("Failed to stream chat response");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let finalData = null;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      if (!line.trim()) continue;

      const event = JSON.parse(line);

      if (event.type === "process") {
        onProcessLog?.(event.log);
      }

      if (event.type === "final") {
        finalData = event;
      }

      if (event.type === "error") {
        throw new Error(event.message);
      }
    }
  }

  if (!finalData) {
    throw new Error("Chat stream finished without a final response");
  }

  return {
    session_id: finalData.session_id,
    response: finalData.response,
    process_logs: finalData.process_logs || [],
  };
};


export const getMessages = async (sessionId) => {
  const res = await fastapi.get(`${FASTAPI_API}/sessions/${sessionId}/messages`);
  return res.data;
};

export const getChatSessions = async (userId, chatbotId) => {
  const res = await fastapi.get(`${FASTAPI_API}/sessions/${userId}/${chatbotId}`);
  return res.data;
};

export const deleteChatSession = async (sessionId) => {
  const res = await fastapi.delete(`${FASTAPI_API}/sessions/${sessionId}`)
  return res.data;
}

export const speechToText = async (audio) => {
  const audioBlob = new Blob(audio, { type: "audio/wav" });
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  try {
    const res = await axios.post(`http://127.0.0.1:8000/chat/stt`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    console.error("STT error:", err);
    return null;
  }
}