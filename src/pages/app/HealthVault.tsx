import { useState } from 'react';
import { FaFlask, FaFilePrescription, FaUserMd, FaSyringe, FaSearch, FaPlus, FaChevronDown } from 'react-icons/fa';

const navLinks = [
  { label: 'Dashboard', active: false },
  { label: 'Health Vault', active: true },
  { label: 'Profile', active: false },
];

const categories = ['All Categories', 'Lab Report', 'Prescription', 'Consultation', 'Vaccination'];
const sortOptions = ['Date (Newest)', 'Date (Oldest)', 'A-Z', 'Z-A'];

const records = [
  {
    icon: <FaFlask className="text-blue-400 text-2xl" />, color: 'bg-blue-100',
    title: 'Complete Blood Count', type: 'Lab Report', date: 'Oct 15, 2023',
    doctor: 'Dr. Anjali Sharma', tags: ['#AnnualCheckup', '#Routine'], link: '#',
  },
  {
    icon: <FaFilePrescription className="text-green-500 text-2xl" />, color: 'bg-green-100',
    title: 'Prescription - Fever', type: 'Prescription', date: 'Sep 28, 2023',
    doctor: 'Dr. Raj Patel', tags: ['#Fever', '#DrPatel'], link: '#',
  },
  {
    icon: <FaUserMd className="text-purple-500 text-2xl" />, color: 'bg-purple-100',
    title: 'Dermatology Follow-up', type: 'Consultation', date: 'Aug 05, 2023',
    doctor: 'Dr. Priya Singh', tags: ['#SkinCare'], link: '#',
  },
  {
    icon: <FaSyringe className="text-yellow-600 text-2xl" />, color: 'bg-yellow-100',
    title: 'COVID-19 Booster', type: 'Vaccination', date: 'Jul 12, 2023',
    doctor: 'City Health Center', tags: ['#Immunization'], link: '#',
  },
];

const HealthVault = () => {
  const [category, setCategory] = useState(categories[0]);
  const [sort, setSort] = useState(sortOptions[0]);
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-green-400"></span>
          </div>
          <span className="text-gray-900 font-bold text-2xl ml-2">Swāsthya Sync</span>
        </div>
        <nav className="flex gap-2">
          {navLinks.map((nav) => (
            <button
              key={nav.label}
              className={`px-5 py-2 rounded-lg font-medium text-base transition-all ${
                nav.active
                  ? 'bg-orange-100 text-orange-500 shadow border border-orange-200'
                  : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Title & Subtitle */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-gray-900">Health Vault</h1>
        <p className="text-gray-500 text-lg mt-1">Your secure & organized medical history.</p>
      </div>
      <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-orange-200 rounded-full mb-6"></div>

      {/* Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex gap-3 items-center">
          {/* Filter Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
              {category} <FaChevronDown className="ml-1 text-gray-400" />
            </button>
            {/* Dropdown logic can be added here */}
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
              {sort} <FaChevronDown className="ml-1 text-gray-400" />
            </button>
            {/* Dropdown logic can be added here */}
          </div>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search records..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
            />
          </div>
          {/* Add Record Button */}
          <button className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all">
            <FaPlus /> Add Record
          </button>
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {records.map((rec, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full ${rec.color}`}>{rec.icon}</div>
              <div className="ml-auto text-gray-400 font-medium text-sm">{rec.date}</div>
            </div>
            <div className="font-bold text-lg text-gray-900">{rec.title}</div>
            <div className="text-gray-500 text-sm mb-1">{rec.type}</div>
            <div className="text-gray-700 text-sm">
              <span className="font-semibold">{rec.type === 'Vaccination' ? 'Clinic' : 'Doctor'}:</span> {rec.doctor}
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {rec.tags.map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">{tag}</span>
              ))}
            </div>
            <a href={rec.link} className="mt-3 text-orange-500 font-semibold text-sm hover:underline self-end">View Document</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthVault; 