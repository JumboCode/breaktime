import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MobileCarouselItem from "/src/components/mobile/YACarouselItem";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";
import useEmblaCarousel from 'embla-carousel-react';
import PropTypes from "prop-types";

export default function BookingTab({ onBook }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const chevronSize = windowWidth * 0.06;

    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: 'start',
        dragFree: false,
        containScroll: false,
    });
    
    const services = [
        { name: "Shower", imageImport: ShowerCarouselImage },
        { name: "Laundry", imageImport: LaundryCarouselImage },
        { name: "Test Store Appointment", imageImport: StoreCarouselImage },
    ];
    
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);
    
    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);
    
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', () => {
            setCurrentIndex(emblaApi.selectedScrollSnap());
        });
    }, [emblaApi]);

    return (
        <div>
            <div className="w-fit h-fit ml-[33px] mt-[23px] flex flex-col text-[14vw] font-extralight">
                <span className="-my-4">Book</span>
                <span className="-my-4">Your</span>
                <span className="text-bright-purple -my-4 font-light">Services</span>
            </div>

            <div className="flex items-center justify-between mx-[33px] mt-12">
                <p className="text-dark-navy font-semibold text-[8vw]">
                    {services[currentIndex].name}
                </p>
                <div className="flex items-center gap-2 text-bright-purple">
                    <button onClick={scrollPrev}>
                        <ChevronLeft strokeWidth={5} size={chevronSize}/>
                    </button>
                    <span className="text-[4vw] text-nowrap text-gray-400">
                        {currentIndex + 1} of {services.length}
                    </span>
                    <button onClick={scrollNext}>
                        <ChevronRight strokeWidth={5} size={chevronSize}/>
                    </button>
                </div>
            </div>

            <div className="mt-3 mx-[20px]">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                        {services.map((service, index) => (
                            <div key={index} className="flex-[0_0_100%] min-w-0 px-4 pb-4">
                                <MobileCarouselItem
                                    service={service}
                                    onBook={(tab) => onBook(service, tab)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

BookingTab.propTypes = {
    onBook: PropTypes.func.isRequired,
};