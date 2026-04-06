import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import PropTypes from "prop-types";

const MobileCarouselItem = ({ service, onBook }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const iconSize = windowWidth * 0.07;

    return (
        <div className="rounded-2xl bg-[#ebebec] shadow-lg relative w-full h-fit">
            <img 
                className="w-full object-cover rounded-4xl p-[13px]"
                src={service.imageImport} 
                alt={service.name} 
            />
            <div className="flex justify-between items-center px-4 py-4 rounded-b-2xl">
                <button 
                    className="text-[5vw] font-light text-dark-navy flex items-center gap-1"
                    onClick={() => onBook('guidelines')}
                >
                    <Info size={iconSize} strokeWidth={2} color="#262445"/>
                    Guidelines
                </button>
                <button 
                    className="bg-bright-purple text-white text-[5vw] px-8 py-2 rounded-full font-semibold"
                    onClick={() => onBook('book')}
                >
                    Book
                </button>
            </div>
        </div>
    );
};

MobileCarouselItem.propTypes = {
    service: PropTypes.shape({
        name: PropTypes.string.isRequired,
        imageImport: PropTypes.string.isRequired,
    }).isRequired,
    onBook: PropTypes.func.isRequired,
};

export default MobileCarouselItem;