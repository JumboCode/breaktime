import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "../utils/general";
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

const isBookingPast = (timestamp, startTime) => {
    if (!timestamp || !startTime) return false;
    const [year, month, day] = timestamp.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes) < new Date();
};

const getTimeUntil = (timestamp, startTime) => {
    if (!timestamp || !startTime) return '';
    const [year, month, day] = timestamp.split('-').map(Number);
    const [hours, minutes] = startTime.split(':').map(Number);
    const serviceDateTime = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    const diffMs = serviceDateTime - now;

    if (diffMs <= 0) return 'Completed';

    const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const serviceMidnight = new Date(year, month - 1, day);
    const diffDays = Math.round((serviceMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) return `Starts in ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours === 0 ? 'Now' : `Starts in ${diffHours} hr${diffHours === 1 ? '' : 's'}`;
};

const NextBookings = ({ onOpenAppointments, onOpenBooking }) => {
    const [bookings, setBookings] = useState([]);
    const { user, isLoaded } = useUser();

    useEffect(() => {
        if (!isLoaded || !user) return;
        apiCall('/booking/userbookinghistory', 'POST', { userID: user.username }, null)
            .then(data => setBookings(data.bookings ?? []))
            .catch(() => {});
    }, [isLoaded, user]);

    const upcomingBookings = bookings.filter(b =>
        b.status === 'confirmed' && !isBookingPast(b.timestamp, b.duration?.startTime)
    );
    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xl text-dark-navy">Next Bookings</h3>
                <span
                    className="text-dark-navy opacity-[60%] underline text-sm cursor-pointer hover:opacity-100 transition-opacity"
                    onClick={onOpenAppointments}
                >
                    View Appointments
                </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar">
                {upcomingBookings.length === 0 ? (
                    <div className="text-center py-8 text-light-purple">
                        No upcoming bookings
                    </div>
                ) : (
                    upcomingBookings.map((booking) => {
                        const icon = getServiceIcon(booking.serviceID);
                        const label = booking.serviceID
                            ? booking.serviceID.charAt(0).toUpperCase() + booking.serviceID.slice(1) + ' Service'
                            : 'Service';
                        const timeMsg = getTimeUntil(booking.timestamp, booking.duration?.startTime);

                        return (
                            <div
                                key={booking.bookingID ?? booking._id}
                                className="bg-bright-purple rounded-2xl p-[4px]"
                            >
                                <div className="rounded-2xl p-3 flex items-center gap-3 relative h-14">
                                    <div className="w-10 h-10 bg-lime-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        {icon
                                            ? <img src={icon} alt={label} className="w-5 h-5 object-contain" />
                                            : <span className="text-dark-purple font-semibold">?</span>
                                        }
                                    </div>

                                    <div className="flex-1 text-white">
                                        <h4 className="text-md font-semibold">{label}</h4>
                                        <p className="text-sm mt-1">{timeMsg}</p>
                                    </div>

                                    <button
                                        onClick={() => onOpenBooking?.(booking)}
                                        className="px-3 py-[2px] absolute bottom-[2px] right-2 border-1 border-lime-500 text-white rounded-full text-sm cursor-pointer hover:bg-lime-500 hover:text-dark-navy transition-colors"
                                    >
                                        More
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

NextBookings.propTypes = {
    onOpenAppointments: PropTypes.func,
    onOpenBooking: PropTypes.func,
};

export default NextBookings;
