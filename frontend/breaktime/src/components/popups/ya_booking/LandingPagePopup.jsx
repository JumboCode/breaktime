import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import ServiceGuidelines from './ServiceGuidelines';
import BookingForm from './BookingForm';
import ServiceImage from '/src/assets/popup-icons/ServiceImage.png';

function LandingPagePopup({ onClose, service, initialIsBooking = false }) {
    const [isBooking, setIsBooking] = useState(initialIsBooking);

    return (
        <div className="fixed inset-0 z-50 bg-[#F0F7F2] font-poppins text-[#262445] overflow-auto">
            <button type="button" onClick={onClose}
                className="mb-4 mt-2 ml-2 flex gap-2 items-center justify-center w-[140px] h-[45px] bg-[#B27DED] text-[#F0F7F2] text-lg rounded-2xl hover:bg-[#943BF6]">
                <ChevronLeft strokeWidth={7} color="#F0F7F2" />
                go back
            </button>

            <div className="flex flex-row items-start gap-100 px-8">
                {/* Left column */}
                <div className="flex flex-col items-center shrink-0 w-[320px] mt-10">
                    <h2 className="text-6xl font-thin text-[#B27DED]">
                        {service?.name ?? "Service"}
                    </h2>

                    <img
                        src={service?.imageImport ?? ServiceImage}
                        alt={service?.name ?? "Service"}
                        className="w-[300px] mt-7"
                    />

                    <button type="button"
                        onClick={() => setIsBooking((p) => !p)}
                        className="mt-4 w-[160px] h-[50px] bg-[#B27DED] text-[#F0F7F2] text-lg rounded-2xl">
                        {isBooking ? 'View Guidelines' : 'Book Now'}
                    </button>
                </div>

                {/* Right column */}
                <div className="flex-1 min-w-0 mt-10 overflow-y-auto">
                    {isBooking
                        ? <BookingForm service={service} onSuccess={onClose} />
                        : <ServiceGuidelines service={service} />
                    }
                </div>
            </div>
        </div>
    );
}

export default LandingPagePopup;