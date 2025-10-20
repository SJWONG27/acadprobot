import React, { useEffect, useState } from 'react'
import TableGroupAccess from '../../component/TableGroupAccess'
import { getCurrentUser } from '../../services/authService'
import Toggles from '../../component/Toggles'
import { ArrowPathIcon } from '@heroicons/react/24/solid'


const SuperAdminAccessPage = () => {
  const [refercode, setRefercode] = useState("");
  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token available");
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setRefercode(data.data.refercode);
      } catch (error) {
        console.log("Group access (refercode): ", error)
      }
    }
    fetchAdmin();
  }, [])

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 font-bold text-xl text-indigo-600'>
        <p>Admin Access</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div className='flex flex-row self-center justify-between mt-4 border-2 border-indigo-300 p-2 w-min rounded-md shadow-md'>
          <div className='flex flex-col self-center mr-1.5'>
            <span className='text-xs font-light'>Refer Code: </span>
            {/* <span className='text-indigo-500 text-center text-xl font-semibold mb-1'>{refercode}</span> */}
            <span className='text-indigo-500 text-center text-xl font-semibold mb-1'>23232323</span>
          </div>
          <div className='self-center justify-center'>
            <button
              type="button"
              className="rounded-full bg-indigo-600 p-1.5 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ArrowPathIcon aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
        <div className='mt-12'>
          <TableGroupAccess />
        </div>
      </div>
    </div>
  )
}

export default SuperAdminAccessPage
