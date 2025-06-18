import APAddDocs from "./APAddDocs";
import { useAdminContent } from "../context/AdminContentProvider";
import { uploadDocs, getDocs, uploadWebsiteDocs, getWebsiteDocs, deleteDocument, deleteWebsiteDocument } from '../services/adminService'
import { useEffect } from "react";

export default function TableDocScraping() {
    const {
        confirmDelete,
        documents,
        setDocuments,
        showDocPanel,
        setShowDocPanel,
        setWebsites,
    } = useAdminContent();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;
    
        getDocs(token)
          .then((data) => setDocuments(data))
          .catch((err) => console.error("Failed to fetch documents:", err));
    
        getWebsiteDocs(token)
        .then((data) => setWebsites(data))
        .catch((err) => console.error("Failed to website url:", err));
      }, []);

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold text-gray-900">Documents</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of documents to be scraped (max. 10).
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <button
                        onClick={() => setShowDocPanel(true)}
                        type="button"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Add Docs
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
                                        Title
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        Progress
                                    </th>
                                    {/* <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">View</span>
                                    </th> */}
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                        <span className="sr-only">Delete</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {documents.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                                            {doc.filename}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{doc.status}</td>
                                        {/* <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <a href="#" className="text-indigo-500 hover:text-indigo-700">
                                                View<span className="sr-only">, {doc.filename}</span>
                                            </a>
                                        </td> */}
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                            <button
                                                onClick={() => confirmDelete(doc.id)}
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

            {showDocPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
                    <APAddDocs
                        // fileUpload={fileUpload}
                        // setFileUpload={setFileUpload}
                        // handleDocsUpload={handleDocsUpload}
                        // setShowDocPanel={setShowDocPanel}
                        // successAlertMessage={successAlertMessage}
                        // setSuccessAlertMessage={setSuccessAlertMessage}
                    />
                </div>
            )}
        </div>
    )
}