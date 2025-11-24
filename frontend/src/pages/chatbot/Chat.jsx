import React, { useState, useEffect } from 'react'
import ChatSideBar from './ChatSideBar'
import ChatInterface from './ChatInterface'
import { useChatContent } from '../../context/ChatContentProvider'
import ConfirmationModal from '../../component/ConfirmationModal'
import AlertSuccess from '../../component/AlertSuccess'
import AlertLoginRequiredChat from '../../component/AlertLoginRequiredChat'

const Chat = () => {
  const {
    alertLoginChat,
    deleteChat,
    confirmationModal,
    cancelDelete,
    successAlertMessage,
    setSuccessAlertMessage,
    isSidebarOpen,
  } = useChatContent();

  return (
    <div className="w-screen h-screen flex flex-row relative">
      <div className={`h-full max-w-78 bg-white border border-gray-200 drop-shadow transform transition-transform duration-800 ease-in-out overflow-y-hidden ${isSidebarOpen ? 'translate-x-0 absolute z-20  sm:relative' : '-translate-x-full w-0'}`}>
        <ChatSideBar />
      </div>

      <div className={`h-full w-full overflow-hidden transition-all duration-800 `}>
        <ChatInterface />
      </div>

      {successAlertMessage && (
        <AlertSuccess
          text={successAlertMessage}
          onClose={() => setSuccessAlertMessage("")}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        />
      )}

      {confirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <ConfirmationModal
              title="Delete Confirmation"
              onConfirm={deleteChat}
              onCancel={cancelDelete}
            />
          </div>
        </div>
      )}
      {alertLoginChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <AlertLoginRequiredChat />
        </div>
      )}
    </div>
  )
}

export default Chat
