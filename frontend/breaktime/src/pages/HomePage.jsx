import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import MainCalendar from "../components/MainCalendar";
import CalendarCorner from "../assets/maincal/CalendarCorner.svg";
import { useState } from "react";

export default function HomePage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (            
        <div className="bg-indigo-purple h-screen w-screen overflow-hidden">
            <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
            <div className="flex p-[30px] pt-[10px] gap-[30px]">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                    <SideBar />
                </div>

                <div className={`h-[calc(100vh-120px)] relative bg-cal-bg border-none rounded-[20px] font-all text-cal-font ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}>
                    <div>
                        <img src={CalendarCorner} className="absolute bottom-0 m-[-30px]"/>
                        <img src={CalendarCorner} className="absolute top-0 right-0 m-[-30px] rotate-180"/>
                    </div>

                    <div className="bg-cal-bg p-[50px] main-cal-wrapper">
                        <MainCalendar />
                    </div>
                </div>
            </div>
        </div>
    );
}