import Link from 'next/link';
import React from 'react'
import { AiOutlineUserSwitch, AiOutlineLock } from "react-icons/ai";

const Login = () => {
  return (
    <>
        <div className='min-h-dvh w-full font-Poppins bg-[#FF4A20] grid grid-cols-2'>
            <div className='bg-gradient-to-r from-[#ff0000] to-[rgba(0,0,0,0)] pt-30 pl-10'>
                <p className='text-white text-center text-7xl leading-none tracking-tight font-bold'>YOUR HEALTH <br /> IS A PRIORITY!</p>
                <img className='mt-30 mb-0 ml-auto mr-auto h-110' src="/wellH2o.png" alt="H2O" />
            </div>
            <div className='relative'>
                <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] h-150 w-110 rounded-2xl p-10 bg-white'>
                    <img className='mt-0 mb-0 ml-auto mr-auto' src="/swasthyasync.svg" alt="Swasthya Sync" />
                    <p className='text-center py-4 text-[#FF4A20] font-bold text-5xl'>Sync Yourself</p>

                    {/* Form */}
                    <form className='flex flex-col justify-center items-center gap-3 h-100'>
                        <div className='w-75'>
                            <div className='flex items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineUserSwitch /></span>
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                className='focus:outline-none w-full bg-transparent'
                            />
                            </div>
                            {/* {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>} */}
                        </div>
                        <div className='w-75'>
                            <div className='flex items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineLock /></span>
                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                className='focus:outline-none w-full bg-transparent'
                            />
                            </div>

                        </div>
                        <div className='pt-5 pb-2'>
                            <button type="submit" className='bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg mr-3'>Log in</button>
                            <button type="button" className='bg-[#FF4A20] font-semibold text-white cursor-pointer px-4 py-2 rounded-lg'>
                                <img className='inline mr-2 h-6' src="/GoogleWhiteIco.png" alt="Google Icon" /> Sign in with Google
                            </button>
                        </div>
                        <p>Not a user? <Link href={'/Signup'}><span className='underline'>Sign up</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login