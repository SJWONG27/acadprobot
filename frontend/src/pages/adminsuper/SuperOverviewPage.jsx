import React from 'react'
import { useSuperAdminContent } from '../../context/SuperAdminContentProvider'
import {
  FolderArrowDownIcon
} from '@heroicons/react/24/outline'

const SuperOverviewPage = () => {

  const {
    isLoading,
    handleDownloadReport
  } = useSuperAdminContent();


  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Dashboard</p>
      </div>
      <div className='grid grid-rows-2 gap-y-20'>
        <div className='grid gap-y-2 sm:grid-cols-2 '>
          <div>
            <h2 className="text-base/7 font-semibold text-indigo-600">Chatbot Usage</h2>
            <p className="mt-1 text-sm/6 text-gray-500">Overview of chatbot usage</p>
          </div>

          <div class="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
            <div class="flex justify-between">
              <div>
                <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">32.4k</h5>
                <p class="text-base font-normal text-gray-500 dark:text-gray-400">Users this week</p>
              </div>
              <div
                class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
                12%
                <svg class="w-3 h-3 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4" />
                </svg>
              </div>
            </div>
            <div id="area-chart">

            </div>
            <div class="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
              <div class="flex justify-between items-center pt-5">
                <button
                  id="dropdownDefaultButton"
                  data-dropdown-toggle="lastDaysdropdown"
                  data-dropdown-placement="bottom"
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
                  type="button">
                  Last 7 days
                  <svg class="w-2.5 m-2.5 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
                  </svg>
                </button>
                <div id="lastDaysdropdown" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
                  <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Yesterday</a>
                    </li>
                    <li>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Today</a>
                    </li>
                    <li>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 7 days</a>
                    </li>
                    <li>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 30 days</a>
                    </li>
                    <li>
                      <a href="#" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Last 90 days</a>
                    </li>
                  </ul>
                </div>
                <a
                  href="#"
                  class="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500  hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                  Users Report
                  <svg class="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                  </svg>
                </a>
              </div>
            </div>
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
                : "bg-red-600 hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
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
