import React, { useState, useEffect } from 'react';
import { FaGlassWhiskey, FaCoffee, FaLeaf, FaLemon, FaPlus, FaGlassMartiniAlt, FaWineBottle, FaAppleAlt } from 'react-icons/fa';
import { supabase } from '../../lib/supabaseClient';

const periodOptions = [
  { label: 'daily' },
  { label: 'weekly' },
  { label: 'monthly' },
  { label: 'quarterly' },
  { label: 'yearly' },
];

type HydrationOption = {
  icon: React.ReactElement;
  label: string;
  value?: string;
  unit: string;
  topBg: string;
  bottomBg: string;
  bottomText: string;
  est: string;
};

const hydrationCategories: { label: string; icon: React.ReactElement; topBg: string; bottomBg: string; bottomText: string; }[] = [
  { label: 'Water', icon: <FaGlassWhiskey className="text-3xl text-sky-400" />, topBg: 'bg-sky-100', bottomBg: 'bg-sky-400', bottomText: 'text-white' },
  { label: 'Electrolytes', icon: <FaLemon className="text-3xl text-yellow-400" />, topBg: 'bg-yellow-100', bottomBg: 'bg-yellow-400', bottomText: 'text-white' },
  { label: 'Flavored Water', icon: <FaGlassWhiskey className="text-3xl text-pink-400" />, topBg: 'bg-pink-100', bottomBg: 'bg-pink-400', bottomText: 'text-white' },
  { label: 'Tea', icon: <FaLeaf className="text-3xl text-green-400" />, topBg: 'bg-green-100', bottomBg: 'bg-green-400', bottomText: 'text-white' },
  { label: 'Coffee', icon: <FaCoffee className="text-3xl text-brown-400" />, topBg: 'bg-yellow-100', bottomBg: 'bg-yellow-400', bottomText: 'text-white' },
  { label: 'Juice', icon: <FaAppleAlt className="text-3xl text-pink-400" />, topBg: 'bg-pink-100', bottomBg: 'bg-pink-400', bottomText: 'text-white' },
  { label: 'Milk Drinks', icon: <FaGlassMartiniAlt className="text-3xl text-yellow-400" />, topBg: 'bg-yellow-100', bottomBg: 'bg-yellow-400', bottomText: 'text-white' },
  { label: 'Smoothies', icon: <FaAppleAlt className="text-3xl text-purple-400" />, topBg: 'bg-purple-100', bottomBg: 'bg-purple-400', bottomText: 'text-white' },
  { label: 'Functional Drinks', icon: <FaWineBottle className="text-3xl text-gray-400" />, topBg: 'bg-gray-100', bottomBg: 'bg-gray-400', bottomText: 'text-white' },
  { label: 'Herbal Drinks', icon: <FaLeaf className="text-3xl text-green-400" />, topBg: 'bg-green-100', bottomBg: 'bg-green-400', bottomText: 'text-white' },
  { label: 'Broths', icon: <FaGlassWhiskey className="text-3xl text-orange-400" />, topBg: 'bg-orange-100', bottomBg: 'bg-orange-400', bottomText: 'text-white' },
  { label: 'Traditional Drinks', icon: <FaGlassWhiskey className="text-3xl text-blue-400" />, topBg: 'bg-blue-100', bottomBg: 'bg-blue-400', bottomText: 'text-white' },
];


const Hydration = () => {
  const [hydrationStats, setHydrationStats] = useState<HydrationOption[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editMl, setEditMl] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<'daily'|'weekly'|'monthly'|'quarterly'|'yearly'>('daily');
  const [addedCategories, setAddedCategories] = useState<string[]>([]);

  // Helper to get date range for period
  const getDateRange = (period: string) => {
    const today = new Date();
    let start: Date, end: Date;
    end = new Date(today);
    switch (period) {
      case 'daily':
        start = new Date(today);
        break;
      case 'weekly':
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        break;
      case 'monthly':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarterly':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      case 'yearly':
        start = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(today);
    }
    return { start, end };
  };

  // Fetch user and hydration logs for selected period
  useEffect(() => {
    const fetchHydration = async () => {
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
      // Fetch hydration logs for this user and period
      const { start, end } = getDateRange(activePeriod);
      const startStr = start.toISOString().slice(0, 10);
      const endStr = end.toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from('hydration_logs')
        .select('category, amount_ml')
        .eq('user_id', user.id)
        .gte('date', startStr)
        .lte('date', endStr);
      if (error) {
        console.error('Error fetching hydration logs:', error.message);
        return;
      }
      // Sum by category
      const categoryTotals: { [key: string]: number } = {};
      data.forEach((row: { category: string; amount_ml: number }) => {
        categoryTotals[row.category] = (categoryTotals[row.category] || 0) + row.amount_ml;
      });
      // Build hydrationStats from categories
      const stats: HydrationOption[] = hydrationCategories.map(cat => ({
        icon: cat.icon,
        label: cat.label,
        value: categoryTotals[cat.label] ? (categoryTotals[cat.label] / 1000).toFixed(2) : undefined,
        unit: 'liters',
        topBg: cat.topBg,
        bottomBg: cat.bottomBg,
        bottomText: cat.bottomText,
        est: '',
      }));
      setHydrationStats(stats);
      // Track which categories have been added (i.e., have a value)
      setAddedCategories(Object.keys(categoryTotals));
    };
    fetchHydration();
  }, [activePeriod]);

  const handlePeriodClick = (label: string) => {
    setActivePeriod(label as typeof activePeriod);
  };

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddCategory = (category: typeof hydrationCategories[0]) => {
    if (!addedCategories.includes(category.label)) {
      setAddedCategories([...addedCategories, category.label]);
    }
    setShowModal(false);
  };

  const handleCardClick = (idx: number) => {
    // Only allow editing if category is added
    if (!addedCategories.includes(hydrationStats[idx].label)) return;
    setEditingIndex(idx);
    setEditMl('');
  };
  const handleEditMlChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditMl(e.target.value);
  const handleAddAmount = async (idx: number) => {
    if (!editMl || isNaN(Number(editMl)) || !userId) return;
    const addMl = Number(editMl);
    const today = new Date().toISOString().slice(0, 10);
    const category = hydrationStats[idx].label;
    // Insert new hydration log
    const { error } = await supabase.from('hydration_logs').insert([
      { user_id: userId, date: today, category, amount_ml: addMl }
    ]);
    if (error) {
      console.error('Error adding hydration log:', error.message);
      return;
    }
    // Update UI
    const prev = Number(hydrationStats[idx].value || 0);
    const newValue = (prev + addMl / 1000).toFixed(2);
    setHydrationStats(hydrationStats.map((stat, i) => i === idx ? { ...stat, value: newValue } : stat));
    setEditingIndex(null);
  };
  const handleSubtractAmount = async (idx: number) => {
    if (!editMl || isNaN(Number(editMl)) || !userId) return;
    const subMl = Number(editMl);
    const today = new Date().toISOString().slice(0, 10);
    const category = hydrationStats[idx].label;
    // Insert negative hydration log
    const { error } = await supabase.from('hydration_logs').insert([
      { user_id: userId, date: today, category, amount_ml: -subMl }
    ]);
    if (error) {
      console.error('Error subtracting hydration log:', error.message);
      return;
    }
    // Update UI
    const prev = Number(hydrationStats[idx].value || 0);
    const newValue = Math.max(prev - subMl / 1000, 0).toFixed(2);
    setHydrationStats(hydrationStats.map((stat, i) => i === idx ? { ...stat, value: newValue } : stat));
    setEditingIndex(null);
  };

  return (
    <div className="h-screen px-4 py-6 relative">
      {/* Today Title */}
      <div className="text-3xl font-bold mb-4">today</div>

      {/* Period Filters */}
      <div className="flex gap-4 mb-8">
        {periodOptions.map((opt) => (
          <button
            key={opt.label}
            className={`px-6 py-2 rounded border font-medium text-lg transition-all ${
              activePeriod === opt.label ? 'bg-black text-white border-black' : 'bg-white text-black border-black/30 hover:border-black'
            }`}
            onClick={() => handlePeriodClick(opt.label)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Hydration Stat Cards - align left */}
      <div className="flex flex-wrap gap-10 mb-4 justify-start">
        {hydrationStats
          .map((stat, idx) => ({ stat, idx }))
          .filter(({ stat }) => addedCategories.includes(stat.label))
          .map(({ stat, idx }) => (
            <div key={stat.label + (stat.value ?? '') + idx} className="flex flex-col w-72 h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer" onClick={() => handleCardClick(idx)}>
              <div className={`flex flex-col items-center justify-center py-10 ${stat.topBg}`}>
                {stat.icon}
                <div className="mt-4 text-2xl font-semibold text-black">{stat.label}</div>
              </div>
              <div className={`flex-1 flex flex-col items-center justify-center py-12 ${stat.bottomBg} ${stat.bottomText}`}>
                {editingIndex === idx ? (
                  <form onClick={e => e.stopPropagation()} onSubmit={e => e.preventDefault()} className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={editMl}
                        onChange={handleEditMlChange}
                        className="border rounded px-2 py-1 w-24 text-black"
                        placeholder="ml"
                        autoFocus
                      />
                      <span className="text-lg font-medium">ml</span>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleAddAmount(idx)} className="bg-green-600 text-white rounded-lg px-4 py-1 font-semibold hover:bg-green-700 transition">Add</button>
                      <button type="button" onClick={() => handleSubtractAmount(idx)} className="bg-red-600 text-white rounded-lg px-4 py-1 font-semibold hover:bg-red-700 transition">Subtract</button>
                    </div>
                  </form>
                ) : (
                  <div className="text-3xl font-bold">{stat.value ? `${stat.value} ` : '-- '}<span className="text-xl font-normal">liters</span></div>
                )}
              </div>
            </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button onClick={handleAddClick} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
        <FaPlus className="text-white text-3xl" />
      </button>
      {/* Modal Popup - now simple, no blur, grid of squares */}
      {showModal && (
        <div className="fixed inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[36rem] shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-4 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-6">Add Hydration Category</h2>
            <div className="grid grid-cols-3 gap-6">
              {hydrationCategories.filter(cat => !addedCategories.includes(cat.label)).map((cat) => (
                <button
                  key={cat.label}
                  className={`flex flex-col items-center justify-center w-32 h-32 rounded-xl border-2 border-gray-200 transition-all shadow hover:shadow-lg ${cat.topBg}`}
                  onClick={() => handleAddCategory(cat)}
                >
                  {cat.icon}
                  <span className="mt-4 text-base font-semibold text-center text-black">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hydration; 