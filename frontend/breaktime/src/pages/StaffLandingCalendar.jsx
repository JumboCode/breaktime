import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import { useState } from "react";

export default function StaffLandingCalendar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (            
        <div className="bg-indigo-purple h-screen w-screen overflow-hidden">
            <NavBar isSidebarOpen={isSidebarOpen} onToggle={setIsSidebarOpen} />
            <div className="flex p-[30px] pt-[10px] gap-[30px]">
                <div className={`${isSidebarOpen ? 'block' : 'hidden'}`} >
                    <SideBar />
                </div>

                {/* Placeholder for calendar view */}
                <div className={`h-[calc(100vh-120px)] bg-white rounded-[20px] ${isSidebarOpen ? 'w-[calc(100vw-440px)]' : 'w-[calc(100vw-60px)]'}`}></div>
            </div>
        </div>
    );
}