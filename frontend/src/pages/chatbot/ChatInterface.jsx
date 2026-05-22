import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm-configurable';
import { MicrophoneIcon, PaperAirplaneIcon, WindowIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import logo_acadprobot_square from '../../../src/assets/logo_acadprobot_square.svg'
import { useChatContent } from '../../context/ChatContentProvider'
import "./ChatMarkdown.css";
import { speechToText } from "../../services/chatService";

const ChatInterface = () => {
  const {
    isSidebarOpen,
    selectedSessionId,
    messages,
    input,
    setInput,
    toggleSidebar,
    handleSend,
  } = useChatContent();

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

  const getProcessStatusLabel = (msg, log, index) => {
    if (log.status === "failed") return "Failed";
    if (log.status === "completed") return "Done";
    if (log.status === "running") return "Running";
    if (msg.isProcessing || index > 0) return "Pending";

    return "Done";
  };

  const getProcessStatusClasses = (msg, log, index) => {
    if (log.status === "failed") {
      return "border-red-300 bg-red-50 text-red-700";
    }

    if (log.status === "completed") {
      return "border-green-300 bg-green-50 text-green-700";
    }

    if (log.status === "running" || (msg.isProcessing && index === 0)) {
      return "border-blue-300 bg-blue-50 text-blue-700";
    }

    if (msg.isProcessing) {
      return "border-gray-200 bg-gray-50 text-gray-500";
    }

    return "border-green-300 bg-green-50 text-green-700";
  };

  const renderProcessLogs = (msg) => {
    if (!msg.processLogs?.length) return null;

    return (
      <div className="mb-3 p-3 text-sm max-w-xs">
        <p className="mb-2 font-semibold text-green-800">Bot process</p>
        <ol className="space-y-2">
          {msg.processLogs.map((log, processIndex) => (
            <li key={`${log.step}-${processIndex}`} className="flex items-center justify-between">
              <span>{log.step}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getProcessStatusClasses(
                  msg,
                  log,
                  processIndex
                )}`}
              >
                {getProcessStatusLabel(msg, log, processIndex)}
              </span>
            </li>
          ))}
        </ol>
      </div>
    );
  };

  // speech-to-text
  const [isMicActive, setIsMicActive] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // const startRecording = () => {
  //   setInput("");
  //   // resetTranscript();
  //   // SpeechRecognition.startListening({ continuous: true });
  //   setIsMicActive(true);
  // };
  const startRecording = async () => {
    setInput(""); // Clear input
    audioChunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.start();
    setIsMicActive(true);
  };

  // const stopRecording = () => {
  //   SpeechRecognition.stopListening();
  //   setInput(transcript); // Set transcribed text into input
  //   setIsMicActive(false);
  // };

  const stopRecording = async () => {
    mediaRecorderRef.current.stop();
    setIsMicActive(false);

    mediaRecorderRef.current.onstop = async () => {
      const result = await speechToText(audioChunksRef.current);

      if (result?.text) {
        setInput(result.text);
      } else {
        setInput("no detected")
      }
    };
  };

  // const cancelRecording = () => {
  //   // SpeechRecognition.stopListening();
  //   // resetTranscript();
  //   setInput("");
  //   setIsMicActive(false);
  // };

  const cancelRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch (error) {
      console.error("Cancel recording failed:", error);
    }
    audioChunksRef.current = [];
    setIsMicActive(false);
  };


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
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-10 p-2 pl-4 pr-4 rounded-2xl w-fit max-w-screen-md text-left 
              ${msg.role === "user"
                    ? "bg-blue-100 text-black ml-auto " // Align right
                    : "bg-green-100 text-black mr-auto" // Align left
                  }`}
              >
                {/* {msg.content} */}
                {msg.role === "assistant" && renderProcessLogs(msg)}
                <div className="chat-markdown">
                  {msg.content && (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  )}
                </div>

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
          {/* <MicrophoneIcon className="w-5 text-blue-500" /> */}
          {!isMicActive ? (
            <MicrophoneIcon className="w-5 text-blue-500 cursor-pointer" onClick={startRecording} />
          ) : (
            <div className="flex gap-2">
              <CheckIcon className="w-5 text-green-500 cursor-pointer" onClick={stopRecording} />
              <XMarkIcon className="w-5 text-red-500 cursor-pointer" onClick={cancelRecording} />
            </div>
          )}
          <PaperAirplaneIcon className="w-5 text-blue-500" onClick={handleSend} />
        </div>
      </div>

    </div>
  );
};

export default ChatInterface;
