import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, WindowIcon } from "@heroicons/react/24/outline";
import { sendMessage, getMessages, getChatSessions } from "../../services/chatService";
import { getCurrentUser } from "../../services/authService";

const ChatInterface = ({ isSidebarOpen, toggleSidebar, userId, chatSessions, selectedSessionId }) => {
  const [input, setInput] = useState("");
  const [sessionList, setSessionList] = useState([]);
  // const [selectedSessionId, setSelectedSessionId] = useState("");
  const [sessionId, setSessionId] = useState([]);
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchSessionID = async () => {
      if (!userId) return;

      try {
        const res = await getChatSessions(userId);
        if (res.length > 0) {
          const sessionIds = res.map(session => session.session_id)
          setSessionList(sessionIds);
          console.log(sessionIds);
        }
      } catch (error) {
        console.error("Failed to fetch chat session id", error);
      }
    };

    fetchSessionID();
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedSessionId) return;

      try {
        const res = await getMessages(selectedSessionId);
        setMessages(res);
      } catch (error) {
        console.error("Failed to fetch chat messages", error);
      }
    };

    fetchMessages();
  }, [selectedSessionId]);



  const handleSend = async () => {
    if (!input.trim()) return;
    if (!userId) {
      console.error("no user id fetched");
    }
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const data = await sendMessage(userId, input, selectedSessionId);
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);

      // Optional: Set sessionId if it's returned (for first-time use)
      if (data.session_id && !sessionId) setSessionId(data.session_id);
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-8 relative">
      {!isSidebarOpen && (
        <div className="absolute top-8 left-6 z-20">
          <WindowIcon aria-hidden="true" className="size-6" onClick={toggleSidebar} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-10 p-2 pl-4 pr-4 rounded-2xl w-fit max-w-screen-md text-left 
              ${msg.role === "user"
                ? "bg-blue-500 text-white ml-auto " // Align right
                : "bg-gray-100 text-black mr-auto" // Align left
              }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex w-full self-center justify-between drop-shadow-lg border border-gray-200 bg-white z-10 pl-2 pr-2 max-h-96 rounded-md">
        <textarea
          ref={textareaRef}
          className="p-2 w-full max-h-90 overflow-y-auto resize-none focus:outline-none"
          placeholder="Ask me a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
        />
        <div className="flex w-23 justify-around">
          <MicrophoneIcon className="w-5 text-blue-500" />
          <PaperAirplaneIcon className="w-5 text-blue-500" onClick={handleSend} />
        </div>
      </div>

    </div>
  );
};

export default ChatInterface;
