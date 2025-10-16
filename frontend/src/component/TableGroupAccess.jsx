import { useEffect, useState } from "react"
import APUploadGroupAccessFile from "./APUploadGroupAccessFile"
import { getUsersOfAdmin } from "../services/adminService";

const items = [
    { email: 'you@example.com' },
    // More people...
]

export default function TableGroupAccess() {
    const [showPanel, setShowPanel] = useState(false);

    const [usersEmail, setUsersEmail] = useState([]);
    useEffect(()=>{
        const fetchUsersEmail = async()=>{
            try {
                const response = await getUsersOfAdmin();
                const emails = response.data.map(user => user.email);
                console.log("Fetch user email under admin: ", emails);
                setUsersEmail(emails);
            } catch (error) {
                console.error("Failed to fetch users under admin :", error);
            }
        }
        fetchUsersEmail();
    },[])

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Invite users to access your chatbot
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={()=>setShowPanel(true)}
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Import CSV
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Email
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {usersEmail.map((email) => (
                                    <tr key={email}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                                            {email}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-red-500 hover:text-red-700">
                                                Revoke Access<span className="sr-only">, {email}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <APUploadGroupAccessFile/>
                </div>
            )}
        </div>
    )
}