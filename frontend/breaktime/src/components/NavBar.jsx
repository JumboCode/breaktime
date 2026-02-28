import Breaktime_Secondary_Logo_SkyBlue from "../assets/logos-icons/Logo_Secondary/Breaktime_Secondary_SkyBlue.png";
import Breaktime_Secondary_Logo_MidnightBlue from "../assets/logos-icons/Logo_Secondary/Breaktime_Secondary_MidnightBlue.png";
import { useState } from "react";
import { useClerk } from '@clerk/clerk-react';

const NavBar = ({ isSidebarOpen, onToggle, userType }) => {
    // const [userType, setUserType] = useState('Staff');
    const [viewType, setViewType] = useState('Calendar');
    const { signOut } = useClerk();

    const toggleSidebar = () => {
        if (onToggle) onToggle(!isSidebarOpen);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className={`flex h-[80px] ${userType === 'Staff' ? 'bg-indigo-purple' : 'bg-light-grey'} font-all gap-[20px] pt-[22px] pr-[40px] pl-[40px] pb-[16px]`}>
            <button onClick={toggleSidebar} className="mt-[-4px] select-none">
                <div className="h-[22px] w-[22px] bg-lime-500 text-indigo-purple font-semibold rounded-[11px] text-center justify-self-end relative top-[8px] left-[6px]">3</div>
                <div className="flex items-end">
                    <svg className={`h-[24px] ${userType === 'Staff' ? 'stroke-light-purple' : 'stroke-dark-navy'} hover:stroke-lime-500 transition-colors cursor-pointer`} width="49" height="31" viewBox="0 0 49 31" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="4" strokeLinecap="round">
                        <line x1="2" y1="2" x2="47" y2="2"/>
                        <line x1="2" y1="11" x2="47" y2="11"/>
                        <line x1="2" y1="20" x2="47" y2="20"/>
                        <line x1="2" y1="29" x2="47" y2="29"/>
                    </svg>
                </div>
            </button>

            <div className="h-full">
                <img src={userType === 'Staff' ? Breaktime_Secondary_Logo_SkyBlue : Breaktime_Secondary_Logo_MidnightBlue} className="h-full object-contain"/>
            </div>

            <div className={`bg-lime-500 ${userType === 'YA' ? 'border border-dark-navy' : ''} text-indigo-purple font-semibold text-xl rounded-[24px] p-[20px] mt-[9px] flex items-center justify-center`}>
                {userType === 'Staff' ? 'Staff Portal' : 'YA USERS'}
                
            </div>

            {userType === 'Staff' ?
                <div className="flex items-end text-light-purple text-xl gap-[20px]">
                    <div className="font-semibold">View bookings:</div>
                    <div className="flex gap-[20px] select-none">
                        <button
                            onClick={() => setViewType('Calendar')}
                            className={`cursor-pointer hover:underline w-[93px]
                                ${viewType === 'Calendar' ? 'underline' : 'hover:font-semibold'}`}
                        >
                            Calendar
                        </button>
                        <button
                            onClick={() => setViewType('List')}
                            className={`cursor-pointer hover:underline
                                ${viewType === 'List' ? 'underline' : 'hover:font-semibold'}`}
                        >
                            List
                        </button>
                       
                </div>
                </div>
            : 
                <></>
            }
             <button
                onClick={() => handleSignOut()}
                className={`cursor-pointer hover:underline
                    ${viewType === 'List' ? 'underline' : 'hover:font-semibold'}`}
            >
                Sign Out
            </button>
        </div>
    );
};

export default NavBar;