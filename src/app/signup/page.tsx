'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineLock } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

import { authClient } from '@/lib/auth/client';

export default function SignUp() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    const clearError = () => {
        setTimeout(() => {
            setError(null);
        }, 5000);
    };

    const signUpUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            clearError();
            return;
        }

        const { error: signUpError } = await authClient.signUp.email({
            email,
            password,
            name,
        });

        if (signUpError) {
            setError(signUpError.message || 'Signup failed');
            setLoading(false);
            clearError();
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleSignIn = async () => {
        await authClient.signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };

    return (
        <div className='min-h-dvh w-full font-poppins bg-[#FF4A20] grid md:grid-cols-2 grid-cols-1 grid-rows-3 sm:grid-rows-1'>
            <div className='md:bg-gradient-to-r from-[#ff0000] to-[rgba(0,0,0,0)] md:pt-30 pt-10 md:pl-10'>
                <p className='text-white text-center text-3xl sm:text-5xl md:text-7xl leading-none tracking-tight font-bold'>YOUR HEALTH <br /> IS A PRIORITY!</p>
                <img className='hidden md:block mt-30 mb-0 ml-auto mr-auto h-110' src="/wellH2o.png" alt="H2O" />
            </div>
            <div className='relative'>
                <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:h-[620px] md:w-110 rounded-2xl p-10 bg-white'>
                    <img className='mt-0 mb-0 ml-auto mr-auto h-18' src="/ssiconO.svg" alt="Swasthya Sync" />
                    <p className='text-center py-4 text-[#FF4A20] font-bold text-5xl'>Sync Yourself</p>

                    <form onSubmit={signUpUser} className='flex flex-col justify-center items-center gap-3'>
                        <div className='flex text-black items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><BiRename /></span>
                            <input
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className='focus:outline-none' type="text" placeholder='Name'
                                required
                            />
                        </div>
                        <div className='w-75'>
                            <div className='flex text-black items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                                <span className='opacity-50 text-lg'><MdOutlineMail /></span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    required
                                    className='focus:outline-none w-full bg-transparent'
                                />
                            </div>
                        </div>
                        <div className='w-75'>
                            <div className='flex text-black items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                                <span className='opacity-50 text-lg'><AiOutlineLock /></span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='focus:outline-none w-full bg-transparent'
                                />
                            </div>
                        </div>
                        <div className='flex text-black items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineLock /></span>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className='focus:outline-none' type="password" placeholder='Confirm Password'
                                required
                            />
                        </div>
                        {error && <p className='text-red-600 text-sm'>{error}</p>}
                        <div className='pt-2 flex flex-col justify-center items-center gap-2 w-75'>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className='w-full bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg disabled:opacity-50'
                            >
                                {loading ? 'Signing up...' : 'Sign up'}
                            </button>
                        </div>
                        
                        <div className='w-75 flex items-center gap-2 py-1'>
                            <div className='h-[1px] bg-zinc-200 flex-1'></div>
                            <span className='text-zinc-400 text-xs'>or</span>
                            <div className='h-[1px] bg-zinc-200 flex-1'></div>
                        </div>

                        <button 
                            onClick={handleGoogleSignIn}
                            type="button" 
                            className='flex text-black items-center justify-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 rounded-lg hover:bg-zinc-50'
                        >
                            <FcGoogle size={20} /> <span className='text-sm'>Sign up with Google</span>
                        </button>

                        <p className='pt-2 text-sm'>Already a user? <Link href="/login"><span className='underline'>Log in</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}