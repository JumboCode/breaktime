import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
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
                    <h1 className="text-[120px]">
                        Choose a Service to Get Started
                    </h1>
                </div>
            </div>
        </div>
    );
}