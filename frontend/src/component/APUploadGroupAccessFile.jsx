import { useState, useRef } from "react"
import { useAdminContent } from "../context/AdminContentProvider";
import AlertSuccess from "./AlertSuccess";

export default function APUploadGroupAccessFile() {

    const {
        isLoading,
        handleInviteUser,
        setShowGroupAccessPanel,
    } = useAdminContent();

    const fileInputRef = useRef(null);
    const [fileUpload, setFileUpload] = useState(null);

    const handleFileSelect = (file) => {
        if (file) {
            setFileUpload(file);
            console.log('Uploaded file', file);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileSelect(file);
    }

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900">Upload Excel File</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Use an Excel file with one column containing user emails.</p>
                    <p>See the documentation for upload guidelines.</p>
                </div>
                <form className="mt-5 flex flex-col sm:items-center" >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".xlsx"
                        className="hidden"
                    />
                    {!fileUpload ? (
                        <button
                            onClick={handleButtonClick}
                            type="button"
                            className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                                className="mx-auto size-12 text-gray-400"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                />
                            </svg>
                            <span className="mt-2 block text-sm font-semibold text-gray-900">Upload a file</span>
                        </button>
                    ) : (
                        <div className="mt-4 text-sm text-gray-800">
                            <span className="font-semibold">Selected file:</span> {fileUpload.name}
                        </div>
                    )
                    }

                    {fileUpload && (
                        <button
                            type="button"
                            onClick={() => setFileUpload(null)}
                            className="mt-2 text-sm text-red-600 hover:underline"
                        >
                            Remove file
                        </button>
                    )}

                    <div className="flex flex-row mt-6">
                        <button
                            type="button"
                            onClick={() => {
                                handleInviteUser(fileUpload)
                            }}
                            disabled={!fileUpload || isLoading}
                            className={`mt-3 inline-flex w-full items-center justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  sm:ml-3 sm:mt-0 sm:w-auto
                                ${isLoading ?
                                    "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                }`
                            }
                        >
                            Start
                        </button>
                        <button
                            disabled={isLoading}
                            onClick={() => {
                                setShowGroupAccessPanel(false)
                                setFileUpload(null)
                            }}
                            className={`mt-3 inline-flex w-full items-center justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:mt-0 sm:w-auto
                                ${isLoading ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-600 hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                }`
                            }
                        >
                            Discard
                        </button>
                    </div>

                </form>
            </div>

        </div>
    )
}