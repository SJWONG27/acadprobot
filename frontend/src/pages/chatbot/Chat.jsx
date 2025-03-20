import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const Chat = () => {
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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const response = await getAIResponse(input);
    setMessages((prev) => [...prev, { role: "bot", text: response }]);
  };

  const getAIResponse = async (userInput) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(`You said: "${userInput}"`), 1000);
    });
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-10 overflow-y-auto space-y-2 p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-10 p-2 pl-4 pr-4 rounded-2xl w-fit max-w-screen-md text-left 
              ${msg.role === "user"
              ? "bg-blue-500 text-white ml-auto " // Align right
              : "bg-gray-100 text-black mr-auto" // Align left
              }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex fixed bottom-2 left-1/2 transform -translate-x-1/2 justify-between drop-shadow-lg bg-white z-10 pl-2 pr-2 w-9/12 max-h-96 rounded-md">
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

export default Chat;
