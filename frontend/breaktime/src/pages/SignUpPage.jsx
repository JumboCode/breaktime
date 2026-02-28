import StaffSignup from "../components/StaffSignup";
import UserSignup from "../components/UserSignup";
import UserStaffToggle from "../components/UserStaffToggle"; 
import { Tagline } from "../components/Tagline";
import Breaktime_Secondary_Logo from "../assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
    const [selectedType, setSelectedType] = useState('users');
    return (
        <div className="min-h-screen bg-indigo-purple font-all flex items-center justify-center">
            <div className="flex overflow-x-hidden h-[100vh] lg:max-h-[800px] max-w-[1500px] flex-wrap flex-row pl-[5vw] pr-[5vw] pt-[10vh] pb-[4vh]">
                {/* LHS - HEADING TEXT */}
                <div className="text-lime-500 flex flex-col w-[675px] lg:w-1/2">
                    <Tagline />
                    <p className="text-light-purple mt-8 text-xl w-3/4">
                    Create your account to connect, book services, and be part of our community
                    </p>
                </div>
                
                {/* RHS - SIGNUP AND LOGO */}
                <div className="flex flex-wrap w-fit lg:w-1/2 justify-between">
                    {/* SIGNUP STYLE */}
                    <div className="items-end flex w-auto">
                        <div className="flex flex-col space-y-4 w-auto flex-1 pt-8 pl-8 justify-end min-h-[462px]">
                            <h2 className="text-light-purple text-xl">
                                Let's get you started!
                            </h2>
                                <UserStaffToggle selectedType={selectedType} onToggle={setSelectedType} />
                            
                            <div className="flex-1">
                                {selectedType === 'staff' ? <StaffSignup/> : <UserSignup/>}
                            </div>
                            
                            <Link to="/" className="text-light-purple uppercase underline hover:text-lime-500" href="">
                                Already have an account? Sign In
                            </Link>
                        </div>
                    </div>
                    {/* LOGO STYLE */}
                    <div>
                        <img src={Breaktime_Secondary_Logo} className="w-[220px]"/>
                    </div>
                </div>
            </div>
        </div>
    );
}