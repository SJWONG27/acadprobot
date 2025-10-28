import React, { useEffect, useState } from 'react'
import TableAdminChatbotRequest from '../../component/TableAdminChatbotRequest'
import Tab from '../../component/Tab'
import { getCurrentUser } from '../../services/authService'
import Toggles from '../../component/Toggles'
import { ArrowPathIcon } from '@heroicons/react/24/solid'
import { useSuperAdminContent } from '../../context/SuperAdminContentProvider'

const tabs = [
  { name: 'pending' },
  { name: 'approved' },
  { name: 'rejected' },
]

const SuperAdminAccessPage = () => {

  const {
    activeTab,
    setActiveTab,
  } = useSuperAdminContent();


  
  return (
    <div>
      <div className='mx-auto pt-2 pb-4 font-bold text-xl text-indigo-600'>
        <p>Admin and Chatbot Request</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div className='mt-2 self-center'>
          <Tab
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        <div className='mt-12'>
          {activeTab === "pending" && (
            <TableAdminChatbotRequest
              status="pending"
              description="Requests waiting for approval"
            />
          )}
          {activeTab === "approved" && (
            <TableAdminChatbotRequest
              status="approved"
              description="Approved chatbot admin requests"
            />
          )}
          {activeTab === "rejected" && (
            <TableAdminChatbotRequest
              status="rejected"
              description="Rejected chatbot admin requests"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SuperAdminAccessPage
