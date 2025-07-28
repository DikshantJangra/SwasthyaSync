import React, { useEffect, useState } from 'react'
import { AiOutlineUserSwitch, AiOutlineLock } from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';


const SignUp = () => {
    const [name, setName] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    // const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();


    const clearError = () => {
        setTimeout(() => {
          setError(null);
        }, 2000);
      };

      // Email + Password Sign-Up
      const signUpUser = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          clearError();
          return;
        }
    
        const { data: authData , error: authError } = await supabase.auth.signUp({
          email,
          password,
          options:{
            data:{
              displayName: name,
              providerType: 'email',
            }
          },
        });
        console.log(authError?.message)
    
        if (authError) {
          setError(authError.message);
          clearError();
        } else {
          console.log('Signup successful:', authData);
        }
        const user = authData?.user
        if (!user) {
          // setError(authError.message);
          return;
        }
      

        const { error:insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          username: username,
          name: name,
          password: password
        })
        if (insertError) {
          setError(insertError.message);
          return;
        }
        navigate('/login')
      
      };

    
      // Google Sign-Up
      // const handleGoogleSignup = async () => {
      //   const { data, error } = await supabase.auth.signInWithOAuth({
      //     provider: 'google',
      //   });
      //   console.log(data)
    
      //   if (error) {
      //     setError(error.message);
      //     clearError();
      //   } else {
      //     console.log('Redirecting to Google sign-in...');
      //   }
      // };
      
      useEffect(()=>{
        const handleAuthRedirect = async()=>{
          const{ data, error } = await supabase.auth.getSession();
          if(error){
            console.log(error)
          }else if(data.session){
            console.log(data.session.user)
            navigate('/dashboard')
          }else{
            console.log('No Login detected')
          }
        }
        handleAuthRedirect();
      },[])
    
      
  return (
    <>
        <div className='min-h-dvh w-full font-Poppins bg-[#FF4A20] grid md:grid-cols-2 grid-cols-1 grid-rows-3 sm:grid-rows-1'>
            <div className='md:bg-gradient-to-r from-[#ff0000] to-[rgba(0,0,0,0)] md:pt-30 pt-5 md:pl-10'>
                <p className='text-white text-center text-3xl sm:text-5xl md:text-7xl leading-none tracking-tight font-bold'>YOUR HEALTH <br /> IS A PRIORITY!</p>
                <img className='hidden md:block mt-30 mb-0 ml-auto mr-auto h-110' src="/wellH2o.png" alt="H2O" />
            </div>
            <div className='relative'>
                <div className='absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:h-150 md:w-110 rounded-2xl p-10 bg-white'>
                    <img className='mt-0 mb-0 ml-auto mr-auto h-18' src="/ssiconO.svg" alt="Swasthya Sync" />
                    <p className='text-center py-4 text-[#FF4A20] font-bold text-5xl'>Sync Yourself</p>

                    {/* Form */}
                    <form onSubmit={signUpUser} className='flex flex-col justify-center items-center gap-3 h-100'>
                    {/* <div className='flex flex-col justify-center items-center gap-3 h-full'> */}
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><BiRename /></span>
                            <input
                                value={name}
                                required
                                onChange={(e) => setName(e.target.value)}
                                className='focus:outline-none' type="text" placeholder='Name'
                            />
                        </div>
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineUserSwitch /></span>
                            <input
                                value={username}
                                required
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
                                required
                                onChange={(e) => setPassword(e.target.value)} 
                                className='focus:outline-none w-full bg-transparent'
                            />
                            </div>

                        </div>
                        <div className='flex items-center gap-2 w-75 border-[1px] border-zinc-300 px-4 py-2 required rounded-lg'>
                            <span className='opacity-50 text-lg'><AiOutlineLock /></span>
                            <input
                                value={confirmPassword}
                                required
                                onChange={(e)=>setConfirmPassword(e.target.value)}
                                className='focus:outline-none' type="password" placeholder='Confirm Password' 
                            />
                        </div>
                        {error && <p className='absolute bottom-30 text-red-600'>{error}</p>}
                        <div className='mt-8 pb-2 flex flex-col sm:flex-row justify-center items-center gap-2'>
                            <button type="submit" className='bg-[#FF4A20] text-white font-semibold cursor-pointer px-4 py-2 rounded-lg mr-3'>Sign up</button>
                            {/* <button onClick={handleGoogleSignup} className='bg-[#FF4A20] font-semibold text-white cursor-pointer px-4 py-2 rounded-lg'>
                                <img className='inline mr-2 h-6' src="/GoogleIco.webp" alt="Google Icon" /> Sign up with Google
                            </button> */}
                        </div>
                        <p>Already a user? <Link to={'/Login'}><span className='underline'>Log in</span></Link></p>
                    </form>
                </div>
            </div>
        </div>
    </>
  )
}

export default SignUp