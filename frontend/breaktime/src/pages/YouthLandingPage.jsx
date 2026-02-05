import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import CarouselButton from "/src/assets/carousel/SearchBarButton.svg";
import CarouselItem from "../components/YACarouselItem";
import LaundryCarouselImage from "/src/assets/carousel/LaundryCarouselImage.png";
import ShowerCarouselImage from "/src/assets/carousel/ShowerCarouselImage.png";
import StoreCarouselImage from "/src/assets/carousel/StoreCarouselImage.png";

import { useState, useRef } from "react";


export default function HomePage() {
    class ResourceTile {
        constructor(name, imageImport) {
            this.name = name;
            this.imageImport = imageImport;
        }
    }
    const carouselRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userType] = useState('YA');
    const [searchQuery, setSearchQuery] = useState("");

    const resourceTileList = [
        new ResourceTile("Shower", ShowerCarouselImage),
        new ResourceTile("Laundry", LaundryCarouselImage),
        new ResourceTile("Test Store Appointment", StoreCarouselImage),
        new ResourceTile("Test1 Store Appointment", StoreCarouselImage),
        new ResourceTile("Test2 Store Appointment", StoreCarouselImage),
        new ResourceTile("Test3 Store Appointment", StoreCarouselImage),
        new ResourceTile("Test4 Store Appointment", StoreCarouselImage),
        new ResourceTile("Test5 Store Appointment", StoreCarouselImage)
    ];

    const scrollCarousel = (direction) => {
        if (carouselRef.current) {
            const scrollAmount = 400; // Adjust this value to control scroll distance
            const newScrollPosition = direction === 'left' 
                ? carouselRef.current.scrollLeft - scrollAmount
                : carouselRef.current.scrollLeft + scrollAmount;
            
            carouselRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
        }
    };

    const filteredResourceTiles = resourceTileList.filter((tile) =>
        tile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (            
        <div className="bg-light-grey h-screen w-screen overflow-hidden ya-carousel-container">
            <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType}/>
            <div className="flex p-[30px] pt-[10px] gap-[30px]">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                    <SideBar userType={userType}/>
                </div>

                <div className={`h-[calc(100vh-120px)] relative border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}>
                    <h1 className="text-[104px] leading-[104px] mb-16">
                        Choose a <span className="text-bright-purple">Service</span> to get Started
                    </h1>

                    <div>
                        <div className="inline-flex gap-2">
                            {/* search bar itself*/}
                            <input
                                className="text-dark-navy opacity-80 border-2 border-bright-purple rounded-2xl pl-5 pr-5 pt-0 pb-0 bg-none "
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="search for services..."
                            />
                            
                            {/* Left Button */}
                            <img 
                                src={`${CarouselButton}`} 
                                className="rotate-180 scale-75 hover:cursor-pointer" 
                                onClick={() => scrollCarousel('left')}
                            />
                            {/* Right Button*/}
                            <img 
                                src={`${CarouselButton}`} 
                                className="scale-75 hover:cursor-pointer" 
                                onClick={() => scrollCarousel('right')}
                            />
                        </div>
                        <div className="mb-4 mt-2">
                            <span className="text-dark-navy opacity-60">Hover to see details, then book</span>
                        </div>
                    </div>

                    {/* Infinite image carousel (dynamic) */}
                    <div ref={carouselRef} className="flex gap-10 overflow-x-auto scroll-smooth scrollbar-hide">
                        {/* <CarouselItem serviceName="Shower"/> */}
                        { resourceTileList.length == 0 ? (
                            <div>
                                No services available!
                            </div>
                        ) : (
                            filteredResourceTiles.length == 0 ? (
                                <div>
                                    No services match this search!
                                </div>
                            ) : (
                                    filteredResourceTiles.map((resource) => (
                                    <div key={resource.name}>
                                        <CarouselItem name={resource.name} image={resource.imageImport} />
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}