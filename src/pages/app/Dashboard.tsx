import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { FaDroplet } from "react-icons/fa6";
import { GiWaterBottle, GiWeight, GiWeightScale } from "react-icons/gi";
import { TbRulerMeasure2 } from "react-icons/tb";
import { FaUserMd } from "react-icons/fa";
import { MdTipsAndUpdates } from "react-icons/md";

const Dashboard = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const [upcomingMeetups, setUpcomingMeetups] = useState<{ doctor: string; date: string }[]>([]);
    const [todayHydration, setTodayHydration] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);
    const [weight, setWeight] = useState<number | null>(null);
    const [blood, setBlood] = useState<string | null>(null);


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
            setUserId(user.id);

            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
          
            if (error) {
              console.error('Error fetching user data:', error.message);
            } else {
                console.log('User data:', data);
            }

            // Fetch latest health records
            const fetchLatestMetric = async (type: string) => {
                const { data, error } = await supabase
                    .from('health_records')
                    .select('value')
                    .eq('user_id', user.id)
                    .eq('type', type)
                    .order('recorded_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                if (error) {
                    console.error(`Error fetching ${type}:`, error.message);
                    return null;
                }
                return data ? data.value : null;
            };
            const [latestHeight, latestWeight, latestBlood] = await Promise.all([
                fetchLatestMetric('height'),
                fetchLatestMetric('weight'),
                fetchLatestMetric('blood_group'),
            ]);
            setHeight(latestHeight ? Number(latestHeight) : null);
            setWeight(latestWeight ? Number(latestWeight) : null);
            setBlood(latestBlood || null);

            const todayStr = new Date().toISOString().slice(0, 10);
            const { data: meetups, error: meetupsError } = await supabase
              .from('doctor_meetups')
              .select('doctor, date')
              .eq('user_id', user.id)
              .gte('date', todayStr)
              .order('date', { ascending: true });
            if (!meetupsError && meetups) {
              setUpcomingMeetups(meetups);
            } else {
              setUpcomingMeetups([]);
            }

            const { data: hydration, error: hydrationError } = await supabase
              .from('hydration_logs')
              .select('amount_ml')
              .eq('user_id', user.id)
              .eq('date', todayStr);
            //   console.log(hydration)
            if (!hydrationError && hydration) {
              const totalMl = hydration.reduce((sum: number, row: {amount_ml: number})=>{
                return(
                    sum + (row.amount_ml || 0)
                )
              },0)
              setTodayHydration(totalMl > 0 ? totalMl / 1000 : null);
            } else {
              setTodayHydration(null);
            }
          };
          fetchCurrentUserData()          
    },[])

    const [editing, setEditing] = useState<string | null>(null);
    const [inputHeight, setInputHeight] = useState('');
    const [inputWeight, setInputWeight] = useState('');
    const [inputBlood, setInputBlood] = useState('');

    const handleSubmitHeight = async (e: React.FormEvent) => {
      e.preventDefault();
      if (inputHeight && userId) {
        const { error } = await supabase.from('health_records').insert([
            { user_id: userId, type: 'height', value: inputHeight }
        ]);
        if (error) {
            console.error('Error saving height:', error.message);
        } else {
            setInputHeight('');
            setEditing(null);
            
            const { data: newHeight } = await supabase
              .from('health_records')
              .select('value')
              .eq('user_id', userId)
              .eq('type', 'height')
              .order('recorded_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            setHeight(newHeight ? Number(newHeight.value) : null);
        }
      }
    };
    const handleSubmitWeight = async (e: React.FormEvent) => {
      e.preventDefault();
      if (inputWeight && userId) {
        const { error } = await supabase.from('health_records').insert([
            { user_id: userId, type: 'weight', value: inputWeight }
        ]);
        if (error) {
            console.error('Error saving weight:', error.message);
        } else {
            setInputWeight('');
            setEditing(null);
            
            const { data: newWeight } = await supabase
              .from('health_records')
              .select('value')
              .eq('user_id', userId)
              .eq('type', 'weight')
              .order('recorded_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            setWeight(newWeight ? Number(newWeight.value) : null);
        }
      }
    };
    const handleSubmitBlood = async (e: React.FormEvent) => {
      e.preventDefault();
      if (inputBlood && userId) {
        const { error } = await supabase.from('health_records').insert([
            { user_id: userId, type: 'blood_group', value: inputBlood }
        ]);
        if (error) {
            console.error('Error saving blood group:', error.message);
        } else {
            // setBlood(inputBlood); // This line was removed as per the edit hint
            setInputBlood('');
            setEditing(null);
            // Refetch latest blood group after adding
            const { data: newBlood } = await supabase
              .from('health_records')
              .select('value')
              .eq('user_id', userId)
              .eq('type', 'blood_group')
              .order('recorded_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            setBlood(newBlood ? newBlood.value : null);
        }
      }
    };

    const bmi = height && weight ? (weight / ((height / 100) ** 2)).toFixed(1) : '--'
    const checkBMI = ()=>{
        if (Number(bmi) < 18.5) {
            return 'Underweight';
          } else if (Number(bmi) < 24.9) {
            return 'Normal';
          } else if (Number(bmi) < 29.9) {
            return 'Overweight';
          } else {
            return 'Obese';
          }
    }
  return (
    <div className="h-screen p-4 md:p-8"> {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Left/Main Section */}
        <div className="lg:col-span-2 flex flex-col gap-6"> {/* Health Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">{/* Height Card */}
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2">
              {/* <img src="/height.svg" alt="Height" className="h-14 mb-2" /> */}
              <TbRulerMeasure2 className="h-14 text-4xl mb-2 text-blue-700" />
              {editing === 'height' ? (
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitHeight}>
                  <input type="number" value={inputHeight} onChange={e => setInputHeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2" placeholder="Enter height (cm)" />
                  <button type="submit" className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">Save</button>
                </form>
              ) : (
                <>
                  <div className="text-lg font-semibold">Height</div>
                  <div className="text-2xl font-bold text-blue-600">{height !== null ? `${height} cm` : '-- cm'}</div>
                  <button className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 hover:cursor-pointer transition" onClick={() => setEditing('height')}>
                    {height? "Update" : "Add Height"}
                  </button>
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2"> {/* Weight Card */}
              {/* <img src="/weight.svg" alt="Weight" className="h-14 mb-2" /> */}
              <GiWeight className="h-14 text-5xl mb-2 text-green-700" />
              {editing === 'weight' ? (
                <form className="flex flex-col items-center w-full" onSubmit={handleSubmitWeight}>
                  <input type="number" value={inputWeight} onChange={e => setInputWeight(e.target.value)} className="w-full text-center border rounded p-1 mb-2" placeholder="Enter weight (kg)" />
                  <button type="submit" className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition">Save</button>
                </form>
              ) : (
                <>
                  <div className="text-lg font-semibold">Weight</div>
                  <div className="text-2xl font-bold text-green-600">{weight !== null ? `${weight} kg` : '-- kg'}</div>
                  <button className="mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 hover:cursor-pointer transition" onClick={() => setEditing('weight')}>
                    {weight? "Update" : "Add Weight"}
                  </button>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2"> {/* Blood Group Card */}
              {/* <img src="/blood.svg" alt="Blood Group" className="h-14 mb-2" /> */}
              <FaDroplet className="h-14 text-3xl mb-2 text-red-600" />
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
                  <div className="text-2xl font-bold text-red-600">{blood !== null ? blood : '--'}</div>
                  <button className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 hover:cursor-pointer transition" onClick={() => setEditing('blood')}>
                    {blood? "Update" : "Add Blood Group"}
                  </button>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center gap-2"> {/* BMI Card */}
              {/* <img src="/bmi.svg" alt="BMI" className="h-14 mb-2" /> */}
              <GiWeightScale className="h-14 text-3xl mb-2 text-purple-600" />
              <div className="text-lg font-semibold">BMI</div>
              <div className="text-2xl font-bold text-purple-600">{bmi}</div>
              {(height && weight)? <span className="mt-2 px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium hover:purple-200 transition">{checkBMI()}</span> :<div className="text-center text-xs text-gray-500">Add height and weight to calculate BMI</div>}
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Activity & Hydration Cards */}
            
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2"> {/* Upcoming Doctor Visits Card */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                  <FaUserMd className="h-5 w-5" />
                </span>
                <span className="font-semibold">Upcoming Doctor Visits</span>
              </div>
              {upcomingMeetups.length === 0 ? (
                <div className="text-gray-400 italic">No visits scheduled.</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {upcomingMeetups.map((meetup, idx) => (
                    <div key={idx} className="flex items-center py-2">
                      <span className="font-semibold text-base text-gray-900">{meetup.doctor}</span>
                      <span className="ml-auto text-gray-500 text-sm">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-2xl shadow p-6 flex flex-col gap-2"> {/* Hydration Card */}
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-100 text-blue-600 rounded-full p-2">
                <GiWaterBottle className="h-5 w-5" />
                </span>
                <span className="font-semibold">Hydration</span>
                <span className="ml-auto text-xs text-gray-400">Manual</span>
              </div>
              <div className="text-2xl font-bold">{todayHydration !== null ? `${todayHydration}L` : '--'} <span className="text-gray-400 text-base font-normal">/ 3L</span></div>
              <div className="text-sm text-green-600 mb-2">{todayHydration !== null ? 'Good progress!' : 'No hydration logged.'}</div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: todayHydration !== null ? `${Math.min((todayHydration / 3) * 100, 100)}%` : '0%'}}></div>
              </div>
              <a href="/hydration" className="mt-2 ml-auto flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                <span className="text-lg font-bold">+</span> Add
              </a>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col gap-6"> {/* Right Section */}
          
          <div className="bg-[#FF4A20] text-white rounded-2xl shadow p-6 flex flex-col items-center justify-center gap-4"> {/* Add New Data Card */}
            <div className="text-lg font-semibold text-center">Keep Your Health Records Organized!</div>
            <div className="text-center text-sm">Easily add and manage your important health documents in one place.</div>
            <a href="/health-vault" className="bg-white text-[#FF4A20] font-semibold rounded-full px-6 py-2 flex items-center gap-2 shadow hover:bg-gray-100 transition">
              <span className="text-xl font-bold">+</span> Add New
            </a>
          </div>
          
          <div className="bg-[#FF4A20]/20 rounded-2xl shadow p-6 flex flex-col gap-3"> {/* Tip of the Day Card */}
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#FF4A20]/20 text-[#FF4A20] rounded-full p-2">
                <MdTipsAndUpdates className="h-5 w-5" />
              </span>
              <span className="font-semibold">Tip of the Day</span>
            </div>
            <div className="bg-gradient-to-br from-[#FF4A20]/90 to-[#fb6442] rounded-xl p-4 text-white">
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