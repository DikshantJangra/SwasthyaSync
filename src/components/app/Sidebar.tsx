// components/Sidebar.tsx
import { IoBodySharp } from 'react-icons/io5';
import { FaGlassWater } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { RiHealthBookLine } from 'react-icons/ri';
import { FaStethoscope } from 'react-icons/fa6';
// import { MdRestaurantMenu } from 'react-icons/md';
// import { GiMuscularTorso } from 'react-icons/gi';

const Sidebar = () => {
  const location = useLocation();

  const buttons = [
    { icon: <IoBodySharp size={25} />, to: '/dashboard', label: 'Dashboard' },
    { icon: <FaGlassWater size={25} />, to: '/hydration', label: 'Hydration' },
    { icon: <RiHealthBookLine size={25} />, to: '/health-vault', label: 'Health Vault' },
    { icon: <FaStethoscope size={25} />, to: '/doctor-meetup', label: 'Doctor Meet ups' },
    // { icon: <GiMuscularTorso size={25} />, to: '/body', label: 'Body' },
    // { icon: <MdRestaurantMenu size={25} />, to: '/nutrition', label: 'Nutrition' },
  ];

  return (
    <aside className="h-auto md:h-screen w-full md:w-50 flex flex-col md:justify-start md:items-stretch items-center bg-transparent text-white">
      <div className="flex justify-center items-center gap-2 px-4 py-2 md:pl-8 md:pt-5">
        <img src="/ssiconO.svg" alt="Swāsthya Sync" className='h-10 sm:h-13 max-w-full' />
        <h1 className="font-black text-lg sm:text-lg md:text-xl lg:text-2xl leading-none text-[#FF4A20]">Swāsthya <br />Sync</h1>
      </div>
      <nav className="flex flex-row md:flex-col justify-center items-center gap-6 md:gap-14 w-full md:h-full pb-2 md:pb-0">
        {buttons.map((btn) => (
          <Link
            key={btn.to}
            to={btn.to}
            className={`p-3 rounded-full shadow-md hover:bg-[#FF4A20] hover:text-white transition-colors duration-200 
              ${location.pathname === btn.to ? 'bg-[#FF4A20] text-white' : 'bg-white text-black'}`}
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
