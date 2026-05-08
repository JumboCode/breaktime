import { useState } from 'react';
import PropTypes from 'prop-types';
import BookingDetailsContent from '/src/components/mobile/BookingDetailsContent';
import BookingActivityContent from '/src/components/mobile/BookingActivityContent';
import EditBookingContent from '/src/components/mobile/EditBookingContent';

const defaultButtonStyle = "rounded-full flex-1 py-[5px] text-[5vw] text-gray-400 ";
const activeTabStyle = "bg-[#b37ded] rounded-full font-medium text-white px-[3px]";

const getIsActive = (booking) => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.timestamp}T${booking.duration?.startTime}`);
    const hasPassed = bookingDateTime < now;
    return (booking.status === 'pending' || booking.status === 'confirmed') && !hasPassed;
};

export default function AppointmentBottomSheet({ booking, onClose }) {
    const [currentBooking, setCurrentBooking] = useState(booking);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);

    const handleEditSuccess = (updatedFields) => {
        setCurrentBooking(prev => ({ ...prev, ...updatedFields }));
        setIsEditing(false);
    };

    const isActive = getIsActive(currentBooking);

    return (
        <div className="px-[15px] py-[20px] rounded-t-4xl bg-white">
            {/* Service name */}
            <p className="text-dark-navy font-semibold text-[8vw]">
                {currentBooking.serviceID}
            </p>

            {/* User info row */}
            <div className="flex items-center gap-[2vw] mt-[1.5vw] flex-wrap">
                <span className="px-[2.5vw] py-[0.8vw] bg-[#B9FF00] text-dark-navy text-[3.5vw] rounded-full font-medium">
                    YA USER
                </span>
                <span className="text-dark-navy text-[3.5vw]">
                    {currentBooking.clientName}
                </span>
                <span className="text-gray-400 text-[3.5vw]">
                    #{currentBooking.bookingID || currentBooking.id || '------'}
                </span>
            </div>

            {/* Tab switcher — hidden while editing */}
            {!isEditing && (
                <div className="border border-gray-300 w-full rounded-full p-[3px] mt-[16px] flex justify-center items-center gap-2">
                    <button
                        className={defaultButtonStyle + (activeTab === 'activity' ? activeTabStyle : '')}
                        onClick={() => setActiveTab('activity')}
                    >
                        Booking Activity
                    </button>
                    <button
                        className={defaultButtonStyle + (activeTab === 'details' ? activeTabStyle : '')}
                        onClick={() => setActiveTab('details')}
                    >
                        Booking Details
                    </button>
                </div>
            )}

            {/* Content area */}
            <div className="mt-4 overflow-y-auto">
                {isEditing ? (
                    <EditBookingContent
                        booking={currentBooking}
                        onCancel={() => setIsEditing(false)}
                        onSuccess={handleEditSuccess}
                    />
                ) : activeTab === 'details' ? (
                    <BookingDetailsContent
                        booking={currentBooking}
                        isActive={isActive}
                        onEdit={() => setIsEditing(true)}
                        onCancel={onClose}
                    />
                ) : (
                    <BookingActivityContent booking={currentBooking} />
                )}
            </div>

            {/* Footer */}
            <p className="text-center text-gray-400 text-[3vw] tracking-widest mt-[6vw] pb-[5vw]">
                ENJOY YOUR SERVICE
            </p>
        </div>
    );
}

AppointmentBottomSheet.propTypes = {
    booking: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
