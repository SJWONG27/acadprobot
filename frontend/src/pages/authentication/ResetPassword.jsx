import AlertSuccess from '../../component/AlertSuccess.jsx'
import logo_acadprobot_square from '../../../src/assets/logo_acadprobot_square.svg'
import logo_acadprobot_long from '../../../src/assets/logo_acadprobot_long.svg'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { CheckBadgeIcon } from '@heroicons/react/20/solid'


export default function ResetPassword() {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [refercode, setReferCode] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(true);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
        checkPasswordMatch(newPassword, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        checkPasswordMatch(password, newConfirmPassword);
    };

    const checkPasswordStrength = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        console.log(regex.test(password)); // To check the regex test
        setPasswordStrength(regex.test(password));
    };

    const checkPasswordMatch = (password, confirmPassword) => {
        setPasswordMatch(password === confirmPassword);
    };

    const [successModal, setSuccessModal] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {

            // const data = await register(email, password, refercode);
            setSuccessModal(true);
        } catch (error) {
            console.error("Register Error: ", error)
        }
    }

    return (
        <div className="relative p-8 ">
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

            {!successModal ?
                <div>
                    <div className="mx-auto max-w-2xl text-center mb-10">
                        <p className="mt-8 text-pretty text-lg font-bold text-blue-700 sm:text-xl/8">
                            Password Reset
                        </p>
                    </div>

                    <form className="w-9/12 space-y-12 px-10 py-10 bg-white shadow-2xl rounded-2xl justify-self-center">
                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={!showPassword ? "password" : "text"}
                                    maxLength={50}
                                    required
                                    autoComplete="current-password"
                                    placeholder='Min. 8 chars with letters, numbers, symbols'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (<EyeSlashIcon className="size-5" />) : (<EyeIcon className="size-5" />)}
                                </button>
                            </div>
                            {!passwordStrength && (
                                <p className="text-xs text-red-500 mt-1">Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmpassword" className="block text-sm/6 font-medium text-gray-900">
                                Confirm Password
                            </label>
                            <div className="mt-2 relative">
                                <input
                                    id="confirmpassword"
                                    name="confirmpassword"
                                    maxLength={50}
                                    type={!showConfirmPassword ? "password" : "text"}
                                    required
                                    autoComplete="current-password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder='Must match with password above'
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (<EyeSlashIcon className="size-5" />) : (<EyeIcon className="size-5" />)}
                                </button>
                            </div>
                            {!passwordMatch && (
                                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                onClick={handleResetPassword}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Reset Password
                            </button>
                        </div>
                    </form>
                </div> :

                <div className='mt-18 flex flex-col place-content-center place-items-center w-9/12 space-y-6 px-10 py-15 bg-green-100 rounded-2xl shadow-2xl justify-self-center'>
                    <CheckBadgeIcon className='size-20 fill-green-500' />
                    <p className='text-pretty text-lg font-semibold text-blue-700 sm:text-xl/8'>Password Reset Successfully</p>
                    <p className='text-pretty text-md font-semibold text-gray-700 sm:text-sm'>Back to the main page to login</p>
                </div>
            }

        </div>
    )
}