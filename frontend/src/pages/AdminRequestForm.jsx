'use client'

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, Textarea, TransitionChild } from '@headlessui/react'
import logo_acadprobot_square from '../../src/assets/logo_acadprobot_square.svg'
import logo_acadprobot_long from '../../src/assets/logo_acadprobot_long.svg'
import { useNavigate } from 'react-router-dom'


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function AdminRequestForm() {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false)

    // const [user, setUser] = useState("eded");

    const user = [
        {
            "email": "meow",
        }
    ]

    return (
        <div className="h-full bg-white-900 p-10">
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
            <main>
                {/* Settings forms */}
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
                <div className="mx-auto max-w-2xl text-center my-10 ">
                    <p className="text-pretty text-lg font-bold text-blue-700 sm:text-xl/8">
                        Admin Access Request
                    </p>
                    <p className="text-pretty text-xs font-medium text-gray-700 sm:text-md">
                        Request Admin Access to Create Chatbot
                    </p>
                </div>

                <div className="w-full p-2">

                    <form className='grid grid-rows-2 place-items-center gap-x-8 gap-y-12'>
                        <div className='grid gap-y-7 gap-x-10 md:grid-cols-2'>
                            <div className="">
                                <h2 className="text-base/7 font-semibold text-black">Requester Information</h2>
                                <p className="mt-1 text-sm/6 text-gray-400">Please provide your personal information as follow.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="email" className="block text-sm/6 font-medium text-black">
                                        Email address
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user?.email || "null"}
                                            readOnly
                                            className="block w-full rounded-md bg-indigo-100 px-3 py-1.5 text-base text-black outline-1 -outline-offset-1 outline-indigo-100 placeholder:text-gray-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="fullname" className="block text-sm/6 font-medium text-black">
                                        Full Name
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-indigo-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                required
                                                maxLength={50}
                                                placeholder="Enter your full name"
                                                className="block min-w-0 grow bg-transparent py-1.5 pl-1 pr-3 text-base text-black placeholder:text-gray-500 focus:outline-0 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="fullname" className="block text-sm/6 font-medium text-black">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <div className="flex items-center rounded-md bg-white/5 pl-3 outline-1 -outline-offset-1 outline-indigo-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-500">
                                            <div className="shrink-0 select-none text-base text-gray-500 sm:text-sm/6"></div>
                                            <input
                                                id="fullname"
                                                name="fullname"
                                                type="text"
                                                required
                                                maxLength={30}
                                                placeholder="Mr. / Mrs. / Dr. / Prof."
                                                className="block min-w-0 grow bg-transparent py-1.5 pl-1 pr-3 text-base text-black placeholder:text-gray-500 focus:outline-0 sm:text-sm/6"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='grid gap-y-7 gap-x-10 md:grid-cols-2'>
                            <div>
                                <h2 className="text-base/7 font-semibold text-black">Chatbot Information</h2>
                                <p className="mt-1 text-sm/6 text-gray-400">Please provide details of chatbot you wish to create.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="chatbot-name" className="block text-sm/6 font-medium text-black">
                                        Desired Chatbot Name
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="chatbot-name"
                                            name="chatbot-name"
                                            type="text"
                                            maxLength={50}
                                            required
                                            placeholder='Enter your chatbot name'
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black  outline-1 -outline-offset-1 outline-indigo-300 placeholder:text-gray-500  focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="department-program" className="block text-sm/6 font-medium text-black">
                                        Department / Program
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="department-program"
                                            name="department-program"
                                            type="text"
                                            maxLength={50}
                                            required
                                            placeholder='Computer Science Department'
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black  outline-1 -outline-offset-1 outline-indigo-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="purpose" className="block text-sm/6 font-medium text-black">
                                        Purpose of Request
                                    </label>
                                    <div className="mt-2">
                                        <Textarea
                                            id="purpose"
                                            name="purpose"
                                            required
                                            rows={4}
                                            maxLength={600}
                                            placeholder='Briefly describe why you need to create the following chatbot'
                                            // className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all duration-200"
                                            className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black  outline-1 -outline-offset-1 outline-indigo-300 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="mt-6 grid gap-y-5 md:grid-cols-2 gap-x-5 md:w-5/12">
                            <button
                                type="submit"
                                className="rounded-md  bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Submit Request
                            </button>
                            <button
                                onClick={()=>navigate("/")}
                                className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                                Back to Home
                            </button>
                        </div>
                    </form>

                </div>
            </main>
        </div>
    )
}