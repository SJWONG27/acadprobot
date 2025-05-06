import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, WindowIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const ChatInterface = ({ isSidebarOpen, toggleSidebar }) => {
  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! How can I help you?" }]);
  const [input, setInput] = useState("");
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

  // const sendMessage = async () => {
  //   if (!input.trim()) return;

  //   const newMessage = { role: "user", text: input };
  //   setMessages((prev) => [...prev, newMessage]);
  //   setInput("");

  //   const response = await getAIResponse(input);
  //   setMessages((prev) => [...prev, { role: "bot", text: response }]);
  // };
  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const newMessage = { role: "user", content: input }; // Ensure correct format
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  
    try {
      const formattedMessages = messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant") // Remove invalid roles like "bot"
        .map(({ role, content }) => ({ role, content: content || "Something wrong happen" })); // Ensure "content" exists
  
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...formattedMessages, newMessage] }), // Include chat history
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        console.error("Error:", data.detail);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };
  
  // const getAIResponse = async (userInput) => {
  //   try {
  //     const response = await axios.get("http://127.0.0.1:8000/chat", {
  //       params: { query: userInput },
  //     });
  //     return response.data.response;
  //   } catch (error) {
  //     console.error("Error fetching AI response:", error);
  //     return "Sorry, something went wrong!";
  //   }
  // };

  return (
    <div className="h-full w-full flex flex-col p-8 relative">
      {!isSidebarOpen && (
        <div className="absolute">
          <WindowIcon aria-hidden="true" className="size-6" onClick={toggleSidebar}/>
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
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
        />
        <div className="flex w-23 justify-around">
          <MicrophoneIcon className="w-5 text-blue-500" />
          <PaperAirplaneIcon className="w-5 text-blue-500" onClick={sendMessage} />
        </div>
      </div>

    </div>
  );
};

export default ChatInterface;
