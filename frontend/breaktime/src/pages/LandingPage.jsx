import StaffSignup from "../components/StaffSignup"
import UserSignup from "../components/UserSignup"
import UserStaffToggle from "../components/UserStaffToggle"; 
import Grap_1 from "../assets/landingPage/Grap_1.png"
import { useState } from "react";

export default function LandingPage() {
    const [selectedType, setSelectedType] = useState('staff');
    return (
        <div className="flex min-h-screen bg-indigo-purple font-all flex-wrap flex-row">
            {/* LHS - HEADING TEXT */}
            <div className="text-lime-500 flex flex-col w-1/2 pr-4 pl-8">
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
            <div className="h-screen items-end flex">
                <div className="flex flex-col space-y-4 w-full lg:w-auto lg:flex-1 pt-8 px-8 lg:mr-[118px] mb-[10px] justify-end min-h-[462px]">
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
        </div>
    );
}