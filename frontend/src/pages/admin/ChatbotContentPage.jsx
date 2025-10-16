import React, { useState, useEffect } from 'react'
import Toggles from '../../component/Toggles'
import FrequencyCustom from '../../component/FrequencyCustom'
import TableWebScraping from '../../component/TableWebScraping'
import TableDocScraping from '../../component/TableDocScraping'
import { uploadDocs, getDocs, uploadWebsiteDocs, getWebsiteDocs, deleteDocument, deleteWebsiteDocument } from '../../services/adminService'
import AlertSuccess from '../../component/AlertSuccess'
import ConfirmationModal from '../../component/ConfirmationModal'
import { useAdminContent } from '../../context/AdminContentProvider'


const ChatbotContentPage = () => {
  const {
    confirmationModal,
    setConfirmationModal,
    confirmDelete,
    cancelDelete,
    deleteTarget,
    successAlertMessage,
    setSuccessAlertMessage,
    fileUpload,
    setFileUpload,
    documents,
    setDocuments,
    showDocPanel,
    setShowDocPanel,
    websiteUpload,
    setWebsiteUpload,
    websites,
    setWebsites,
    showWebsiteDocPanel,
    setShowWebsiteDocPanel,
    handleDocsUpload,
    handleWebsiteDocsUpload,
    handleDeleteDoc,
    hanldeDeleteWebsiteDoc
  } = useAdminContent();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    getDocs(token)
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Failed to fetch documents:", err));

    getWebsiteDocs(token)
      .then((data) => setWebsites(data))
      .catch((err) => console.error("Failed to website url:", err));
  }, []);

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Chatbot Content</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Web Scraping</p>
          {/* <div className='flex flex-row justify-between mt-8'>
            <div className='flex flex-row w-md'>
              <span className='mr-4'>Auto Update</span>
              <Toggles />
            </div>
            <div className='flex w-md'>
              <FrequencyCustom />
            </div>
          </div> */}
          <div className='mt-12 mb-8'>
            <TableWebScraping
              // websiteUpload={websiteUpload}
              // setWebsiteUpload={setWebsiteUpload}
              // handleWebsiteDocsUpload={handleWebsiteDocsUpload}
              // websites={websites}
              // showWebsiteDocPanel={showWebsiteDocPanel}
              // setShowWebsiteDocPanel={setShowWebsiteDocPanel}
              // hanldeDeleteWebsiteDoc={hanldeDeleteWebsiteDoc}
            />
          </div>
        </div>
      </div>

      <div className='flex flex-col pb-3 mt-8'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Document Scraping</p>
          <div className='mt-12 mb-8'>
            <TableDocScraping/>
          </div>
        </div>
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
                // onConfirm={hanldeDeleteWebsiteDoc}
                onConfirm={deleteTarget === "document" ? handleDeleteDoc : hanldeDeleteWebsiteDoc}
                onCancel={cancelDelete}
              />
            </div>
        </div>
      )}


    </div>
  )
}

export default ChatbotContentPage
