import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { WindowIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { format } from "date-fns"
import { useChatContent } from '../../context/ChatContentProvider'


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatSideBar() {
  const {
    confirmDelete,
    isSidebarOpen,
    chatSessions,
    selectedSessionId,
    setSelectedSessionId,
    toggleSidebar,
    toggleNewChat,
  } = useChatContent();

  if (!isSidebarOpen) return null;

  return (
    <div className="w-full">
      <nav aria-label="Sidebar" className="flex flex-1 flex-col p-6">
        <div className='flex flex-row justify-between items-center'>
          <a href="/" className="flex flex-row items-center mr-2.5">
            <img
              alt="AcadProBot"
              src={logo_acadprobot_long}
              className="w-50 h-auto object-fill"
            />
          </a>
          <div className='flex flex-row'>
            <PencilSquareIcon
              aria-hidden="true"
              className="size-6"
              onClick={toggleNewChat}
            />
            <WindowIcon
              aria-hidden="true"
              className="size-6"
              onClick={toggleSidebar}
            />
          </div>
        </div>
        <div className="text-xs/6 font-semibold text-gray-400">Chat History</div>
        <ul role="list" className="-mx-2 mt-2 space-y-1 ">

          {chatSessions.map((item) => {
            const isActive = item.id === selectedSessionId || item.session_id === selectedSessionId;
            const id = item.session_id || item.id; // handle both backend + temp sessions

            return (
              <li key={id}>
                <a
                  onClick={() => setSelectedSessionId(id)}
                  className={classNames(
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600',
                    'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold cursor-pointer'
                  )}
                >
                  <div className='truncate flex flex-col w-full'>
                    <div className='truncate'>
                      {/* Show placeholder title if missing */}
                      {item.title || "Untitled Chat"}
                      {item.temp && <span className="italic text-gray-400"> (pending)</span>}
                    </div>

                    {/* Only show date if exists */}
                    {item.created_at && (
                      <div className='self-end'>
                        <span className="text-xs font-light">
                          {format(new Date(item.created_at), 'MMM dd, h:mm a')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Disable delete icon for temp sessions */}
                  {!item.temp && (
                    <TrashIcon
                      aria-hidden="true"
                      className="size-5 self-center cursor-pointer hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent selecting session when deleting
                        confirmDelete(id);
                      }}
                    />
                  )}
                </a>
              </li>
            );
          })}
          
        </ul>
      </nav>
    </div>

  )
}