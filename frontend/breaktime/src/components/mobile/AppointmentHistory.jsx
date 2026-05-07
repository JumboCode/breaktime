import AppointmentCard from "./AppointmentCard";
import ShowerIcon from '/src/assets/popup-icons/ShowerGreen.png';
import LaundryIcon from '/src/assets/popup-icons/LaundryGreen.png';
import MarketIcon from '/src/assets/popup-icons/MarketGreen.png';
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { apiCall } from "/src/utils/general";

const getServiceIcon = (serviceName) => {
    if (!serviceName) return null;
    const name = serviceName.toLowerCase();
    if (name.includes('shower')) return ShowerIcon;
    if (name.includes('laundry')) return LaundryIcon;
    if (name.includes('store') || name.includes('market')) return MarketIcon;
    return null;
};

export default function AppointmentHistory() {
    const [filter, setFilter] = useState('all');
    const [bookings, setBookings] = useState([]);
    const { user, isLoaded } = useUser();

    const defaultButtonStyle = "text-[4vw] transition-all duration-200 ";
    const activeTabStyle = " text-black font-semibold";

    useEffect(() => {
        if (!isLoaded || !user) return;

        const fetchBookings = async () => {
            try {
                const response = await apiCall('/booking/userbookinghistory', 'POST', { userID: user.username }, null);
                if (response.bookings) {
                    setBookings(response.bookings);
                }
            } catch (err) {
                console.error('Failed to fetch bookings:', err);
            }
        };

        fetchBookings();
    }, [isLoaded, user]);

    const getFilteredBookings = () => {
        const now = new Date();

        return bookings.filter((booking) => {
            const bookingDateTime = new Date(`${booking.timestamp}T${booking.duration?.startTime}`);
            const hasPassed = bookingDateTime < now;
            const isActive = booking.status === 'confirmed' && !hasPassed;
            const isPast = booking.status === 'canceled' || hasPassed;

            if (filter === 'all') return true;
            if (filter === 'active') return isActive;
            if (filter === 'past') return isPast;
            return true;
        });
    };

    return (
        <div>
            {/* Appointment Filter */}
            <div className="flex justify-start items-center w-full gap-[6vw] mb-[3vw]">
                <button
                    className={defaultButtonStyle + (filter === 'all' ? activeTabStyle : "text-gray-400 ")}
                    onClick={() => setFilter('all')}>
                    All
                </button>
                <button
                    className={defaultButtonStyle + (filter === 'active' ? activeTabStyle : "text-gray-400 ")}
                    onClick={() => setFilter('active')}>
                    Active
                </button>
                <button
                    className={defaultButtonStyle + (filter === 'past' ? activeTabStyle : "text-gray-400 ")}
                    onClick={() => setFilter('past')}>
                    Past
                </button>
            </div>

            <div className="flex flex-col gap-[3vw] mt-[3vw]">
                {getFilteredBookings().length === 0 ? (
                    <p className="text-gray-400 text-[3.5vw] mt-[2vw]">No bookings found.</p>
                ) : (
                    getFilteredBookings().map((booking, index) => (
                        <AppointmentCard
                            key={index}
                            appointment={{
                                service_name: booking.serviceID,
                                service_icon: getServiceIcon(booking.serviceID),
                                service_date: booking.timestamp,
                                start_time: booking.duration?.startTime,
                                status: booking.status,
                            }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}