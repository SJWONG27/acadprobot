import { ArrowLeftStartOnRectangleIcon, ArrowRightEndOnRectangleIcon, UserCircleIcon } from '@heroicons/react/20/solid'
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid'

import AlertSuccess from '../../component/AlertSuccess.jsx'
import logo_acadprobot_square from '../../../src/assets/logo_acadprobot_square.svg'
import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../../services/authService.js'
import { 
    joinChatbot, 
    getChatbotUnderUser 
} from '../../services/chatbotService.js'

import {useChatContent} from '../../context/ChatContentProvider.jsx'

const people = [
    {
        name: 'Computer Science',
        title: '2025 Jun 24',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Computer Science',
        title: '2025 Jun 24',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Computer Science',
        title: '2025 Jun 24',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Computer Science',
        title: '2025 Jun 24',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    {
        name: 'Computer Science',
        title: '2025 Jun 24',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60',
    },
    // More people...
]




export default function LisofChatbot() {

    const {
        setSelectedChatbotId
    } = useChatContent();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("acess_token");
        console.log("access_token after logout:", localStorage.getItem("access_token"));
        navigate('/');
    }

    const userNavigation = [
        { name: 'Sign out', href: '/' },
    ]

    const [successAlertMessage, setSuccessAlertMessage] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userId, setUserId] = useState("");
    const [refercode, setRefercode] = useState("");
    const [listChatbots, setListChatbots] = useState([]);

    const triggerAlert = (message) => {
        setSuccessAlertMessage(message);
        setTimeout(() => setSuccessAlertMessage(""), 5000);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("No token");
                return;
            }
            try {
                const data = await getCurrentUser(token);
                setUserEmail(data.data.email);
                setUserId(data.data.id);

            } catch (error) {
                console.error("Fetch user id error: ", error)
            }
        }
        fetchUser();
    }, [])

    useEffect(() => {
        const fetchChatbots = async () => {
            if (!userId) return;
            try {
                const data = await getChatbotUnderUser(userId);
                console.log(data);
                setListChatbots(data);
            } catch (error) {
                console.error("Fetch chatbots error: ", error)
            }
        }
        fetchChatbots();
    }, [userId])

    const handleJoinChatbot = async (userId, refercode) => {
        try {
            await joinChatbot(userId, refercode);
            triggerAlert("Chatbot Joined Successfully");
        } catch (error) {
            console.error("HandleJoinChatbot: ", error);
            triggerAlert("Chatbot not exist or dy joined");
        } finally {
            setRefercode("");
        }
    }

    const handleEnterChatbot = (chatbot_id) => {
        setSelectedChatbotId(chatbot_id);
        console.log(chatbot_id);
        // navigate("/chat");
        navigate(`/chat?chatbot_id=${chatbot_id}`);
    }

    return (
        <div className="relative p-8">
            <div className='flex flex-row justify-between items-center'>
                <div className="flex h-16 shrink-0 items-center">
                    <a href='/' className='flex flex-row '>
                        <img
                            alt="AcadProBot"
                            src={logo_acadprobot_square}
                            className="h-12 w-auto"
                        />
                        <img
                            alt="AcadProBot"
                            src={logo_acadprobot_long}
                            className="h-13 w-auto"
                        />
                    </a>
                </div>
                <div className="flex justify-end">
                    <Menu as="div" className="relative">
                        <MenuButton className="-m-1.5 flex items-center p-1.5">
                            <span className="sr-only">Open user menu</span>
                            <UserCircleIcon className="size-8" />
                            <span className="flex items-center">
                                <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900 hidden sm:inline">
                                    {userEmail}
                                </span>
                                <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                            </span>
                        </MenuButton>
                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                            {userNavigation.map((item) => (
                                <MenuItem key={item.name}>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none"
                                    >
                                        {item.name}
                                    </button>
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Menu>
                </div>
            </div>

            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'ellipse(70% 100% at 50% 0%)',
                        // 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    // className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-60deg bg-gradient-to-tr from-[#7c8ede] to-[#577ceb] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    className="relative top-0 left-1/2 -translate-x-1/2  w-[90vw] h-[90vh] bg-gradient-to-b from-[#dcd0ff] via-[#5245fc] to-[#fbfbfb] opacity-20 blur-3xl -z-10"
                />
            </div>
            <div className="mx-auto max-w-2xl text-center">
                <p className="mt-8 text-pretty text-lg font-bold text-blue-700 sm:text-xl/8">
                    List of Chatbots
                </p>
            </div>
            <div className='flex flex-row justify-center items-center self-center mt-8'>
                <input
                    id="refercode"
                    name="refercode"
                    type="text"
                    value={refercode}
                    onChange={(e) => setRefercode(e.target.value)}
                    placeholder="Input refercode to join a chatbot"
                    className=" w-5/12 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <button
                    onClick={() => handleJoinChatbot(userId, refercode)}
                    className="flex shrink-0 items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline -outline-offset-1 outline-gray-300 hover:bg-gray-50 focus:relative focus:outline focus:-outline-offset-2 focus:outline-indigo-600"
                >
                    Join
                </button>
            </div>
            <ul role="list" className="mt-8 grid grid-cols-1 gap-6 p-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {listChatbots.map((listChatbot) => (
                    <li
                        key={listChatbot.id}
                        className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-xl"
                    >
                        <div className="flex flex-1 flex-col p-8">
                            {/* <img alt="" src={person.imageUrl} className="mx-auto size-32 shrink-0 rounded-full" /> */}
                            <h3 className="mt-6 text-sm font-medium text-gray-900">{listChatbot.name}</h3>
                            <dl className="mt-1 flex grow flex-col justify-between">
                                <dt className="sr-only">Title</dt>
                                <dd className="text-sm text-gray-500">{listChatbot.refercode}</dd>
                            </dl>
                        </div>
                        <div>
                            <div className="-mt-px flex divide-x divide-gray-200">
                                <div className="flex w-0 flex-1">
                                    <a
                                        href={`mailto:${listChatbot.name}`}
                                        className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-red-700"
                                    >
                                        <ArrowLeftStartOnRectangleIcon aria-hidden="true" className="size-5 text-red-400" />
                                        Leave
                                    </a>
                                </div>
                                <div className="-ml-px flex w-0 flex-1">
                                    <a
                                        onClick={()=> handleEnterChatbot(listChatbot.id)}
                                        className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-blue-700"
                                    >
                                        <ArrowRightEndOnRectangleIcon aria-hidden="true" className="size-5 text-blue-400" />
                                        Enter
                                    </a>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {successAlertMessage && (
                <AlertSuccess
                    text={successAlertMessage}
                    onClose={() => setSuccessAlertMessage("")}
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
                />
            )}

        </div>
    )
}