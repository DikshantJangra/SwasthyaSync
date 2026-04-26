'use client';

/**
 * Fitness Page
 * 
 * Main page for the Fitness module with 3 tabs:
 * 1. Workout — Log workout sessions with exercises and sets
 * 2. Nutrition — Search food, log meals, view daily intake (UPDATED)
 * 3. Goals — Set fitness goals
 * 
 * The Nutrition tab now includes:
 * - Total calories counter at the top
 * - Food search using Open Food Facts API
 * - Meal type selector (Breakfast/Lunch/Dinner/Snacks)
 * - Day-wise meal display grouped by meal type
 */

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

// Meal type options for the selector
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snacks"] as const;

const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function FitnessPage() {
  const { data: session } = authClient.useSession();
  const utils = trpc.useContext();
  const { data: dashboard, isLoading } = trpc.fitness.getDashboard.useQuery(undefined, { enabled: !!session?.user });
  const { data: exercises } = trpc.fitness.getExercises.useQuery() || { data: [] };

  const [activeTab, setActiveTab] = useState<'workout' | 'nutrition' | 'goals'>('workout');

  // --- WORKOUT (Simple) ---
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [debouncedExerciseQuery, setDebouncedExerciseQuery] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<{ exerciseName: string, caloriesPerSet: number } | null>(null);
  
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [duration, setDuration] = useState(15);
  
  // Debounce for exercise search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedExerciseQuery(exerciseQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [exerciseQuery]);

  // Queries
  const { data: exerciseSearchResults } = trpc.fitness.searchExercise.useQuery(
    { query: debouncedExerciseQuery },
    { enabled: debouncedExerciseQuery.length > 0 }
  );
  
  const todayDateStr = getLocalDateString();
  const { data: todayWorkouts } = trpc.fitness.getSimpleWorkoutsByDate.useQuery({ date: todayDateStr }, { enabled: !!session?.user });
  const { data: dailySummary } = trpc.fitness.getDailySummary.useQuery({ date: todayDateStr }, { enabled: !!session?.user });
  const todayCaloriesBurned = dailySummary?.caloriesBurned ?? 0;
  const todayCalories = dailySummary?.caloriesIntake ?? 0;
  const logWorkout = trpc.fitness.logSimpleWorkout.useMutation({
    onSuccess: () => {
      utils.fitness.getSimpleWorkoutsByDate.invalidate();
      utils.fitness.getDailySummary.invalidate();
      utils.fitness.getDashboard.invalidate();
      utils.fitness.getGoalProgress.invalidate();
      // Reset form
      setExerciseQuery('');
      setSelectedExercise(null);
      setSets(3);
      setReps(10);
      setDuration(15);
    }
  });

  const deleteWorkoutMutation = trpc.fitness.deleteSimpleWorkout.useMutation({
    onSuccess: () => {
      utils.fitness.getSimpleWorkoutsByDate.invalidate();
      utils.fitness.getDailySummary.invalidate();
      utils.fitness.getDashboard.invalidate();
      utils.fitness.getGoalProgress.invalidate();
    }
  });

  const handleLogWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseQuery) return;
    logWorkout.mutate({ 
      exerciseName: exerciseQuery, 
      caloriesPerSet: selectedExercise?.caloriesPerSet,
      sets, 
      reps, 
      duration,
      date: todayDateStr
    });
  };

  const setSimpleGoal = trpc.fitness.setSimpleGoal.useMutation({
    onSuccess: () => {
      utils.fitness.getGoalProgress.invalidate();
    }
  });

  const { data: goalProgress } = trpc.fitness.getGoalProgress.useQuery(undefined, { enabled: !!session?.user });

  const [showGoalSelection, setShowGoalSelection] = useState(false);

  // Helper functions for dynamic UI logic
  function getGoalTargets(goalType: string) {
    if (goalType === "lose_weight") {
      return { burn: 400, intake: 1800 };
    }
    if (goalType === "build_muscle") {
      return { burn: 300, intake: 2500 };
    }
    return { burn: 300, intake: 2000 };
  }

  function checkGoalAchieved(goalType: string, burned: number, intake: number) {
    if (goalType === "lose_weight") {
      return burned > intake; // Assuming the user meant this as a simple check
    }
    if (goalType === "build_muscle") {
      return intake > burned;
    }
    return Math.abs(burned - intake) < 200;
  }

  // --- NEW INTELLIGENT GOALS LOGIC ---
  function calculateBMR(weight: number, height: number, age: number) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }

  // Using mocked health data as requested (assuming age 20)
  const userWeight = 70; 
  const userHeight = 175; 
  const userAge = 20;
  
  const bmr = calculateBMR(userWeight, userHeight, userAge);
  const dailyCalories = bmr * 1.4;

  // Calculate dynamic targets if goalProgress is available
  let dynamicTargetBurn = 0;
  let netCalories = 0;
  let burnProgress = 0;

  if (goalProgress && dailySummary) {
    // Dynamic target: how much more to burn to balance daily needs vs intake
    dynamicTargetBurn = dailyCalories - todayCalories;
    if (dynamicTargetBurn < 0) dynamicTargetBurn = 0; // Prevent negative targets
    
    netCalories = dailySummary.netCalories;
    
    burnProgress = dynamicTargetBurn > 0 ? (todayCaloriesBurned / dynamicTargetBurn) * 100 : 100;
    if (burnProgress > 100) burnProgress = 100;
  }


  // ============================================================
  // NUTRITION TAB STATE — Search, log, and display food items
  // ============================================================
  
  // Food search state — LIVE SEARCH (results appear as user types)
  const [searchQuery, setSearchQuery] = useState("");          // What the user is typing
  const [debouncedQuery, setDebouncedQuery] = useState("");    // Debounced value sent to API
  
  // Debounce effect — waits 300ms after user stops typing before searching
  // This prevents firing a search on every single keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300); // 300ms delay
    // Cleanup: cancel the timer if user types again before 300ms
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Meal logging state — tracks which food card is expanded (by index)
  const [selectedFoodIdx, setSelectedFoodIdx] = useState<number | null>(null);
  // Quantity in grams — user can adjust this, default 100g
  const [quantity, setQuantity] = useState<number>(100);
  
  // tRPC hooks for the new nutrition API routes
  // searchFood — fires automatically when debouncedQuery changes (live search)
  const { data: searchResults, isFetching: isSearching } = trpc.fitness.searchFood.useQuery(
    { query: debouncedQuery },
    { enabled: debouncedQuery.length > 0 } // Only search when there's text
  );

  // getTodayCalories is now handled by dailySummary

  // getFoodLogsByDate — shows today's meals grouped by type
  const { data: todayLogs } = trpc.fitness.getFoodLogsByDate.useQuery(
    { date: todayDateStr },
    { enabled: !!session?.user }
  );

  // logFood mutation — saves food to the database
  const logFoodMutation = trpc.fitness.logFood.useMutation({
    onSuccess: () => {
      // After logging, refresh the data
      utils.fitness.getDailySummary.invalidate();
      utils.fitness.getFoodLogsByDate.invalidate();
      utils.fitness.getDashboard.invalidate();
      utils.fitness.getGoalProgress.invalidate();
      // Clear the selection and reset quantity
      setSelectedFoodIdx(null);
      setQuantity(100);
    },
  });

  // deleteFoodLog mutation — removes a food log entry from the database
  const deleteFoodLogMutation = trpc.fitness.deleteFoodLog.useMutation({
    onSuccess: () => {
      // After deleting, refresh the data so UI updates
      utils.fitness.getDailySummary.invalidate();
      utils.fitness.getFoodLogsByDate.invalidate();
      utils.fitness.getDashboard.invalidate();
      utils.fitness.getGoalProgress.invalidate();
    },
  });

  // No handleSearch needed — live search is triggered automatically via debounce

  /**
   * Handle meal logging — calculates calories based on quantity entered
   * Calories in DB are per 100g, so: actual = (caloriesPer100g * quantity) / 100
   */
  const handleLogFood = (mealType: typeof MEAL_TYPES[number]) => {
    if (selectedFoodIdx === null || !searchResults?.[selectedFoodIdx]) return;
    const food = searchResults[selectedFoodIdx];
    // Calculate calories proportionally based on quantity
    const adjustedCalories = Math.round((food.calories * quantity) / 100);
    const adjustedProtein = Math.round(((food.protein || 0) * quantity) / 100);
    const adjustedCarbs = Math.round(((food.carbs || 0) * quantity) / 100);
    const adjustedFat = Math.round(((food.fat || 0) * quantity) / 100);
    
    logFoodMutation.mutate({
      foodName: food.foodName,
      calories: adjustedCalories,
      protein: adjustedProtein,
      carbs: adjustedCarbs,
      fat: adjustedFat,
      mealType,
      date: todayDateStr
    });
  };

  // Legacy nutrition logging (kept for backward compatibility with Fluid logging)
  const [activeMeal, setActiveMeal] = useState<'Fluid' | null>(null);
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
          <div className="space-y-8 animate-in fade-in">
            {/* 1. TOTAL CALORIES BURNED */}
            <div className="bg-gray-50 p-8 rounded-[32px] text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Today's Calories Burned</p>
              <p className="text-5xl font-bold">{todayCaloriesBurned ?? 0} <span className="text-lg text-gray-400 font-normal">kcal</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 2. LOG WORKOUT FORM */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Log a Workout</h2>
                <form onSubmit={handleLogWorkout} className="bg-white border rounded-3xl p-6 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Exercise Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={exerciseQuery} 
                        onChange={e => {
                          setExerciseQuery(e.target.value);
                          if (selectedExercise && e.target.value !== selectedExercise.exerciseName) {
                            setSelectedExercise(null);
                          }
                        }} 
                        placeholder="e.g. Bench Press, Squat" 
                        required 
                        className="w-full p-3 border rounded-xl font-bold focus:outline-none focus:border-black"
                      />
                      {debouncedExerciseQuery && !selectedExercise && exerciseSearchResults && exerciseSearchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                          {exerciseSearchResults.map((ex) => (
                            <div 
                              key={ex.exerciseName}
                              onClick={() => {
                                setExerciseQuery(ex.exerciseName);
                                setSelectedExercise(ex);
                              }}
                              className="p-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                            >
                              <span className="font-bold">{ex.exerciseName}</span>
                              <span className="text-xs text-gray-500">{ex.caloriesPerSet} cal/set</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Sets</label>
                      <input 
                        type="number" min="1" 
                        value={sets} 
                        onChange={e => setSets(Number(e.target.value))} 
                        className="w-full p-3 border rounded-xl font-bold focus:outline-none focus:border-black text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Reps</label>
                      <input 
                        type="number" min="1" 
                        value={reps} 
                        onChange={e => setReps(Number(e.target.value))} 
                        className="w-full p-3 border rounded-xl font-bold focus:outline-none focus:border-black text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Duration (min)</label>
                      <input 
                        type="number" min="1" 
                        value={duration} 
                        onChange={e => setDuration(Number(e.target.value))} 
                        className="w-full p-3 border rounded-xl font-bold focus:outline-none focus:border-black text-center"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={logWorkout.isPending} 
                    className="w-full py-4 mt-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {logWorkout.isPending ? 'Logging...' : 'Log Workout'}
                  </button>
                </form>
              </div>

              {/* 3. TODAY'S WORKOUTS */}
              <div className="space-y-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Workouts</h2>
                <div className="space-y-3">
                  {todayWorkouts && todayWorkouts.length > 0 ? (
                    todayWorkouts.map((w) => (
                      <div key={w.id} className="p-5 border rounded-2xl flex justify-between items-center group bg-white shadow-sm hover:border-black transition-all">
                        <div>
                          <p className="font-bold text-lg">{w.exerciseName}</p>
                          <p className="text-sm text-gray-500 font-medium mt-1">
                            {w.sets} sets × {w.reps} reps, {w.duration} min
                          </p>
                        </div>
                        <div className="flex items-center gap-3 text-right">
                          <p className="font-bold text-red-500">{w.caloriesBurned} cal</p>
                          <button
                            onClick={() => deleteWorkoutMutation.mutate({ id: w.id })}
                            disabled={deleteWorkoutMutation.isPending}
                            className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="Remove this workout"
                          >
                            <BsTrash size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 border-2 border-dashed rounded-3xl text-center text-gray-400 font-bold bg-gray-50">
                      No workouts logged yet. Let's get moving!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* NUTRITION TAB — Food Search + Meal Logging + Day-wise View   */}
        {/* ============================================================ */}
        {activeTab === 'nutrition' && (
          <div className="space-y-8 animate-in fade-in">

            {/* 1. TOTAL CALORIES TODAY — Shows at the top */}
            <div className="bg-gray-50 p-8 rounded-[32px] text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Calories Today</p>
              <p className="text-5xl font-bold">{todayCalories ?? 0} <span className="text-lg text-gray-400 font-normal">kcal</span></p>
            </div>

            {/* 2. FOOD SEARCH — Search bar with dropdown results */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Search Food</h2>
              
              {/* Search input + dropdown container */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Start typing to search (e.g., biryani, paneer, dal)..."
                  className={`w-full p-4 border-2 font-bold focus:outline-none focus:border-black ${
                    searchResults && searchResults.length > 0 && debouncedQuery 
                      ? 'rounded-t-2xl rounded-b-none border-b-0' 
                      : 'rounded-2xl'
                  }`}
                />
                {/* Subtle loading indicator inside the input */}
                {isSearching && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">Searching...</span>
                )}

                {/* DROPDOWN RESULTS — styled as autocomplete suggestions */}
                {searchResults && searchResults.length > 0 && debouncedQuery && (
                  <div className="border-2 border-t-0 rounded-b-2xl bg-white shadow-lg max-h-[350px] overflow-y-auto">
                    {searchResults.map((food, idx) => {
                      const isExpanded = selectedFoodIdx === idx;
                      const adjustedCal = Math.round((food.calories * quantity) / 100);

                      return (
                        <div key={idx}>
                          {/* Each suggestion row */}
                          <button
                            onClick={() => {
                              setSelectedFoodIdx(isExpanded ? null : idx);
                              setQuantity(100);
                            }}
                            className={`w-full px-4 py-3 text-left flex justify-between items-center hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                              isExpanded ? 'bg-red-50' : ''
                            }`}
                          >
                            <span className="text-sm font-semibold truncate max-w-[60%]">{food.foodName}</span>
                            <div className="flex flex-col items-end">
                              <span className="text-xs font-bold text-gray-600 whitespace-nowrap">{food.calories} cal/100g</span>
                              <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">P:{food.protein}g C:{food.carbs}g F:{food.fat}g</span>
                            </div>
                          </button>

                          {/* Inline expansion — quantity + meal type (appears inside dropdown) */}
                          {isExpanded && (
                            <div className="bg-gray-50 px-4 py-4 border-b border-gray-200 space-y-3">
                              {/* Quantity input + live calorie preview */}
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                  <label className="text-xs font-bold text-gray-500">Qty:</label>
                                  <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                    min={1}
                                    className="w-16 p-1.5 border rounded-lg text-center text-sm font-bold focus:outline-none focus:border-black"
                                  />
                                  <span className="text-xs text-gray-400 font-bold">g</span>
                                </div>
                                <div className="text-sm font-bold flex flex-col">
                                  <span>= <span className="text-red-500 text-base">{adjustedCal}</span> cal</span>
                                  <span className="text-[10px] text-gray-400 font-medium">
                                    P:{Math.round(((food.protein || 0) * quantity) / 100)}g 
                                    C:{Math.round(((food.carbs || 0) * quantity) / 100)}g 
                                    F:{Math.round(((food.fat || 0) * quantity) / 100)}g
                                  </span>
                                </div>
                              </div>
                              {/* Compact meal type buttons */}
                              <div className="grid grid-cols-4 gap-2">
                                {MEAL_TYPES.map((mealType) => (
                                  <button
                                    key={mealType}
                                    onClick={() => handleLogFood(mealType)}
                                    disabled={logFoodMutation.isPending}
                                    className="py-2 border-2 rounded-lg font-bold capitalize text-xs hover:border-black hover:bg-white transition-all disabled:opacity-50"
                                  >
                                    {mealType}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* No results — shown inside dropdown area */}
                {searchResults && searchResults.length === 0 && debouncedQuery && !isSearching && (
                  <div className="border-2 border-t-0 rounded-b-2xl bg-white shadow-lg px-4 py-4">
                    <p className="text-center text-gray-400 text-sm font-bold">No foods found. Try a different search.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. WATER LOGGING — Quick access to log water */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveMeal(activeMeal === 'Fluid' ? null : 'Fluid')}
                className="p-6 border rounded-[24px] text-left hover:border-black transition-all group w-full flex justify-between items-center"
              >
                <div>
                  <p className="text-xl font-bold flex items-center gap-2"><BsDropletFill className="text-blue-500" /> Water</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 group-hover:text-blue-500">Log Intake</p>
                </div>
              </button>

              {activeMeal === 'Fluid' && (
                <div className="bg-blue-50 p-6 rounded-[24px] animate-in slide-in-from-bottom-3">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const amount = Number(new FormData(e.currentTarget).get('ml'));
                    logWater.mutate({ amountMl: amount });
                  }} className="flex gap-4">
                    <input name="ml" type="number" placeholder="500ml" required className="flex-1 p-4 rounded-2xl border font-bold" />
                    <button type="submit" className="px-8 bg-blue-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs">Save</button>
                  </form>
                </div>
              )}
            </div>

            {/* 5. DAY-WISE MEAL DISPLAY — Shows today's meals grouped by type */}
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Meals</h3>
              
              {/* Show each meal type section */}
              {MEAL_TYPES.map((mealType) => {
                // Get the food logs for this meal type
                const logs = todayLogs?.[mealType] || [];
                
                return (
                  <div key={mealType} className="space-y-2">
                    {/* Meal type header with total calories for this meal */}
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold capitalize text-lg">{mealType}</h4>
                      <span className="text-sm text-gray-400 font-bold">
                        {logs.reduce((sum, l) => sum + l.calories, 0)} cal
                      </span>
                    </div>
                    
                    {/* List of foods in this meal — each has a remove button */}
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <div key={log.id} className="p-4 border rounded-xl flex justify-between items-center group">
                          <div className="max-w-[60%]">
                            <p className="font-bold truncate w-full">{log.foodName}</p>
                            <p className="text-[10px] font-bold text-gray-400">P:{log.protein}g C:{log.carbs}g F:{log.fat}g</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-red-500">{log.calories} cal</span>
                            {/* Remove button — calls backend deleteFoodLog */}
                            <button
                              onClick={() => deleteFoodLogMutation.mutate({ id: log.id })}
                              disabled={deleteFoodLogMutation.isPending}
                              className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50"
                              title="Remove this food"
                            >
                              <BsTrash size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-300 text-sm font-bold py-2">No items logged</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
           <div className="space-y-8 animate-in fade-in pt-10">
              {goalProgress && !showGoalSelection ? (
                // AFTER SELECTING GOAL
                <div className="space-y-8">
                  <div className="bg-gray-50 p-8 rounded-[32px] text-center border">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Goal</p>
                    <p className="text-4xl font-bold capitalize">
                      {goalProgress.goalType === 'lose_weight' && "Lose Weight"}
                      {goalProgress.goalType === 'build_muscle' && "Build Muscle"}
                      {goalProgress.goalType === 'maintain' && "Maintain"}
                    </p>
                    <div className="mt-4 inline-block px-4 py-2 bg-white rounded-full border shadow-sm">
                      <p className={`text-sm font-bold ${checkGoalAchieved(goalProgress.goalType, todayCaloriesBurned, todayCalories) ? 'text-green-500' : 'text-red-500'}`}>
                        {checkGoalAchieved(goalProgress.goalType, todayCaloriesBurned, todayCalories) ? "✔ Goal Achieved Today" : "❌ Goal Not Achieved"}
                      </p>
                    </div>
                    {/* INSIGHT MESSAGE */}
                    <div className="mt-3 text-sm text-gray-500 font-medium">
                      {goalProgress.goalType === 'lose_weight' && "Burn more calories than intake to lose weight"}
                      {todayCalories > todayCaloriesBurned && goalProgress.goalType !== 'lose_weight' && "Try reducing calorie intake"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Targets */}
                    <div className="p-8 border rounded-[32px]">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Targets</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="font-bold">Burn</span>
                          <span className="font-bold text-red-500">{dynamicTargetBurn} kcal</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="font-bold">Intake</span>
                          <span className="font-bold text-green-500">{getGoalTargets(goalProgress.goalType).intake} kcal</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 font-bold">
                          <span>BMR: {bmr} kcal/day</span>
                          <span>Daily Need: {dailyCalories} kcal</span>
                        </div>
                      </div>
                    </div>

                    {/* Today's Progress */}
                    <div className="p-8 border rounded-[32px]">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Today's Progress</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="font-bold">Calories Burned</span>
                          <span className="font-bold text-red-500">{todayCaloriesBurned} kcal</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="font-bold">Calories Intake</span>
                          <span className="font-bold text-green-500">{todayCalories} kcal</span>
                        </div>
                        {/* NET CALORIES */}
                        <div className="flex justify-between items-center pb-4 border-b">
                          <span className="font-bold">Net Calories</span>
                          <span className={`font-bold px-3 py-1 rounded-full ${netCalories < 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {netCalories < 0 ? `Calorie Deficit: ${netCalories} kcal` : `Calorie Surplus: +${netCalories} kcal`}
                          </span>
                        </div>
                        {/* PROGRESS BAR */}
                        <div className="pt-2">
                          <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                            <span>Burn Progress</span>
                            <span>{Math.round(burnProgress)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${burnProgress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Button to change goal */}
                  <div className="text-center mt-8">
                    <button 
                      onClick={() => setShowGoalSelection(true)}
                      className="text-xs font-bold text-gray-400 underline hover:text-black"
                    >
                      Change Goal
                    </button>
                  </div>
                </div>
              ) : (
                // GOAL SELECTION UI
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-center">Select your fitness goal</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[
                       { id: 'lose_weight', title: 'Lose Weight', desc: 'Burn more than you eat' },
                       { id: 'build_muscle', title: 'Build Muscle', desc: 'Eat more than you burn' },
                       { id: 'maintain', title: 'Maintain', desc: 'Keep intake and burn balanced' }
                     ].map(g => (
                        <button 
                          key={g.id} 
                          onClick={() => {
                            setSimpleGoal.mutate({ type: g.id as any });
                            setShowGoalSelection(false);
                          }} 
                          disabled={setSimpleGoal.isPending}
                          className="p-10 border rounded-[40px] text-left hover:border-black transition-all group bg-white shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                           <p className="text-2xl font-bold">{g.title}</p>
                           <p className="text-sm text-gray-500 mt-2">{g.desc}</p>
                           <p className="text-xs font-bold text-gray-400 uppercase mt-6 group-hover:text-red-500 transition-colors">Select Goal &rarr;</p>
                        </button>
                     ))}
                  </div>
                </div>
              )}
           </div>
        )}
      </div>

    </div>
  );
}
