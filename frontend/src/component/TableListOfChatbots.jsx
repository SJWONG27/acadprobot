import { useEffect, useState } from "react"
import APUploadGroupAccessFile from "./APUploadGroupAccessFile"
import ConfirmationModal from "./ConfirmationModal";
import { getUsersOfAdmin } from "../services/adminService";
import { getAllChatbots } from "../services/superadminService";
import { format } from "date-fns"
import { useSuperAdminContent } from "../context/SuperAdminContentProvider";


export default function TableListOfChatbots() {

    const {
        chatbots,
        setChatbots,
        confirmDelete,
    } = useSuperAdminContent();

    // const [showPanel, setShowPanel] = useState(false);


    useEffect(()=>{
        const fetchChatbotsDetails = async()=>{
            try {
                const response = await getAllChatbots();
                console.log(response);
                setChatbots(response);
            } catch (error) {
                console.error("Failed to fetch chatbots :", error);
            }
        }
        fetchChatbotsDetails();
    },[])

    return (
        <div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Chatbot Name
                                    </th>
                                     <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Refer Code
                                    </th>
                                     <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Created_at
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {chatbots.map((chatbot) => (
                                    <tr key={chatbot.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                                            {chatbot.name}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                                            {chatbot.refercode}
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-0">
                                            {format(new Date(chatbot.created_at), 'yyy MMM dd, h:mm a')}
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button
                                                onClick={() => confirmDelete(chatbot.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* {showPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <ConfirmationModal/>
                </div>
            )} */}
        </div>
    )
}