import React from 'react'
import Toggles from '../../component/Toggles'
import FrequencyCustom from '../../component/FrequencyCustom'
import TableWebScraping from '../../component/TableWebScraping'
import TableDocScraping from '../../component/TableDocScraping'


const ChatbotContentPage = () => {
  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Chatbot Content</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>Web Scraping</p>
          <div className='flex flex-row justify-between mt-8'>
            <div className='flex flex-row w-md'>
              <span className='mr-4'>Auto Update</span>
              <Toggles />
            </div>
            <div className='flex w-md'>
              <FrequencyCustom />
            </div>
          </div>
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


    </div>
  )
}

export default ChatbotContentPage
