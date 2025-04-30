import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <header className='py-5 px-4'>
        <nav className='flex items-end gap-5'>
            <Image src={'/swasthyasync.png'} height={40} width={40} alt='Swasthya Sync'></Image>
            <span className='text-4xl font-black'>Swasthya Sync</span>
        </nav>
    </header>
  )
}

export default Navbar