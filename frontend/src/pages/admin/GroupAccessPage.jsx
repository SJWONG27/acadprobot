import React, { useEffect, useState } from 'react'
import TableGroupAccess from '../../component/TableGroupAccess'
import { getCurrentUser } from '../../services/authService'
import { getUsersUnderChatbot } from '../../services/adminService'
import Toggles from '../../component/Toggles'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import SelectMenu from '../../component/SelectMenu';
import { useAdminContent } from '../../context/AdminContentProvider'

const GroupAccessPage = () => {
  const {
      chatbotsUnderAdmin,
      selectedChatbot,
      setSelectedChatbot
    } = useAdminContent();

  // const [refercode, setRefercode] = useState("");
  // useEffect(() => {
  //   const fetchAdmin = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No token available");
  //       return;
  //     }

  //     try {
  //       const data = await getCurrentUser(token);
  //       setRefercode(data.data.refercode);
  //     } catch (error) {
  //       console.log("Group access (refercode): ", error)
  //     }
  //   }
  //   fetchAdmin();
  // }, [])
  
  // const [selectedChatbot, setSelectedChatbot] = useState(null);
  // const [usersUnderChatbot, setUsersUnderChatbot] = useState([]);

  // useEffect(()=>{
  //   const fetchUsersUnderChatbot = async() =>{
  //     if(!selectedChatbot) return;
  //     try {
  //       const data = await getUsersUnderChatbot(selectedChatbot.id);
  //       setUsersUnderChatbot(data);
  //     } catch (error) {
  //       console.error("fetchUsersUnderChatbot", error);
  //     }
  //   }
  //   fetchUsersUnderChatbot()
  // },[])

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Group Access</p>
      </div>

      <div className='flex flex-col items-center justify-around shadow-md bg-indigo-100 py-5 px-1 rounded-xl md:flex-row'>
        <SelectMenu
          chatbots={chatbotsUnderAdmin}
          menuTitle="Current Chatbot"
          selected={selectedChatbot}
          setSelected={setSelectedChatbot}
        />
      </div>

      <div className='flex flex-col pb-3 mt-15'>
        <div className='flex flex-col self-center items-center justify-center mt-4 border-2 border-indigo-300 p-2 w-6/12 rounded-md shadow-md sm:w-100'>
            <span className='text-xs font-light'>Refer Code: </span>
            <span className='text-indigo-500 text-center text-xl font-semibold mb-1'>{selectedChatbot?.refercode || "null"}</span>
        </div>
        <div className='mt-12'>
          <TableGroupAccess />
        </div>
      </div>
    </div>
  )
}

export default GroupAccessPage
