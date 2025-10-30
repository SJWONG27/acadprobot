import React, { useState, useEffect } from 'react'
import TableWebScraping from '../../component/TableWebScraping'
import TableDocScraping from '../../component/TableDocScraping'
import { uploadDocs, getDocs, uploadWebsiteDocs, getWebsiteDocs, deleteDocument, deleteWebsiteDocument } from '../../services/adminService'
import ConfirmationModal from '../../component/ConfirmationModal'
import { useAdminContent } from '../../context/AdminContentProvider'
import SelectMenu from '../../component/SelectMenu'
import APAddWebUrl from '../../component/APAddWebUrl'
import APAddDocs from '../../component/APAddDocs'

const ChatbotContentPage = () => {
  const {
    confirmationModal,
    cancelDelete,
    deleteTarget,
    setDocuments,
    setWebsites,
    handleDeleteDoc,
    handleDeleteWebsiteDoc,
    chatbotsUnderAdmin,
    selectedChatbot,
    setSelectedChatbot,
    showWebsiteDocPanel,
    showDocPanel,
  } = useAdminContent();

  useEffect(() => {
    const fetchDocument = async () => {
      if (!selectedChatbot) {
        return;
      }

      const chatbotId = selectedChatbot.id;
      if (!chatbotId) {
        console.log("no chatbot id")
        return;
      }
      try {
        const response = await getDocs(chatbotId);
        setDocuments(response);
      } catch (error) {
        console.error("fetchDocument", error);
      }
    }
    fetchDocument()
  }, [selectedChatbot])

  useEffect(() => {
    const fetchWebsiteDocument = async () => {
      if (!selectedChatbot) {
        return;
      }
      const chatbotId = selectedChatbot.id;
      if (!chatbotId) {
        console.log("no chatbot id")
        return;
      }
      try {
        const response = await getWebsiteDocs(chatbotId);
        setWebsites(response);
      } catch (error) {
        console.error("fetchDocument", error);
      }
    }
    fetchWebsiteDocument()
  }, [selectedChatbot])

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Chatbot Content</p>
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
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Web Scraping</p>
          <div className='mt-12 mb-8'>
            <TableWebScraping />
          </div>
        </div>
      </div>

      <div className='flex flex-col pb-3 mt-8'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Document Scraping</p>
          <div className='mt-12 mb-8'>
            <TableDocScraping />
          </div>
        </div>
      </div>

      {confirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <ConfirmationModal
              title="Delete Confirmation"
              onConfirm={handleDeleteDoc}
              onCancel={cancelDelete}
            />
          </div>
        </div>
      )}

      {confirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10">
            <ConfirmationModal
              title="Delete Confirmation"
              onConfirm={deleteTarget === "website" ?  handleDeleteWebsiteDoc: handleDeleteDoc }
              onCancel={cancelDelete}
            />
          </div>
        </div>
      )}

      {showWebsiteDocPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <APAddWebUrl />
        </div>
      )}

      {showDocPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <APAddDocs />
        </div>
      )}


    </div>
  )
}

export default ChatbotContentPage
