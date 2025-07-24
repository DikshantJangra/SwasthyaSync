import React, { useState } from 'react';
import { FaRegCalendarAlt, FaGlassWhiskey, FaCoffee, FaLeaf, FaLemon, FaPlus, FaGlassMartiniAlt, FaWineBottle, FaAppleAlt } from 'react-icons/fa';

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

const extraOptions: Omit<HydrationOption, 'value'>[] = [
  { label: 'milk', icon: <FaGlassMartiniAlt className="text-3xl text-yellow-400" />, unit: 'glass', topBg: 'bg-yellow-100', bottomBg: 'bg-yellow-400', bottomText: 'text-white', est: '2 glass' },
  { label: 'juice', icon: <FaAppleAlt className="text-3xl text-pink-400" />, unit: 'glass', topBg: 'bg-pink-100', bottomBg: 'bg-pink-400', bottomText: 'text-white', est: '2 glass' },
  { label: 'soda', icon: <FaWineBottle className="text-3xl text-gray-400" />, unit: 'bottle', topBg: 'bg-gray-100', bottomBg: 'bg-gray-400', bottomText: 'text-white', est: '1 bottle' },
];

const initialHydrationStats: HydrationOption[] = [
  {
    icon: <FaGlassWhiskey className="text-3xl text-sky-400" />, label: 'water', value: '2.5', unit: 'litters',
    topBg: 'bg-sky-100', bottomBg: 'bg-sky-400', bottomText: 'text-white', est: '6ltrs',
  },
];

const Hydration = () => {
  const [hydrationStats, setHydrationStats] = useState<HydrationOption[]>(initialHydrationStats);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Omit<HydrationOption, 'value'> | null>(null);
  const [inputValue, setInputValue] = useState('');

  const today = new Date();
  const formatted = today.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOption(null);
    setInputValue('');
  };
  const handleOptionSelect = (option: Omit<HydrationOption, 'value'>) => setSelectedOption(option);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value);
  const handleAddHydration = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedOption || !inputValue) return;
    setHydrationStats([
      ...hydrationStats,
      {
        ...selectedOption,
        value: inputValue,
      },
    ]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-sky-300"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-sky-300"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-sky-300"></span>
          </div>
          <span className="text-sky-400 font-bold text-2xl ml-2">Swāsthya Sync</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <FaRegCalendarAlt />
          <span className="text-base font-medium">{formatted}</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200"></div>
      </div>

      {/* Today Title */}
      <div className="text-3xl font-bold mb-4">today</div>

      {/* Period Filters */}
      <div className="flex gap-4 mb-8">
        {periodOptions.map((opt) => (
          <button
            key={opt.label}
            className={`px-6 py-2 rounded border font-medium text-lg transition-all ${
              // No activePeriod state, so just default styling
              'bg-white text-black border-black/30 hover:border-black'
            }`}
            // onClick handler can be added if period filtering is needed
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Hydration Stat Cards - align left */}
      <div className="flex flex-wrap gap-10 mb-4 justify-start">
        {hydrationStats.map((stat) => (
          <div key={stat.label + stat.value} className="flex flex-col w-72 h-80 rounded-2xl overflow-hidden shadow-lg">
            <div className={`flex flex-col items-center justify-center py-10 ${stat.topBg}`}>
              {stat.icon}
              <div className="mt-4 text-2xl font-semibold text-black">{stat.label}</div>
            </div>
            <div className={`flex-1 flex flex-col items-center justify-center py-12 ${stat.bottomBg} ${stat.bottomText}`}>
              <div className="text-3xl font-bold">{stat.value} <span className="text-xl font-normal">{stat.unit}</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button */}
      <button onClick={handleAddClick} className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-black flex items-center justify-center shadow-lg hover:bg-gray-800 transition">
        <FaPlus className="text-white text-3xl" />
      </button>
      {/* Modal Popup with light blur bg */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-96 shadow-lg relative">
            <button onClick={handleCloseModal} className="absolute top-2 right-4 text-2xl">&times;</button>
            <h2 className="text-xl font-bold mb-4">Add Hydration</h2>
            <div className="flex gap-4 mb-4">
              {extraOptions.map((opt) => (
                <button
                  key={opt.label}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${selectedOption?.label === opt.label ? 'border-black' : 'border-gray-200'}`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {opt.icon}
                  <span className="mt-2 text-base font-medium">{opt.label}</span>
                </button>
              ))}
            </div>
            {selectedOption && (
              <form onSubmit={handleAddHydration} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Amount:</span>
                  <input
                    type="number"
                    min="0"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="border rounded px-2 py-1 w-24"
                    placeholder={`e.g. 1`}
                  />
                  <span className="text-lg font-medium">{selectedOption.unit}</span>
                </div>
                <button type="submit" className="bg-black text-white rounded-lg px-4 py-2 font-semibold hover:bg-gray-800 transition">Add</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Hydration; 