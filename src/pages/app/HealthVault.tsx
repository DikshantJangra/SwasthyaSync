import { useState } from 'react';
import { FaFlask, FaFilePrescription, FaUserMd, FaSyringe, FaSearch, FaPlus, FaChevronDown, FaHospital, FaTooth, FaEye, FaFileMedical, FaFileInvoiceDollar, FaFileAlt, FaXRay } from 'react-icons/fa';
import React, { useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react';

const navLinks = [
  { label: 'Dashboard', active: false },
  { label: 'Health Vault', active: true },
  { label: 'Profile', active: false },
];

const categories = ['All Categories', 'Lab Report', 'Prescription', 'Consultation', 'Vaccination'];
const sortOptions = ['Date (Newest)', 'Date (Oldest)', 'A-Z', 'Z-A'];

const initialRecords = [
  {
    icon: <FaFlask className="text-blue-400 text-2xl" />, color: 'bg-blue-100',
    title: 'Complete Blood Count', type: 'Lab Report', date: 'Oct 15, 2023',
    doctor: 'Dr. Anjali Sharma', tags: ['#AnnualCheckup', '#Routine'], link: '#', notes: ''
  },
  {
    icon: <FaFilePrescription className="text-green-500 text-2xl" />, color: 'bg-green-100',
    title: 'Prescription - Fever', type: 'Prescription', date: 'Sep 28, 2023',
    doctor: 'Dr. Raj Patel', tags: ['#Fever', '#DrPatel'], link: '#', notes: ''
  },
  {
    icon: <FaUserMd className="text-purple-500 text-2xl" />, color: 'bg-purple-100',
    title: 'Dermatology Follow-up', type: 'Consultation', date: 'Aug 05, 2023',
    doctor: 'Dr. Priya Singh', tags: ['#SkinCare'], link: '#', notes: ''
  },
  {
    icon: <FaSyringe className="text-yellow-600 text-2xl" />, color: 'bg-yellow-100',
    title: 'COVID-19 Booster', type: 'Vaccination', date: 'Jul 12, 2023',
    doctor: 'City Health Center', tags: ['#Immunization'], link: '#', notes: ''
  },
];

const recordCategories = [
  'Lab Report', 'Prescription', 'Doctor Consultation', 'Hospitalization', 'Vaccination',
  'Imaging Scan (X-ray, MRI, CT)', 'Dental Record', 'Eye Check-up', 'Discharge Summary',
  'Medical Bill', 'Insurance Document', 'Other',
];

const tagSuggestions = ['Allergy', 'Blood Test', 'Cardiology', 'Dermatology', 'ENT', 'Diabetes', 'Fever', 'Wellness', 'Cold'];

const HealthVault = () => {
  const [category, setCategory] = useState(categories[0]);
  const [sort, setSort] = useState(sortOptions[0]);
  const [search, setSearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState<{
    category: string;
    date: string;
    doctor: string;
    title: string;
    tags: string[];
    tagInput: string;
    notes: string;
  }>({
    category: '',
    date: new Date().toISOString().slice(0, 10),
    doctor: '',
    title: '',
    tags: [],
    tagInput: '',
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [records, setRecords] = useState(initialRecords);
  const [viewRecord, setViewRecord] = useState<null | typeof records[0]>(null);

  // Filter records by category
  let filteredRecords = records.filter(rec =>
    category === 'All Categories' || rec.type === category
  );
  // Search filter
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    filteredRecords = filteredRecords.filter(rec =>
      rec.title.toLowerCase().includes(s) ||
      rec.doctor.toLowerCase().includes(s) ||
      rec.tags.some(tag => tag.toLowerCase().includes(s))
    );
  }
  // Sort
  if (sort === 'Date (Newest)') {
    filteredRecords = filteredRecords.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sort === 'Date (Oldest)') {
    filteredRecords = filteredRecords.slice().sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sort === 'A-Z') {
    filteredRecords = filteredRecords.slice().sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === 'Z-A') {
    filteredRecords = filteredRecords.slice().sort((a, b) => b.title.localeCompare(a.title));
  }

  // Tag suggestion filter
  const filteredTagSuggestions = tagSuggestions.filter(
    t => t.toLowerCase().includes(form.tagInput.toLowerCase()) && !form.tags.includes(t)
  );

  // Add tag
  const addTag = (tag: string) => {
    setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: '' }));
    setTimeout(() => tagInputRef.current && tagInputRef.current.focus(), 0);
  };
  // Remove tag
  const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

  // Handle form field changes
  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFormError('');
  };

  // Save record
  const handleSaveRecord = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.category) {
      setFormError('Please select a category.');
      return;
    }
    if (!form.date) {
      setFormError('Please select a date of service.');
      return;
    }
    // Assign icon and color based on category
    let icon: React.ReactElement = <FaFilePrescription className="text-gray-500 text-2xl" />;
    let color = 'bg-gray-100';
    switch (form.category) {
      case 'Lab Report':
        icon = <FaFlask className="text-blue-400 text-2xl" />;
        color = 'bg-blue-100';
        break;
      case 'Prescription':
        icon = <FaFilePrescription className="text-green-500 text-2xl" />;
        color = 'bg-green-100';
        break;
      case 'Doctor Consultation':
        icon = <FaUserMd className="text-purple-500 text-2xl" />;
        color = 'bg-purple-100';
        break;
      case 'Vaccination':
        icon = <FaSyringe className="text-yellow-600 text-2xl" />;
        color = 'bg-yellow-100';
        break;
      case 'Hospitalization':
        icon = <FaHospital className="text-pink-500 text-2xl" />;
        color = 'bg-pink-100';
        break;
      case 'Imaging Scan (X-ray, MRI, CT)':
        icon = <FaXRay className="text-cyan-600 text-2xl" />;
        color = 'bg-cyan-100';
        break;
      case 'Dental Record':
        icon = <FaTooth className="text-orange-500 text-2xl" />;
        color = 'bg-orange-100';
        break;
      case 'Eye Check-up':
        icon = <FaEye className="text-blue-600 text-2xl" />;
        color = 'bg-blue-200';
        break;
      case 'Discharge Summary':
        icon = <FaFileMedical className="text-indigo-500 text-2xl" />;
        color = 'bg-indigo-100';
        break;
      case 'Medical Bill':
        icon = <FaFileInvoiceDollar className="text-amber-600 text-2xl" />;
        color = 'bg-amber-100';
        break;
      case 'Insurance Document':
        icon = <FaFileAlt className="text-lime-600 text-2xl" />;
        color = 'bg-lime-100';
        break;
      case 'Other':
      default:
        icon = <FaFilePrescription className="text-gray-500 text-2xl" />;
        color = 'bg-gray-100';
        break;
    }
    // Format date as e.g. 'Oct 15, 2023'
    const dateObj = new Date(form.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    setRecords(prev => [
      {
        icon,
        color,
        title: form.title || form.category,
        type: form.category,
        date: formattedDate,
        doctor: form.doctor,
        tags: form.tags.map(t => t.startsWith('#') ? t : `#${t}`),
        link: '#',
        notes: form.notes,
      },
      ...prev,
    ]);
    setShowAddModal(false);
    setForm({
      category: '',
      date: new Date().toISOString().slice(0, 10),
      doctor: '',
      title: '',
      tags: [],
      tagInput: '',
      notes: '',
    });
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header & Navigation - removed as per instructions */}
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
            <button type="button" onClick={() => setShowCategoryDropdown(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
              {category} <FaChevronDown className="ml-1 text-gray-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow z-10">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-orange-50 ${cat === category ? 'bg-orange-100 text-orange-500' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Sort Dropdown */}
          <div className="relative">
            <button type="button" onClick={() => setShowSortDropdown(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
              {sort} <FaChevronDown className="ml-1 text-gray-400" />
            </button>
            {showSortDropdown && (
              <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow z-10">
                {sortOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSort(opt); setShowSortDropdown(false); }}
                    className={`block w-full text-left px-4 py-2 hover:bg-orange-50 ${opt === sort ? 'bg-orange-100 text-orange-500' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
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
              aria-label="Search records"
            />
          </div>
          {/* Add Record Button */}
          <button
            className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all"
            onClick={() => setShowAddModal(true)}
            aria-label="Add Record"
          >
            <FaPlus /> Add Record
          </button>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="add-record-title">
            {/* Fixed header and close */}
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
              <h2 id="add-record-title" className="text-2xl font-bold">Add a Record</h2>
              <button
                className="text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveRecord} className="flex flex-col gap-4 px-8 py-4 overflow-y-auto">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block font-semibold mb-1">Category<span className="text-red-500">*</span></label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  required
                  aria-required="true"
                >
                  <option value="">Select Category</option>
                  {recordCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {/* Date of Service */}
              <div>
                <label htmlFor="date" className="block font-semibold mb-1">Date of Service<span className="text-red-500">*</span></label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  required
                  aria-required="true"
                />
              </div>
              {/* Doctor/Clinic Name */}
              <div>
                <label htmlFor="doctor" className="block font-semibold mb-1">Doctor / Clinic Name</label>
                <input
                  id="doctor"
                  name="doctor"
                  type="text"
                  value={form.doctor}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  placeholder="e.g. Dr. Priya Sharma, Apollo Clinic"
                />
              </div>
              {/* Brief Title / Summary */}
              <div>
                <label htmlFor="title" className="block font-semibold mb-1">Brief Title / Summary</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  placeholder="e.g. Annual Health Check-up"
                />
              </div>
              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block font-semibold mb-1">Tags (Optional)</label>
                <input
                  id="tags"
                  name="tagInput"
                  type="text"
                  value={form.tagInput}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700"
                  placeholder="Type to add tags..."
                  autoComplete="off"
                  ref={tagInputRef}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if ((e.key === 'Enter' || e.key === ',') && form.tagInput.trim()) {
                      e.preventDefault();
                      addTag(form.tagInput.trim());
                    }
                  }}
                  aria-label="Tags"
                />
                {/* Tag suggestions */}
                {form.tagInput && filteredTagSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {filteredTagSuggestions.map(tag => (
                      <button
                        type="button"
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-orange-100"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
                {/* Tag chips */}
                {form.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.tags.map(tag => (
                      <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        {tag}
                        <button type="button" className="ml-1 text-gray-500 hover:text-red-500" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`}>×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block font-semibold mb-1">My Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700 min-h-[80px]"
                  placeholder="Add any personal notes, doctor's advice, or follow-up instructions..."
                  rows={4}
                />
              </div>
              {/* Error Message */}
              {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className={`flex-1 px-5 py-2 rounded-lg font-semibold text-white transition-all ${form.category && form.date ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={!(form.category && form.date)}
                >
                  Save Record
                </button>
                <button
                  type="button"
                  className="flex-1 px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRecords.map((rec, idx) => (
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
            <button
              type="button"
              className="mt-3 text-orange-500 font-semibold text-sm hover:underline self-end"
              onClick={() => setViewRecord(rec)}
              aria-label="View Document"
            >
              View Document
            </button>
          </div>
        ))}
      </div>
      {/* View Document Modal */}
      {viewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="view-record-title">
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
              <h2 id="view-record-title" className="text-2xl font-bold">Record Details</h2>
              <button
                className="text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setViewRecord(null)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col gap-4 px-8 py-4 overflow-y-auto">
              <div className="flex items-center gap-4 mb-2">
                <div className={`w-12 h-12 flex items-center justify-center rounded-full ${viewRecord.color}`}>{viewRecord.icon}</div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{viewRecord.title}</div>
                  <div className="text-gray-500 text-sm">{viewRecord.type}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div><span className="font-semibold">Date of Service:</span> {viewRecord.date}</div>
                <div><span className="font-semibold">{viewRecord.type === 'Vaccination' ? 'Clinic' : 'Doctor/Clinic'}:</span> {viewRecord.doctor || <span className="text-gray-400">—</span>}</div>
                <div><span className="font-semibold">Tags:</span> {viewRecord.tags.length > 0 ? viewRecord.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium ml-1">{tag}</span>) : <span className="text-gray-400 ml-1">—</span>}</div>
                <div><span className="font-semibold">Notes:</span> {viewRecord.notes ? <span className="ml-1">{viewRecord.notes}</span> : <span className="text-gray-400 ml-1">—</span>}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthVault; 