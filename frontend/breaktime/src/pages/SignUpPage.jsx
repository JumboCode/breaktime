import StaffSignup from "/src/components/StaffSignup";
import UserSignup from "/src/components/UserSignup";
import UserStaffToggle from "/src/components/UserStaffToggle"; 
import { Tagline } from "/src/components/Tagline";
import Breaktime_Secondary_Logo from "/src/assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import { useState } from "react";
import { Link } from "react-router-dom";

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export default function SignUpPage() {
    const [selectedType, setSelectedType] = useState('users');
    const mobile = isMobile();

    return (
        <div className="relative min-h-screen bg-indigo-purple font-all flex items-center justify-center">

            {!mobile && (
                <img src={Breaktime_Secondary_Logo} className="absolute top-[4vh] right-[5vw] w-[220px]"/>
            )}

            <div className={`flex overflow-x-hidden w-full max-w-[1500px]
                ${mobile
                    ? 'flex-col px-[6vw] pt-[8vw] pb-[6vw] gap-[8vw]'
                    : 'flex-row h-[100vh] lg:max-h-[800px] pl-[5vw] pr-[5vw] pt-[10vh] pb-[4vh]'
                }`}>

                {/* LHS - HEADING TEXT */}
                <div className={`text-lime-500 flex flex-col ${mobile ? 'w-full' : 'w-[675px] lg:w-1/2'}`}>
                    {mobile && (
                        <div className="flex items-center justify-between w-full mb-[4vw]">
                            <img src={Breaktime_Secondary_Logo} className="w-[35vw]"/>
                        </div>
                    )}
                    <Tagline />
                    <p className={`text-light-purple mt-8 ${mobile ? 'text-[4vw] w-full' : 'text-xl w-3/4'}`}>
                        Create your account to connect, book services, and be part of our community
                    </p>
                </div>

                {/* RHS - SIGNUP */}
                <div className={`flex ${mobile ? 'flex-col w-full' : 'flex-wrap w-fit lg:w-1/2 justify-between'}`}>
                    <div className="items-end flex w-full">
                        <div className={`flex flex-col space-y-4 flex-1 justify-end
                            ${mobile ? 'pt-[4vw]' : 'pt-8 pl-8 min-h-[462px]'}`}>
                            <h2 className={`text-light-purple ${mobile ? 'text-[4.5vw]' : 'text-xl'}`}>
                                Let's get you started!
                            </h2>
                            {!mobile && (
                                <UserStaffToggle selectedType={selectedType} onToggle={setSelectedType} />
                            )}
                            <div className="flex-1">
                                {!mobile && selectedType === 'staff' ? <StaffSignup /> : <UserSignup />}
                            </div>
                            <Link to="/"
                                className={`text-light-purple uppercase underline hover:text-lime-500 ${mobile ? 'text-[3.5vw]' : ''}`}>
                                Already have an account? Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}