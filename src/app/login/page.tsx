'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AiOutlineUserSwitch, AiOutlineLock } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

import { authClient } from '@/lib/auth/client';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (session) {
            router.push('/dashboard');
        }
    }, [session, router]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        if (signInError) {
            setError(signInError.message || 'Login failed. Please check your credentials.');
            setLoading(false);
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
                <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:h-[550px] md:w-110 rounded-2xl p-10 bg-white'>
                    <img className='mt-0 mb-0 ml-auto mr-auto h-18' src="/ssiconO.svg" alt="Swasthya Sync" />
                    <p className='text-center py-4 text-[#FF4A20] font-bold text-5xl'>Sync Yourself</p>

                    <form onSubmit={handleSignIn} className='flex flex-col justify-center items-center gap-3'>
                        <div className='w-75'>
                            <div className='flex text-black items-center gap-2 border-[1px] border-zinc-300 px-4 py-2 rounded-lg'>
                                <span className='opacity-50 text-lg'><AiOutlineUserSwitch /></span>
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    className='focus:outline-none w-full bg-transparent'
                                />
                            </div>
                            <p className='pt-1 text-xs text-red-600'>{error}</p>
                        </div>
                        <div className='pt-2 flex flex-col justify-center items-center gap-2 w-75'>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className='w-full bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg disabled:opacity-50'
                            >
                                {loading ? 'Logging in...' : 'Log in'}
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
                            <FcGoogle size={20} /> <span className='text-sm'>Log in with Google</span>
                        </button>

                        <p className='pt-4 text-sm'>Not a user? <Link href="/signup"><span className='underline'>Sign up</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    );
}
