'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from "@/lib/auth/client";

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const today = new Date();
  const formatted = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
    await authClient.signOut({
        fetchOptions: {
            onSuccess: () => {
                router.push('/');
            }
        }
    });
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-6 py-4 bg-transparent">
      <div>
        <p className="text-gray-500 text-2xl">Today, {formatted}</p>
      </div>
      <div
        ref={profileRef}
        className="relative flex items-center gap-4 bg-white rounded-xl shadow-md p-4 mt-4 md:mt-0 cursor-pointer select-none"
        onClick={() => setDropdownOpen((v) => !v)}
      >
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {session?.user.image ? (
            <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
          ) : (
            <svg className="text-2xl text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          )}
        </div>
        <div>
          {isPending ? (
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <div className="font-semibold text-black">Hi, {session?.user.name || session?.user.email?.split('@')[0] || 'User'}!</div>
          )}
          <div className="text-xs text-gray-400">{formatted}</div>
        </div>
        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
            <button
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-50 rounded-xl font-semibold"
              onClick={e => { e.stopPropagation(); handleLogout(); }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;