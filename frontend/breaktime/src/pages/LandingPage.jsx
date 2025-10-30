import StaffSignup from "../components/StaffSignup";
import UserSignup from "../components/UserSignup";
import UserStaffToggle from "../components/UserStaffToggle"; 
import Grap_1 from "../assets/landingPage/Grap_1.png";
import Breaktime_Secondary_Logo from "../assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import { useState } from "react";

export default function LandingPage() {
    const [selectedType, setSelectedType] = useState('staff');
    return (
        <div className="flex min-h-screen bg-indigo-purple font-all flex-wrap flex-row pl-[5vw] pt-[10vh] pr-[5vw] pb-[4vh]">
            {/* LHS - HEADING TEXT */}
            <div className="text-lime-500 flex flex-col w-1/2">
                <h1 className="text-[120px] leading-none drop-shadow-lg drop-shadow-black">
                    <div>Book</div>
                    <div>Manage</div>
                    <div className="flex">
                        C<img src={Grap_1} className="h-18 mt-7.5"/>nnect.
                    </div>
                </h1>
                <p className="text-light-purple mt-8 text-xl w-3/4">
                Create your account to connect, book services, and be part of our community
                </p>
            </div>
            
            {/* SIGNUP STYLE */}
            <div className="flex w-1/2 justify-between">
                <div className="items-end flex w-auto">
                    <div className="flex flex-col space-y-4 w-auto flex-1 pt-8 justify-end min-h-[462px]">
                        <h2 className="text-light-purple text-xl">
                            Let's get you started!
                        </h2>
                            <UserStaffToggle onToggle={setSelectedType} classname=""/>
                        
                        <div className="flex-1">
                            {selectedType === 'staff' ? <StaffSignup/> : <UserSignup/>}
                        </div>
                        
                        <a className="text-light-purple uppercase underline hover:text-lime-500" href="">
                            Already have an account? Sign In
                        </a>
                    </div>
                </div>
                <div>
                    <img src={Breaktime_Secondary_Logo} className="w-[220px]"/>
                </div>
            </div>
        </div>
    );
}