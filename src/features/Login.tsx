'use client'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineUserSwitch, AiOutlineLock } from "react-icons/ai";
import { supabase } from '../lib/supabaseClient';
// import { LiaAwardSolid } from 'react-icons/lia';

const Login = () => {

    const[email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const[error, setError] = useState('')
    const navigate = useNavigate();

    const handleSignIn = async(e: React.FormEvent)=>{
        e.preventDefault()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            setError(`Error: ${error}`)
            return
        }
        const user = data.user
        const session = data.session
        if(session){
            console.log(`Signed in user: ${user}`)
        }
        navigate('/dashboard')
        
    }
    const handleSignInWithGoogle = async(e:React.FormEvent)=>{
        e.preventDefault();
        console.log('pending')
    }
  return (
    <>
        <div className='min-h-dvh w-full font-Poppins bg-[#FF4A20] grid md:grid-cols-2 grid-cols-1 grid-rows-3'>
            <div className='md:bg-gradient-to-r from-[#ff0000] to-[rgba(0,0,0,0)] md:pt-30 pt-10 md:pl-10'>
                <p className='text-white text-center text-3xl sm:text-5xl md:text-7xl leading-none tracking-tight font-bold'>YOUR HEALTH <br /> IS A PRIORITY!</p>
                <img className='hidden md:block mt-30 mb-0 ml-auto mr-auto h-110' src="/wellH2o.png" alt="H2O" />
            </div>
            <div className='relative'>
                <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:h-150 md:w-110 rounded-2xl p-10 bg-white'>
                    <img className='mt-0 mb-0 ml-auto mr-auto h-18' src="/ssiconO.svg" alt="Swasthya Sync" />
                    <p className='text-center py-4 text-[#FF4A20] font-bold text-5xl'>Sync Yourself</p>

                    {/* Form */}
                    <form onSubmit={handleSignIn} className='flex flex-col justify-center items-center gap-3 h-100'>
                        <div className='w-75'>
                            <div className='flex items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineUserSwitch /></span>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                className='focus:outline-none w-full bg-transparent'
                            />
                            </div>
                            <p className='pt-3 text-red-600'>{error}</p>
                        </div>
                        <div className='pt-5 pb-2 flex flex-col md:flex-row justify-center items-center gap-2'>
                            <button type="submit" className='bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg mr-3'>Log in</button>
                            <button onClick={handleSignInWithGoogle} className='bg-[#FF4A20] font-semibold text-white cursor-pointer px-4 py-2 rounded-lg'>
                                <img className='inline mr-2 h-6' src="/GoogleIco.webp" alt="Google Icon" /> Sign in with Google
                            </button>
                        </div>
                        <p>Not a user? <Link to={'/SignUp'}><span className='underline'>Sign up</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Login