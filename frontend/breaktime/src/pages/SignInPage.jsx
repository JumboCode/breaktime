import StaffSignin from "/src/components/StaffSignin";
import UserSignin from "/src/components/UserSignin";
import UserStaffToggle from "/src/components/UserStaffToggle"; 
import { Tagline } from "/src/components/Tagline";
import Breaktime_Secondary_Logo from "/src/assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import { Link } from "react-router-dom";
import { useState } from "react";

const isMobile = () => {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 1025;
};

export default function SignInPage() {
    const [selectedType, setSelectedType] = useState('users');
    const mobile = isMobile();

    return (
        <div className="relative min-h-screen bg-indigo-purple font-all flex items-center justify-center">

            {/* Logo - desktop only, fixed top right */}
            {!mobile && (
                <img src={Breaktime_Secondary_Logo} className="absolute top-[4vh] right-[5vw] w-[220px]"/>
            )}

            <div className={`flex overflow-x-hidden w-full max-w-[1500px]
                ${mobile
                    ? 'flex-col px-[6vw] pt-[8vw] pb-[6vw] gap-[8vw]'
                    : 'flex-row h-[100vh] lg:max-h-[800px] pl-[5vw] pr-[5vw] pt-[10vh] pb-[4vh]'
                }`}>

                {/* LHS - HEADING TEXT */}
                <div className={`text-lime-500 flex flex-col ${mobile ? 'w-full' : 'lg:w-1/2'}`}>
                    {mobile && (
                        <div className="flex items-center justify-between w-full mb-[4vw]">
                            <img src={Breaktime_Secondary_Logo} className="w-[35vw]"/>
                        </div>
                    )}
                    <Tagline />
                    <p className={`text-light-purple mt-8 ${mobile ? 'text-[4vw] w-full' : 'text-xl w-3/4'}`}>
                        Sign in to access your bookings,<br />
                        schedules, and tools
                    </p>
                </div>

                {/* RHS - SIGNUP */}
                <div className={`flex ${mobile ? 'flex-col w-full' : 'flex-wrap lg:w-1/2 justify-between'}`}>
                    <div className="items-end flex w-full">
                        <div className={`flex flex-col space-y-4 flex-1 justify-end
                            ${mobile ? 'pt-[4vw]' : 'pt-8 pl-8 min-h-[462px]'}`}>
                            <h2 className={`text-light-purple ${mobile ? 'text-[4.5vw]' : 'text-xl'}`}>
                                Let's get you started!
                            </h2>
                            {!mobile && (
                                <UserStaffToggle selectedType={selectedType} onToggle={setSelectedType} />
                            )}
                            {!mobile && selectedType === 'staff' ?
                                <StaffSignin key="staff-view"/> :
                                <UserSignin key="user-view"/>}
                            <Link to="/signup"
                                className={`text-light-purple uppercase underline hover:text-lime-500 ${mobile ? 'text-[3.5vw]' : ''}`}>
                                SIGN UP
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}