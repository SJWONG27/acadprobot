import { useSuperAdminContent } from "../context/SuperAdminContentProvider"


export default function APReviewApproveRequest() {

    const {
        handleApproveRequest,
        requestRemark,
        setRequestRemark,
        setShowAPReviewApproveRequest
    } = useSuperAdminContent();


    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900">Review Request</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Add remarks for the review</p>
                </div>
                <form className="mt-5 flex flex-col sm:items-center">
                    <div className="w-full flex flex-col sm:max-w-xs">
                        <input
                            id="remark"
                            name="remark"
                            type="text"
                            placeholder="remark"
                            value={requestRemark}
                            onChange={(e) => setRequestRemark(e.target.value)}
                            aria-label="remark"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                    </div>
                    <div className="flex flex-row mt-6">
                        <button
                            type="button"
                            onClick={()=>{
                                handleApproveRequest();
                                setShowAPReviewApproveRequest(false);
                            }}
                            className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            onClick={()=>{setShowAPReviewApproveRequest(false)}}
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