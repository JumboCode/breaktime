import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";
import AppointmentBottomSheet from "/src/components/mobile/AppointmentBottomSheet";

const getServiceImage = (serviceName) => {
    if (!serviceName) return ShowerCarouselImage;
    const name = serviceName.toLowerCase();
    if (name.includes('shower')) return ShowerCarouselImage;
    if (name.includes('laundry')) return LaundryCarouselImage;
    return StoreCarouselImage;
};

export default function AppointmentDetailsPage({ booking, onClose }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const chevronSize = windowWidth * 0.06;
    const serviceImage = getServiceImage(booking.serviceID);

    return (
        <div className="w-screen overflow-x-hidden">
            {/* Hero image */}
            <div className="relative w-full h-[50vh]">
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
                               bg-bright-purple text-[#F0F7F2] text-[5vw] rounded-2xl hover:bg-[#943BF6]"
                >
                    <ChevronLeft strokeWidth={5} size={chevronSize} color="#F0F7F2" />
                    go back
                </button>
            </div>

            <AppointmentBottomSheet booking={booking} onClose={onClose} />
        </div>
    );
}

AppointmentDetailsPage.propTypes = {
    booking: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};
