'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { IoBodySharp } from "react-icons/io5";
import { FaGlassWater } from "react-icons/fa6";
import { GiMuscularTorso } from "react-icons/gi";
import { MdRestaurantMenu } from "react-icons/md";
import { AiFillSun } from "react-icons/ai";
import { BsDropletFill } from "react-icons/bs";
import { BiPlusMedical } from "react-icons/bi";
import { auth } from '../../firebase/firebaseConfig';
import BarChart from '../../components/BarChart';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Sedan } from 'next/font/google';


const Hydration = () => {
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState<any>(null);
  const [city, setCity] = useState('')
  const [day, setDay] = useState('')
  
  const fetchWeather = async()=>{
    try{
      const resp = await fetch(`https://api.weatherapi.com/v1/current.json?key=ef77917615df4c5692d150428250905&q=${city}&aqi=no`)
      const result = await resp.json()
      setLocation(result)
      localStorage.setItem('location', JSON.stringify(result));
      console.log(result)
      console.log('Fetching Weather')
    }
    catch(err){
      setLocation('')
    }
  }
  
  
  const drinks =[
    {qnt:250, time:'8:00'},
    {qnt:450, time:'3:00'},
    {qnt:250, time:'4:00'},
    {qnt:150, time:'5:00'},
    {qnt:100, time:'11:00'},
    {qnt:300, time:'13:00'},
    {qnt:500, time:'16:00'},
    {qnt:300, time:'19:00'},
    {qnt:100, time:'21:00'},
  ]
  console.log(location)
  // useEffect(()=>{
  //   if(location && location.current.temp_c){
  //     const temp = location.current.temp_c
  //     temp>22?setDay(" hot day "):setDay(" cold day ")
  //   }
  // },[location])
  useEffect(()=>{
    const storedLocation  = localStorage.getItem('location')
    if(storedLocation){
      setLocation(JSON.parse(storedLocation))
    }else{
      setLocation('')
    }

    const unsubscribe = onAuthStateChanged(auth, (user: User | null)=>{
      if(user){
        setUsername(user.displayName || 'Anonymus')
      }
    })
    return ()=> unsubscribe();
  },[])
  
  return (
    <div className='h-screen px-4 pt-5 bg-black'>
      <div className='grid grid-cols-[15%_85%]'>
        <div className='flex gap-3'>
          <img src="/swasthyasync.svg" alt="Swasthya Sync" />
          <p className='font-black text-3xl text-[#FF4A20] tracking-tight leading-none'>Swāsthya <br /> Sync</p>
        </div>
        <p className='self-end justify-self-center text-white text-5xl'>
          <span>Welcome </span>
          <span className='font-bold text-[#FF4A20]'>{username}!</span>
        </p>
      </div>

      <div className='grid grid-cols-[10%_90%] text-white'>
        <div className='flex flex-col gap-15 h-[90vh] items-center justify-center'>
        <Link className='p-3 bg-black/10 text-[#FF4A20]/80 rounded-2xl text-3xl shadow-[2px_4px_50px_0px_#404040] hover:text-4xl duration-200 transition-all' href={'/'}><IoBodySharp /></Link>
        <Link className='p-3 bg-[#FF4A20]/80 rounded-2xl text-white text-4xl shadow-[2px_4px_50px_0px_#FF4A20] hover:text-4xl duration-200 transition-all' href={'/'}><FaGlassWater /></Link>
        <Link className='p-3 bg-black/10 text-white/80 rounded-2xl text-3xl shadow-[2px_4px_50px_0px_#404040] hover:text-4xl duration-200 transition-all' href={'/'}><GiMuscularTorso /></Link>
        <Link className='p-3 bg-black/10 text-green-600/80 rounded-2xl text-3xl shadow-[2px_4px_50px_0px_#404040] hover:text-4xl duration-200 transition-all' href={'/'}><MdRestaurantMenu /></Link>
        </div>

        <div className='mx-8'>
          <div className='h-35 bg-[#FF4A20]/20 rounded-2xl mt-12 px-8 py-2'>
            {location? (
              <div className='flex justify-between items-center'>
              <span className='flex items-center justify-between gap-3 text-4xl font-bold'><AiFillSun className='text-9xl text-[#FF4A20]' /> {location?.current?.temp_c}° C</span>
              <p className='text-3xl'>
                <span>It’s a </span>
                <span className='text-[#FF4A20] font-bold lowercase'>{day}</span>
                <span>in </span>
                {/* <span className='underline-offset-5 underline cursor-pointer [text-decoration-thickness:2px]' onClick={()=>setLocation('')}>{location.location.name} </span> */}
                <span>today.</span>
              </p>
              <p className='text-2xl text-zinc-500 border-l-[1px] pl-8 h-20 pt-6'>Make sure to stay hydrated!</p>
            </div>
            ):(
              <div className='flex flex-col justify-center items-center'>
                <p className='font-medium text-2xl'>📍 Set your location:</p>
                  <div className='w-fit border border-white mt-2 text-center rounded-2xl pr-12 px-3 py-1'><input value={city} onChange={(e)=>setCity(e.target.value)} type="text" placeholder='Where you live?' className='outline-none'/></div>
                  <button onClick={fetchWeather} className='mt-2 px-3 py-1 rounded-2xl cursor-pointer bg-[#FF4A20]/80'>Set Location</button>
              </div>
            )}
          </div>

        <div className='flex justify-between mt-5'>
          <div className='flex justify-start items-center px-4 gap-4 w-70 h-20 bg-[#55BCD9]/20 rounded-lg'>
            <p className='border-6 border-[#55BCD9] px-3 py-4 rounded-[50%]'>80%</p>

            <p className='text-[#55BCD9]'>
              <span className='leading-none'>Today's Intake</span><br />
              <span className='font-bold leading-none'>4000ml</span>
            </p>
          </div>

          <div className='flex justify-start items-center px-4 gap-4 w-70 h-20 bg-[#55BCD9]/20 rounded-lg'>
            <p className='border-6 border-[#55BCD9] px-3 py-4 rounded-[50%]'>80%</p>

            <p className='text-[#55BCD9]'>
              <span className='leading-none'>Today's Intake</span><br />
              <span className='font-bold leading-none'>4000ml</span>
            </p>
          </div>

          <div className='flex justify-start items-center px-4 gap-4 w-70 h-20 bg-[#55BCD9]/20 rounded-lg'>
            <p className='border-6 border-[#55BCD9] px-3 py-4 rounded-[50%]'>80%</p>

            <p className='text-[#55BCD9]'>
              <span className='leading-none'>Today's Intake</span><br />
              <span className='font-bold leading-none'>4000ml</span>
            </p>
          </div>
        </div>

        <div className='grid grid-cols-3 mx-5 mt-20 '>
          <div className='col-span-2 self-end w-190 max-w-4xl shadow-2xl'>
            <BarChart />
          </div>

          <div className='relative'>
            <div className='overflow-y-auto overflow-x-hidden h-100 w-80 bg-[#008CFF]/20 py-5 px-3 rounded-lg'>
            <span className='absolute text-[#008CFF] text-9xl top-0 right-0'><BsDropletFill /></span>
            <p className='sticky top-0 text-3xl font-bold text-center text-[#008CFF]'>Drink Logs</p>

            {drinks.map((drink, idx)=>(
              <div key={idx} className='w-full h-15 mt-4 text-[#008CFF] bg-[#008CFF]/20 rounded-2xl flex justify-between items-center px-7'>
                <p>{drink.qnt} ml</p>
                <p className='font-bold'>{drink.time}</p>
              </div>
            ))}
            </div>
          </div>

          <div className='absolute right-15 bottom-10 px-5 py-5 rounded-full bg-[#008CFF]/20 cursor-pointer'>
            <BiPlusMedical className='text-2xl text-[#008CFF]' />
          </div>
        </div>
        </div>

      </div>
      {/* 
      <div className='grid grid-cols-[5%_95%] grid-rows-1'>
        <div className='bg-zinc-200'>
          <Link href={'/'}><IoBodySharp /></Link>
        </div>H
        <div className='bg-red-600'></div>
      </div>
      */}
    </div>
  )
}

export default Hydration