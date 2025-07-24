import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { supabase } from "../../lib/supabaseClient";

// Circular Progress Component
const CircularProgress = ({ value, color, label }: { value: number; color: string; label: string }) => {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1.2em"
          fontWeight="bold"
          fill={color}
        >
          {value}%
        </text>
      </svg>
      <span className="mt-2 font-medium text-gray-700">{label}</span>
    </div>
  );
};

const Dashboard = () => {
    const [name, setName] = useState('loading')

    const today = new Date();
    const formatted = today.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      useEffect(()=>{
        const fetchCurrentUserData = async () => {
            const {
              data: { session },
              error: sessionError,
            } = await supabase.auth.getSession();
          
            if (sessionError) {
              console.error('Session error:', sessionError.message);
              return;
            }
          
            const user = session?.user;
          
            if (!user) {
              console.warn('No authenticated user found');
              return;
            }
          
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
          
            if (error) {
              console.error('Error fetching user data:', error.message);
            } else {
                setName(data.name)
                console.log('User data:', data);
            }
          };
          fetchCurrentUserData()          
    },[])
  return (
    <div className="min-h-screen px-2 md:px-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <p className="text-gray-500 text-2xl">Today, {formatted}</p>
        </div>
        <div className="flex items-center gap-4 bg-white rounded-xl shadow p-4 mt-4 md:mt-0">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            
            <BiUser className="text-2xl" />
          </div>
          <div>
            <div className="font-semibold">Hi, {name}!</div>
            <div className="text-xs text-gray-400">{formatted}</div>
          </div>
          <div className="ml-4">
            {/* <span className="relative inline-block">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-5-6.32V4a1 1 0 10-2 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 006 19h12a1 1 0 00.71-1.71L18 16z" fill="#9ca3af"/></svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
            </span> */}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Section */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Day at a Glance */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Your Day at a Glance</h2>
            <div className="flex flex-col sm:flex-row justify-around gap-6">
              <CircularProgress value={70} color="#2563eb" label="Health Score" />
              <CircularProgress value={80} color="#22c55e" label="Activity" />
              <CircularProgress value={65} color="#a21caf" label="Sleep" />
            </div>
          </div>

          {/* Activity & Hydration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-100 text-green-600 rounded-full p-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M13 7h-2V3a1 1 0 10-2 0v4H7a1 1 0 100 2h2v4a1 1 0 102 0V9h2a1 1 0 100-2z" fill="#22c55e"/></svg>
                </span>
                <span className="font-semibold">Activity</span>
                <span className="ml-auto text-xs text-gray-400">Synced</span>
              </div>
              <div className="text-2xl font-bold">7,800 <span className="text-gray-400 text-base font-normal">/ 10,000 steps</span></div>
              <div className="text-sm text-gray-500 mb-2">Keep moving! Just 2,200 steps to go!</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-400 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            {/* Hydration Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2C10.34 2 9 3.34 9 5c0 2.5 3 7 3 7s3-4.5 3-7c0-1.66-1.34-3-3-3z" fill="#2563eb"/></svg>
                </span>
                <span className="font-semibold">Hydration</span>
                <span className="ml-auto text-xs text-gray-400">Manual</span>
              </div>
              <div className="text-2xl font-bold">1.5L <span className="text-gray-400 text-base font-normal">/ 3L</span></div>
              <div className="text-sm text-green-600 mb-2">Good progress!</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <button className="mt-2 ml-auto flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                <span className="text-lg font-bold">+</span> Add
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6">
          {/* Add New Data Card */}
          <div className="bg-red-500 text-white rounded-2xl shadow p-6 flex flex-col items-center justify-center gap-4">
            <div className="text-lg font-semibold text-center">What have you done today?</div>
            <div className="text-center text-sm">Log your daily progress manually.</div>
            <button className="bg-white text-red-500 font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow hover:bg-gray-100 transition">
              <span className="text-xl font-bold">+</span> Add New Data
            </button>
          </div>
          {/* Tip of the Day Card */}
          <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-100 text-yellow-600 rounded-full p-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-2 0v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7zm0 18a2 2 0 002-2h-4a2 2 0 002 2z" fill="#eab308"/></svg>
              </span>
              <span className="font-semibold">Tip of the Day</span>
            </div>
            <div className="bg-gradient-to-br from-yellow-900 to-yellow-700 rounded-xl p-4 text-white">
              <div className="font-bold mb-1">Ayurvedic Wisdom</div>
              <div className="text-sm">Try a warm cup of haldi doodh (turmeric milk) before bed to improve sleep quality and reduce inflammation.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;