import React from 'react'
import TableFAQsUpdate from '../../component/TableFAQsUpdate'

const FAQsManager = () => {
  return (
    <div>
      <div className='mx-auto pt-2 pb-4 font-bold text-xl text-indigo-600'>
        <p>FAQs Manager</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div>
          <div className='mt-12 mb-8'>
            <TableFAQsUpdate />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQsManager
