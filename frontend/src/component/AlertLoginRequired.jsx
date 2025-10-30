import { useNavigate } from "react-router-dom"
import { useAdminContent } from "../context/AdminContentProvider";

export default function AlertLoginRequired() {
    const {setAlertLogin} = useAdminContent();

    const navigate = useNavigate();

    return (
        <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base font-semibold text-gray-900">Session Timeout</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>Your session has expired for security reasons.</p>
                    <p> Please sign in again or return to the home page.</p>
                </div>

                <div className="flex flex-row mt-6">
                    <button
                        type="button"
                        onClick={() => {
                            navigate("/login")
                            setAlertLogin(false)
                        }}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
                    >
                        Login Back
                    </button>
                    <button
                        onClick={() => { 
                            navigate("/")
                            setAlertLogin(false)
                         }}
                        className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:ml-3 sm:mt-0 sm:w-auto"
                    >
                        Back to Main Page
                    </button>
                </div>

            </div>
        </div>
    )
}