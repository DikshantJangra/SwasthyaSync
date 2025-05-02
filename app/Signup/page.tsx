"use client"
import Link from 'next/link';
import React, { use, useState } from 'react'
import { AiOutlineUserSwitch, AiOutlineLock } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig.js"; 
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation.js';



// Example function that receives user input


const Signup = () => {
    const router = useRouter(); // Initializing Router

    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const clearError = ()=>{
        setTimeout(()=>{
            setError(null)
        },2000)
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(password != confirmPassword){
            setError('Passwords do not match')
            clearError()
            return
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          if(auth.currentUser){
            await updateProfile(auth.currentUser, {
                displayName: name || username
            })
          }
          console.log("User signed up:", userCredential.user);
          setSuccess(true);
          setError(null);
          router.push('/dashboard')
        } catch (err: any) {
          setError(err.message);
          console.error("Signup error:", err.code, err.message);
        }
      };

    const handleGoogleSignup = async()=>{
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Google sign-in successful:", user);
            setSuccess(true);
            setError(null);
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message);
            console.error("Google sign-in error:", err.code, err.message);
            clearError();
        }
    }
      
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
                    <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center gap-3 h-100'>
                    {/* <div className='flex flex-col justify-center items-center gap-3 h-full'> */}
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><BiRename /></span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='focus:outline-none' type="text" placeholder='Name'
                            />
                        </div>
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineUserSwitch /></span>
                            <input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='focus:outline-none' type="text" placeholder='Username' 
                            />
                        </div>
                        <div className='w-75'>
                            <div className='flex items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                            <span className='opacity-50 text-lg'><MdOutlineMail /></span>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                placeholder="Email"
                                required
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
                                onChange={(e) => setPassword(e.target.value)} 
                                className='focus:outline-none w-full bg-transparent'
                            />
                            </div>

                        </div>
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineLock /></span>
                            <input
                                value={confirmPassword}
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                className='focus:outline-none' type="password" placeholder='Confirm Password' 
                            />
                        </div>
                        {error && <p className='absolute bottom-30 text-red-600'>{error}</p>}
                        <div className='mt-8 pb-2'>
                            <button type="submit" className='bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg mr-3'>Sign up</button>
                            <button onClick={handleGoogleSignup} className='bg-[#FF4A20] font-semibold text-white cursor-pointer px-4 py-2 rounded-lg'>
                                <img className='inline mr-2 h-6' src="/GoogleWhiteIco.png" alt="Google Icon" /> Sign up with Google
                            </button>
                        </div>
                        <p>Already a user? <Link href={'/Login'}><span className='underline'>Log in</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default Signup