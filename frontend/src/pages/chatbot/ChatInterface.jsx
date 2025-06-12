import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, WindowIcon } from "@heroicons/react/24/outline";
import { sendMessage, getMessages } from "../../services/chatService";
import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import logo_acadprobot_square from '../../../src/assets/logo_acadprobot_square.svg'



const ChatInterface = ({ isSidebarOpen, toggleSidebar, userId, chatSessions, selectedSessionId, messages, setMessages, handleSend, input, setInput }) => {
  // const [input, setInput] = useState("");
  // const [messages, setMessages] = useState([]);

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


  return (
    <div className="h-full w-full flex flex-col p-8 relative">
      {!isSidebarOpen && (
        <div className="absolute top-8 left-6 z-20">
          <WindowIcon aria-hidden="true" className="size-6" onClick={toggleSidebar} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto space-y-2">
        {(!selectedSessionId) ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="flex flex-row">
              <img
                alt="AcadProBot"
                src={logo_acadprobot_square}
                className="w-15"
              />
              <img
                alt="AcadProBot"
                src={logo_acadprobot_long}
                className="w-40"
              />
            </div>

            <p className="">How can I help you today?</p>
          </div>
        ) :(
        <>
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
        </>
        )}
      </div>

      <div className="flex w-full self-center justify-between drop-shadow-lg border border-gray-200 bg-white z-10 pl-2 pr-2 max-h-96 rounded-md">
        <textarea
          ref={textareaRef}
          className="p-2 w-full max-h-90 overflow-y-auto resize-none focus:outline-none"
          placeholder="Ask me a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            } 
          }}
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
