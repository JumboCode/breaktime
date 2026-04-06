import BottomSheet from "/src/components/mobile/BookingCreationBottomSheet";
import { ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function BookingPage({ onClose, service, defaultTab }) {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const chevronSize = windowWidth * 0.06;
    
    useEffect(() => {
            const handleResize = () => setWindowWidth(window.innerWidth);
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

    return (
        <div>
            <div className="relative w-full h-[50vh]">
                <img
                    src={service.imageImport}
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt={service.name}
                />
                <div className="absolute inset-0 backdrop-blur-xs"/>

                <button type="button" onClick={onClose}
                    className="absolute top-4 left-4 flex gap-2 items-center justify-center pl-2 pr-4 py-1
                             bg-[#B27DED] text-[#F0F7F2] text-[5vw] rounded-2xl hover:bg-[#943BF6]">
                    <ChevronLeft strokeWidth={5} size={chevronSize} color="#F0F7F2" />
                    Go back
                </button>
            </div>

            <BottomSheet service={service} defaultTab={defaultTab} onSuccess={onClose}/>
        </div>
    );
}

BookingPage.propTypes = {
    onClose: PropTypes.func.isRequired,
    service: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageImport: PropTypes.string.isRequired,
    }).isRequired,
    defaultTab: PropTypes.string,
};