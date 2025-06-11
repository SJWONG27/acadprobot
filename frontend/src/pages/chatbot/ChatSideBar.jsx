import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { WindowIcon } from '@heroicons/react/24/outline'
import { format } from "date-fns"

const chatSession = [
  { name: 'Chat 1', href: '#', current: false },
  { name: 'Chat 2', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatSideBar({ isSidebarOpen, toggleSidebar, chatSessions, selectedSessionId, setSelectedSessionId }) {

  return (
    <div className="w-full">
      <nav aria-label="Sidebar" className="flex flex-1 flex-col p-6">
        <div className='flex flex-row justify-between items-center '>
          <a href="/" className="flex-shrink-0">
            <img
              alt="AcadProBot"
              src={logo_acadprobot_long}
              className="w-40 "
            />
          </a>
          <WindowIcon 
            aria-hidden="true" 
            className="size-6" 
            onClick={toggleSidebar} 
          />
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
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className='self-end'>
                    <span className="text-xs italic font-light">{format(new Date(item.created_at), 'MMM dd, h:mm a')}</span>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

  )
}