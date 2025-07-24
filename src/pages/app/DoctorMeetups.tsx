import { FaUserMd, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';

const navLinks = [
  { label: 'Dashboard', active: false },
  { label: 'Doctor Meetups', active: true },
  { label: 'Profile', active: false },
];

const upcomingMeetups = [
  {
    doctor: 'Dr. Meera Kapoor',
    date: '22 July 2024',
    link: '#',
  },
];

const pastMeetups = [
  {
    doctor: 'Dr. Rahul Singh',
    date: '15 July 2024',
    link: '#',
  },
  {
    doctor: 'Dr. Anjali Sharma',
    date: '02 July 2024',
    link: '#',
  },
];

const DoctorMeetups = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
            <span className="inline-block w-3 h-3 rounded-full bg-blue-400"></span>
          </div>
          <span className="text-gray-900 font-bold text-2xl ml-2">Swāsthya Sync</span>
        </div>
        <nav className="flex gap-2">
          {navLinks.map((nav) => (
            <button
              key={nav.label}
              className={`px-5 py-2 rounded-lg font-medium text-base transition-all ${
                nav.active
                  ? 'bg-blue-100 text-blue-500 shadow border border-blue-200'
                  : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50'
              }`}
            >
              {nav.label}
            </button>
          ))}
        </nav>
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
                <span className="ml-auto text-gray-500 text-sm">{meetup.date}</span>
                <a href={meetup.link} className="ml-6 text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">View Details</a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Meetups */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Meetups</h2>
        <div className="text-gray-500 font-semibold mb-2">July 2024</div>
        <div className="border-t border-gray-200 mb-2"></div>
        {pastMeetups.length === 0 ? (
          <div className="text-gray-400 italic">No past meetups.</div>
        ) : (
          <div className="divide-y divide-gray-200 bg-white rounded-xl shadow">
            {pastMeetups.map((meetup, idx) => (
              <div key={idx} className="flex items-center px-4 py-3">
                <span className="font-semibold text-base text-gray-900">{meetup.doctor}</span>
                <span className="ml-auto text-gray-500 text-sm">{meetup.date}</span>
                <a href={meetup.link} className="ml-6 text-blue-600 text-sm font-medium hover:underline whitespace-nowrap">View Details</a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorMeetups; 