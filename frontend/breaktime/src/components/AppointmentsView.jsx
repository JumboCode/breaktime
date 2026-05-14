import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "../utils/general";
import AppointmentSlideOut from "./AppointmentSlideOut";
import ShowerIcon from '/src/assets/popup-icons/ShowerGreen.png';
import LaundryIcon from '/src/assets/popup-icons/LaundryGreen.png';
import MarketIcon from '/src/assets/popup-icons/MarketGreen.png';

const getServiceIcon = (serviceName) => {
    if (!serviceName) return null;
    const name = serviceName.toLowerCase();
    if (name.includes('shower')) return ShowerIcon;
    if (name.includes('laundry')) return LaundryIcon;
    if (name.includes('store') || name.includes('market')) return MarketIcon;
    return null;
};

const getTimeUntil = (service_date, start_time) => {
    const [year, month, day] = service_date.split('-').map(Number);
    const [hours, minutes] = start_time.split(':').map(Number);
    const serviceDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    const diffMs = serviceDateTime - now;

    if (diffMs <= 0) {
        const date = new Date(year, month - 1, day);
        return `Completed on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const serviceMidnight = new Date(year, month - 1, day);
    const diffDays = Math.round((serviceMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) return `${diffDays} day${diffDays === 1 ? '' : 's'} away`;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours === 0 ? 'Now' : `${diffHours} hr${diffHours === 1 ? '' : 's'} away`;
};

const isBookingPast = (service_date, start_time) => {
    const [year, month, day] = service_date.split('-').map(Number);
    const [hours, minutes] = start_time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes) < new Date();
};

const formatDateTime = (timestamp, startTime) => {
    if (!timestamp || !startTime) return '';
    const [year, month, day] = timestamp.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    const date = new Date(year, month - 1, day, hours, minutes);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};


function ServiceIcon({ serviceName, past }) {
    const icon = getServiceIcon(serviceName);
    return (
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${past ? 'bg-light-purple-subtle' : 'bg-bright-purple'}`}>
            {icon ? (
                <img src={icon} alt={serviceName} className={`w-5 h-5 object-contain ${past ? 'opacity-60' : ''}`} />
            ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )}
        </div>
    );
}

ServiceIcon.propTypes = {
    serviceName: PropTypes.string,
    past: PropTypes.bool,
};

function AppointmentItem({ booking, onClick }) {
    const past = isBookingPast(booking.timestamp, booking.duration?.startTime) || booking.status === 'canceled';
    const timeUntil = getTimeUntil(booking.timestamp, booking.duration?.startTime);
    const subtitle = formatDateTime(booking.timestamp, booking.duration?.startTime);
    const canceled = booking.status === 'canceled';

    return (
        <div
            onClick={onClick}
            className="flex items-start gap-4 px-8 py-4 mx-8 my-4 shadow-sm shadow-light-purple rounded-2xl cursor-pointer transition-colors hover:bg-staff-main-comp-hover"
        >
            <div className="mt-1 shrink-0">
                <ServiceIcon serviceName={booking.serviceID} past={past} />
            </div>

            <div className="flex-1 min-w-0">
                <span className={`${past ? 'font-normal' : 'font-bold'} text-dark-navy text-base`}>
                    {booking.serviceID
                        ? booking.serviceID.charAt(0).toUpperCase() + booking.serviceID.slice(1) + ' Service'
                        : 'Service'}
                </span>
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            </div>

            <div className="flex flex-col items-end shrink-0 gap-2">
                <span className="text-sm text-gray-400 whitespace-nowrap">{timeUntil}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    canceled
                        ? 'bg-gray-100 text-gray-500'
                        : past
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-lime-500/20 text-lime-700'
                }`}>
                    {canceled ? 'Canceled' : past ? 'Past' : 'Active'}
                </span>
            </div>
        </div>
    );
}

AppointmentItem.propTypes = {
    booking: PropTypes.shape({
        serviceID: PropTypes.string,
        timestamp: PropTypes.string,
        status: PropTypes.string,
        duration: PropTypes.shape({ startTime: PropTypes.string }),
    }).isRequired,
    onClick: PropTypes.func.isRequired,
};

AppointmentsView.propTypes = {
    pendingBookingID: PropTypes.string,
    onClearPending: PropTypes.func,
};

export default function AppointmentsView({ pendingBookingID = null, onClearPending }) {
    const [activeTab, setActiveTab] = useState('all');
    const [bookings, setBookings] = useState([]);
    const [slideOutBooking, setSlideOutBooking] = useState(null);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        apiCall('/booking/userbookinghistory', 'POST', { userID: user.username }, null)
            .then(data => setBookings(data.bookings ?? []))
            .catch(() => {});
    }, [isLoaded, user]);

    useEffect(() => {
        if (!pendingBookingID) return;
        apiCall(`/booking/getByBookingID?bookingID=${pendingBookingID}`, 'GET', null, null)
            .then(data => setSlideOutBooking(data.booking))
            .catch(() => setSlideOutBooking({ activity: [] }))
            .finally(() => onClearPending?.());
    }, [pendingBookingID, onClearPending]);

    const handleBookingClick = (booking) => {
        apiCall(`/booking/getByBookingID?bookingID=${booking.bookingID}`, 'GET', null, null)
            .then(data => setSlideOutBooking(data.booking))
            .catch(() => setSlideOutBooking({ activity: [] }));
    };

    const classify = (booking) => {
        const past = isBookingPast(booking.timestamp, booking.duration?.startTime);
        const isActive = booking.status === 'confirmed' && !past;
        const isPast = booking.status === 'canceled' || past;
        return { isActive, isPast };
    };

    const filteredBookings = bookings.filter(b => {
        const { isActive, isPast } = classify(b);
        if (activeTab === 'active') return isActive;
        if (activeTab === 'past') return isPast;
        return true;
    });

    const activeCount = bookings.filter(b => classify(b).isActive).length;
    const pastCount = bookings.filter(b => classify(b).isPast).length;

    const TabBtn = ({ tabKey, label, count }) => (
        <button
            onClick={() => setActiveTab(tabKey)}
            className={`text-sm font-medium px-4 py-1 rounded-full transition-colors cursor-pointer
                ${activeTab === tabKey
                    ? 'bg-dark-purple text-white'
                    : 'text-gray-600 hover:text-dark-navy'}`}
        >
            {label}{count !== undefined ? <span className="ml-2 bg-white text-dark-purple rounded-full px-1">{count}</span> : ''}
        </button>
    );

    TabBtn.propTypes = {
        tabKey: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        count: PropTypes.number,
    };

    return (
        <div className="bg-staff-main-comp-bg rounded-[20px] h-full flex flex-col font-all overflow-hidden">
            <div className="flex items-center gap-4 px-8 pt-8 pb-3">
                <h1 className="text-3xl font-bold text-dark-navy">Your Bookings</h1>
            </div>

            <div className="flex items-center mx-7 my-2 px-2 py-1 gap-2 border border-gray-300 rounded-full">
                <TabBtn tabKey="all" label="ALL" count={bookings.length || undefined} />
                <TabBtn tabKey="active" label="Active" count={activeCount || undefined} />
                <TabBtn tabKey="past" label="Past" count={pastCount || undefined} />
            </div>

            <p className="px-8 pb-1 text-xs text-gray-600">click to see details</p>

            <div className="flex flex-1 overflow-hidden border-t border-gray-100">
                <div className="flex-1 overflow-y-auto scrollbar-purple">
                    {filteredBookings.length === 0 ? (
                        <p className="text-center text-gray-400 mt-12 text-sm">No bookings found</p>
                    ) : (
                        filteredBookings.map((booking, i) => (
                            <AppointmentItem
                                key={booking.bookingID ?? i}
                                booking={booking}
                                onClick={() => handleBookingClick(booking)}
                            />
                        ))
                    )}
                </div>
            </div>

            <AppointmentSlideOut
                isOpen={!!slideOutBooking}
                onClose={() => setSlideOutBooking(null)}
                booking={slideOutBooking}
            />
        </div>
    );
}
