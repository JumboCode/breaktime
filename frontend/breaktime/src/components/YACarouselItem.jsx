import { useState } from "react";
import LandingPagePopup from "/src/components/popups/ya_booking/LandingPagePopup";
import { createPortal } from "react-dom";

const CarouselItem = ({ service }) => {
    const [isHovering, setIsHovering] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
        <div 
            className={`${isHovering ? 'border-4' : 'border-2'} rounded-xl border-bright-purple w-80 h-fit p-2 justify-items-center cursor-pointer`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="relative w-76 h-76">
                <img className={`${isHovering ? 'blur-[2px]' : ''} rounded-xl shadow-md object-cover`} src={service.imageImport} alt={service.name} />
                <div
                    className={`absolute inset-0 flex items-center justify-center rounded-xl transition-opacity duration-200 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundColor: 'rgb(38, 36, 69, 0.4)' }}
                >
                    <button 
                        className="text-lime-500 border-2 rounded-xl pt-2 pb-2 pr-3 pl-3 text-3xl lowercase"
                        onClick={() => setShowPopup(true)} 
                    >book this service
                    </button>
                </div>
            </div>
            
            <p className={`${isHovering ? 'underline' : ''} font-bold text-lg`}>
                { isHovering ? "Details & Guidelines" : service.name } 
            </p>
        </div>
        {/* Portal renders the popup at document.body level, outside the carousel */}
        {showPopup && createPortal(
            <LandingPagePopup onClose={() => setShowPopup(false)} 
            service={ service }/>,
            document.body
        )}
        </>
    );
};

export default CarouselItem;