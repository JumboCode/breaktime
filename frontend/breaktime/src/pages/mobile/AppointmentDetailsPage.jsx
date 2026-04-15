import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";
import BookingActivityContent from "/src/components/mobile/BookingActivityContent";
import BookingDetailsContent from "/src/components/mobile/BookingDetailsContent";
import EditBookingContent from "/src/components/mobile/EditBookingContent";

const getServiceImage = (serviceName) => {
    if (!serviceName) return ShowerCarouselImage;
    const name = serviceName.toLowerCase();
    if (name.includes('shower')) return ShowerCarouselImage;
    if (name.includes('laundry')) return LaundryCarouselImage;
    return StoreCarouselImage;
};

export default function AppointmentDetailsPage({ booking, onClose }) {
    const [activeTab, setActiveTab] = useState('details');
    const [isEditing, setIsEditing] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chevronSize = windowWidth * 0.06;
    const serviceImage = getServiceImage(booking.serviceID);

    const tabButtonStyle = "flex-1 py-[5px] text-[4vw] text-gray-400 rounded-full transition-all duration-200";
    const activeTabStyle = " bg-[#b37ded] font-medium text-white";

    return (
        <div className="bg-light-grey min-h-screen w-screen overflow-x-hidden">
            {/* Header image */}
            <div className="relative w-full h-[35vh]">
                <img
                    src={serviceImage}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={booking.serviceID}
                />
                <div className="absolute inset-0 backdrop-blur-xs" />
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 left-4 flex gap-2 items-center pl-2 pr-4 py-1
                               bg-[#B27DED] text-[#F0F7F2] text-[5vw] rounded-2xl hover:bg-[#943BF6]"
                >
                    <ChevronLeft strokeWidth={5} size={chevronSize} color="#F0F7F2" />
                    go back
                </button>
            </div>

            {/* Content card */}
            <div className="px-[20px] pt-[20px] pb-[10vw] rounded-t-4xl bg-[#ebebeb] -mt-4 relative">
                {/* Service name */}
                <p className="text-dark-navy font-semibold text-[8vw]">{booking.serviceID}</p>

                {/* User info */}
                <div className="flex items-center gap-[2vw] mt-[1.5vw] flex-wrap">
                    <span className="px-[2.5vw] py-[0.8vw] bg-[#B9FF00] text-dark-navy text-[3.5vw] rounded-full font-medium">
                        YA USER
                    </span>
                    <span className="text-dark-navy text-[3.5vw]">
                        {booking.clientName}
                    </span>
                    <span className="text-gray-400 text-[3.5vw]">
                        Booking Number #{booking.id || booking._id || '------'}
                    </span>
                </div>

                {/* Tab switcher — hidden while editing */}
                {!isEditing && (
                    <div className="border border-gray-300 w-full rounded-full p-[3px] mt-[4vw] flex gap-1">
                        <button
                            className={tabButtonStyle + (activeTab === 'activity' ? activeTabStyle : "")}
                            onClick={() => setActiveTab('activity')}
                        >
                            Booking Activity
                        </button>
                        <button
                            className={tabButtonStyle + (activeTab === 'details' ? activeTabStyle : "")}
                            onClick={() => setActiveTab('details')}
                        >
                            Booking Details
                        </button>
                    </div>
                )}

                {/* Tab content */}
                <div className="mt-[4vw]">
                    {isEditing ? (
                        <EditBookingContent
                            booking={booking}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : activeTab === 'details' ? (
                        <BookingDetailsContent
                            booking={booking}
                            onEdit={() => setIsEditing(true)}
                        />
                    ) : (
                        <BookingActivityContent booking={booking} />
                    )}
                </div>
            </div>
        </div>
    );
}

AppointmentDetailsPage.propTypes = {
    booking: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
