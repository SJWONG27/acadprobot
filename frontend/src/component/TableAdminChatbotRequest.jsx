import { useEffect, useState } from "react"
import React from "react";
import APReviewApproveRequest from "./APReviewApproveRequest";
import APReviewRejectRequest from "./APReviewRejectRequest";
import APUploadGroupAccessFile from "./APUploadGroupAccessFile"
import { useSuperAdminContent } from "../context/SuperAdminContentProvider";
import { formatInTimeZone } from 'date-fns-tz'


export default function TableAdminChatbotRequest({ status, description }) {

    const {
        requestSubmitted, 
        setSelectedRequest,
        showAPReviewApproveRequest, setShowAPReviewApproveRequest,
        showAPReviewRejectRequest, setShowAPReviewRejectRequest
    } = useSuperAdminContent();

    const [expandedRowId, setExpandedRowId] = useState(null);

    const toggleRow = (id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    };

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">{status.toUpperCase()}</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        {description}
                    </p>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Name
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Email
                                    </th>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                                        Department
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Action</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {requestSubmitted
                                    .filter((request) => request.status === status)
                                    .map((request) => (
                                        <React.Fragment key={request.id}>
                                            {/* MAIN ROW */}
                                            <tr className=" transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-700 sm:pl-0">
                                                    {request.title} {request.fullname}
                                                </td>
                                                <td className="whitespace-nowrap py-4 text-sm text-gray-500">{request.email}</td>
                                                <td className="whitespace-nowrap py-4 text-sm text-gray-500">{request.department_program}</td>

                                                <td className="grid place-items-center text-sm font-bold gap-y-2 py-2">
                                                    <button
                                                        onClick={() => toggleRow(request.id)}
                                                        className="bg-gray-200 text-gray-700 px-4 py-1 rounded-sm hover:bg-gray-300"
                                                    >
                                                        {expandedRowId === request.id ? "Hide" : "Details"}
                                                    </button>

                                                    {status === "pending" && (
                                                        <div className="grid place-items-center text-sm font-bold gap-y-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedRequest(request)
                                                                    setShowAPReviewApproveRequest(true);
                                                                }}
                                                                className="bg-indigo-500 text-white px-3 py-1 rounded-sm hover:bg-indigo-200"
                                                            >
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedRequest(request)
                                                                    setShowAPReviewRejectRequest(true);
                                                                }}
                                                                className="bg-red-500 text-white px-5 py-1 rounded-sm hover:bg-red-200"
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>

                                            {/* EXPANDED DETAILS ROW */}
                                            {expandedRowId === request.id && (
                                                <tr className="bg-indigo-50 transition-all">
                                                    <td colSpan="4" className="px-6 py-4 text-sm text-gray-800 border-t-indigo-300">
                                                        <div className="space-y-2">
                                                            <p>
                                                                <strong>Chatbot Name Proposed</strong>
                                                            </p>
                                                            <p>{request.chatbot_name}</p>
                                                            <p>
                                                                <strong>Purpose</strong>
                                                            </p>
                                                            <p> {request.purpose}</p>
                                                            <p>
                                                                <strong>Submitted At</strong>
                                                            </p>
                                                            <p>{formatInTimeZone(request.submitted_at + 'Z', 'Asia/Singapore', 'MMM dd, h:mm a')}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {showAPReviewApproveRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <APReviewApproveRequest />
                </div>
            )}
            {showAPReviewRejectRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <APReviewRejectRequest />
                </div>
            )}
        </div>
    )
}