'use client';

import { useState, useEffect, useRef } from 'react';
import { FaFlask, FaFilePrescription, FaUserMd, FaSyringe, FaSearch, FaPlus, FaChevronDown, FaHospital, FaTooth, FaEye, FaFileMedical, FaFileInvoiceDollar, FaFileAlt, FaXRay } from 'react-icons/fa';
import type { ChangeEvent, KeyboardEvent, FormEvent } from 'react';

const categories = ['All Categories', 'Lab Report', 'Prescription', 'Consultation', 'Vaccination'];
const sortOptions = ['Date (Newest)', 'Date (Oldest)', 'A-Z', 'Z-A'];

const recordCategories = [
    'Lab Report', 'Prescription', 'Doctor Consultation', 'Hospitalization', 'Vaccination',
    'Imaging Scan (X-ray, MRI, CT)', 'Dental Record', 'Eye Check-up', 'Discharge Summary',
    'Medical Bill', 'Insurance Document', 'Other',
];

const tagSuggestions = ['Allergy', 'Blood Test', 'Cardiology', 'Dermatology', 'ENT', 'Diabetes', 'Fever', 'Wellness', 'Cold'];

interface RecordType {
    icon: React.ReactElement;
    color: string;
    title: string;
    type: string;
    date: string;
    doctor: string;
    tags: string[];
    link: string;
    notes: string;
}

export default function HealthVault() {
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
    const tagInputRef = useRef<HTMLInputElement>(null);
    const [records, setRecords] = useState<RecordType[]>([]);
    const [viewRecord, setViewRecord] = useState<RecordType | null>(null);

    useEffect(() => {
        // Mock records instead of Supabase
        const mockData = [
            { category: 'Lab Report', title: 'Blood Test', doctor: 'City Lab', date: '2023-10-15', tags: ['#BloodTest'], notes: 'Normal results' },
            { category: 'Prescription', title: 'Fever Medicine', doctor: 'Dr. Sharma', date: '2023-11-20', tags: ['#Fever'], notes: 'Take twice a day' }
        ];

        const mapped = mockData.map((rec: any) => {
            let icon: React.ReactElement = <FaFilePrescription className="text-gray-500 text-2xl" />;
            let color = 'bg-gray-100';
            switch (rec.category) {
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
            }
            const dateObj = new Date(rec.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            return {
                icon,
                color,
                title: rec.title || rec.category,
                type: rec.category,
                date: formattedDate,
                doctor: rec.doctor,
                tags: rec.tags,
                link: '#',
                notes: rec.notes,
            };
        });
        setRecords(mapped);
    }, []);

    let filteredRecords = records.filter(rec =>
        category === 'All Categories' || rec.type === category
    );

    if (search.trim()) {
        const s = search.trim().toLowerCase();
        filteredRecords = filteredRecords.filter(rec =>
            rec.title.toLowerCase().includes(s) ||
            rec.doctor.toLowerCase().includes(s) ||
            rec.tags.some(tag => tag.toLowerCase().includes(s))
        );
    }

    const addTag = (tag: string) => {
        setForm(f => ({ ...f, tags: [...f.tags, tag], tagInput: '' }));
    };
    const removeTag = (tag: string) => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));

    const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setFormError('');
    };

    const handleSaveRecord = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.category || !form.date) return;

        // Mock save
        const newRec: RecordType = {
            icon: <FaFilePrescription className="text-gray-500 text-2xl" />,
            color: 'bg-gray-100',
            title: form.title || form.category,
            type: form.category,
            date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            doctor: form.doctor,
            tags: form.tags,
            link: '#',
            notes: form.notes,
        };
        setRecords([newRec, ...records]);
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
        <div className="min-h-screen bg-gray-50 px-4 py-6 font-poppins">
            <div className="mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Health Vault</h1>
                <p className="text-gray-500 text-lg mt-1">Your secure & organized medical history.</p>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-orange-200 rounded-full mb-6"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div className="flex gap-3 items-center">
                    <div className="relative">
                        <button type="button" onClick={() => setShowCategoryDropdown(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 font-medium">
                            {category} <FaChevronDown className="ml-1 text-gray-400" />
                        </button>
                        {showCategoryDropdown && (
                            <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-xl z-20">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => { setCategory(cat); setShowCategoryDropdown(false); }}
                                        className={`block w-full text-left px-4 py-2 hover:bg-orange-50 ${cat === category ? 'bg-orange-100 text-orange-500' : 'text-gray-700'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3 items-center w-full md:w-auto">
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
                    <button
                        className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow transition-all"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FaPlus /> Add Record
                    </button>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900">Add a Record</h2>
                            <button className="text-3xl text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)} type="button">&times;</button>
                        </div>
                        <form onSubmit={handleSaveRecord} className="flex flex-col gap-4 px-8 py-4 overflow-y-auto">
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Category<span className="text-red-500">*</span></label>
                                <select name="category" value={form.category} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700" required>
                                    <option value="">Select Category</option>
                                    {recordCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Date of Service<span className="text-red-500">*</span></label>
                                <input name="date" type="date" value={form.date} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700" required />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Doctor / Clinic Name</label>
                                <input name="doctor" type="text" value={form.doctor} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700" placeholder="e.g. Dr. Priya Sharma" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Brief Title / Summary</label>
                                <input name="title" type="text" value={form.title} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700" placeholder="e.g. Annual Health Check-up" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">My Notes (Optional)</label>
                                <textarea name="notes" value={form.notes} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 bg-white text-gray-700 min-h-[80px]" placeholder="Add any personal notes..." rows={4} />
                            </div>
                            <div className="flex gap-3 mt-4">
                                <button type="submit" className={`flex-1 px-5 py-2 rounded-lg font-semibold text-white transition-all ${form.category && form.date ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!(form.category && form.date)}>Save Record</button>
                                <button type="button" className="flex-1 px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecords.map((rec, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow p-5 flex flex-col gap-2 border border-gray-100 hover:shadow-xl transition-all cursor-pointer" onClick={() => setViewRecord(rec)}>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-12 h-12 flex items-center justify-center rounded-full ${rec.color}`}>{rec.icon}</div>
                            <div className="ml-auto text-gray-400 font-medium text-sm">{rec.date}</div>
                        </div>
                        <div className="font-bold text-lg text-gray-900">{rec.title}</div>
                        <div className="text-gray-500 text-sm mb-1">{rec.type}</div>
                        <div className="text-gray-700 text-sm"><span className="font-semibold">Doctor:</span> {rec.doctor}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {rec.tags.map(tag => <span key={tag} className="bg-gray-100 text-gray-500 px-2 py-1 rounded-full text-xs font-medium">{tag}</span>)}
                        </div>
                    </div>
                ))}
            </div>

            {viewRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Record Details</h2>
                            <button className="text-3xl text-gray-400 hover:text-gray-700" onClick={() => setViewRecord(null)}>&times;</button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 flex items-center justify-center rounded-full ${viewRecord.color}`}>{viewRecord.icon}</div>
                                <div>
                                    <div className="font-bold text-xl text-gray-900">{viewRecord.title}</div>
                                    <div className="text-gray-500">{viewRecord.type}</div>
                                </div>
                            </div>
                            <div className="space-y-2 text-gray-800">
                                <p><span className="font-semibold">Date:</span> {viewRecord.date}</p>
                                <p><span className="font-semibold">Doctor:</span> {viewRecord.doctor || '—'}</p>
                                <p><span className="font-semibold">Notes:</span> {viewRecord.notes || 'No notes'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
