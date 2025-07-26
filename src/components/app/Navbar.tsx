import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { BiLogOutCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [name, setName] = useState('loading');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const formatted = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) return;
      const user = session?.user;
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', user.id)
        .maybeSingle();
      if (!error && data && data.name) setName(data.name);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 px-2 md:px-5 pt-4">
      <div>
        <p className="text-gray-500 text-2xl">Today, {formatted}</p>
      </div>
      <div
        ref={profileRef}
        className="relative flex items-center gap-4 bg-white rounded-xl shadow p-4 mt-4 md:mt-0 cursor-pointer select-none"
        onClick={() => setDropdownOpen((v) => !v)}
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
          <img src="/user.svg" className='w-full h-full object-cover ' alt="" />
        </div>
        <div>
          <div className="font-semibold">Hi, {name}!</div>
          <div className="text-xs text-gray-400">{formatted}</div>
        </div>
        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-15 mt-2 w-full bg-white rounded-b-2xl shadow-lg border border-gray-100 z-50">
            <div
              // to={'/'}
              onClick={(e)=> e.stopPropagation()}
              className='w-full text-left px-4 py-3 bg-gray-300  text-gray-700 hover:bg-gray-100 font-semibold cursor-pointer outline outline-gray-100 block'
            >
              Update Profile <span className='text-gray-400 outline-red-500 text-xs outline '>comming soon</span>
            </div>
            <button
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 rounded-b-2xl font-semibold cursor-pointer outline outline-gray-100"
              onClick={e => { e.stopPropagation(); handleLogout(); }}
            >
              <BiLogOutCircle className='inline' /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar; 