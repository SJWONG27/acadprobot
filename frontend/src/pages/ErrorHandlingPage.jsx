import logo_acadprobot_square from '../../src/assets/logo_acadprobot_square.svg'
import logo_acadprobot_long from '../../src/assets/logo_acadprobot_long.svg'
import { useNavigate } from 'react-router-dom';

export default function ErrorHandlingPage() {

    const navigate = useNavigate();

    const handleClickRefresh = () => {
        localStorage.removeItem("token");
        navigate("/");
    }
    return (
        <div className="bg-white">
            <div className='flex flex-row px-6 py-5'>
                <img
                    alt=""
                    src={logo_acadprobot_square}
                    className="h-14 w-auto"
                />
                <img
                    alt=""
                    src={logo_acadprobot_long}
                    className="h-14 w-auto"
                />
            </div>
            <div className="align-center px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="text-balance text-4xl font-bold tracking-tight text-red-600 sm:text-6xl">
                        Error Reaching The Page
                    </h1>
                    <p className="mx-auto mt-6 max-w-xl text-pretty text-lg/8 text-gray-600">
                        Opps! You have encountered an unexpected error when trying to reach the page. Please click the button below and try again.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <a
                            onClick={handleClickRefresh}
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Back to Main Page
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}