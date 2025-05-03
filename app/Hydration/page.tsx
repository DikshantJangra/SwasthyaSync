import Link from 'next/link'
import React from 'react'
import { IoBodySharp } from "react-icons/io5";

const Hydration = () => {
  return (
    <div className='h-screen px-4 pt-5'>
      <div className='grid grid-cols-[15%_85%]'>
        <div className='flex gap-3'>
          <img src="/swasthyasync.svg" alt="Swasthya Sync" />
          <p className='font-black text-3xl text-[#FF4A20] tracking-tight leading-none'>Swāsthya <br /> Sync</p>
        </div>
        <p className='self-end justify-self-center text-5xl'>
          <span>Welcome </span>
          <span className='font-bold text-[#FF4A20]'>Dikshant!</span>
        </p>
      </div>

      <div className=''>

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