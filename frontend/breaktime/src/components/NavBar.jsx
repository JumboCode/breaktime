import Breaktime_Secondary_Logo from "../assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import HamburgerMenu from "../assets/navigation/HamburgerMenu.png";
import { useState } from "react";
import SideBar from "./SideBar";


function NavBar() {
    const [selected, setSelected] = useState('staffPortal');
    
    const handleChange = (value) => {
        setSelected(value);
    };

    return (
        <div className="flex h-[80px] bg-indigo-purple font-all gap-[20px] pt-[22px] pr-[40px] pl-[40px] pb-[16px]">
            <div className="flex items-end">
                <img src={HamburgerMenu} className="h-[24px]"/>
            </div>

            <div className="h-full">
                <img src={Breaktime_Secondary_Logo} className="h-full object-contain"/>
            </div>

            <div className="bg-lime-500 text-indigo-purple font-semibold text-xl rounded-[24px] p-[20px] mt-[9px] flex items-center justify-center">
                Staff Portal
            </div>

            <div className="flex items-end text-light-purple text-xl gap-[20px]">
                <div className="font-semibold">View bookings:</div>
                <div className="gap-[20px]">
                    <a>Calendar</a>
                    <a>List</a>
                </div>
            </div>
            <div className="fixed left-0 top-[80px] w-50%">
                <SideBar/>

            </div>
        </div>
    );
}

export default NavBar;