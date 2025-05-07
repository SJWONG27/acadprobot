import React from 'react'
import TableGroupAccess from '../../component/TableGroupAccess'

const GroupAccessPage = () => {
  return (
    <div>
      <div className='mx-auto pt-2 pb-4 font-bold text-xl text-indigo-600'>
        <p>Group Access</p>
      </div>

      <div className='flex flex-col pb-3'>
          <div className='flex flex-col self-center mt-4 border-2 border-indigo-300 p-2 w-2/12 rounded-md shadow-md'>
            <span className='text-xs font-light'>Refer Code: </span>
            <span className='text-indigo-500 text-center text-xl font-semibold mb-1'>5gT781</span>
          </div>
          <div className='mt-12'>
            <TableGroupAccess/>
          </div>
      </div>
    </div>
  )
}

export default GroupAccessPage
