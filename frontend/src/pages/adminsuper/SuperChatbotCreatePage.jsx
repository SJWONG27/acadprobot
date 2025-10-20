import { useSuperAdminContent } from '../../context/SuperAdminContentProvider'
import ConfirmationModal from '../../component/ConfirmationModal';
import TableListOfChatbots from '../../component/TableListOfChatbots'

const SuperChatbotCreatePage = () => {
  const {
    chatbotName,
    setChatbotName,
    adminEmail,
    setAdminEmail,
    handleChatbotCreate,
    handleDeleteChatbot,
    cancelDelete,
    confirmationModal,
  } = useSuperAdminContent();
  

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) return;

  //   getDocs(token)
  //     .then((data) => setDocuments(data))
  //     .catch((err) => console.error("Failed to fetch documents:", err));

  //   getWebsiteDocs(token)
  //     .then((data) => setWebsites(data))
  //     .catch((err) => console.error("Failed to website url:", err));
  // }, []);

  return (
    <div>
      <div className='mx-auto pt-2 pb-4 mb-8 font-bold text-xl text-indigo-600'>
        <p>Chatbot Management</p>
      </div>

      <div className='flex flex-col pb-3'>
        <div className="divide-y divide-white/5">
          <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-1 py-4 sm:px-6 md:grid-cols-3 lg:px-1">
            <div>
              <h2 className="text-base/7 font-semibold text-indigo-600">Create Chatbot</h2>
              <p className="mt-1 text-sm/6 text-gray-500">Customize the chatbot for the admins</p>
            </div>

            <form className="md:col-span-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">

                <div className="col-span-full">
                  <label htmlFor="chatbotname" className="block text-sm/6 font-medium text-black">
                    Chatbot Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="chatbotname"
                      name="chatbotname"
                      type="text"
                      placeholder='name_chatbot'
                      value={chatbotName}
                      onChange={(e) => setChatbotName(e.target.value)}
                      className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="col-span-full">
                  <label htmlFor="email" className="block text-sm/6 font-medium text-black">
                    Admin Email Assigned To
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder='admin@gmail.com'
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black  outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex">
                <button
                  onClick={() => handleChatbotCreate(chatbotName, adminEmail)}
                  className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Generate Chatbot
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='flex flex-col pb-3 mt-8'>
        <div>
          <p className='font-semibold text-lg text-indigo-600'>List of Chatbots</p>
          <div className='mt-12 mb-8'>
            <TableListOfChatbots />
          </div>
        </div>
      </div>

{/* 
      {successAlertMessage && (
        <AlertSuccess
          text={successAlertMessage}
          onClose={() => setSuccessAlertMessage("")}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        />
      )} */}

      {confirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10">
              <ConfirmationModal
                title="Delete Confirmation"
                onConfirm={handleDeleteChatbot}
                onCancel={cancelDelete}
              />
            </div>
        </div>
      )}

      {/* {confirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative z-10">
              <ConfirmationModal
                title="Delete Confirmation"
                // onConfirm={hanldeDeleteWebsiteDoc}
                onConfirm={deleteTarget === "document" ? handleDeleteDoc : hanldeDeleteWebsiteDoc}
                onCancel={cancelDelete}
              />
            </div>
        </div>
      )} */}


    </div>
  )
}

export default SuperChatbotCreatePage
