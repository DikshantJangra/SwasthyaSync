'use client';

import { useState, useEffect } from 'react';

interface MeetupType {
    doctor: string;
    date: string;
    type: string;
    notes: string;
}

export default function DoctorMeetups() {
    const [meetups, setMeetups] = useState<MeetupType[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDetails, setShowDetails] = useState<MeetupType | null>(null);
    const [form, setForm] = useState({ doctor: '', date: '', type: 'Upcoming', notes: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        // Mock meetups instead of Supabase
        const mockMeetups: MeetupType[] = [
            { doctor: 'Dr. Sharma', date: '2023-12-01', type: 'Upcoming', notes: 'General checkup' },
            { doctor: 'Dr. Gupta', date: '2023-10-15', type: 'Past', notes: 'Follow up' }
        ];
        setMeetups(mockMeetups);
    }, []);

    const today = new Date().toISOString().slice(0, 10);
    const upcomingMeetups = meetups.filter(m => m.type === 'Upcoming' && m.date >= today);
    const pastMeetups = meetups.filter(m => m.type === 'Past' || m.date < today);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setFormError('');
    };

    const handleAddMeetup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.doctor || !form.date) {
            setFormError('Please fill all required fields.');
            return;
        }
        const type = form.date < today ? 'Past' : 'Upcoming';
        const newMeetup: MeetupType = { ...form, type };
        setMeetups([newMeetup, ...meetups]);
        setShowAddModal(false);
        setForm({ doctor: '', date: '', type: 'Upcoming', notes: '' });
    };

    return (
        <div className="min-h-screen px-4 py-6 font-poppins">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-black">Plan or Log a Doctor Meetup</h1>
                <button
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-all"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Meetup
                </button>
            </div>

            <div className="mb-10">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meetups</h2>
                {upcomingMeetups.length === 0 ? (
                    <div className="text-gray-400 italic">No upcoming meetups.</div>
                ) : (
                    <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
                        {upcomingMeetups.map((meetup, idx) => (
                            <div key={idx} className="flex items-center px-6 py-4 hover:bg-orange-50 transition-colors">
                                <span className="font-semibold text-lg text-gray-900">{meetup.doctor}</span>
                                <span className="ml-auto text-gray-500 font-medium">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                <button
                                    className="ml-6 text-blue-600 font-semibold hover:underline"
                                    onClick={() => setShowDetails(meetup)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Meetups</h2>
                {pastMeetups.length === 0 ? (
                    <div className="text-gray-400 italic">No past meetups.</div>
                ) : (
                    <div className="divide-y divide-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
                        {pastMeetups.map((meetup, idx) => (
                            <div key={idx} className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors">
                                <span className="font-semibold text-lg text-gray-900">{meetup.doctor}</span>
                                <span className="ml-auto text-gray-500 font-medium">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                                <button
                                    className="ml-6 text-blue-600 font-semibold hover:underline"
                                    onClick={() => setShowDetails(meetup)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Add Doctor Meetup</h2>
                            <button className="text-3xl text-gray-400 hover:text-gray-700" onClick={() => setShowAddModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddMeetup} className="p-8 space-y-4">
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Doctor Name<span className="text-red-500">*</span></label>
                                <input name="doctor" type="text" value={form.doctor} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 text-gray-700" required placeholder="e.g. Dr. Priya Sharma" />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Date<span className="text-red-500">*</span></label>
                                <input name="date" type="date" value={form.date} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 text-gray-700" required />
                            </div>
                            <div>
                                <label className="block font-semibold mb-1 text-gray-800">Notes (Optional)</label>
                                <textarea name="notes" value={form.notes} onChange={handleFormChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-200 text-gray-700 min-h-[60px]" placeholder="Add any notes..." rows={3} />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className={`flex-1 px-5 py-2 rounded-lg font-semibold text-white transition-all ${form.doctor && form.date ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`} disabled={!(form.doctor && form.date)}>Save Meetup</button>
                                <button type="button" className="flex-1 px-5 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetails && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Meetup Details</h2>
                            <button className="text-3xl text-gray-400 hover:text-gray-700" onClick={() => setShowDetails(null)}>&times;</button>
                        </div>
                        <div className="space-y-4">
                            <div className="font-bold text-xl text-orange-600">{showDetails.doctor}</div>
                            <div className="text-gray-800">
                                <p><span className="font-semibold">Date:</span> {new Date(showDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                <p><span className="font-semibold">Type:</span> {showDetails.type}</p>
                                <p><span className="font-semibold">Notes:</span> {showDetails.notes || 'No notes'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
