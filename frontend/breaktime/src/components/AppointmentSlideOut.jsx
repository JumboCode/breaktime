import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "motion/react";
import BookingDetailsContent from "/src/components/mobile/BookingDetailsContent";
import BookingActivityContent from "/src/components/mobile/BookingActivityContent";
import EditBookingContent from "/src/components/mobile/EditBookingContent";
import { apiCall } from "../utils/general";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";

const getServiceImage = (serviceName) => {
    if (!serviceName) return ShowerCarouselImage;
    const name = serviceName.toLowerCase();
    if (name.includes('shower')) return ShowerCarouselImage;
    if (name.includes('laundry')) return LaundryCarouselImage;
    return StoreCarouselImage;
};

const getIsActive = (booking) => {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.timestamp}T${booking.duration?.startTime}`);
    const hasPassed = bookingDateTime < now;
    return (booking.status === 'pending' || booking.status === 'confirmed') && !hasPassed;
};

export default function AppointmentSlideOut({ isOpen, onClose, booking }) {
    const [currentBooking, setCurrentBooking] = useState(booking);
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setCurrentBooking(booking);
        setActiveTab('details');
        setIsEditing(false);
    }, [booking]);

    useEffect(() => {
        if (activeTab !== 'activity' || !currentBooking?.bookingID) return;
        const poll = setInterval(async () => {
            try {
                const data = await apiCall(`/booking/getByBookingID?bookingID=${currentBooking.bookingID}`, 'GET', null, null);
                if (data.booking) setCurrentBooking(data.booking);
            } catch { /* silent */ }
        }, 10000);
        return () => clearInterval(poll);
    }, [activeTab, currentBooking?.bookingID]);

    const handleEditSuccess = async (updatedFields) => {
        try {
            const data = await apiCall(`/booking/getByBookingID?bookingID=${currentBooking.bookingID}`, 'GET', null, null);
            if (data.booking) setCurrentBooking(data.booking);
            else setCurrentBooking(prev => ({ ...prev, ...updatedFields }));
        } catch {
            setCurrentBooking(prev => ({ ...prev, ...updatedFields }));
        }
        setIsEditing(false);
    };

    if (!booking || !currentBooking) return null;

    const isActive = getIsActive(currentBooking);
    const serviceImage = getServiceImage(currentBooking?.serviceID);
    const serviceName = currentBooking?.serviceID
        ? currentBooking.serviceID.charAt(0).toUpperCase() + currentBooking.serviceID.slice(1)
        : 'Service';

    const activeTabStyle = "bg-[#b37ded] rounded-full font-medium text-white px-3 py-1 text-base";
    const defaultTabStyle = "rounded-full flex-1 py-1 text-base text-gray-400";

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.18)",
                            backdropFilter: "blur(4px)",
                            WebkitBackdropFilter: "blur(4px)",
                            zIndex: 40,
                        }}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: isOpen ? 0 : "100%" }}
                transition={{ type: "spring", stiffness: 280, damping: 32 }}
                style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    maxWidth: 440,
                    background: "#fff",
                    boxShadow: "-8px 0 40px rgba(0,0,0,0.10)",
                    zIndex: 50,
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Poppins', sans-serif",
                    overflowY: "auto",
                }}
            >
                {/* Hero image */}
                <div className="relative w-full h-[200px] shrink-0">
                    <img
                        src={serviceImage}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt={serviceName}
                    />
                    <div className="absolute inset-0 backdrop-blur-sm" />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:bg-white text-xl leading-none cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-5 flex flex-col gap-4">
                    {/* Service name */}
                    <p className="text-dark-navy font-semibold text-2xl">{serviceName}</p>

                    {/* User info row */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-[#B9FF00] text-dark-navy text-sm rounded-full font-medium">
                            YA USER
                        </span>
                        <span className="text-dark-navy text-sm">{currentBooking?.clientName}</span>
                        <span className="text-gray-400 text-sm">
                            #{currentBooking?.bookingID || '------'}
                        </span>
                    </div>

                    {/* Tab switcher — hidden while editing */}
                    {!isEditing && (
                        <div className="border border-gray-300 w-full rounded-full p-[3px] flex justify-center items-center gap-2">
                            <button
                                className={defaultTabStyle + (activeTab === 'activity' ? ' ' + activeTabStyle : '')}
                                onClick={() => setActiveTab('activity')}
                            >
                                Activity
                            </button>
                            <button
                                className={defaultTabStyle + (activeTab === 'details' ? ' ' + activeTabStyle : '')}
                                onClick={() => setActiveTab('details')}
                            >
                                Details
                            </button>
                        </div>
                    )}

                    {/* Content area */}
                    <div>
                        {isEditing ? (
                            <EditBookingContent
                                booking={currentBooking}
                                onCancel={() => setIsEditing(false)}
                                onSuccess={handleEditSuccess}
                                forceDesktop
                            />
                        ) : activeTab === 'details' ? (
                            <BookingDetailsContent
                                booking={currentBooking}
                                isActive={isActive}
                                onEdit={() => setIsEditing(true)}
                                onCancel={onClose}
                                forceDesktop
                            />
                        ) : (
                            <BookingActivityContent booking={currentBooking} forceDesktop />
                        )}
                    </div>

                    <p className="text-center text-gray-400 text-xs tracking-widest mt-4 pb-4">
                        ENJOY YOUR SERVICE
                    </p>
                </div>
            </motion.aside>
        </>
    );
}

AppointmentSlideOut.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    booking: PropTypes.object,
};
