'use client';

import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth/client";
import { 
  BsLightningChargeFill, 
  BsFillPieChartFill, 
  BsFlagFill, 
  BsPlusLg,
  BsActivity,
  BsFillCupHotFill
} from "react-icons/bs";

export default function FitnessPage() {
  const { data: session } = authClient.useSession();
  const utils = trpc.useContext();

  // Queries
  const { data: dashboard, isLoading } = trpc.fitness.getDashboard.useQuery(undefined, {
    enabled: !!session?.user,
  });

  // Mutations
  const logWorkout = trpc.fitness.logWorkout.useMutation({
    onSuccess: () => utils.fitness.getDashboard.invalidate(),
  });
  const logMeal = trpc.fitness.logMeal.useMutation({
    onSuccess: () => utils.fitness.getDashboard.invalidate(),
  });
  const setGoal = trpc.fitness.setGoal.useMutation({
    onSuccess: () => utils.fitness.getDashboard.invalidate(),
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'nutrition' | 'goals'>('dashboard');

  if (isLoading) return <div className="p-8 animate-pulse text-gray-400">Loading Fitness Engine...</div>;

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fitness Engine</h1>
          <p className="text-gray-500">Unified health & performance tracking</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border">
          {(['dashboard', 'workout', 'nutrition', 'goals'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                ? "bg-[#FF4A20] text-white shadow-md" 
                : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-black">
            <div className="p-3 bg-orange-100 text-[#FF4A20] rounded-xl">
              <BsLightningChargeFill size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-poppins">Weekly Workouts</p>
              <p className="text-2xl font-bold">{dashboard?.recentWorkouts.length || 0}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-black">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <BsFillPieChartFill size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-poppins">Today's Calories</p>
              <p className="text-2xl font-bold">
                {dashboard?.todayNutrition.reduce((acc, curr) => acc + curr.nutrients.calories, 0) || 0} kcal
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 text-black">
            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
              <BsFlagFill size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium font-poppins">Active Goals</p>
              <p className="text-2xl font-bold">{dashboard?.activeGoals.length || 0}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-black">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <BsActivity className="text-[#FF4A20]" /> Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {dashboard?.recentWorkouts.length === 0 && (dashboard?.todayNutrition.length === 0) ? (
                <p className="text-gray-400 text-center py-8 italic">No recent activity logged.</p>
              ) : (
                <div className="space-y-4">
                  {dashboard?.recentWorkouts.map((w) => (
                    <div key={w.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-2 h-10 bg-[#FF4A20] rounded-full" />
                      <div>
                        <p className="font-semibold">Workout Session</p>
                        <p className="text-sm text-gray-500">
                          {w.durationMinutes} mins • {w.sets.length} sets • {new Date(w.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {dashboard?.todayNutrition.map((n) => (
                    <div key={n.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-2 h-10 bg-blue-500 rounded-full" />
                      <div>
                        <p className="font-semibold">{n.mealType} - {n.foodName || 'Food Item'}</p>
                        <p className="text-sm text-gray-500">
                          {n.nutrients.calories} kcal • {n.quantity}{n.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BsActivity size={80} />
            </div>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-400">
              <BsLightningChargeFill /> AI Coach Insights
            </h3>
            <div className="space-y-4">
              {dashboard?.insights && dashboard.insights.length > 0 ? (
                dashboard.insights.map((insight) => (
                  <div key={insight.id} className="p-3 bg-white/10 rounded-xl border border-white/5 backdrop-blur-sm">
                    <p className="text-sm leading-relaxed">{insight.content}</p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-white/10 rounded-xl border border-white/5">
                  <p className="text-sm">Log your data to unlock AI coaching!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forms Updated for New Schemas */}
      {activeTab === 'workout' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-black">
          <h2 className="text-2xl font-bold mb-6">Log a Detailed Workout</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            logWorkout.mutate({
              durationMinutes: Number(formData.get('duration')),
              sets: [{
                exerciseId: "bench-press", // Example
                setNumber: 1,
                setType: "working",
                reps: Number(formData.get('reps')),
                weight: Number(formData.get('weight')),
              }],
            });
            setActiveTab('dashboard');
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input name="duration" type="number" required className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                <input name="reps" type="number" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input name="weight" type="number" className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
            </div>
            <button type="submit" disabled={logWorkout.isPending} className="w-full bg-[#FF4A20] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200">
              Log Detailed Workout
            </button>
          </form>
        </div>
      )}

      {activeTab === 'nutrition' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-black">
          <h2 className="text-2xl font-bold mb-6">Log Broad Macro Entry</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            logMeal.mutate({
              mealType: formData.get('mealType') as string,
              quantity: 1,
              unit: "serving",
              nutrients: {
                calories: Number(formData.get('calories')),
                protein: Number(formData.get('protein')),
                carbs: Number(formData.get('carbs')),
                fat: Number(formData.get('fat')),
              }
            });
            setActiveTab('dashboard');
          }} className="space-y-4">
            <select name="mealType" className="w-full p-3 rounded-xl border border-gray-200 mb-4">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                <input name="calories" type="number" required className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input name="protein" type="number" required className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input name="carbs" type="number" required className="w-full p-3 rounded-xl border border-gray-200" />
              </div>
            </div>
            <button type="submit" disabled={logMeal.isPending} className="w-full bg-[#FF4A20] text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200">
              Log Meal Nutrients
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
