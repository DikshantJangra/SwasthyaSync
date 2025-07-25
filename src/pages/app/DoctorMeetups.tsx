import { FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';

const initialMeetups = [
  { doctor: 'Dr. Meera Kapoor', date: '2024-07-22', type: 'Upcoming', notes: '' },
  { doctor: 'Dr. Rahul Singh', date: '2024-07-15', type: 'Past', notes: '' },
  { doctor: 'Dr. Anjali Sharma', date: '2024-07-02', type: 'Past', notes: '' },
];

const DoctorMeetups = () => {
  const [meetups, setMeetups] = useState(initialMeetups);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetails, setShowDetails] = useState<null | typeof meetups[0]>(null);
  const [form, setForm] = useState({ doctor: '', date: '', type: 'Upcoming', notes: '' });
  const [formError, setFormError] = useState('');

  // Split meetups by type and date
  const today = new Date().toISOString().slice(0, 10);
  const upcomingMeetups = meetups.filter(m => m.type === 'Upcoming' && m.date >= today);
  const pastMeetups = meetups.filter(m => m.type === 'Past' || m.date < today);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFormError('');
  };
  const handleAddMeetup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.doctor || !form.date) {
      setFormError('Please fill all required fields.');
      return;
    }
    // Determine type based on date if not set
    let type = form.type;
    if (form.date < today) type = 'Past';
    else type = 'Upcoming';
    setMeetups(prev => [
      { doctor: form.doctor, date: form.date, type, notes: form.notes },
      ...prev,
    ]);
    setShowAddModal(false);
    setForm({ doctor: '', date: '', type: 'Upcoming', notes: '' });
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Creative Add Meetup */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-black">Plan or Log a Doctor Meetup</h1>
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
          onClick={() => setShowAddModal(true)}
        >
          + Add Meetup
        </button>
      </div>

      {/* Upcoming Meetups */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Meetups</h2>
        {upcomingMeetups.length === 0 ? (
          <div className="text-gray-400 italic">No upcoming meetups.</div>
        ) : (
          <div className="divide-y divide-gray-200 bg-white rounded-xl shadow">
            {upcomingMeetups.map((meetup, idx) => (
              <div key={idx} className="flex items-center px-4 py-3">
                <span className="font-semibold text-base text-gray-900">{meetup.doctor}</span>
                <span className="ml-auto text-gray-500 text-sm">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <button
                  className="ml-6 text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
                  onClick={() => setShowDetails(meetup)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Meetups */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Meetups</h2>
        {pastMeetups.length === 0 ? (
          <div className="text-gray-400 italic">No past meetups.</div>
        ) : (
          <div className="divide-y divide-gray-200 bg-white rounded-xl shadow">
            {pastMeetups.map((meetup, idx) => (
              <div key={idx} className="flex items-center px-4 py-3">
                <span className="font-semibold text-base text-gray-900">{meetup.doctor}</span>
                <span className="ml-auto text-gray-500 text-sm">{new Date(meetup.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <button
                  className="ml-6 text-blue-600 text-sm font-medium hover:underline whitespace-nowrap"
                  onClick={() => setShowDetails(meetup)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meetup Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="add-meetup-title">
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
              <h2 id="add-meetup-title" className="text-2xl font-bold">Add Doctor Meetup</h2>
              <button
                className="text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setShowAddModal(false)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddMeetup} className="flex flex-col gap-4 px-8 py-4 overflow-y-auto">
              <div>
                <label htmlFor="doctor" className="block font-semibold mb-1">Doctor Name<span className="text-red-500">*</span></label>
                <input
                  id="doctor"
                  name="doctor"
                  type="text"
                  value={form.doctor}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 bg-white text-gray-700"
                  required
                  aria-required="true"
                  placeholder="e.g. Dr. Priya Sharma"
                />
              </div>
              <div>
                <label htmlFor="date" className="block font-semibold mb-1">Date<span className="text-red-500">*</span></label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 bg-white text-gray-700"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="notes" className="block font-semibold mb-1">Notes (Optional)</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-200 bg-white text-gray-700 min-h-[60px]"
                  placeholder="Add any notes, follow-up, or context..."
                  rows={3}
                />
              </div>
              {formError && <div className="text-red-500 text-sm font-medium mt-1">{formError}</div>}
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className={`flex-1 px-5 py-2 rounded-lg font-semibold text-white transition-all ${form.doctor && form.date ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                  disabled={!(form.doctor && form.date)}
                >
                  Save Meetup
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

      {/* View Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col" role="dialog" aria-modal="true" aria-labelledby="view-meetup-title">
            <div className="sticky top-0 z-10 bg-white rounded-t-2xl flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100">
              <h2 id="view-meetup-title" className="text-2xl font-bold">Meetup Details</h2>
              <button
                className="text-2xl text-gray-400 hover:text-gray-700"
                onClick={() => setShowDetails(null)}
                aria-label="Close"
                type="button"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col gap-4 px-8 py-4 overflow-y-auto">
              <div className="font-bold text-lg text-gray-900">{showDetails.doctor}</div>
              <div><span className="font-semibold">Date:</span> {new Date(showDetails.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
              <div><span className="font-semibold">Type:</span> {showDetails.type}</div>
              <div><span className="font-semibold">Notes:</span> {showDetails.notes ? <span className="ml-1">{showDetails.notes}</span> : <span className="text-gray-400 ml-1">—</span>}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorMeetups; 