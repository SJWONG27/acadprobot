import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { WindowIcon, TrashIcon, PencilSquareIcon, RocketLaunchIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'
import { format } from "date-fns"
import { useChatContent } from '../../context/ChatContentProvider'
import { useNavigate } from "react-router-dom";
// import AlertLoginRequired from '../../component/AlertLoginRequired';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatSideBar() {

  const {
    handleClickRocket,
    handleLogout,
    confirmDelete,
    isSidebarOpen,
    chatSessions,
    selectedSessionId,
    setSelectedSessionId,
    toggleSidebar,
    toggleNewChat,
  } = useChatContent();

  const tools = [
    {
      "icon": PencilSquareIcon,
      "desc": "New Chat",
      "action": toggleNewChat
    },
    {
      "icon": RocketLaunchIcon,
      "desc": "Chatbots",
      "action": handleClickRocket
    },
    {
      "icon": BuildingLibraryIcon,
      "desc": "Main menu",
      "action": handleLogout
    },
  ]

  if (!isSidebarOpen) return null;

  return (
    <div className="w-full h-full">
      <nav aria-label="Sidebar" className="flex flex-1 flex-col py-2">
        <div className='flex flex-row justify-between items-center px-4'>
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

        <div className="flex flex-col gap-3 px-4 ">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const Action = tool.action;
            return (
              <div
                key={index}
                className="group flex items-center gap-3 py-2.5 px-2 space-x-3 rounded-md hover:bg-indigo-100 cursor-pointer"
                onClick={Action}
              >
                <Icon className="h-5 w-5 text-gray-600 group-hover:text-indigo-600" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-indigo-600">{tool.desc}</span>
              </div>
            )
          })}
        </div>

        <div className="text-xs/6 mt-8 font-semibold px-4 text-gray-400">Chat History</div>
        <div className='overflow-y-scroll h-screen px-4'>
          <ul role="list" className="-mx-2 mt-2 space-y-1">

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
                      'group flex gap-x-3 rounded-md px-4 py-2 text-sm/6 font-semibold cursor-pointer'
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
        </div>
      </nav>

    </div>

  )
}