'use client';

import { IoBodySharp } from 'react-icons/io5';
import { FaDumbbell } from 'react-icons/fa6';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiHealthBookLine } from 'react-icons/ri';
import { FaStethoscope } from 'react-icons/fa6';

const Sidebar = () => {
  const pathname = usePathname();

  const buttons = [
    { icon: <IoBodySharp size={25} />, to: '/dashboard', label: 'Dashboard' },
    { icon: <FaDumbbell size={25} />, to: '/fitness', label: 'Fitness Engine' },
    { icon: <RiHealthBookLine size={25} />, to: '/health-vault', label: 'Health Vault' },
    { icon: <FaStethoscope size={25} />, to: '/doctor-meetup', label: 'Doctor Meet ups' },
  ];

  return (
    <aside className="h-auto md:h-screen w-full md:w-50 flex flex-col md:justify-start md:items-stretch items-center bg-white/30 backdrop-blur border-r border-gray-100">
      <div className="flex justify-center items-center gap-2 px-4 py-6 md:pl-8">
        <img src="/ssiconO.svg" alt="Swāsthya Sync" className='h-10 sm:h-13 max-w-full' />
        <h1 className="font-black text-lg sm:text-lg md:text-xl lg:text-2xl leading-none text-[#FF4A20]">Swāsthya <br />Sync</h1>
      </div>
      <nav className="flex flex-row md:flex-col justify-center items-center gap-6 md:gap-10 w-full md:h-full pb-2 md:pb-0">
        {buttons.map((btn) => (
          <Link
            key={btn.to}
            href={btn.to}
            className={`p-4 rounded-full shadow-md hover:bg-[#FF4A20] hover:text-white transition-all duration-200 
              ${pathname === btn.to ? 'bg-[#FF4A20] text-white' : 'bg-white text-black'}`}
            title={btn.label}
          >
            {btn.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
