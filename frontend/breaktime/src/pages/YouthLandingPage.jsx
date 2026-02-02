import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import CarouselButton from "/src/assets/maincal/BackButtonCal.svg";
import { useState } from "react";

export default function HomePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userType] = useState('YA');

    return (            
        <div className="bg-light-grey h-screen w-screen overflow-hidden">
            <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} userType={userType}/>
            <div className="flex p-[30px] pt-[10px] gap-[30px]">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                    <SideBar userType={userType}/>
                </div>

                <div className={`h-[calc(100vh-120px)] relative border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}>
                    <h1 className="text-[108px]">
                        Choose a <span className="text-bright-purple">Service</span> to get Started
                    </h1>

                    {/* Search bar */}
                    <div>
                        <div className="inline-flex gap-2">
                            {/* search bar itself*/}
                            
                            {/* Left Button */}
                            <img src={`${CarouselButton}`}/>
                            {/* Right Button*/}
                            <img src={`${CarouselButton}`} className="rotate-180"/>
                        </div>
                        <div>
                            <span className="text-dark-navy opacity-60">Hover to see details, then book</span>
                        </div>
                    </div>

                    {/* Infinite image carousel (dynamic) */}
                    <div>

                    </div>
                </div>
            </div>
        </div>
    );
}