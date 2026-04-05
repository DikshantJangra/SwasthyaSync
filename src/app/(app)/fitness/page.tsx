'use client';

import { useState, useEffect } from "react";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth/client";
import { 
  BsPlusLg,
  BsDashLg,
  BsCheck2All,
  BsTrash,
  BsDropletFill
} from "react-icons/bs";

type Exercise = { id: string; name: string };

export default function FitnessPage() {
  const { data: session } = authClient.useSession();
  const utils = trpc.useContext();
  const { data: dashboard, isLoading } = trpc.fitness.getDashboard.useQuery(undefined, { enabled: !!session?.user });
  const { data: exercises } = trpc.fitness.getExercises.useQuery() || { data: [] };

  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition' | 'goals'>('workout');

  // --- WORKOUT ---
  const [isLive, setIsLive] = useState(false);
  const [time, setTime] = useState(0);
  const [activeLifts, setActiveLifts] = useState<{ exId: string; name: string; sets: { r: number; w: number; done: boolean }[] }[]>([]);
  
  const logWorkout = trpc.fitness.logWorkout.useMutation({
    onSuccess: () => { utils.fitness.getDashboard.invalidate(); cancelSession(); }
  });

  const setGoal = trpc.fitness.setGoal.useMutation({
    onSuccess: () => utils.fitness.getDashboard.invalidate()
  });

  useEffect(() => {
    let i: any;
    if (isLive) i = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(i);
  }, [isLive]);

  const addLift = (ex: any) => setActiveLifts(l => [...l, { exId: ex.id, name: ex.name, sets: [{ r: 8, w: 20, done: false }] }]);
  const updateSet = (lIdx: number, sIdx: number, f: 'r' | 'w' | 'done', d: number) => {
    setActiveLifts(l => l.map((x, i) => i === lIdx ? { ...x, sets: x.sets.map((s, j) => j === sIdx ? { ...s, [f]: f === 'done' ? !s.done : Math.max(0, (s as any)[f] + d) } : s) } : x));
  };
  const cancelSession = () => { setIsLive(false); setTime(0); setActiveLifts([]); };
  const finishWorkout = () => {
    const sets = activeLifts.flatMap(l => l.sets.map((s, j) => ({ exerciseId: l.exId, setNumber: j + 1, reps: s.r, weight: s.w, setType: "working" as const })));
    logWorkout.mutate({ durationMinutes: Math.max(1, Math.floor(time / 60)), sets });
  };

  // --- NUTRITION ---
  const [activeMeal, setActiveMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner' | 'Fluid' | null>(null);
  const logMeal = trpc.fitness.logMeal.useMutation({ onSuccess: () => { utils.fitness.getDashboard.invalidate(); setActiveMeal(null); } });
  const logWater = trpc.fitness.logWater.useMutation({ onSuccess: () => { utils.fitness.getDashboard.invalidate(); setActiveMeal(null); } });

  if (isLoading) return <div className="p-10 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black font-poppins pb-20">
      
      {/* Simple Header */}
      <div className="px-6 py-10 max-w-6xl mx-auto flex justify-between items-center border-b">
        <h1 className="text-4xl font-bold">Fitness</h1>
        <div className="flex gap-8">
          {['workout', 'nutrition', 'goals'].map((t: any) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`text-xs uppercase font-bold tracking-widest ${activeTab === t ? 'text-red-500 border-b-2 border-red-500 pb-1' : 'text-gray-400'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {activeTab === 'workout' && (
          <div className="space-y-10">
            {!isLive ? (
              <div className="py-10 text-center space-y-6">
                <button onClick={() => setIsLive(true)} className="px-12 py-4 bg-black text-white rounded-full font-bold uppercase text-sm tracking-widest hover:bg-red-500 transition-colors">Start Workout</button>
                <div className="space-y-4 pt-10 text-left">
                  <h2 className="text-gray-400 uppercase text-[10px] font-bold tracking-widest">Recent Logs</h2>
                  {dashboard?.recentWorkouts.map(w => (
                     <div key={w.id} className="p-6 border rounded-2xl flex justify-between items-center hover:border-black">
                        <div>
                          <p className="font-bold">{new Date(w.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">{w.durationMinutes} min workout</p>
                        </div>
                        <p className="font-bold text-lg">{w.sets.length} sets</p>
                     </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl">
                   <p className="text-4xl font-bold tabular-nums">{Math.floor(time/60)}:{(time%60).toString().padStart(2,'0')}</p>
                   <div className="flex gap-4">
                     <button onClick={cancelSession} className="text-xs font-bold text-red-500">Cancel</button>
                     <button onClick={finishWorkout} className="px-8 py-3 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-widest">Finish</button>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    {activeLifts.map((l, lIdx) => (
                      <div key={lIdx} className="border rounded-2xl overflow-hidden bg-white">
                        <div className="bg-gray-50 p-4 font-bold flex justify-between border-b">
                          <span>{l.name}</span>
                          <button onClick={() => setActiveLifts(prev => prev.filter((_,i)=>i!==lIdx))} className="text-red-500 text-xs">Remove</button>
                        </div>
                        <div className="p-4 space-y-3">
                          {l.sets.map((s, sIdx) => (
                            <div key={sIdx} className="flex justify-between items-center">
                              <span className="font-bold text-gray-400">#{sIdx+1}</span>
                              <div className="flex items-center gap-2">
                                <button onClick={()=>updateSet(lIdx, sIdx, 'w', -2.5)} className="w-8 h-8 rounded border flex items-center justify-center text-xs">-</button>
                                <span className="w-10 text-center font-bold">{s.w}kg</span>
                                <button onClick={()=>updateSet(lIdx, sIdx, 'w', 2.5)} className="w-8 h-8 rounded border flex items-center justify-center text-xs">+</button>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={()=>updateSet(lIdx, sIdx, 'r', -1)} className="w-8 h-8 rounded border flex items-center justify-center text-xs">-</button>
                                <span className="w-6 text-center font-bold">{s.r}</span>
                                <button onClick={()=>updateSet(lIdx, sIdx, 'r', 1)} className="w-8 h-8 rounded border flex items-center justify-center text-xs">+</button>
                              </div>
                              <button onClick={() => updateSet(lIdx, sIdx, 'done', 1 as any)} className={`w-8 h-8 rounded border flex items-center justify-center ${s.done ? 'bg-green-500' : ''}`}><BsCheck2All /></button>
                            </div>
                          ))}
                          <button onClick={() => setActiveLifts(l => l.map((x,i) => i === lIdx ? { ...x, sets: [...x.sets, {r:8, w:20, done:false}] } : x))} className="w-full py-2 border-dashed border-2 rounded text-xs font-bold text-gray-400">+ Add Set</button>
                        </div>
                      </div>
                    ))}
                    {activeLifts.length === 0 && <p className="text-center py-20 bg-gray-50 rounded-2xl font-bold text-gray-300 border-2 border-dashed">Select a lift below</p>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Select Exercise</p>
                    {exercises?.map((ex: any) => (
                      <button key={ex.id} onClick={() => addLift(ex)} className="w-full text-left p-4 border rounded-xl font-bold hover:bg-gray-50 flex justify-between items-center group">
                        {ex.name} <BsPlusLg className="group-hover:text-red-500" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div className="space-y-10 animate-in fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {['Breakfast', 'Lunch', 'Dinner', 'Fluid'].map(m => (
                 <button key={m} onClick={() => setActiveMeal(m as any)} className="p-8 border rounded-[32px] text-left hover:border-black transition-all group">
                    <p className="text-2xl font-bold">{m}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 group-hover:text-red-500">Log Now</p>
                 </button>
               ))}
             </div>

             {activeMeal && (
                <div className="bg-gray-50 p-10 rounded-[40px] animate-in slide-in-from-bottom-5">
                   <div className="flex justify-between items-center mb-6">
                      <h2 className="text-3xl font-bold">Log {activeMeal}</h2>
                      <button onClick={() => setActiveMeal(null)} className="text-xs font-bold uppercase tracking-widest text-gray-400">Close</button>
                   </div>
                   
                   {activeMeal === 'Fluid' ? (
                      <form onSubmit={(e) => {
                          e.preventDefault();
                          const amount = Number(new FormData(e.currentTarget).get('ml'));
                          logWater.mutate({ amountMl: amount });
                      }} className="flex gap-4">
                         <input name="ml" type="number" placeholder="500ml" required className="flex-1 p-4 rounded-2xl border font-bold" />
                         <button type="submit" className="px-8 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Save</button>
                      </form>
                   ) : (
                      <form onSubmit={(e) => {
                          e.preventDefault();
                          const d = new FormData(e.currentTarget);
                          logMeal.mutate({
                              mealType: activeMeal.toLowerCase(),
                              foodName: d.get('food') as string,
                              quantity: 1, unit: 'serving',
                              nutrients: { calories: Number(d.get('cal')), protein: Number(d.get('p')), carbs: Number(d.get('c')), fat: Number(d.get('f')) }
                          });
                      }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input name="food" placeholder="Food name" className="p-4 rounded-xl border font-bold md:col-span-2" />
                         <input name="cal" type="number" placeholder="Calories" className="p-4 rounded-xl border font-bold" />
                         <input name="p" type="number" placeholder="Protein (g)" className="p-4 rounded-xl border font-bold" />
                         <input name="c" type="number" placeholder="Carbs (g)" className="p-4 rounded-xl border font-bold" />
                         <input name="f" type="number" placeholder="Fat (g)" className="p-4 rounded-xl border font-bold" />
                         <button type="submit" className="p-4 bg-black text-white rounded-xl font-bold uppercase md:col-span-2">Log Meal</button>
                      </form>
                   )}
                </div>
             )}

             <div className="pt-10 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Intake</h3>
                {dashboard?.todayNutrition.map(n => (
                   <div key={n.id} className="p-4 border rounded-xl flex justify-between items-center">
                      <span className="font-bold capitalize">{n.mealType}: {n.foodName || 'Food'}</span>
                      <span className="font-bold text-red-500">{n.nutrients.calories} cal</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'goals' && (
           <div className="space-y-8 animate-in fade-in pt-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { t: 'Lose Weight', v: 70 },
                   { t: 'Build Muscle', v: 85 },
                   { t: 'Maintain', v: 75 }
                 ].map(g => (
                    <button key={g.t} onClick={() => setGoal.mutate({ type: 'weight', targetWeight: g.v })} className="p-10 border rounded-[40px] text-left hover:border-black group">
                       <p className="text-2xl font-bold">{g.t}</p>
                       <p className="text-xs font-bold text-gray-400 uppercase mt-2 group-hover:text-red-500">Pick Goal</p>
                    </button>
                 ))}
              </div>
           </div>
        )}
      </div>

    </div>
  );
}
