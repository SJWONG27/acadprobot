import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { WindowIcon } from '@heroicons/react/24/outline'


const chatSession = [
  { name: 'Chat 1', href: '#', current: false },
  { name: 'Chat 2', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ChatSideBar({ isSidebarOpen, toggleSidebar }) {
  return (
    <div className="w-full">
      <nav aria-label="Sidebar" className="flex flex-1 flex-col p-6">
        <div className='flex flex-row justify-between items-center'>
          <a href="/">
              <img
              alt="AcadProBot"
              src={logo_acadprobot_long}
              className="w-40 "
            />
          </a>
          <WindowIcon aria-hidden="true" className="size-6" onClick={toggleSidebar} />
        </div>
        <div className="text-xs/6 font-semibold text-gray-400">Chat History</div>
        <ul role="list" className="-mx-2 mt-2 space-y-1">
          {chatSession.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? 'bg-gray-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600',
                  'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold',
                )}
              >
                <span className="truncate">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>

  )
}