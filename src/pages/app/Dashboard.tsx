import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";
import { supabase } from "../../lib/supabaseClient";

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

    // Add these states and handlers at the top of the Dashboard component
    const [editing, setEditing] = useState<string | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [blood, setBlood] = useState<string | null>(null);
    const [inputHeight, setInputHeight] = useState('');
    const [inputWeight, setInputWeight] = useState('');
    const [inputBlood, setInputBlood] = useState('');

    const handleSubmitHeight = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputHeight) {
        setHeight(Number(inputHeight));
        setInputHeight('');
        setEditing(null);
      }
    };
    const handleSubmitWeight = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputWeight) {
        setWeight(Number(inputWeight));
        setInputWeight('');
        setEditing(null);
      }
    };
    const handleSubmitBlood = (e: React.FormEvent) => {
      e.preventDefault();
      if (inputBlood) {
        setBlood(inputBlood);
        setInputBlood('');
        setEditing(null);
      }
    };
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
          {/* Health Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Height Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
              <img src="/height.svg" alt="Height" className="h-14 mb-2" />
              {editing === 'height' ? (
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitHeight}>
                  <input type="number" value={inputHeight} onChange={e => setInputHeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2" placeholder="Enter height (cm)" />
                  <button type="submit" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">Save</button>
                </form>
              ) : (
                <>
                  <div className="text-lg font-semibold">Height</div>
                  <div className="text-2xl font-bold text-blue-600">{height ? `${height} cm` : '-- cm'}</div>
                  <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition" onClick={() => setEditing('height')}>
                    {height ? 'Update' : 'Add Height'}
                  </button>
                </>
              )}
            </div>
            {/* Weight Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
              <img src="/weight.svg" alt="Weight" className="h-14 mb-2" />
              {editing === 'weight' ? (
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitWeight}>
                  <input type="number" value={inputWeight} onChange={e => setInputWeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2" placeholder="Enter weight (kg)" />
                  <button type="submit" className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition">Save</button>
                </form>
              ) : (
                <>
                  <div className="text-lg font-semibold">Weight</div>
                  <div className="text-2xl font-bold text-green-600">{weight ? `${weight} kg` : '-- kg'}</div>
                  <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition" onClick={() => setEditing('weight')}>
                    {weight ? 'Update' : 'Add Weight'}
                  </button>
                </>
              )}
            </div>
            {/* Blood Group Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
              <img src="/blood.svg" alt="Blood Group" className="h-14 mb-2" />
              {editing === 'blood' ? (
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitBlood}>
                  <select value={inputBlood} onChange={e => setInputBlood(e.target.value)} className="w-full text-center border rounded p-1 mb-2">
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <button type="submit" className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition">Save</button>
                </form>
              ) : (
                <>
                  <div className="text-lg font-semibold">Blood Group</div>
                  <div className="text-2xl font-bold text-red-600">{blood ? blood : '--'}</div>
                  <button className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition" onClick={() => setEditing('blood')}>
                    {blood ? 'Update' : 'Add Blood Group'}
                  </button>
                </>
              )}
            </div>
            {/* BMI Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
              <img src="/bmi.svg" alt="BMI" className="h-14 mb-2" />
              <div className="text-lg font-semibold">BMI</div>
              <div className="text-2xl font-bold text-purple-600">{height && weight ? (weight / ((height/100) * (height/100))).toFixed(1) : '--'}</div>
              {height && weight ? (
                <div className={`text-xs font-semibold rounded-full px-3 py-1 mt-1 ${getBmiClass(weight / ((height/100) * (height/100)))}`}>
                  {getBmiStatus(weight / ((height/100) * (height/100)))}
                </div>
              ) : (
                <div className="text-xs text-gray-500">Add height and weight to calculate BMI</div>
              )}
            </div>
          </div>

          {/* Activity & Hydration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Doctor Visits Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 2a7 7 0 017 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 01-2 0v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 017-7zm0 18a2 2 0 002-2h-4a2 2 0 002 2z" fill="#2563eb"/></svg>
                </span>
                <span className="font-semibold">Upcoming Doctor Visits</span>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="flex items-center py-2">
                  <span className="font-semibold text-base text-gray-900">Dr. Meera Kapoor</span>
                  <span className="ml-auto text-gray-500 text-sm">22 July 2024</span>
                  <a href="#" className="ml-6 text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">View Details</a>
                </div>
              </div>
              <div className="text-sm text-gray-500 mt-2">Stay prepared for your next appointment!</div>
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
              <a href="/hydration" className="mt-2 ml-auto flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                <span className="text-lg font-bold">+</span> Add
              </a>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-6">
          {/* Add New Data Card */}
          <div className="bg-red-500 text-white rounded-2xl shadow p-6 flex flex-col items-center justify-center gap-4">
            <div className="text-lg font-semibold text-center">Keep Your Health Records Organized!</div>
            <div className="text-center text-sm">Easily add and manage your important health documents in one place.</div>
            <a href="/health-vault" className="bg-white text-red-500 font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow hover:bg-gray-100 transition">
              <span className="text-xl font-bold">+</span> Add New
            </a>
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

function getBmiStatus(bmi: number) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}
function getBmiClass(bmi: number) {
  if (bmi < 18.5) return 'bg-blue-100 text-blue-700';
  if (bmi < 25) return 'bg-green-100 text-green-700';
  if (bmi < 30) return 'bg-yellow-100 text-yellow-700';
  return 'bg-red-100 text-red-700';
}