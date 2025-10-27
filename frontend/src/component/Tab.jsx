import { ChevronDownIcon } from '@heroicons/react/16/solid'

// const tabs = [
//   { name: 'My Account', href: '#', current: false },
//   { name: 'Company', href: '#', current: false },
//   { name: 'Team Members', href: '#', current: true },
//   { name: 'Billing', href: '#', current: false },
// ]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Tab({ tabs, activeTab, setActiveTab }) {
    return (
        <div>
            <div className="grid grid-cols-1 sm:hidden">
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    aria-label="Select a tab"
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-2 pl-3 pr-8 text-base text-gray-900  outline-1 -outline-offset-1 outline-gray-300  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                >
                    {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                    ))}
                </select>
                <ChevronDownIcon
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end fill-gray-500"
                />
            </div>
            <div className="hidden sm:block">
                <nav aria-label="Tabs" className="flex space-x-4">
                    {tabs.map((tab) => (
                        <a
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={`
                                px-4 py-2 text-sm font-medium
                                ${activeTab === tab.name
                                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                }
                            `}
                        >
                            {tab.name.toUpperCase()}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    )
}