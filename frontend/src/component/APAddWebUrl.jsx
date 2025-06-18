import { useAdminContent } from "../context/AdminContentProvider";

export default function APAddWebUrl() {
    const {
        confirmationModal,
        setConfirmationModal,
        confirmDelete,
        cancelDelete,
        successAlertMessage,
        setSuccessAlertMessage,
        fileUpload,
        setFileUpload,
        documents,
        setDocuments,
        showDocPanel,
        setShowDocPanel,
        websiteUpload,
        setWebsiteUpload,
        websites,
        setWebsites,
        showWebsiteDocPanel,
        setShowWebsiteDocPanel,
        handleDocsUpload,
        handleWebsiteDocsUpload,
        handleDeleteDoc,
        hanldeDeleteWebsiteDoc
      } = useAdminContent();

    const handleWebsiteSelect = (url)=>{
        if(url){
            setWebsiteUpload(url);
            console.log("Website uploaded: ", url);
        }
    }
    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900">Add Web URLs</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Add web address you wish to scrape .</p>
                </div>
                <form className="mt-5 flex flex-col sm:items-center">
                    <div className="w-full flex flex-col sm:max-w-xs">
                        {/* <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="title"
                            aria-label="title"
                            className="block mb-4 w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        /> */}
                        <input
                            id="url"
                            required
                            name="eurlmail"
                            type="url"
                            onChange={(e) => handleWebsiteSelect(e.target.value)}
                            placeholder="https://example.com"
                            aria-label="url"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    <div className="flex flex-row mt-6">
                        <button
                            type="submit"
                            onClick={handleWebsiteDocsUpload}
                            disabled={!websiteUpload}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                        >
                            Start Scraping
                        </button>
                        <button
                            onClick={()=>{setShowWebsiteDocPanel(false)}}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:ml-3 sm:mt-0 sm:w-auto"
                        >
                            Discard
                        </button>
                    </div>
                    
                </form>
            </div>
        </div>
    )
}