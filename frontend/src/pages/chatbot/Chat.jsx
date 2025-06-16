import React, { useState, useEffect } from 'react'
import ChatSideBar from './ChatSideBar'
import ChatInterface from './ChatInterface'
import { getCurrentUser } from '../../services/authService'
import { sendMessage, getMessages, getChatSessions, deleteChatSession } from '../../services/chatService'

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userId, setUserId] = useState("");
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token");
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUserId(data.data.id);
      } catch (error) {
        console.error("Fetch user id error: ", error)
      }
    }
    fetchUser();
  }, [])


  useEffect(() => {
    const fetchChatSession = async () => {
      if (!userId) return;
      const res = await getChatSessions(userId);
      // console.log("fetchChatSession", res);

      try {
        setChatSessions(res);
      } catch (error) {
        console.error("Fetch chat session error: ", error)
      }
    }
    fetchChatSession();
  }, [userId])


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


  const deleteChat = async (session_id) => {
    deleteChatSession(session_id);
    const res = await getChatSessions(userId);
    setChatSessions(res);
  }

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
      // if (data.session_id && !sessionId) setSessionId(data.session_id);
      if (data.session_id && !selectedSessionId) setSelectedSessionId(data.session_id);


      // reload by fetching  chat session again
      const res = await getChatSessions(userId);
      setChatSessions(res);
    } catch (error) {
      console.error("Request handleSend failed:", error);
    }
  };

  const toggleNewChat = () => {
    setSelectedSessionId(null);
  }

  return (
    <div className="w-screen h-screen flex flex-row relative">
      {/* <div className={`h-full sm:w-5/12 md:w-4/12 xl:w-3/12 2xl:w-2/12 w-9/12 bg-white border border-gray-200 drop-shadow transform transition-transform duration-800 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full w-0'}`}> */}
      <div className={`h-full w-78 bg-white border border-gray-200 drop-shadow transform transition-transform duration-800 ease-in-out ${isSidebarOpen ? 'translate-x-0 absolute z-20  sm:relative' : '-translate-x-full w-0'}`}>
        <ChatSideBar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userId={userId}
          chatSessions={chatSessions}
          selectedSessionId={selectedSessionId}
          setSelectedSessionId={setSelectedSessionId}
          deleteChat={deleteChat}
          toggleNewChat={toggleNewChat}
        />
      </div>

      {/* <div className={`h-full overflow-hidden transition-all duration-800 ${isSidebarOpen ? 'fixed right-0  xl:w-9/12' : 'ml-0 w-screen'}`}> */}
      <div className={`h-full w-full overflow-hidden transition-all duration-800 `}>

        <ChatInterface
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          userId={userId}
          chatSessions={chatSessions}
          selectedSessionId={selectedSessionId}
          messages={messages}
          setMessages={setMessages}
          handleSend={handleSend}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  )
}

export default Chat
