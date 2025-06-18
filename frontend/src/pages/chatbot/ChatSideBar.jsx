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
        <ul role="list" className="-mx-2 mt-2 space-y-1">
          {chatSessions.map((item) => (
            <li key={item.title}>
              <a
                onClick={() => setSelectedSessionId(item.session_id)}
                className={classNames(
                  item.session_id === selectedSessionId
                    ? 'bg-indigo-100 text-indigo-700' // active style
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600', // default style
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                )}
              >
                <div className='truncate flex flex-col w-full'>
                  <div className='truncate'>
                    {item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}
                  </div>
                  <div className='self-end'>
                    <span className="text-xs  font-light">{format(new Date(item.created_at), 'MMM dd, h:mm a')}</span>
                  </div>
                </div>
                <TrashIcon
                  aria-hidden="true"
                  className="size-5 self-center"
                  onClick={() => confirmDelete(item.session_id)}
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

  )
}