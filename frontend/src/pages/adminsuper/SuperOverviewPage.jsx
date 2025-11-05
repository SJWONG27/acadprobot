import React from 'react'
import { useSuperAdminContent } from '../../context/SuperAdminContentProvider'
import {
  FolderArrowDownIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const SuperOverviewPage = () => {

  const {
    isLoading,
    handleDownloadReport
  } = useSuperAdminContent();

  const handleClickRefresh = () => {
    window.location.reload();
  }


  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Dashboard</p>
      </div>
      <div className='grid grid-rows-2'>
        <div className='flex flex-col mb-10'>
          <div className='grid gap-x-2 gap-y-2 sm:grid-cols-2'>
            <div>
              <h2 className="text-base/7 font-semibold text-indigo-600">Chatbot Usage</h2>
              <p className="mt-1 text-sm/6 text-gray-500">Overview of chatbot usage</p>
            </div>

            <button
              type="button"
              onClick={handleClickRefresh}
              className="flex flex-row w-full h-min items-center justify-around rounded-md px-3 py-3 text-sm font-semibold text-white shadow-sm sm:w-4/12 bg-green-600 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <ArrowPathIcon className="size-6" />
              <div>Refresh</div>
            </button>
          </div>


          <div className='flex mt-4 bg-indigo-50 justify-center items-center py-5 px-5 rounded-xl'>
            <iframe
              title="AcadProBot Dashboard"
              width="100%"
              height="500"
              seamless="seamless"
              src="https://lookerstudio.google.com/embed/reporting/f7b39e6a-fbef-4166-954c-22ddfbf72850/page/xwLeF"
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </div>
        </div>



        <div className='grid gap-x-2 gap-y-2 sm:grid-cols-2'>
          <div>
            <h2 className="text-base/7 font-semibold text-indigo-600">Academic Queries Classifier</h2>
            <p className="mt-1 text-sm/6 text-gray-500">Download list of queries rejected</p>
          </div>
          <button
            type="button"
            onClick={handleDownloadReport}
            disabled={isLoading}
            className={`flex flex-row w-full h-min items-center justify-around rounded-md px-3 py-3 text-sm font-semibold text-white shadow-sm  sm:w-5/12
                                ${isLoading ?
                "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              }`
            }
          >
            <FolderArrowDownIcon aria-hidden="true" className="size-6" />
            <div>Download Report</div>
          </button>
        </div>
      </div>


    </div>
  )
}

export default SuperOverviewPage
