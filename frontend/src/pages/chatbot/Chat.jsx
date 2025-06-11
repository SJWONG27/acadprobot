import React, { useState, useEffect } from 'react'
import ChatSideBar from './ChatSideBar'
import ChatInterface from './ChatInterface'
import { getCurrentUser } from '../../services/authService'
import { sendMessage, getMessages, getChatSessions } from '../../services/chatService'

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("clicked")
  }

  const [userId, setUserId] = useState("");

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

  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    const fetchChatSession = async () => {
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

  const [selectedSessionId, setSelectedSessionId] = useState(null);


  return (
    <div className="w-screen h-screen flex flex-row relative">
      <div className={`absolute z-10 h-full sm:w-5/12 md:w-4/12 xl:w-3/12 2xl:w-2/12 w-9/12 bg-white border border-gray-200 drop-shadow transform transition-transform duration-800 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ChatSideBar 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          userId = {userId}
          chatSessions = {chatSessions}
          selectedSessionId={selectedSessionId}
          setSelectedSessionId={setSelectedSessionId}
        />
      </div>

      <div className={`h-full overflow-hidden transition-all duration-800 ${isSidebarOpen ? 'fixed right-0  xl:w-9/12' : 'ml-0 w-screen'}`}>
        <ChatInterface 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          userId = {userId}
          chatSessions = {chatSessions}
          selectedSessionId={selectedSessionId}
        />
      </div>
    </div>
  )
}

export default Chat
