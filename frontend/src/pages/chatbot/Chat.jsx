import React, {useState} from 'react'
import ChatSideBar from './ChatSideBar'
import ChatInterface from './ChatInterface'

const Chat = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen);
    console.log("clicked")
  }

  return (
    <div className="w-screen h-screen flex flex-row relative">
      <div className={`absolute z-10 h-full sm:w-5/12 md:w-4/12 xl:w-3/12 2xl:w-2/12 w-9/12 bg-white border border-gray-200 drop-shadow transform transition-transform duration-800 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <ChatSideBar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      </div>
        
      <div className={`h-full overflow-hidden transition-all duration-800 ${isSidebarOpen? 'fixed right-0 w-10/12 ' : 'ml-0 w-full'}`}>
        <ChatInterface isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      </div>
    </div>
  )
}

export default Chat
